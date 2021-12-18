const router = require("express").Router();
const LocationController = require("../controllers/locations");
const auth = require("../middleware/check-location-auth");

router.get("/", LocationController.locations_get_all);

router.post("/add", auth, LocationController.locations_add);

router.get("/:id", LocationController.locations_find_location);

router.delete("/deleteall", auth, LocationController.location_delete_all);

router.delete("/:id", auth, LocationController.location_delete);

router.patch("/updatelocation/:id", LocationController.location_update);

module.exports = router;
