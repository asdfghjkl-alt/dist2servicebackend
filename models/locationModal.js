const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
	address: { type: String, required: true },
	lat: { type: Number, required: true },
	lng: { type: Number, required: true },
	english: { type: String, required: true },
	chinese: { type: String, required: true },
	category: { type: String, required: true },
	desc: { type: String, required: true },
	chinesedesc: { type: String, required: true },
	webpage: { type: String },
	phone: { type: String },
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
