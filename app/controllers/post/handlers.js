const service = require("../../services/post");

module.exports = {
	create: async (req, res) => {
		let data = {
			files: req.files,
			body: req.body,
			user: req.user,
		};
		let response = await service.create(data);
		if (response.error) {
			req.flash("error", response.msg);
			res.redirect("/");
		} else {
			req.flash("success", response.msg);
			res.redirect("/");
		}
	},

	update: async (req, res) => {
		req.body.id = req.params.id;
		let data = {
			body: req.body,
			user: req.user,
		};
		let response = await service.update(data);
		if (response.error) {
			req.flash("error", response.msg);
			res.redirect(`/post/${req.params.id}`);
		} else {
			req.flash("success", response.msg);
			res.redirect(`/post/${req.params.id}`);
		}
	},

	delete: async (req, res) => {
		let data = {
			postId: req.params.id,
			user: req.user,
		};
		let response = await service.delete(data);
		if (response.error) {
			req.flash("error", response.msg);
			res.redirect(`/post/${req.params.id}`);
		} else {
			req.flash("success", response.msg);
			res.redirect(`/`);
		}
	},
};
