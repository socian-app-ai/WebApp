const express = require("express");
const SocietyType = require("../../../models/society/society.type.model");
const Society = require("../../../models/society/society.model");
const Members = require('../../../models/society/members.collec.model');
const VerificationRequest = require("../../../models/verification/society.verify.model");
const router = express.Router();


/**
 * @summary finds society based on id
 *  @todo  No_role_Required
 */
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    // let role;
    // let universityId;
    // let campusId;
    try {

        const society = await Society.findOne({ _id: id })
        if (!society) return res.status(404).json("no society found")
        res.status(200).json(society)

    } catch (error) {
        console.error("Error in society.route.js ", error);
        res.status(500).json("Internal Server Error");
    }
});



/**
 * ALL University Page Default - childrens = Comsats, Fasts, UET, Bahria
 * @summary get all-uni[all parents] societies
 */
router.get("/universities/all", async (req, res) => {

    let role;
    try {
        if (role === 'ext_org') return res.status(417).json("EXT Cant Access this route")
        const platform = req.headers['x-platform']
        if (platform === 'web') {
            role = req.session.user.role

        } else if (platform === 'app') {
            role = req.user.role
        }
        const society = await Society.find(
            {
                references: {
                    role: role
                }
            }
        )


        if (!society) return res.status(404).json("no society found")
        res.status(200).json(society)
    } catch (error) {
        console.error("Error in society.route.js ", error);
        res.status(500).json("Internal Server Error");
    }
});

/**
 * ALL CAMPUS PAGE default - children = Comsats WAH+VEHARI+ATTOCK+ABBOTTABAD
 * lets assign another analogy: all campus to be university page
 * @summary get all-campus[parent and child] societies
 */
router.get("/campuses/all", async (req, res) => {

    let role;
    let universityId;
    try {
        const platform = req.headers['x-platform']
        if (platform === 'web') {
            role = req.session.user.role
            if (role !== 'ext_org') {
                universityId = req.session.university.universityId._id
            }
        } else if (platform === 'app') {
            role = req.user.role
            if (role !== 'ext_org') {
                universityId = req.user.university.universityId._id
            }
        }
        const society = await Society.find(
            {
                references: {
                    role: role,
                    universityId
                }
            }
        )


        if (!society) return res.status(404).json("no society found")
        res.status(200).json(society)
    } catch (error) {
        console.error("Error in society.route.js ", error);
        res.status(500).json("Internal Server Error");
    }
});
/**
 * HOME PAGE default - child itslef = Comsats Lahore ONLY
 * @summary  get one[single-child] campus-societies
 */
router.get("/campus/all", async (req, res) => {
    const { id } = req.params;
    let role;
    let universityId;
    let campusId;
    try {
        const platform = req.headers['x-platform']
        if (platform === 'web') {
            role = req.session.user.role
            if (role !== 'ext_org') {
                universityId = req.session.university.universityId._id,
                    campusId = req.session.university.campus._id
            }
        } else if (platform === 'app') {
            userId = req.user._id
            role = req.user.role
            if (role !== 'ext_org') {

                universityId = req.user.university.universityId._id,
                    campusId = req.user.university.campus._id
            }
        }
        const society = await Society.findOne({ _id: id },

            {
                references: {
                    role: role,
                    universityId,
                    campusId
                }
            }
        )


        if (!society) return res.status(404).json("no society found")
        res.status(200).json(society)
    } catch (error) {
        console.error("Error in society.route.js ", error);
        res.status(500).json("Internal Server Error");
    }
});






/**
 * @summary finds society based on @param {societyId}  Role__UNI__CAMPUS__and__COMPANY 
 */
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    let role;
    let universityId;
    let campusId;
    try {
        const platform = req.headers['x-platform']
        if (platform === 'web') {
            role = req.session.user.role
            if (role !== 'ext_org') {
                universityId = req.session.university.universityId._id,
                    campusId = req.session.university.campus._id
            }
            // else {
            //     // TODO IMPLEMENT LATER - to make query faster, give company id
            //     // companyId 
            // }
        } else if (platform === 'app') {
            userId = req.user._id
            role = req.user.role
            if (role !== 'ext_org') {

                universityId = req.user.university.universityId._id,
                    campusId = req.user.university.campus._id
            }
            // else {
            //     // TODO IMPLEMENT LATER - to make query faster, give company id
            //     // companyId 
            // }
        }
        const society = await Society.findOne({ _id: id },
            (role === "ext_org")
                ? { companyReference: { isCompany: true } }
                :
                {
                    references: {
                        role: role,
                        universityId,
                        campusId
                    }
                }
        )


        if (!society) return res.status(404).json("no society found")
        res.status(200).json(society)
    } catch (error) {
        console.error("Error in society.route.js ", error);
        res.status(500).json("Internal Server Error");
    }
});

