module.exports = {
	signup: async (req, res) => {
		let data = {
			title: "Signup",
			csrf: req.csrfToken(),
		};
		res.render("auth/signup", data);
	},

	login: (req, res) => {
		let data = {
			title: "Login",
			csrf: req.csrfToken(),
		};
		res.render("auth/login", data);
	},
};
