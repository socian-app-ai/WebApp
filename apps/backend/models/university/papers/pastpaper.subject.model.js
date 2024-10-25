
const mongoose = require("mongoose");
const { Schema } = mongoose;

// File Schema
const fileSchema = new Schema({
    pdf: String,
    // required: true
    // image: String, // better use pdf only
}, { timestamps: true }); // Add timestamps here

// Assignment and Quiz Schema
const assignmentQuizExamSchema = new Schema({
    name: { type: String, default: '' },
    teachers: [{
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        index: true,
    }],
    file: fileSchema,
}, { timestamps: true });

// MIDTERM SCHEMA
const pastpaper_MidTerm_Schema = new Schema({
    year: { type: Number, required: true },
    assignments: [assignmentQuizExamSchema],
    quizzes: [assignmentQuizExamSchema],
    fall: {
        final: {
            lab: [assignmentQuizExamSchema],
            theory: [assignmentQuizExamSchema],
        },
        mid: {
            lab: [assignmentQuizExamSchema],
            theory: [assignmentQuizExamSchema],
        }
    },
    spring: {
        final: {
            lab: [assignmentQuizExamSchema],
            theory: [assignmentQuizExamSchema],
        },
        mid: {
            lab: [assignmentQuizExamSchema],
            theory: [assignmentQuizExamSchema],
        }
    },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
}, { timestamps: true }); 

const PastPaperMID = mongoose.model("PastPaperMID", pastpaper_MidTerm_Schema);

// SESSIONAL SCHEMA
const pastpaper_Sessional_Schema = new Schema({
    year: { type: Number, required: true },
    assignments: [assignmentQuizExamSchema],
    quizzes: [assignmentQuizExamSchema],
    fall: {
        sessional: [{
            lab: [assignmentQuizExamSchema],
            theory: [assignmentQuizExamSchema],
        }],
        final: {
            lab: [assignmentQuizExamSchema],
            theory: [assignmentQuizExamSchema],
        },
    },
    spring: {
        final: {
            lab: [assignmentQuizExamSchema],
            theory: [assignmentQuizExamSchema],
        },
        sessional: [{
            lab: [assignmentQuizExamSchema],
            theory: [assignmentQuizExamSchema],
        }]
    },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
}, { timestamps: true }); 

const PastPaperSES = mongoose.model("PastPaperSES", pastpaper_Sessional_Schema);

module.exports = { PastPaperSES, PastPaperMID };


















// const { default: mongoose } = require("mongoose");

// const fileSchema = new mongoose.Schema({
//     pdf: String,
//     // required: true
//     // image: String, //better use pdf only
// });


// // MIDTERM SCHEMA

// const pastpaper_MidTerm_Schema = new mongoose.Schema({
//     year: { type: Number, required: true },
//     assignments: [{
//         name: { type: String, default: '' },
//         teachers: [{
//             type: Schema.Types.ObjectId,
//             ref: 'Teacher',
//             index: true,
//         }],
//         file: fileSchema
//     }],
//     quizzes: [{
//         name: { type: String, default: '' },
//         teachers: [{
//             type: Schema.Types.ObjectId,
//             ref: 'Teacher',
//             index: true,
//         }],
//         file: fileSchema
//     }],
//     fall: {
//         final: {
//             lab: [{
//                 teachers: [{
//                     type: Schema.Types.ObjectId,
//                     ref: 'Teacher',
//                     index: true,
//                 }],
//                 file: fileSchema
//             }],
//             theory: [{
//                 teachers: [{
//                     type: Schema.Types.ObjectId,
//                     ref: 'Teacher',
//                     index: true,
//                 }],
//                 file: fileSchema
//             }],
//         },
//         mid: {
//             lab: [{
//                 teachers: [{
//                     type: Schema.Types.ObjectId,
//                     ref: 'Teacher',
//                     index: true,
//                 }],
//                 file: fileSchema
//             }],
//             theory: [{
//                 teachers: [{
//                     type: Schema.Types.ObjectId,
//                     ref: 'Teacher',
//                     index: true,
//                 }],
//                 file: fileSchema
//             }],
//         }
//     },
//     spring: {
//         final: {
//             lab: [{
//                 teachers: [{
//                     type: Schema.Types.ObjectId,
//                     ref: 'Teacher',
//                     index: true,
//                 }],
//                 file: fileSchema
//             }],
//             theory: [{
//                 teachers: [{
//                     type: Schema.Types.ObjectId,
//                     ref: 'Teacher',
//                     index: true,
//                 }],
//                 file: fileSchema
//             }],
//         },
//         mid: {
//             lab: [{
//                 teachers: [{
//                     type: Schema.Types.ObjectId,
//                     ref: 'Teacher',
//                     index: true,
//                 }],
//                 file: fileSchema
//             }],
//             theory: [{
//                 teachers: [{
//                     type: Schema.Types.ObjectId,
//                     ref: 'Teacher',
//                     index: true,
//                 }],
//                 file: fileSchema
//             }],
//         }
//     },
//     subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
// });

