const { Booking } = require("../models/booking");
const { Coach, validatePost, checkBestPossibleSeatsForBooking } = require("../models/coach")

exports.getLayout = async (req, res)=>{
    let layout = await Coach.find().sort({  seatNo:1 });

    return res.status(200).send({ message: "Success", data: layout })
}

exports.createBooking = async (req, res)=>{
    const { error } = validatePost(req.body);
    if (error) return res.status(400).send({ message: "Failure", data: error.details[0].message });

    let available = await checkBestPossibleSeatsForBooking(req.body.numberOfSeats);
    console.log(available);
    if (!available.done) return res.status(400).send({ message: "Failure", data: "Not enough seats left" });

    await Coach.updateMany({ seatNo: { $in: available.seatNos }}, {$set: { status: "booked" }});
    await Booking.create({
        seatNos: available.seatNos,
        userEmail: req.body.userEmail
    });

    return res.status(200).send({ message: "Success", data: { message: `Booking created for seats ${available.seatNos.join(",")}`} })
}