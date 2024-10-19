
// const generateToken = require("../utils/generate.token.js");
// const jwt = require("jsonwebtoken");


const express = require("express");
const router = express.Router()

const { basename } = require("path");

const { resendEmail } = require("../utils/email.util.js");
const bcryptjs = require("bcryptjs");

const User = require("../models/user/user.model.js");
const Campus = require("../models/university/campus.university.model.js");





router.post('/register/student', async (req, res) => {
    const { universityEmail, password, universityId, campusId } = req.body;

    console.log(universityEmail, password, universityId, campusId)
    try {
        const isAlreadyRegistered = await User.findOne({ 'universityEmail': universityEmail })

        if (isAlreadyRegistered) return res.status(400).json('Seems Odd') // already registered

        const campus = await Campus.findOne({
            _id: campusId,
            "universityOrigin": universityId
        });


        console.log(campus)
        if (!campus) return res.status(404).json('Hmm.. Seems Odd, this should not happen') // already registered

        // const emailPatterns = campus.emailPatterns.studentPatterns;

        const emailPatterns = campus.emailPatterns.studentPatterns.map(pattern =>
            pattern.replace(/\d+/g, '\\d+')
        );


        const combinedPattern = `^(${emailPatterns.join('|')})$`;
        const regex = new RegExp(combinedPattern);

        const isEmailValid = regex.test(universityEmail);


        console.log(emailPatterns)
        // const isEmailValid = emailPatterns.some(pattern => new RegExp(pattern).test(universityEmail));
        console.log("Valid", isEmailValid)


        if (!isEmailValid) {
            // TODO Send report to moderator and superadmin
            return res.status(400).json('University email does not match the required format!');
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = new User({
            username: universityEmail,
            universityEmail,
            password: hashedPassword,
            university: {
                name: universityId,
                campusLocation: campusId
            },

            role: 'student'
        });

        await newUser.save();

        campus.users.push(newUser._id)

        return res.status(201).json({ message: "Registration successful!" });

    } catch (error) {
        console.error("Error in ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
})


module.exports = router;