const express = require('express');
const Subject = require('../../../models/university/subject.department.model');
const University = require('../../../models/university/university.register.model');
const Campus = require('../../../models/university/campus.university.model');
const Department = require('../../../models/university/department.university.model');
const AcademicFormat = require('../../../models/university/academic.format.model');
const { PastPaper, PastpapersCollectionByYear } = require('../../../models/university/papers/pastpaper.subject.model');
const router = express.Router()





router.get("/all-pastpapers-in-subject", async (req, res) => {
    const { subjectId, departmentId, campusOrigin, universityOrigin } = req.body;

    try {

        // const findUni = await University.findOne({ _id: universityOrigin })
        // if (!findUni) return res.status(404).json({ message: "no such University found" })

        // const findCampus = await Campus.findOne({ _id: campusOrigin, "universityOrigin": universityOrigin })
        // if (!findCampus) return res.status(404).json({ message: "no such Campus found" })

        // const findDepartment = await Department.findOne({ _id: departmentId, 'references.campusOrigin': campusOrigin, "references.universityOrigin": universityOrigin })
        // if (!findDepartment) return res.status(404).json({ message: "no such Department found" })

        const findSubject = await Subject.findOne({
            _id: subjectId,
            'references.departmentId': departmentId,
            'references.universityOrigin': universityOrigin,
            'references.campusOrigin': campusOrigin,
        })
        if (!findSubject) return res.status(404).json({ message: "no such subject found" })

        const findpastpapers = await PastpapersCollectionByYear.findOne({
            _id: findSubject.pastpapersCollectionByYear._id,
            reference: {
                departmentId,
                universityOrigin,
                campusOrigin,
            }
        })




        await findSubject.save()
        res.status(200).json({
            message: "Past Paper created successfully",
            createdPastPaper: findpastpapers,
            updatedSubject: findSubject
        });



    } catch (error) {
        console.error('Error in subject:', error);
        res.status(500).json({ message: error.message });
    }
})



// this is to upload one assignment [testing phase]
router.post("/upload-single-assignment", async (req, res) => {
    const { year, assignment, subjectId, departmentId, campusOrigin, universityOrigin } = req.body;

    try {
        // Find the subject based on the provided references
        const findSubject = await Subject.findOne({
            _id: subjectId,
            'references.departmentId': departmentId,
            'references.universityOrigin': universityOrigin,
            'references.campusOrigin': campusOrigin,
        });
        if (!findSubject) return res.status(404).json({ message: "No such subject found" });



        // Retrieve the Past Papers Collection by Year for the found subject
        const findPastpapersCollection = await PastpapersCollectionByYear.findOne({
            _id: findSubject.pastpapersCollectionByYear._id,
            'references.subjectId': subjectId,
            'references.universityOrigin': universityOrigin,
            'references.campusOrigin': campusOrigin,
        });
        // console.log(findPastpapersCollection, findSubject.pastpapersCollectionByYear._id.toHexString(),)
        if (!findPastpapersCollection) return res.status(404).json({ message: "No past papers collection found" });

        // Find or create a PastPaper for the specified year
        let pastpaper = findPastpapersCollection.pastpapers.find(val => val.year === year);
        if (!pastpaper) {
            pastpaper = await PastPaper.create({
                year: year,
                references: {
                    subjectId,
                    universityOrigin,
                    campusOrigin,
                }
            });
            findPastpapersCollection.pastpapers.push(pastpaper._id); // Link the new pastpaper to the collection
        } else {
            pastpaper = await PastPaper.findOne({
                _id: pastpaper._id,
                references: {
                    subjectId,
                    universityOrigin,
                    campusOrigin,
                }
            });
        }

        // Add the assignment to the pastpaper's assignments array
        pastpaper.assignments.push({ name: assignment });
        await pastpaper.save(); // Save changes to the pastpaper

        await findPastpapersCollection.save(); // Save the collection updates

        res.status(200).json({
            message: "Past Paper created or updated successfully",
            createdPastPaper: pastpaper,
            updatedSubject: findSubject
        });

    } catch (error) {
        console.error('Error in subject:', error);
        res.status(500).json({ message: error.message });
    }
});




// router.post("/upload-single-assignment", async (req, res) => {
//     const {
//         year, assignment
//         , subjectId, departmentId, campusOrigin, universityOrigin
//     } = req.body;

