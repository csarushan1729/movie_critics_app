const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    movieName: { 
        type: String,
        required: true,
    },
    movieID: { 
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
});

const Review = mongoose.model('Review', reviewSchema); 

module.exports = Review; 
