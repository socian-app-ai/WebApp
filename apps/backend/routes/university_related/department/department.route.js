const express = require('express');
const Department = require('../../../models/university/department.university.model');
const University = require('../../../models/university/university.register.model');
const Campus = require('../../../models/university/campus.university.model');
const router = express.Router()


router.get("/by-university", async (req, res) => {
    const { universityId } = req.body;
    try {

        const departments = await Department.find()

        const department = await Department.findOne({
            'references.universityOrigin': universityId
        })

        if (!departments) return res.status(300).json({ message: "Error fetching Department" })

        res.status(200).json({ departments })

    } catch (error) {
        console.error('Error in department:', error);
        res.status(500).json({ message: error.message });
    }
})


router.get("/by-campus", async (req, res) => {
    const { campusId } = req.body;
    try {


        const departments = await Department.findOne({
            'references.campusOrigin': campusId
        })

        if (!departments) return res.status(300).json({ message: "Error fetching Department" })

        res.status(200).json({ departments })

    } catch (error) {
        console.error('Error in department:', error);
        res.status(500).json({ message: error.message });
    }
})



router.post("/", async (req, res) => {
    const { name, universityId, campusId } = req.body;
    try {
        if (!name || !universityId || !campusId) return res.status(400).json({ message: "name, universityId, campusId  are required" })
        if (name === "" || universityId === "" || campusId === "") return res.status(400).json({ message: "name, universityId, campusId  are required" })

        const findUni = await University.findOne({ _id: universityId })
        if (!findUni) return res.status(404).json({ message: "no such University found" })

        const findCampus = await Campus.findOne({ _id: campusId, "universityOrigin": universityId })
        if (!findCampus) return res.status(404).json({ message: "no such Campus found" })



        const department = await Department.findOne({
            name: name, 'references.universityOrigin': universityId,
            'references.campusOrigin': campusId
        })
        if (department) return res.status(300).json({ message: "Department already exists" })



        const departmentCreated = await Department.create({
            name: name,
            'references.universityOrigin': universityId,
            'references.campusOrigin': campusId
        })

        departmentCreated.save()

        findCampus.departments.push(departmentCreated)
        findCampus.save()
        res.status(200).json({ message: departmentCreated })


    } catch (error) {
        console.error('Error in department:', error);
        res.status(500).json({ message: error.message });
    }
})
router.post("/departments", async (req, res) => {
    try {

    } catch (error) {
        console.error('Error in department:', error);
        res.status(500).json({ message: error.message });
    }
})



module.exports = router;