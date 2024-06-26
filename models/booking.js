const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema({
    seatNo: Array,
    userEmail: String,
    insertDate: { type: Date, default: Date.now() }
});


const Booking = mongoose.model("Booking", schema);

module.exports.Booking = Booking;
