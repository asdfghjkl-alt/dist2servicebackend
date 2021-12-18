let Category = require("../models/categoryModal");

exports.categories_get_all = async (req, res) => {
	try {
		const categories = await Category.find();
		res.json(categories);
	} catch (error) {
		console.log(error.mssage);
		res.status(500).send("server error");
	}
};

exports.category_add = async (req, res, next) => {
	var newCategory = new Category({
		title: req.body.title,
	});
	try {
		const newPat = await newCategory.save();
		res.json("newPro added" + newPat);
	} catch (error) {
		console.log(error.mssage);
		res.status(500).send("server error");
	}
};

exports.category_delete = async (req, res) => {
	Category.findByIdAndDelete(req.params.id)
		.then(() => res.json("Category deleted."))
		.catch((err) => res.status(400).json("Error: " + err));
};
