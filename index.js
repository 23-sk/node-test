const express = require("express");
const app = express();
const bookingRoutes = require("./routes/book");

require("./config/db")();

app.use(express.json());

app.use("/api/coach", bookingRoutes);

app.listen(3000, ()=>{
    console.log("Working on 3000")
});

// Design a model
// At one time max 7 seats can be booked
// priority based assignment
// 
/*
Problem Description:
1. There are 80 seats in a coach of a train with only 7 seats in a row and last row of
only 3 seats. For simplicity, there is only one coach in this train.
2. One person can reserve up to 7 seats at a time.
3. If a person is reserving seats, the priority will be to book them in one row.
4. If seats are not available in one row then the booking should be done in such a way
that the nearby seats are booked.
5. User can book as many tickets as s/he wants until the coach is full.
6. You don’t have to create login functionality for this application.

How it should function?
1. Input required will only be the required number of seats. Example: 2 or 4 or 6 or 1 etc.
2. Output should be seats numbers that have been booked for the user along with the
display of all the seats and their availability status through color or number or anything
else that you may feel fit.

What all you need to submit?
1. You need to write code (functions) as per the conditions and functionality mentioned
above.
2. You need to submit the database structure you’ll be creating as per your code.
*/