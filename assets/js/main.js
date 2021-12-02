// Get URL invitation link
let r = new XMLHttpRequest(),
	url = `https://m2x.alwaysdata.net/hangit/server.php?liens=${current_url.split("?g=")[1]}`,
	link = "",
	invitationLink = null;
r.open("GET", url);
r.send();
r.addEventListener("load", () => {
	link = JSON.parse(r.response);
	if (link.liens) {
		// The player is about to join a GameTip
		Player.role = "guest";
		document.querySelector(".RepeatedNicknamesTip").style.display = "block";
		// Change current URL
		invitationLink = window.location.href.split("?g=");
		invitationLink = invitationLink[invitationLink.length - 1];
		toggleDisplay(Container.nickname);
		toggleDisplay(Container.joinGame);
		GameTip.textContent = ""
	} else if (current_url.includes("?")) {
		// There is a link but it is invalid (not into the database)
		current_url = window.location.href.split("?")[0];
		GameTip.textContent = Return.tip.invalidLink;
	} else if (!link.liens) {
		// The player is about to host a new game
		Player.role = "host";
		toggleDisplay(Container.nickname);
		toggleDisplay(Container.openHostForm);
		GameTip.textContent = Return.tip.joinGame
	}
});
// Ajax requests
let readyPlayers = [],
	messages = [],
	oldMessages = [],
	newMessages = [],
	fetchInterval = setInterval(() => {
		if (!Game.finished && !Game.scoresDisplayed) {
			// Refresh ready player list
			fetch(`https://m2x.alwaysdata.net/hangit/server.php?getallplayer=${invitationLink}`)
				.then(response => response.text())
				.then(data => {readyPlayers = JSON.parse(data)});
			ReadyPlayersList.parentNode.children[0].children[0].textContent = readyPlayers.length;
			if (readyPlayers.length > 1) {
				// There is at least 1 guest ready, the game can be started
				Button.startHostGame.disabled = false
			} else if (readyPlayers.length == 1) Button.startHostGame.disabled = true;
			else if (Game.started) {
				// The game has been finished by the host
				// Close all DOM elements
				Game.finished = true;
				Modal.close();
				Layer.hide();
				Overlay.hide();
				toggleDisplay(Container.nickname, "none");
				toggleDisplay(Container.openHostForm, "none");
				toggleDisplay(Container.joinGame, "none");
				toggleDisplay(Container.gameContainer, "none");
				toggleDisplay(Container.restartGame, "none");
				GameTip.innerHTML = Return.tip.finishedGame
			}
			let lastChild = ReadyPlayersList.lastElementChild,
				lastChild2 = ConnectedPlayersList.lastElementChild;
			// Remove old players in lists
			while (lastChild) {
				ReadyPlayersList.removeChild(lastChild);
				lastChild = ReadyPlayersList.lastElementChild
			}
			while (lastChild2) {
				ConnectedPlayersList.removeChild(lastChild2);
				lastChild2 = ConnectedPlayersList.lastElementChild
			}
			// Add new players to lists
			let allPlayersDone = false;
			for (let i = 0; i < readyPlayers.length; i++) {
				let player = document.createElement("div"),
					player2 = document.createElement("div"),
					player2Nickname = document.createElement("span"),
					player2Score = document.createElement("span");
				player.className = "Player";
				player2.className = "Player";
				player2Nickname.className = "PlayerNickname";
				player2Score.className = "PlayerScore";
				player.textContent = readyPlayers[i].nickname;
				player2Nickname.textContent = readyPlayers[i].nickname;
				player2Score.textContent = `${readyPlayers[i].score} points`;
				player.style.color = readyPlayers[i].nicknameColor;
				player2.style.color = readyPlayers[i].nicknameColor;
				ReadyPlayersList.appendChild(player);
				player2.appendChild(player2Nickname);
				player2.appendChild(player2Score);
				ConnectedPlayersList.appendChild(player2);
				// Change player nickname if duplicated
				if (Player.role == "guest" && readyPlayers[i].nickname.split(" #")[0] == Player.nickname) {
					Player.nickname = readyPlayers[i].nickname
				}
				// Check for current round player
				if (readyPlayers[i].roundPlayer == "true") {
					Round.currentRoundPlayer.nickname = readyPlayers[i].nickname;
					Round.currentRoundPlayer.nicknameColor = readyPlayers[i].nicknameColor;
					if (readyPlayers[i].nickname == Player.nickname) Player.roundPlayer = true
				}
			}
			// Detect if the guest is in queue
			if (Player.role == "guest" && Player.inQueue && !Game.started) {
				fetch(`https://m2x.alwaysdata.net/hangit/server.php?get_round=${invitationLink}`)
					.then(response => response.text())
					.then(data => {
						if (data == 1) {
							Player.inQueue = false;
							startGame()
						}
					})
			}
			// These fetch() occur only after the game launch
			if (Game.started) {
				// Get current round number
				fetch(`https://m2x.alwaysdata.net/hangit/server.php?get_round=${invitationLink}`)
					.then(response => response.text())
					.then(data => {Round.current = data});
				if (Round.current > 0) Container.gameContainer.children[1].children[0].children[0].textContent = Round.current;
				// Get max rounds number
				fetch(`https://m2x.alwaysdata.net/hangit/server.php?get_max_round=${invitationLink}`)
					.then(response => response.text())
					.then(data => {Round.max = data});
				if (Round.max > 0) Container.gameContainer.children[1].children[0].children[1].textContent = Round.max;
				// Refresh messages
				newMessages = [];
				fetch(`https://m2x.alwaysdata.net/hangit/server.php?getmessage=${invitationLink}`)
					.then(response => response.text())
					.then(data => {messages = JSON.parse(data)});
				if (messages.length > 0) {
					for (let i = 0; i < messages.length; i++) {
						if (oldMessages[i] == undefined) newMessages.push(messages[i])
					}
					// Update old messages
					oldMessages = messages;
					for (let i = 0; i < newMessages.length; i++) {
						// Send & check message
						if (/^!/.test(newMessages[i].text)) {
							if (newMessages[i].nickname == Round.currentRoundPlayer.nickname && newMessages[i].nickname == Player.nickname) {
								sendMessage(true, "Attendez que les joueurs trouvent votre mot avant d'écrire des commandes.")
							} else if (newMessages[i].nickname == Player.nickname) {
								if (Player.status == "lost") sendMessage(true, "Vous avez utilisé tous vos essais !");
								else checkMessage(newMessages[i].text)
							}
						}
						else sendMessage(false, htmlDecode(newMessages[i].text), newMessages[i].nickname, newMessages[i].nicknameColor)
					}
				}
				// Get foundIndex
				fetch(`https://m2x.alwaysdata.net/hangit/server.php?get_foundIndex=${invitationLink}`)
					.then(response => response.text())
					.then(data => {Player.foundIndex = data});
				// Get sent hidden word
				if (!HiddenWord.submitted) {
					fetch(`https://m2x.alwaysdata.net/hangit/server.php?get_hidden_word=${invitationLink}`)
						.then(response => response.text())
						.then(data => {HiddenWord.originalWord = data});
					if (/^[A-Za-zÀ-ú- ]{4,}$/.test(HiddenWord.originalWord)) {
						// The word has been submitted
						HiddenWord.submitted = true;
						// Hide waiting layer for guests
						Layer.hide();
						Overlay.hide();
						// Show/hide hidden word to players
						HiddenWord.length = HiddenWord.originalWord.length;
						if (Round.currentRoundPlayer.nickname == Player.nickname) {
							// Show the word for the player who submitted it
							HiddenWord.displayWord = HiddenWord.originalWord
						} else {
							// Hide the word for the others players
							HiddenWord.displayWord = HiddenWord.originalWord.replace(HiddenWord.originalWord, "_".repeat(HiddenWord.length));
							// Highlight spaces and hyphens
							checkForCharInWord(" ");
							checkForCharInWord("-")
						}
						// Display word span
						HiddenWord.refreshSpan()
					}
				}
				// Check if all players have either found the word or lost
				fetch(`https://m2x.alwaysdata.net/hangit/server.php?get_found=${invitationLink}`)
					.then(response => response.text())
					.then(data => {
						if (data > 0 && data == readyPlayers.length - 1) {
							Game.finished = true;
							endGame()
						}
					})
			}
		} else if (!Game.scoresDisplayed) {
			Game.scoresDisplayed = true;
			fetch(`https://m2x.alwaysdata.net/hangit/server.php?get_score_order=${invitationLink}`)
				.then(response => response.text())
				.then(data => {
					let sortedScores = JSON.parse(data);
					// Display player scores
					for (let i = 0; i < sortedScores.length; i++) {
						let Player = document.createElement("div"),
							PlayerIcon = document.createElement("span"),
							PlayerScore = document.createElement("div"),
							PlayerValue = document.createElement("span"),
							PlayerScoreValue = document.createElement("span");
						Player.className = "PlayerScoreContainer Player";
						PlayerIcon.className = "Icon";
						PlayerScore.className = "PlayerScore";
						PlayerValue.className = "PlayerValue";
						PlayerScoreValue.className = "ScoreValue";
						PlayerIcon.textContent = "😀";
						switch (i) {
							case 0:
								PlayerIcon.textContent = "🥇";
								break;
							case 1:
								PlayerIcon.textContent = "🥈";
								break;
							case 2:
								PlayerIcon.textContent = "🥉";
								break
						}
						if (i == sortedScores.length - 1) PlayerIcon.textContent = "💩";
						PlayerValue.textContent = sortedScores[i].nickname;
						PlayerScoreValue.textContent = `${sortedScores[i].score} points`;
						PlayerScore.appendChild(PlayerValue);
						PlayerScore.appendChild(PlayerScoreValue);
						Player.appendChild(PlayerIcon);
						Player.appendChild(PlayerScore);
						ScorePlayersList.appendChild(Player)
					}
				})
		}
	}, 100);



