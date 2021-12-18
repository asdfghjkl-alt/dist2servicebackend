const jwt = require("jsonwebtoken");
const User = require("../models/userModal");

module.exports = async (req, res, next) => {
	if (req.method === "OPTIONS") {
		return next();
	}
	try {
		const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
		if (!token) {
			res.status(401).json({
				message: "Auth failed",
			});
		}
		const decodedToken = jwt.verify(token, process.env.JWT_KEY);
		req.userData = { userId: decodedToken.userId };
		const user = await User.findById(req.userData.userId.toString());
		if (user.admin) {
			next();
		} else {
			res.status(401).json({
				message: "Auth failed",
			});
		}
	} catch (err) {
		res.status(401).json({
			message: "Auth failed",
		});
	}
};