/**
 * @summary finds ALL SOCIETIES BASED ON  ROLE
 * FOR 
 */
router.get("/with-company/all", async (req, res) => {
    let role;
    let universityId;
    let campusId;
    try {
        const platform = req.headers['x-platform']
        if (platform === 'web') {
            role = req.session.user.role
            if (role !== 'ext_org') {
                universityId = req.session.university.universityId._id,
                    campusId = req.session.university.campus._id
            }
            // else {
            //     // TODO IMPLEMENT LATER - to make query faster, give company id
            //     // companyId 
            // }
        } else if (platform === 'app') {
            userId = req.user._id
            role = req.user.role
            if (role !== 'ext_org') {

                universityId = req.user.university.universityId._id,
                    campusId = req.user.university.campus._id
            }
            // else {
            //     // TODO IMPLEMENT LATER - to make query faster, give company id
            //     // companyId 
            // }
        }
        const society = await Society.find((role === "ext_org")
            ? { companyReference: { isCompany: true } }
            :
            {
                references: {
                    role: role,
                    universityId,
                    campusId
                }
            })

        if (!society) return res.status(404).json("no society found")
        res.status(200).json(society)
    } catch (error) {
        console.error("Error in society.route.js ", error);
        res.status(500).json("Internal Server Error");
    }
});

/**
* @param {icon,banner} url_link
*/
router.post("/create", async (req, res) => {
    try {
        let role;
        let userId;
        let universityId;
        let campusId;
        // get societyTypes from cache later on
        const { name, description, societyTypeId, category, icon, banner, } = req.body;

        const platform = req.headers['x-platform']
        if (platform === 'web') {
            userId = req.session.user._id
            role = req.session.user.role
            if (role !== 'ext_org') {
                universityId = req.session.university.universityId._id,
                    campusId = req.session.university.campus._id
            }

        }
        if (platform === 'app') {
            userId = req.user._id
            role = req.user.role
            if (role !== 'ext_org') {
                universityId = req.user.university.universityId._id,
                    campusId = req.user.university.campus._id
            }
        }
        // else { }



        const alreadyExists = await Society.findOne({ name: name },
            (role === "ext_org")
                ? { companyReference: { isCompany: true } }
                :
                {
                    references: {
                        role: role,
                        universityId,
                        campusId
                    }
                }
        )
        if (alreadyExists) return res.status(302).json('Society already Exists')

        const societyTypeIdExists = await SocietyType.findById(societyTypeId)
        if (societyTypeIdExists) return res.status(302).json('Society Type invalid')

        const newSociety = new Society({
            name,
            description,
            category,
            icon,
            banner,
            creator: userId,
            moderators: [userId],
            totalMembers: 1,
            societyType: societyTypeIdExists._id,
            ...(role === "ext_org"
                ? { companyReference: { isCompany: true, companyOrigin: userId } }
                : { references: { role, universityOrigin: universityId, campusOrigin: campusId } }
            ),
            allows: [user.role]
        });

        await newSociety.save();

        return res.status(201).json({ message: "Society created successfully", society: newSociety });
    } catch (error) {
        console.error("Error creating society: ", error);
        res.status(500).json("Internal Server Error");
    }
});


router.post("/request-verification", async (req, res) => {
    try {
        const { societyId, campusModeratorId, requestedBy, documentObject } = req.body;

        const newRequest = new VerificationRequest({
            society: societyId,
            campusModerator: campusModeratorId,
            requestedBy,
            requiredDocuments: {
                busCardImage: documentObject.busCardImage,
                studentCardImage: documentObject.studentCardImage,
                livePhoto: documentObject.livePhoto
            }
        });
        // TODO chat schema when implemented

        await newRequest.save();

        return res.status(201).json({ message: "Verification request sent", request: newRequest });
    } catch (error) {
        console.error("Error in verification request: ", error);
        res.status(500).json("Internal Server Error");
    }
});




/***
 * @param {role} NOT_REQUIRED NOT MUST
 * 
 */
