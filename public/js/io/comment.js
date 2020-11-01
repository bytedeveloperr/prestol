let commentForm = document.querySelector("#commentForm");
let deleteComment = document.querySelectorAll(".delete-comment");

// listen to comment error
socket.on("commentError", (error) => {
	let commentResponse = document.querySelector("#commentResponse");
	commentResponse.classList.add("alert");
	commentResponse.classList.add("alert-danger");
	commentResponse.innerText = error;
});

// listen to comment success
socket.on("commentSuccess", (success) => {
	let commentResponse = document.querySelector("#commentResponse");
	commentResponse.classList.add("alert");
	commentResponse.classList.remove("alert-danger");
	commentResponse.classList.add("alert-success");
	commentResponse.innerText = success;
});

// listen to post comment
socket.on("postComment", (comment) => {
	let commentsArea = document.querySelector("#comments-area");
	let commentSpan = document.querySelector(".commentSpan");
	let div = document.createElement("div");
	div.classList.add("media");
	div.innerHTML = `
        <div class="media">
          <img src="${comment.user.avatar}" class="rounded-circle align-self-start mr-3" alt="${comment.user.fullname}" width="50px" height="50px">
          <div class="media-body">
            <h5 class="my-0"><a href="/user/${comment.user._id}" class="text-primary font-weight-normal">${comment.user.fullname}</a></h5>
            <p class="mb-3 text-muted date">${comment.createdAt}</p>
            <p class="">${comment.text}</p>
          </div>
        </div>  
       <hr />
      `;
	commentsArea.prepend(div);
	commentSpan.innerText = Number(commentSpan.innerText) + 1;
});

// comment delete error
socket.on("commentDeleteError", (error) => {
	alert(error);
});

// comment delete success
socket.on("commentDeleteSuccess", (response) => {
	alert("Comment Deleted");
});

// Init create comment
commentForm.addEventListener("submit", function (e) {
	e.preventDefault();
	let comment = e.target.elements.comment.value;
	let postId = e.target.elements.postId.value;
	let posterId = e.target.elements.posterId.value;
	let userId = e.target.elements.userId.value;
	let payload = { userId, postId, posterId, comment };
	socket.emit("createComment", payload);
});

for (var i = 0; i < deleteComment.length; i++) {
	deleteComment[i].addEventListener("submit", function (e) {
		e.preventDefault();
		let commentId = e.target.elements.commentId.value;
		let postId = e.target.elements.postId.value;
		let userId = e.target.elements.userId.value;
		let payload = { userId, commentId, postId };
		socket.emit("deleteComment", payload);
	});
}
