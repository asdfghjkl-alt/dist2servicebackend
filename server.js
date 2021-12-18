const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, process.env.FRONT_END + "/build")));

async function connectDB() {
	try {
		// const uri = process.env.ATLAS_URI;
		// await mongoose.connect(uri, {
		await mongoose.connect(`mongodb://127.0.0.1:27017/`, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
		});
		console.log("MongoDB connected ...");
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}
connectDB();

app.use(cors());

app.use("/users/", require("./routes/users"));
app.use("/locations/", require("./routes/locations"));
app.use("/category/", require("./routes/category"));

app.get("*", function (req, res) {
	res.sendFile(
		path.join(__dirname, process.env.FRONT_END, "build", "index.html")
	);
});

const port = process.env.PORT || 6000;

app.listen(port, () => {
	console.log("Localhost running on " + port);
});
