const mongoose = require("mongoose");
// Remmeber: Apply logic in prioirity on frontend then backend and then model. 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    universityEmail: {
        type: String,
        required: function () {
            return !this.personalEmail;
        },
        match: [
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
            "Please fill a valid email address",
        ],
    },
    personalEmail: {
        type: String,
        required: function () {
            return !this.universityEmail;
        },
        match: [
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
            "Please fill a valid email address",
        ],
    },

    secondaryPersonalEmail: {
        type: String,
        match: [
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
            "Please fill a valid email address",
        ],
    },

    phoneNumber: {
        type: String,
        match: [/^\d{10,15}$/, "Please fill a valid phone number"],
    },

    universityEmailVerified: {
        type: Boolean,
        default: false,
    },
    personalEmailVerified: {
        type: Boolean,
        default: false,
    },
    secondaryPersonalEmailVerified: {
        type: Boolean,
        default: false,
    },

    universityEmailExpirationDate: {
        type: Date,
    },

    google_EmailVerified: {
        type: Boolean,
        default: false,
    },
    graduationYear: {
        type: Number,
        default: 3000
    },



    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'alumni', 'teacher', 'ext_org'],
        required: true
    },
    isBlocked: { type: Boolean, default: false },

    // Additional field for ext_org approval:
    approval: {
        isApproved: { type: Boolean, default: false },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }  // This is  ref to a user(admin,mod,super admin)
    },


    //    if using jwt token
    tokens: {
        token: {
            type: String,
            default: ''
        },
        refresh_token: {
            type: String,
            default: ''
        },
        access_token: {
            type: String,
            default: ''
        },
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },



    profile: {
        // update default picture url 
        picture: { type: String, default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg' },
        bio: { type: String, default: '' },
        avatar: { type: String, default: '' },
        location: {
            type: String,
            //enum is not needed to hardcode here so ref is used
            // enum: [{ type: mongoose.Schema.Types.ObjeectId, ref: 'Campus' }]
        },
        website: { type: String, default: '' },
        urls: [String],
        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },
        respect: {
            postRespect: { type: Number, default: 0 },
            commentRespect: { type: Number, default: 0 }
        },
    },

    // savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    // subscribedCommunities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }],
    // subscribedSubCommunities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCommunity' }],               
});


// Methods for handling graduation checks and notifications
userSchema.methods.checkGraduation = function () {
    if (this.role === 'student' && this.graduationYear < new Date().getFullYear()) {
        if (!this.phoneNumber) {
            this.isBlocked = true;  // Block account if phone number isn't present
        } else {
            // Send notification but don't block the account
        }
    }
};

userSchema.methods.convertToAlumni = function () {
    if (this.role === 'student' && this.graduationYear >= new Date().getFullYear()) {
        this.role = 'alumni';  // Automatically convert to alumni
    }
};

userSchema.pre("save", async function (next) {
    // For student or alumni: graduation year logic
    if (this.role === 'student' || this.role === 'alumni') {
        this.checkGraduation();
    }
    // For teacher or ext_org: apply approval status check
    else if (this.role === 'teacher' || this.role === 'ext_org') {
        if (!this.approval.isApproved) {
            this.isBlocked = true;  // Block account if not approved
        }
    }
    this.updatedAt = Date.now();
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