router.post("/role-based/:id", async (req, res) => {
    const { id } = req.params;
    let roleFromMiddleware;

    try {
        const platform = req.header['x-platform']

        if (platform === 'web') {
            roleFromMiddleware = req.session.user.role

        } else if (platform === 'app') {
            roleFromMiddleware = req.user.role
        }

        if (!roleFromMiddleware) return res.status(404).json("role required")
        const society = await Society.findOne({ _id: id }, { 'references.role': roleFromMiddleware })

        if (!society) return res.status(404).json("no society found in " + roleFromMiddleware)
        res.status(200).json(society)
    } catch (error) {
        console.error("Error in society.route.js ", error);
        res.status(500).json("Internal Server Error");
    }
});

/***
 *  For Companies
 */
router.get("/ext-org/:id", async (req, res) => {
    const { id } = req.params;


    try {

        // if (!(req.session.user.role === 'ext_org')) return res.status(404).json("role mismatch error")
        const society = await Society.findOne({ _id: id }, { 'companyReference.isCompany': true })

        if (!society) return res.status(404).json("no society found in ")
        res.status(200).json(society)
    } catch (error) {
        console.error("Error in society.route.js ", error);
        res.status(500).json("Internal Server Error");
    }
});
/***
 *  For Companies
 */
router.get("/ext-org/:companyId", async (req, res) => {
    const { companyId } = req.params;


    try {
        // if (!(req.session.user.role === 'ext_org')) return res.status(404).json("role mismatch error")
        const society = await Society.findOne({ 'companyReference.companyOrigin': companyId },
            { 'companyReference.isCompany': true })

        if (!society) return res.status(404).json("no society found in " + type)
        res.status(200).json(society)
    } catch (error) {
        console.error("Error in society.route.js ", error);
        res.status(500).json("Internal Server Error");
    }
});




router.post("/join-society/:id", async (req, res) => {
    const { id } = req.params;
    let role;
    let userId;

    try {
        const platform = req.headers['x-platform'];
        if (platform === 'web') {
            role = req.session.user.role;
            userId = req.session.user._id;
        } else if (platform === 'app') {

            role = req.user.role;
            userId = req.user._id;
            return res.status(501).json("Platform not supported yet");
        }

        // Fetch the society and validate the role
        const society = await Society.findOne({ _id: id });
        if (!society) return res.status(404).json("Society not found");
        if (!society.allows.includes(role)) return res.status(403).json(`Society does not allow role: ${role}`);

        // Update the society atomically
        const updatedSociety = await Society.findOneAndUpdate(
            { _id: id },
            {
                // $addToSet: { 'members.members': userId }, //{} Avoid duplicate members
                $inc: { totalMembers: 1 }
            },
            { new: true } // Return the updated document
        );

        if (!updatedSociety) return res.status(404).json("Failed to update society");

        // Optional: Sync with Members collection if necessary
        await Members.updateOne(
            { societyId: id },
            { $addToSet: { members: userId } },
            { upsert: true } // Create document if it doesn't exist
        );

        return res.status(200).json({ message: "Joined society successfully", society: updatedSociety });
    } catch (error) {
        console.error("Error in join-society route: ", error);
        res.status(500).json("Internal Server Error");
    }
});

router.post("/leave-society/:id", async (req, res) => {
    const { id } = req.params;
    let role;
    let userId;

    try {
        const platform = req.headers['x-platform'];
        if (platform === 'web') {
            role = req.session.user.role;
            userId = req.session.user._id;
        } else if (platform === 'app') {

            role = req.user.role;
            userId = req.user._id;
            return res.status(501).json("Platform not supported yet");
        }

        // Fetch the society and validate existence
        const society = await Society.findOne({ _id: id }).populate('members').select('_id');
        if (!society) return res.status(404).json("Society not found");

        // Check if the user is already a member
        if (!society.members.members.includes(userId)) {
            return res.status(400).json("You are not a member of this society");
        }

        // Update the society to remove the user
        const updatedSociety = await Society.findOneAndUpdate(
            { _id: id },
            {
                // $pull: { 'members.members': userId }, // Remove user from members array
                $inc: { totalMembers: -1 }          // Decrement the total member count
            },
            { new: true } // Return the updated document
        );

        if (!updatedSociety) return res.status(404).json("Failed to update society");

        // Optional: Sync with Members collection if necessary
        await Members.updateOne(
            { societyId: id },
            { $pull: { members: userId } }
        );

        return res.status(200).json({ message: "Left society successfully", society: updatedSociety });
    } catch (error) {
        console.error("Error in leave-society route: ", error);
        res.status(500).json("Internal Server Error");
    }
});






module.exports = router;
