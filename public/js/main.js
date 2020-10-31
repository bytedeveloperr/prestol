let imageFile = document.querySelector("#imageFile");
let videoFile = document.querySelector("#videoFile");
let imagePreview = document.querySelector("#imagePreview");
let videoPreview = document.querySelector("#videoPreview");

imageFile.addEventListener("change", function () {
	previewImage(this);
});

function previewImage(input) {
	if (input.files) {
		let reader = new FileReader();

		reader.onload = function (e) {
			imagePreview.removeAttribute("hidden");
			imagePreview.setAttribute("src", e.target.result);
		};
		reader.readAsDataURL(input.files[0]);
	}
}

videoFile.addEventListener("change", function () {
	previewVideo(this);
});

function previewVideo(input) {
	if (input.files) {
		let reader = new FileReader();

		reader.onload = function (e) {
			videoPreview.removeAttribute("hidden");
			videoPreview.setAttribute("src", e.target.result);
		};
		reader.readAsDataURL(input.files[0]);
	}
}
