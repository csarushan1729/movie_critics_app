const express=require('express');
const router=express.Router();
const Review=require('../models/review');
require('dotenv').config();

router.post('/:movieID', async (req, res) => {
    try {
        const { movieID } = req.params; 
        const { review, movieName } = req.body; 
        if (!movieName || !review) {
            return res.status(400).json({ error: 'movieName and review are required' });
        }
        const newReview = new Review({
            movieName,
            movieID: parseInt(movieID),
            review,
        });

        const savedReview = await newReview.save();

        res.status(201).json({ message: 'Review saved successfully', data: savedReview });
    } catch (err) {
        console.error('Error saving review:', err);

        if (err.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Validation error',
                message: err.message,
            });
        }

        res.status(500).json({
            error: 'Internal server error',
            message: err.message,
        });
    }
});

router.put('/:movieID', async (req, res) => {
    try {
        const { movieID } = req.params; 
        const updatedReviewData = req.body; 
        const response = await Review.findOneAndUpdate(
            { movieID: parseInt(movieID) }, 
            updatedReviewData,
            {
                new: true,
                runValidators: true, 
            }
        );
        if (!response) {
            return res.status(400).json({ error: 'Movie not found' });
        }

        console.log('Review updated:', response);
        return res.status(200).json(response);
    } catch (err) {
        console.error('Error updating review:', err);
        return res.status(500).json({ error: 'Internal server error', message: err.message });
    }
});


router.delete('/:movieID', async (req, res) => {
    try {
        const { movieID } = req.params; 
        const response = await Review.findOneAndDelete({ movieID: parseInt(movieID) });
        if (!response) {
            return res.status(400).json({ error: 'Movie not found' });
        }

        console.log('Review deleted:', response);
        return res.status(200).json({ message: 'Review deleted successfully', data: response });
    } catch (err) {
        console.error('Error deleting review:', err);
        return res.status(500).json({ error: 'Internal server error', message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find();
        if (!reviews.length) {
            return res.status(404).json({ message: 'No movies found' });
        }
        return res.status(200).json(reviews);
    } catch (err) {
        console.error('Error fetching all movies:', err);
        return res.status(500).json({ error: 'Internal server error', message: err.message });
    }
});


router.get('/:movieID', async (req, res) => {
    try {
        const { movieID } = req.params; 
        const reviews = await Review.find({ movieID: parseInt(movieID) });
        if (!reviews.length) {
            return res.status(404).json({ message: 'No reviews found for this movie' });
        }
        return res.status(200).json(reviews);
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).json({ error: 'Internal server error', message: err.message });
    }
});

module.exports=router;