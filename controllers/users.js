const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/userModal");

const findUser = async (req, res) => {
	const user = await User.findById(req.userData.userId);

	res.status(200).json({
		_id: user._id,
		email: user.email,
		name: user.name,
		admin: user.admin,
		phone: user.phone,
	});
};

const findAllUsers = async (req, res, next) => {
	const users = await User.find();
	res.status(200).json({
		users: users,
	});
};

const signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError("Invalid inputs passed, please check your data.", 422)
		);
	}

	const { name, email, password, admin, phone } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			"Signing up failed, please try again later.",
			500
		);
		return next(error);
	}

	if (existingUser) {
		const error = new HttpError(
			"User exists already, please login instead.",
			422
		);
		return next(error);
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (err) {
		const error = new HttpError(
			"Could not create user, please try again.",
			500
		);
		return next(error);
	}

	const createdUser = new User({
		name: name,
		email: email,
		password: hashedPassword,
		admin: admin,
		phone: phone,
	});

	try {
		await createdUser.save();
	} catch (err) {
		const error = new HttpError(
			"Signing up failed, please try again later.",
			500
		);
		return next(error);
	}

	let token;
	try {
		token = jwt.sign(
			{ userId: createdUser.id, email: createdUser.email },
			process.env.JWT_KEY,
			{ expiresIn: "1h" }
		);
	} catch (err) {
		const error = new HttpError(
			"Signing up failed, please try again later.",
			500
		);
		return next(error);
	}

	res
		.status(201)
		.json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
	const { email, password } = req.body;

	let existingUser;

	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			"Logging in failed, please try again later.",
			500
		);
		return next(error);
	}

	if (!existingUser) {
		const error = new HttpError(
			"Invalid credentials, could not log you in.",
			403
		);
		return next(error);
	}

	let isValidPassword = false;
	try {
		isValidPassword = await bcrypt.compare(password, existingUser.password);
	} catch (err) {
		const error = new HttpError(
			"Could not log you in, please check your credentials and try again.",
			500
		);
		return next(error);
	}

	if (!isValidPassword) {
		const error = new HttpError(
			"Invalid credentials, could not log you in.",
			403
		);
		return next(error);
	}

	let token;
	try {
		token = jwt.sign(
			{ userId: existingUser.id, email: existingUser.email },
			process.env.JWT_KEY,
			{ expiresIn: "1h" }
		);
	} catch (err) {
		const error = new HttpError(
			"Logging in failed, please try again later.",
			500
		);
		return next(error);
	}
	res.status(200).json({
		userId: existingUser.id,
		email: existingUser.email,
		token: token,
	});
};

const user_update = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		user.admin = req.body.admin;
		user.phone = req.body.phone;
		await user.save();
		res.status(200).json("Everything fine");
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

const user_delete = async (req, res) => {
	try {
		User.findByIdAndDelete(req.params.id)
			.then(() => res.json("User deleted."))
			.catch((err) => res.status(400).json("Error: " + err));
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

exports.user_update = user_update;
exports.signup = signup;
exports.findAllUsers = findAllUsers;
exports.findUser = findUser;
exports.login = login;
exports.user_delete = user_delete;
