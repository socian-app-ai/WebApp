const express = require('express');
const Subject = require('../../../models/university/subject.department.model');
const University = require('../../../models/university/university.register.model');
const Campus = require('../../../models/university/campus.university.model');
const Department = require('../../../models/university/department.university.model');
const Teacher = require('../../../models/university/teacher/teacher.model');
const router = express.Router()


router.get("/", async (req, res) => {
    try {

    } catch (error) {
        console.error('Error in teacher:', error);
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


        const teacher = await Teacher.create({
            'name': name,
            'department.name': findDepartment.name,
            'department.departmentId': departmentId,
            'universityOrigin': universityOrigin,
            'campusOrigin': campusOrigin,
        })

        teacher.save()

        findDepartment.teachers.push(teacher)
        findCampus.teachers.push(teacher)

        findDepartment.save()
        findCampus.save()

        if (!teacher) return res.status(502).json({ error: "Failed to create teacher" })

        res.status(200).json(teacher)


    } catch (error) {
        console.error('Error in teacher:', error);
        res.status(500).json({ message: error.message });
    }
})

router.post("/add-teachers-to-teacher", async (req, res) => {
    try {

    } catch (error) {
        console.error('Error in teacher:', error);
        res.status(500).json({ message: error.message });
    }
})
router.post("/add-teachers", async (req, res) => {
    try {

    } catch (error) {
        console.error('Error in teacher:', error);
        res.status(500).json({ message: error.message });
    }
})



module.exports = router;