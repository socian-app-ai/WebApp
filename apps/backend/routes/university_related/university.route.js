const express = require('express');
const University = require('../../models/university/university.register.model');
const router = express.Router();



router.post('/register', async (req, res) => {
    const { name, mainLocationAddress } = req.body;

    try {
        console.log(name)
        const universityExists = await University.findOne({ name: name })
        console.log(universityExists)
        if (universityExists) return res.status(400).json("Alredy Exists");

        const newUniversity = new University(req.body);
        await newUniversity.save();

        console.log('University created successfully:', newUniversity);

        res.status(201).json(newUniversity);
    } catch (error) {
        console.error('Error creating university:', error);
        throw new Error('Unable to create university. Please try again.');
    }

});

router.get('/', async (req, res) => {
    try {
        const university = await University.find().populate('campuses');

        res.status(200).json(university);
    } catch (error) {
        console.error('Error creating campus:', error);
        res.status(500).json({ message: error.message }); // Unable to create campus. Please try again.

    }
})

module.exports = router;
