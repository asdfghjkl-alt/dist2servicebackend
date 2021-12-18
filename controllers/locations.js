let Location = require("../models/locationModal");

exports.locations_get_all = async (req, res) => {
	try {
		const patients = await Location.find();
		res.json(patients);
	} catch (error) {
		console.log(error.mssage);
		res.status(500).send("server error");
	}
};

exports.locations_add = async (req, res, next) => {
	var newLocation = new Location({
		address: req.body.address,
		english: req.body.english,
		chinese: req.body.chinese,
		lat: req.body.lat,
		lng: req.body.lng,
		category: req.body.category,
		webpage: req.body.webpage,
		phone: req.body.phone,
		desc: req.body.desc,
		chinesedesc: req.body.chinesedesc,
	});
	try {
		const newPat = await newLocation.save();
		res.json("newPro added" + newPat);
	} catch (error) {
		console.log(error.mssage);
		res.status(500).send("server error");
	}
};

exports.locations_find_location = async (req, res) => {
	const location = await Location.findById(req.params.id);
	try {
		res.status(200).json({
			location,
		});
	} catch (err) {
		res.status(400).json("Error: " + err);
	}
};

exports.location_delete = async (req, res) => {
	Location.findByIdAndDelete(req.params.id)
		.then(() => res.json("User deleted."))
		.catch((err) => res.status(400).json("Error: " + err));
};

exports.location_delete_all = async (req, res) => {
	Location.deleteMany({})
		.then(() => res.json("User deleted."))
		.catch((err) => res.status(400).json("Error: " + err));
};

exports.location_update = async (req, res) => {
	try {
		const locationUpdate = await Location.findById(req.params.id);
		locationUpdate.english = req.body.english;
		locationUpdate.chinese = req.body.chinese;
		locationUpdate.category = req.body.category;
		locationUpdate.webpage = req.body.webpage;
		locationUpdate.phone = req.body.phone;
		locationUpdate.desc = req.body.desc;
		locationUpdate.chinesedesc = req.body.chinesedesc;
		await locationUpdate.save();
		res.json("Location Updated");
	} catch (err) {
		console.log(err);
		res.status(500).json("error");
	}
};
