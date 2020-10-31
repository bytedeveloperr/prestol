module.exports = (req, res, next) => {
	if (req.session.auth && req.session.user) {
		next();
	} else {
		req.flash("error", "Login to continue");
		res.redirect(`/login?next=${req.url}`);
	}
};
