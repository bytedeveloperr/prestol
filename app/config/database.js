const mongoose = require("mongoose");

(async () => {
	try {
		let conn = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		if (conn) {
			console.log(`Connected to MongoDB successfuly`);
		} else {
			console.log(`Cannot connect to MongoDB`);
		}
	} catch (e) {
		throw new Error(e);
		console.log(`Cannot connect to MongoDB ${e}`);
	}
})();
