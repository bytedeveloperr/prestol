module.exports = (req, res, next) => {
	if (req.session.user) {
		req.user = req.session.user;
	} else {
		req.user = { _id: "" };
	}
	next();
};
