const setNickname = (nickname) => {
	// Test for empty or blank nickname
	if (/^[A-Za-zÀ-ú0-9-_ ]*$/.test(nickname)) {
		// Blank nickname
		if (/^\s*$/.test(nickname)) {
			// Guest player
			Player.nickname = Player.defaultNickname;
			// Send player nickname to server
			localStorage.removeItem("nickname");
			sendDatabasePlayer(Player.nickname, Player.nicknameColor)
		} else {
			Player.nickname = nickname;
			// Send player nickname to server
			localStorage.setItem("nickname", Player.nickname);
			sendDatabasePlayer(Player.nickname, Player.nicknameColor)
		}
	} else {
		// Guest player
		Player.nickname = Player.defaultNickname;
		// Send player nickname to server
		localStorage.removeItem("nickname");
		sendDatabasePlayer(Player.nickname, Player.nicknameColor)
	}
}