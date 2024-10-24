const express = require('express');
const Subject = require('../../../models/university/subject.department.model');
const University = require('../../../models/university/university.register.model');
const Campus = require('../../../models/university/campus.university.model');
const Department = require('../../../models/university/department.university.model');
const router = express.Router()


router.get("/", async (req, res) => {
    try {

    } catch (error) {
        console.error('Error in subject:', error);
        res.status(500).json({ message: error.message });
    }
})


router.post("/", async (req, res) => {
    const { name, departmentId, universityOrigin, campusOrigin } = req.body;
    try {

        const findUni = await University.findOne({ _id: universityOrigin })
        if (!findUni) return res.status(404).json({ message: "no such University found" })

        const findCampus = await Campus.findOne({ _id: campusOrigin, "universityOrigin": universityOrigin })
        if (!findCampus) return res.status(404).json({ message: "no such Campus found" })


        const findDepartment = await Department.findOne({ _id: departmentId, 'references.campusOrigin': campusOrigin, "references.universityOrigin": universityOrigin })
        if (!findDepartment) return res.status(404).json({ message: "no such Department found" })


        const subject = await Subject.create({
            'name': name,
            'references.departmentId': departmentId,
            'references.universityOrigin': universityOrigin,
            'references.campusOrigin': campusOrigin,
        })

        subject.save()

        findDepartment.subjects.push(subject)

        findDepartment.save()

        if (!subject) return res.status(502).json({ error: "Failed to create Subject" })

        res.status(200).json(subject)


    } catch (error) {
        console.error('Error in subject:', error);
        res.status(500).json({ message: error.message });
    }
})

router.post("/add-subject", async (req, res) => {
    try {

    } catch (error) {
        console.error('Error in subject:', error);
        res.status(500).json({ message: error.message });
    }
})
router.post("/add-subjects", async (req, res) => {
    try {

    } catch (error) {
        console.error('Error in subject:', error);
        res.status(500).json({ message: error.message });
    }
})



module.exports = router;