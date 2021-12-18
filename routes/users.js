const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users");
const auth = require("../middleware/check-auth");
const locauth = require("../middleware/check-location-auth");

const router = express.Router();

router.get("/all", locauth, usersController.findAllUsers);

router.get("/", auth, usersController.findUser);

router.post(
	"/signup",
	[
		check("name").not().isEmpty(),
		check("email").isEmail(),
		check("password").isLength({ min: 6 }),
	],
	usersController.signup
);

router.post("/login", usersController.login);
router.post("/locations", usersController.login);

router.patch("/edit/:id", locauth, usersController.user_update);

router.delete("/delete/:id", locauth, usersController.user_delete);

module.exports = router;