Button.openHostForm.addEventListener("click", () => {
	invitationLink = GenerateLink();
	current_url += `?g=${invitationLink}`;
	Input.invitationLink.value = `https://matteoo34.github.io/hangit.io/?g=${invitationLink}`;
	// Input.invitationLink.value = `http://localhost/hangit.io/?g=${invitationLink}`;
	// Create game
	sendData("link_game", invitationLink);
	// Set player nickname
	setTimeout(() => {setNickname(Input.nickname.value)}, 200);
	// Open form 
	Modal.open(Modal.hostForm);
	// Input disabled when modal is open
	Input.nickname.disabled = true
});
document.querySelectorAll("input[type='range']").forEach((input) => {
	input.addEventListener("input", () => {
		let value = input.value;
		input.previousElementSibling.children[0].textContent = value
	})
});
// Copy invitation link to clipboard
Button.copyLink.addEventListener("click", () => {
	Input.invitationLink.select();
	Input.invitationLink.setSelectionRange(0, Input.invitationLink.value.length);
	document.execCommand("copy");
	Button.copyLink.textContent = "✔️ Copié !";
	setTimeout(() => {Button.copyLink.textContent = "Copier le lien"}, 2000)
});
// Launch hosted game
Button.startHostGame.addEventListener("click", () => {
	// Start game
	// Send round value to server
	sendData("maxRounds", Input.maxRounds.value);
	sendData("set_round", 1);
	startGame()
});
// Join hosted game
Button.joinGame.addEventListener("click", () => {
	// Join game
	Player.inQueue = true;
	Button.joinGame.disabled = true;
	Button.joinGame.textContent = "Veuillez patienter pendant que l'hôte lance la partie...";
	// Set player nickname
	setNickname(Input.nickname.value);
	Input.nickname.disabled = true
})