const mongoose = require('mongoose');
const initData= require('./data');
const Listing = require('../models/listing.js');

main().then(() => {
    console.log('connect to db');
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "68fccaddfa2511f23c89110d"}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");

}

initDB();