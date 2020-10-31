function toggleLike(self) {
	let userId = self.getAttribute("data-poster");
	let postId = self.getAttribute("data-id");
	let likerId = self.getAttribute("data-liker");
	let likeIcon = self.querySelector("i");
	let likes = parseInt(self.querySelector("span").innerText);

	let payload = { userId, postId, likerId };

	socket.emit("toggleLike", payload);

	socket.on("toggleLike", function (message) {
		if (message === "liked") {
			likeIcon.className = "text-danger fa-lg fa fa-heart";
			likes++;
			self.querySelector("span").innerText = likes;
			return;
		}
		if (message === "unliked") {
			likeIcon.className = "fa-lg fa fa-heart-o";
			likes--;
			self.querySelector("span").innerText = likes;
			return;
		}
	});
}

function toggleFollow(self) {
	let currentUser = self.getAttribute("data-cuser");
	let userToFollow = self.getAttribute("data-fuser");

	let payload = { currentUser, userToFollow };

	socket.emit("toggleFollow", payload);

	socket.on("toggleFollow", function (message) {
		if (message === "followed") {
			self.innerText = "unfollow";
			self.setAttribute("disabled", true);
		}
		if (message === "unfollowed") {
			self.innerText = "follow";
			self.setAttribute("disabled", true);
		}
	});

	console.log(self);
}
