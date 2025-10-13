const express = require('express');
const { set, default: mongoose } = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({ 
    title:{
        type: String, 
        required: true
    } ,
    description: String,
    image: {
            filename: {
            type: String,
            url: String
        },
        url: {
            type: String,
            default: 'https://images.pexels.com/photos/2486168/pexels-photo-2486168.jpeg'
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [ {
        type: Schema.Types.ObjectId,
        ref: "Review"
        }
    ]
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;