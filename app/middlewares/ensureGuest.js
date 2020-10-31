module.exports = (req, res, next) => {
	if (req.session.auth && req.session.user) {
		res.redirect(`/`);
	} else {
		next();
	}
};
