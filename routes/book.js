const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");

router.get("/layout", bookingController.getLayout);
router.post("/booking", bookingController.createBooking);


module.exports = router;