//     try {

//         // const findUni = await University.findOne({ _id: universityOrigin })
//         // if (!findUni) return res.status(404).json({ message: "no such University found" })

//         // const findCampus = await Campus.findOne({ _id: campusOrigin, "universityOrigin": universityOrigin })
//         // if (!findCampus) return res.status(404).json({ message: "no such Campus found" })

//         // const findDepartment = await Department.findOne({ _id: departmentId, 'references.campusOrigin': campusOrigin, "references.universityOrigin": universityOrigin })
//         // if (!findDepartment) return res.status(404).json({ message: "no such Department found" })

//         const findSubject = await Subject.findOne({
//             _id: subjectId,
//             'references.departmentId': departmentId,
//             'references.universityOrigin': universityOrigin,
//             'references.campusOrigin': campusOrigin,
//         })
//         if (!findSubject) return res.status(404).json({ message: "no such subject found" })

//         const findpastpapersCollection = await PastpapersCollectionByYear.findOne({
//             _id: findSubject.pastpapersCollectionByYear._id,
//             reference: {
//                 departmentId,
//                 universityOrigin,
//                 campusOrigin,
//             }
//         })
//         let pastpaper = null

//         if (!findpastpapersCollection.pastpapers.some(val => val.year === year)) {
//             pastpaper = await PastPaper.create({
//                 year: year,
//                 reference: {
//                     subjectId,
//                     universityOrigin,
//                     campusOrigin,
//                 }
//             })
//         } else {
//             pastpaper = await PastPaper.findOne({
//                 year: year,
//                 reference: {
//                     subjectId,
//                     universityOrigin,
//                     campusOrigin,
//                 }
//             })
//         }
//         pastpaper.assignments.push(assignment)





//         findpastpapers.pastpapers.push()
//         // confusing as shit
//         // findpastpapers.where({ year: 2024 }).add(some pdf that i want to upload to assignmnet)
//         // findpastpapers.where({ year: 2024 }).add(some pdf that i want to upload to fall -> final)
//         // findpastpapers.where({ year: 2024 }).add(some pdf that i want to upload to sessional(whoose option is not available in my frontedn for user so no issue but still i cant upload to sessional because i can only upload to mid as my academicformat here is MIDTERM)  )




//         await findSubject.save()
//         res.status(200).json({
//             message: "Past Paper created successfully",
//             createdPastPaper: createPastpaper,
//             updatedSubject: findSubject
//         });



//     } catch (error) {
//         console.error('Error in subject:', error);
//         res.status(500).json({ message: error.message });
//     }
// })













// create a pastpaper to an existing subject
router.post("/create-pastpaper-id-attach-exisiting-subject", async (req, res) => {
    const { subjectId, departmentId, campusOrigin, universityOrigin } = req.body;

    try {

        const findUni = await University.findOne({ _id: universityOrigin })
        if (!findUni) return res.status(404).json({ message: "no such University found" })

        const findCampus = await Campus.findOne({ _id: campusOrigin, "universityOrigin": universityOrigin })
        if (!findCampus) return res.status(404).json({ message: "no such Campus found" })

        const findDepartment = await Department.findOne({ _id: departmentId, 'references.campusOrigin': campusOrigin, "references.universityOrigin": universityOrigin })
        if (!findDepartment) return res.status(404).json({ message: "no such Department found" })

        const findSubject = await Subject.findOne({
            _id: subjectId,
            'references.departmentId': departmentId,
            'references.universityOrigin': universityOrigin,
            'references.campusOrigin': campusOrigin,
        })
        if (!findSubject) return res.status(404).json({ message: "no such subject found" })


        const createPastpaperCollectionByYear = await PastpapersCollectionByYear.create({
            type: findCampus.academic.FormatType,
            references: {
                universityOrigin: findUni._id,
                subjectId: findSubject._id,
                campusOrigin: findCampus._id
            }
        })

        findSubject.pastpapersCollectionByYear = createPastpaperCollectionByYear._id

        await findSubject.save()
        res.status(200).json({
            message: "Past Paper created successfully",
            createdPastPaper: createPastpaper,
            updatedSubject: findSubject
        });



    } catch (error) {
        console.error('Error in subject:', error);
        res.status(500).json({ message: error.message });
    }
})









module.exports = router;