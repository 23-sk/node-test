const mongoose = require("mongoose");
const Joi = require("joi");

mongoose.set("debug", true);

const schema = new mongoose.Schema({
    seatNo: Number,
    groupNo: Number,
    status: { type: String, enum: ["vacant", "booked"], default: "vacant" }
});


const Coach = mongoose.model("Coach", schema);

function validatePost(req) {
    const schema = Joi.object({
        numberOfSeats: Joi.number().min(1).max(7).required(),
        userEmail: Joi.string().required()
    });

    return schema.validate(req);
}

module.exports.Coach = Coach;
module.exports.validatePost = validatePost;
module.exports.checkBestPossibleSeatsForBooking = checkBestPossibleSeatsForBooking;


async function insertSeats() {

    let data = await Coach.find();
    if (data.length > 0) return;

    let input = [], groupNo = 0;

    for (let i = 1; i <= 80; i++) {
        if (i % 7 === 1) groupNo++;
        input.push({
            seatNo: i,
            groupNo: groupNo
        }) 
    }

    console.log(input);
    await Coach.insertMany(input);
}
// require("../config/db")();
async function checkBestPossibleSeatsForBooking(numberOfSeats) {
    try {
        let result = { done: true, seatNos: [] }, seatNos = [];

        let availableSeats = await Coach.aggregate([
            { $match: { status: "vacant" }},
            { $sort: { groupNo: 1, seatNo: 1 }},
            { $facet: {
                allSeats: [{ $sort: {seatNo: 1}}],
                groupedSeats: [{ $group: { _id: "$groupNo", count: { $sum: 1 }}}]
            }}
        ]);

        let{ allSeats, groupedSeats } = availableSeats[0];

        let eligibleGroup = groupedSeats.find(x => x.count >= numberOfSeats);
        console.log(eligibleGroup);
        if (eligibleGroup) {
            seatNos = allSeats.filter(x => x.groupNo === eligibleGroup._id);
            result.seatNos = seatNos.slice(0, numberOfSeats).map(x => x = x.seatNo);
        }
        else {
            seatNos = findSeatsInSeries(allSeats, numberOfSeats);
            if (seatNos.length === 0) {
                result.seatNos = allSeats.slice(0, numberOfSeats).map(x => x = x.seatNo);
            }
            result.seatNos = seatNos
        }

        if (seatNos.length != numberOfSeats) return { done: false }
        // await Coach.updateMany({ seatNo: { $in: result.seatNos }}, {$set: { status: booked }})
        return result;
    } catch (error) {
        return { done: false }
    }
}

function findSeatsInSeries(allSeats, numberOfSeats) {
    let continousSeatsFound = [];

    for (let i = 0; i < allSeats.length; i++) {
        const seat = allSeats[i];
        continousSeatsFound.push(seat.seatNo)
        
        let j = 1;
        while (j <= numberOfSeats) {
            let nextSeat = allSeats.find(x => x.seatNo === seat.seatNo + j);
            if (nextSeat){
                continousSeatsFound.push(nextSeat.seatNo);
                if (continousSeatsFound.length === numberOfSeats) return continousSeatsFound;
                console.log("while", continousSeatsFound);
                j++;
            }
            else {
                continousSeatsFound = [];
                break
            } 
        }
    }

    return continousSeatsFound;
}
// checkBestPossibleSeatsForBooking(4);

// let allSeats = [
//     {seatNo: 6, status: "vacant"},
//     {seatNo: 7, status: "vacant"},
//     {seatNo: 8, status: "vacant"},
//     {seatNo: 18, status: "vacant"},
//     {seatNo: 19, status: "vacant"},
//     {seatNo: 20, status: "vacant"},
//     {seatNo: 21, status: "vacant"},
// ]

// console.log(findSeatsInSeries(allSeats, 5))
insertSeats();


