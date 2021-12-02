// Check message function
const checkMessage = (msg) => {
		// Check if a sent message matches with the hidden word
		msg = msg.toUpperCase();
		if (msg[0] == "!") {
			// Command
			msg = msg.substr(1, msg.length - 1);
			if (/^[A-ZÀ-Ú]{1}$/.test(msg)) {
				// Letter sent, reveal it on the hidden word if valid
				// Test if the letter hasn't already been proposed
				let letterAlreadyProposed = false;
				for (let i = 0; i < HiddenWord.sentLetters.length; i++) {
					if (HiddenWord.sentLetters[i] == msg) letterAlreadyProposed = true
				}
				if (letterAlreadyProposed) sendMessage(true, "Vous avez déjà proposé cette lettre !");
				else {
					// Add letter to submitted letters
					HiddenWord.sentLetters.push(msg);
					// Check for letter in hidden word
					HiddenWord.currentInputValidity = checkForCharInWord(msg);
					if (HiddenWord.originalWord == HiddenWord.displayWord) {
						sendDatabaseMessage(`${Player.nickname} a trouvé le mot !`, Player.nickname);
						sendPlayerScore(Player.nickname, Player.foundIndex);
						sendWordFound(Player.nickname, 1)
					}
				}
			} else if (msg.length > 1) {
				// Word sent, reveal it on the hidden word if valid
				// Test if the word hasn't already been proposed
				let wordAlreadyProposed = false;
				for (let i = 0; i < HiddenWord.sentWords.length; i++) {
					if (HiddenWord.sentWords[i] == msg) wordAlreadyProposed = true
				}
				if (wordAlreadyProposed) sendMessage(true, "Vous avez déjà proposé ce mot !");
				else {
					// Add letter to submitted letters
					HiddenWord.sentWords.push(msg);
					// Check if the hidden word is found
					HiddenWord.currentInputValidity = checkForFullWord(msg);
					// Secret word
					if (msg == "POUETPOUET") {
						HiddenWord.currentInputValidity = true;
						HiddenWord.displayWord = HiddenWord.originalWord;
						HiddenWord.refreshSpan()
					}
					// If found, increment score & next round
					if (HiddenWord.originalWord == HiddenWord.displayWord) {
						sendDatabaseMessage(`${Player.nickname} a trouvé le mot !`, Player.nickname);
						sendPlayerScore(Player.nickname, Player.foundIndex);
						sendWordFound(Player.nickname, 1)
					}
				}
			}
		}
		if (!HiddenWord.currentInputValidity) {
			// Invalid input, +1 error
			HiddenWord.invalidInputs++;
			// Display remaining tries
			let remainingTries = 11 - HiddenWord.invalidInputs,
				s = (remainingTries > 1) ? "s" : "";
			RemainingTries.textContent = (remainingTries > 0) ? `${remainingTries} essai${s} restant${s}.` : "Pendu(e) !";
			if (HiddenWord.invalidInputs < 11) {
				// Not enough errors to lose
				toggleCanvasPart(HiddenWord.invalidInputs);
				sendMessage(true, `Faux ! Plus que ${remainingTries} essais restants.`)
			} else {
				// Game over!
				setTimeout(() => {Input.message.blur()});
				Player.status = "lost";
				sendWordFound(Player.nickname, 1);
				sendMessage(true, Return.gameOver);
				toggleCanvasPart(11) // Show canvas last part
			}
		}
		// Set input validity to true
		HiddenWord.currentInputValidity = true
	},
	// Check for a specific character in the hidden word and highlight it
	checkForCharInWord = (char) => {
		let check = false;
		for (let i = 0; i < HiddenWord.length; i++) {
			if (HiddenWord.originalWord[i] == char) {
				// New letter found
				check = true;
				HiddenWord.displayWord = HiddenWord.displayWord.substr(0, i) + char + HiddenWord.displayWord.substr(i + 1)
			}
		}
		HiddenWord.refreshSpan();
		return check
	},
	// Check if the requested word and the hidden word are the same
	checkForFullWord = (word) => {
		let check = false;
		if (HiddenWord.originalWord == word) {
			check = true;
			HiddenWord.displayWord = HiddenWord.originalWord
		}
		HiddenWord.refreshSpan();
		return check
	}