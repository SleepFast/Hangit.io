// The word won't be sent if it's empty or blank
Input.submitWord.addEventListener("input", () => {
	if (/^[A-Za-zÀ-ú- ]{4,}$/.test(Input.submitWord.value)) {
		// Blank word
		if (/^\s*$/.test(Input.submitWord.value)) Button.submitWord.disabled = true;
		else Button.submitWord.disabled = false
	} else Button.submitWord.disabled = true
});

// Submit word event listener
Modal.submitWord.addEventListener("submit", (e) => {
	// Prevent form from submitting
	e.preventDefault();
	Modal.close();
	Round.wordSubmitted = true;
	// Send player word to server
	sendHiddenWord(Input.submitWord.value.toUpperCase());
	// Clear word input & disable send word button
	Input.submitWord.value = "";
	Button.submitWord.disabled = true
})