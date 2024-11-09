const express = require("express");
const Discussion = require("../../models/discussion/discussion");
const router = express.Router()



const populateReplies = (path, depth) => {
    if (depth === 0) {
        return { path };
    }
    return {
        path,
        populate: [{
            path: 'replies',
            populate: populateReplies('replies', depth - 1)
        },
        {
            path: 'user',
            select: 'name profilePic universityEmail personalEmail universityEmailVerified updatedAt createdAt personalEmailVerified __v'
        }]
    };
};


router.post("/create-get",  async (req, res) => {
    const { toBeDisccusedId } = req.query
    console.log(toBeDisccusedId)

    try {
        const discussion = await Discussion.findOne({ discussion_of: toBeDisccusedId }).populate({
            path: 'discussioncomments',
            populate: [{
                path: 'user',
                select: 'name profilePic universityEmail personalEmail universityEmailVerified updatedAt personalEmailVerified '
            },
            
            populateReplies("replies", 10)]
        })
    
        if (discussion) return res.status(200).json({ discussion })
console.log(discussion)
        const createDiscussion = await Discussion.create({
            discussion_of: toBeDisccusedId
        })
        console.log(createDiscussion)

        res.status(200).json({ createDiscussion })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}
)

router.get("/", async (req, res) => {

    try {
        const discussion = await Discussion.find()
        if (!discussion) return res.status(404).json({ message: "No Discussion Found" })
        res.status(200).json({ discussion })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
router.post("/:id",  async (req, res) => {
    const { id } = req.params
    try {
        const discussion = await Discussion.findOne({ discussion_of: id })
        if (!discussion) return res.status(404).json({ message: "No Discussion Found" })

        res.status(200).json({ discussion })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})





module.exports = router;