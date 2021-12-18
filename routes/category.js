const router = require("express").Router();
const CategoryController = require("../controllers/category");
const auth = require("../middleware/check-location-auth");

router.get("/", CategoryController.categories_get_all);

router.post("/add", auth, CategoryController.category_add);

router.delete("/:id", auth, CategoryController.category_delete);

module.exports = router;
