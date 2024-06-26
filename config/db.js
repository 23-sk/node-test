const mongoose = require("mongoose");
const config = require("config");

module.exports = async ()=>{
    mongoose.connect(config.get("dbURL"))
        .then(()=>{ console.log(`Connected to db: ${config.get("dbURL")}`)})
        .catch(()=> { console.log("Error connecting the db")});
}