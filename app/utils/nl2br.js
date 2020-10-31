module.exports = (str) => {
	const breakTag = "<br />";
	return String(str).replace(
		/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
		"$1" + breakTag + "$2"
	);
};
