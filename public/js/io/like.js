function toggleLike(self, type) {
	let userId = self.getAttribute("data-poster");
	let likerId = self.getAttribute("data-liker");
	let postId = self.getAttribute("data-postid");
	let likeIcon = document.getElementById(`icon${postId}`);
	let payload = { userId, likerId, postId };
	console.log(likeIcon);

	if (type == "post") {
		socket.emit("togglePostLike", payload);
	} else if (type == "comment") {
		let commentId = self.getAttribute("data-commentid");
		payload.commentId = commentId;
		socket.emit("toggleCommentLike", payload);
	}

	socket.on("toggleLike", function (message) {
		if (message === "liked") {
			console.log(likeIcon);
			likeIcon.className = "text-danger fa-lg fa fa-heart";
			// likes++;
			// self.querySelector("span").innerText = likes;
			return;
		}
		if (message === "unliked") {
			console.log(likeIcon);
			likeIcon.className = "fa-lg fa fa-heart-o";
			// likes--;
			// self.querySelector("span").innerText = likes;
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

function sharePost(self) {
	let userId = self.getAttribute("data-poster");
	let postId = self.getAttribute("data-id");
	let sharerId = self.getAttribute("data-sharer");
	let shareIcon = self.querySelector("i");
	// let likes = parseInt(self.querySelector("span").innerText);

	let payload = { userId, postId, sharerId };

	socket.emit("sharePost", payload);

	socket.on("sharePost", function (message) {
		if (message === "success") {
			self.classList.add("disabled");
			shareIcon.classList.add("text-success");
			console.log("success");
			return;
		}
	});
}
