const mongoose = require('mongoose');

module.exports = async () =>{
    try {
        const conn = await mongoose.connect(process.env.DB);
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error);
        console.log("Could not connect to database !!!");
    }
}