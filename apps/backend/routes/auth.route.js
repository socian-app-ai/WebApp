
// const generateToken = require("../utils/generate.token.js");
// const jwt = require("jsonwebtoken");


const express = require("express");
const router = express.Router()



const { resendEmail } = require("../utils/email.util.js");
const bcryptjs = require("bcryptjs");

const User = require("../models/user/user.model.js");
const Campus = require("../models/university/campus.university.model.js");
const University = require("../models/university/university.register.model.js");





router.post('/register/student', async (req, res) => {
    const { universityEmail, password, universityId, campusId } = req.body;

    console.log(universityEmail, password, universityId, campusId)
    try {
        const isAlreadyRegistered = await User.findOne({ 'universityEmail': universityEmail })

        if (isAlreadyRegistered) return res.status(400).json('Seems Odd') // already registered

        const uniExists = await University.findOne({ _id: universityId })

        if (!uniExists) return res.status(404).json('Hmm.. Seems Odd, this should not happen') // already registered

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
            profile: {
            username: universityEmail,
            },

            role: 'student',
            super_role: 'none'
        });

        await newUser.save();

        campus.users.push(newUser._id)
        uniExists.users.push(newUser._id)

        return res.status(201).json({ message: "Registration successful!" });

    } catch (error) {
        console.error("Error in ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
})



router.post('/login/student', async (req, res) => {
    const { universityId, campusId, email, password } = req.body;
    try {
        // if (universityId && campusId) {

        // }

        const universityFromUser = await User
            .findOne({ universityEmail: email })
            .populate([
                { path: 'university.name', select: '-users _id' },
                { path: 'university.campusLocation', select: '-users _id' },

            ])

        const isPassMatched = await bcryptjs.compare(
            password,
            universityFromUser?.password || "");

        if (!universityFromUser || !isPassMatched)
            return res.status(400).json({ error: "Invalid email or password" });

        req.session.user = {
            _id: universityFromUser._id,
            name: universityFromUser.name,
            email: universityFromUser.universityEmail ? universityFromUser.universityEmail : universityFromUser.personalEmail,
            username: universityFromUser.username,
            profile: universityFromUser.profile,
            university: universityFromUser.university,
            super_role: universityFromUser.super_role,
            role: universityFromUser.role

        };
        // console.log(req.session.user)
        req.session.references = {
            university: {
                name: universityFromUser.university.name.name,
                _id: universityFromUser.university.name._id
            }, 
            campus: {
                name: universityFromUser.university.campusLocation.name,
                _id: universityFromUser.university.campusLocation._id
            }
        }
        // req.references.save((err) => {
        //     if (err) {
        //         console.error('Refferences save error:', err);
        //         return res.status(500).json({ error: "Internal Server Error" });
        //     }}
        // )

        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            // console.log("Session user in Longin Controller : ", req.session.user)
        });

        console.log(req.session.references)
        return res.status(200).json(req.session.user);

    } catch (error) {
        console.error("Error in ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
})



router.get("/session", async (req, res) => {

    // console.log("Req user:", req.session.user)
    // console.log("The session data is in session ", req.session)
    if (req.session.user) {
        res.status(200).json({
            _id: req.session.user._id,
            name: req.session.user.name,
            email: req.session.user.email,
            username: req.session.user.username,
            profile: req.session.user.profile,
            university: req.session.user.university,
            super_role: req.session.user.super_role,
            role: req.session.user.role
        });


    } else {
        res.status(401).json({ error: "Not authenticated" });
    }

})

module.exports = router;