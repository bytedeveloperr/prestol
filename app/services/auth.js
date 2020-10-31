const response = require("../utils/response");
const {
	isEmpty,
	isLength,
	isEmail,
	normalizeEmail,
	trim,
	escape,
} = require("validator");
const xss = require("xss");
const argon2 = require("argon2");
const UserModel = require("../models/User");

module.exports = {
	signup: async (data) => {
		let { fullname, email, password, gender } = data;
		if (
			isEmpty(fullname) ||
			isEmpty(email) ||
			isEmpty(password) ||
			isEmpty(gender)
		) {
			return response({
				msg: "All fields are required",
				data: null,
				error: true,
			});
		} else {
			if (!isEmail(email)) {
				return response({
					msg: "Enter a valid email",
					data: null,
					error: true,
				});
			} else {
				if (!isLength(password, { min: 6 })) {
					return response({
						msg: "Password cannot be less than six characters",
						data: null,
						error: true,
					});
				} else {
					fullname = xss(trim(escape(fullname)));
					email = xss(trim(escape(normalizeEmail(email))));
					password = xss(trim(escape(password)));
					gender = xss(trim(escape(gender)));
					let userExists = await UserModel.findOne({ email });
					if (!userExists) {
						try {
							password = await argon2.hash(password);
							let User = new UserModel({
								fullname,
								email,
								password,
								gender,
							});
							try {
								let user = await User.save();
								user = {
									_id: user._id,
									email: user.email,
									fullname: user.fullname,
								};
								return response({
									msg: "User registered",
									data: user,
									error: false,
								});
							} catch (e) {
								return response({
									msg:
										e +
										" A server error occured, please try again",
									data: null,
									error: true,
								});
							}
						} catch (e) {
							throw new Error(e);
							return response({
								msg:
									e +
									" A server error occured, please try again",
								data: null,
								error: true,
							});
						}
					} else {
						return response({
							msg:
								"The email is already associated with an account",
							data: null,
							error: true,
						});
					}
				}
			}
		}
	},

	login: async (data) => {
		let { email, password } = data;
		if (isEmpty(email) || isEmpty(password)) {
			return response({
				msg: "All fields are required",
				data: null,
				error: true,
			});
		} else {
			if (!isEmail(email)) {
				return response({
					msg: "Enter a valid email",
					data: null,
					error: true,
				});
			} else {
				if (!isLength(password, { min: 6 })) {
					return response({
						msg: "Password cannot be less than six characters",
						data: null,
						error: true,
					});
				} else {
					email = xss(trim(escape(normalizeEmail(email))));
					password = xss(trim(escape(password)));
					let userExists = await UserModel.findOne({ email });
					if (!userExists) {
						return response({
							msg:
								"The email is already not associated with any account",
							data: null,
							error: true,
						});
					} else {
						try {
							if (
								await argon2.verify(
									userExists.password,
									password
								)
							) {
								try {
									user = {
										_id: userExists._id,
										email: userExists.email,
										fullname: userExists.fullname,
									};
									return response({
										msg: "User fectched",
										data: user,
										error: false,
									});
								} catch (e) {
									return response({
										msg:
											e +
											" A server error occured, please try again",
										data: null,
										error: true,
									});
								}
							} else {
								return response({
									msg: "Incorrect password",
									data: null,
									error: true,
								});
							}
						} catch (e) {
							throw new Error(e);
							return response({
								msg:
									e +
									" A server error occured, please try again",
								data: null,
								error: true,
							});
						}
					}
				}
			}
		}
	},
};
