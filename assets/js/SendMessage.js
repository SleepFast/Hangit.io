// The message won't be sent if it's empty or blank
Input.message.addEventListener("input", () => {
	if (/^\s*$/.test(Input.message.value)) Button.sendMessage.disabled = true;
	else Button.sendMessage.disabled = false
});
// Send message function (only UI)
const sendMessage = (auto, msg, authorName, authorColor) => {
		// Send a message on the chat
		// auto = send automatic message (author-less, true|false)
		// Create message DOM
		let listFullHeight = MessageList.scrollHeight,
			listVisibleHeight = MessageList.offsetHeight,
			message = document.createElement("li"),
			inner = document.createElement("div"),
			content = document.createElement("span");
		// Set element classes
		message.className = "Message";
		inner.className = "MessageInner";
		content.className = "MessageContent";
		// Set values
		content.textContent = msg;
		// Append elements
		inner.appendChild(content);
		// Non-automatic message
		if (!auto) {
			// User message, create author section
			if (Chat.lastMessageSender == authorName) {
				// This is the same author who sent the last message
				// Do not display the author element and reduce message padding
				message.style.padding = "0 4px"
			} else {
				// Message from a new author
				// Display an author element
				let author = document.createElement("span");
				author.className = "MessageAuthor";
				author.textContent = authorName;
				author.style.color = authorColor;
				message.appendChild(author)
			}
			// Update last message author
			// console.log("Message envoyé par " + authorName)
			Chat.lastMessageSender = authorName;
			let date = document.createElement("span");
			date.className = "MessageDate";
			date.textContent = "maintenant";
			refreshMessageDate(date);
			inner.appendChild(date)
		}
		message.appendChild(inner);
		// Show message
		MessageList.appendChild(message);
		setMessageListPosition(listFullHeight, listVisibleHeight)
	},
	setMessageListPosition = (fullHeight, visibleHeight) => {
		// Scroll to end of the message list
		if (MessageList.scrollTop == (fullHeight - visibleHeight)) {
			// The user is already at the end of the message list, continue scrolling
			MessageList.scrollTop = MessageList.scrollHeight
		}
	},
	refreshMessageDate = (date) => {
		let oldDate = Date.now(),
			newDate,
			delay = 0,
			minutesInterval,
			secondsInterval = setInterval(() => {
				newDate = Date.now();
				delay = Math.floor((newDate - oldDate) / 1000);
				if (delay < 60) {
					delay += "s";
					date.textContent = delay
				} else {
					clearInterval(secondsInterval);
					date.textContent = "1m";
					minutesInterval = setInterval(() => {
						newDate = Date.now();
						delay = `${Math.floor(((newDate - oldDate) / 1000) / 60)}m`;
						date.textContent = delay
					}, 60000)
				}
			}, 10000)
	}

// Send message event listener
Form.sendMessage.addEventListener("submit", (e) => {
	// Prevent form from submitting
	e.preventDefault();
	// Filled and non-blank input, check message before sending
	let msg = Input.message.value;
	// Disable send button & clear message input
	Input.message.value = "";
	Button.sendMessage.disabled = true;
	// Send message to server
	sendDatabaseMessage(msg, Player.nickname);
	// Re-focus input
	Input.message.focus()
})