// const PastPaperMID = mongoose.model("PastPaperMID", pastpaper_MidTerm_Schema);
// // export is at end of file

// // SESSIONAL SCHEMA

// const pastpaper_Sessional_Schema = new mongoose.Schema({
//     year: { type: Number, required: true },
//     assignments: [{
//         name: { type: String, default: '' },
//         teachers: [{
//             type: Schema.Types.ObjectId,
//             ref: 'Teacher',
//             index: true,
//         }],
//         file: fileSchema
//     }],
//     quizzes: [{
//         name: { type: String, default: '' },
//         teachers: [{
//             type: Schema.Types.ObjectId,
//             ref: 'Teacher',
//             index: true,
//         }],
//         file: fileSchema
//     }],
//     fall: {
        
//         sessional: [{
//             lab: [{
//                 teachers: [{
//                     type: Schema.Types.ObjectId,
//                     ref: 'Teacher',
//                     index: true,
//                 }],
//                 file: fileSchema
//             }],
//             theory: [{
//                 teachers: [{
//                     type: Schema.Types.ObjectId,
//                     ref: 'Teacher',
//                     index: true,
//                 }],
//                 file: fileSchema
//             }],
//         }],
//         final: {
//             lab: [{
//                 teachers: [{
//                     type: Schema.Types.ObjectId,
//                     ref: 'Teacher',
//                     index: true,
//                 }],
//                 file: fileSchema
//             }],
//             theory: [{
//                 teachers: [{
//                     type: Schema.Types.ObjectId,
//                     ref: 'Teacher',
//                     index: true,
//                 }],
//                 file: fileSchema
//             }],
//         },
//     },
//     spring: {
//         final: {
//             lab: [{
//                 teachers: [{
//                     type: Schema.Types.ObjectId,
//                     ref: 'Teacher',
//                     index: true,
//                 }],
//                 file: fileSchema
//             }],
//             theory: [{
//                 teachers: [{
//                     type: Schema.Types.ObjectId,
//                     ref: 'Teacher',
//                     index: true,
//                 }],
//                 file: fileSchema
//             }],
//         },
//         sessional: [{
//             lab: [{
//                 teachers: [{
//                     type: Schema.Types.ObjectId,
//                     ref: 'Teacher',
//                     index: true,
//                 }],
//                 file: fileSchema
//             }],
//             theory: [{
//                 teachers: [{
//                     type: Schema.Types.ObjectId,
//                     ref: 'Teacher',
//                     index: true,
//                 }],
//                 file: fileSchema
//             }],
//         }]
//     },
//     subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
// });

// const PastPaperSES = mongoose.model("PastPaperSES", pastpaper_Sessional_Schema);






// module.exports = { PastPaperSES, PastPaperMID }





// //     assignments: {
// //         assignment_One: { type: Boolean, default: true },
// //         assignment_Two: { type: Boolean, default: true },
// //         assignment_Three: { type: Boolean, default: true },
// //         assignment_Four: { type: Boolean, default: true },
// //         assignment_Five: { type: Boolean, default: false },
// //         assignment_Six: { type: Boolean, default: false },
// //         type: Boolean, default: true
// //     },
// //     quizzes: {
// //         quiz_One: { type: Boolean, default: true },
// //         quiz_Two: { type: Boolean, default: true },
// //         quiz_Three: { type: Boolean, default: true },
// //         quiz_Four: { type: Boolean, default: true },
// //         quiz_Five: { type: Boolean, default: false },
// //         quiz_Six: { type: Boolean, default: false },
// //         type: Boolean, default: true
// //     },
// //     midOrSessional: {
// //         mid: {
// //             lab: { type: Boolean, default: true },
// //             theory: { type: Boolean, default: true },
// //             type: Boolean, default: true
// //         },
// //         sessional: {
// //             sessional_One: { type: Boolean, default: false },
// //             sessional_Two: { type: Boolean, default: false },
// //             sessional_Three: { type: Boolean, default: false },
// //             type: Boolean, default: false,
// //         },
// //     },

// //     final: {
// //         lab: { type: Boolean, default: true },
// //         theory: { type: Boolean, default: true },
// //         type: Boolean, default: false,
// //     },

// //     campusOrigin: {
// //         type: Schema.ObjectId,
// //         ref: 'Campus',
// //         index: true,
// //     },
// //     universityOrigin: {
// //         type: Schema.ObjectId,
// //         ref: 'University',
// //         index: true,
// //     },

// // });