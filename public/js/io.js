let userid = document.body.getAttribute("data-userid");
if (userid !== null || userid !== undefined || userid !== "") {
	socket.emit("initiateUser", userid);
}

socket.on("newNotification", (notif) => {
	let badge = document.querySelector("#notif-badge");
	let notifs = document.querySelector("#notifs");
	let card = document.createElement("div");
	card.classList.add("card");
	let count = parseInt(badge.innerText);
	count++;
	badge.innerText = count;
	card.innerHTML = `
		<div class="card-body">
			<div class="media">
			  <img src="..." class="mr-3" alt="...">
			  <div class="media-body">
			      <a href="/notifications/read/${notif.entity}" class="">${notif.content}</a>
			  </div>
			</div>
		</div>`;
	notifs.prepend(card);
});

function markNotifAsRead(self) {
	let entity = self.getAttribute("data-entity");
	let notifid = self.getAttribute("data-notifid");
	let entityid = self.getAttribute("data-entityid");
	socket.emit("markNotifAsRead", notifid);
	window.location.href = `/${entity}/${entityid}`;
}
