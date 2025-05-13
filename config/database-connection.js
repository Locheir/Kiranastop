const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/kiranastopdb`);
        console.log("database connected successfully...");
    } catch(err) {
        console.error("Error Occurred while connecting to MongoDB : ",err);
        process.exit(1);
    }
}

module.exports = connectDB;