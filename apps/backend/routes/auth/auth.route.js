// const generateToken = require("../utils/generate.token.js");
const jwt = require("jsonwebtoken");

const express = require("express");
const router = express.Router();

const { resendEmail } = require("../../utils/email.util.js");
const bcryptjs = require("bcryptjs");

const User = require("../../models/user/user.model.js");
const Campus = require("../../models/university/campus.university.model.js");
const University = require("../../models/university/university.register.model.js");

// router.post("/register/student", async (req, res) => {
//   const { universityEmail, password, universityId, campusId } = req.body;

//   console.log(universityEmail, password, universityId, campusId);
//   try {
//     const isAlreadyRegistered = await User.findOne({
//       universityEmail: universityEmail,
//     });

//     if (isAlreadyRegistered) return res.status(400).json("Seems Odd"); // already registered

//     const uniExists = await University.findOne({ _id: universityId });

//     if (!uniExists)
//       return res.status(404).json("Hmm.. Seems Odd, this should not happen"); // already registered

//     const campus = await Campus.findOne({
//       _id: campusId,
//       universityOrigin: universityId,
//     });

//     console.log(campus);
//     if (!campus)
//       return res.status(404).json("Hmm.. Seems Odd, this should not happen"); // already registered

//     // const emailPatterns = campus.emailPatterns.studentPatterns;

//     const emailPatterns = campus.emailPatterns.studentPatterns.map((pattern) =>
//       pattern.replace(/\d+/g, "\\d+")
//     );

//     const combinedPattern = `^(${emailPatterns.join("|")})$`;
//     const regex = new RegExp(combinedPattern);

//     const isEmailValid = regex.test(universityEmail);

//     console.log(emailPatterns);
//     // const isEmailValid = emailPatterns.some(pattern => new RegExp(pattern).test(universityEmail));
//     console.log("Valid", isEmailValid);

//     if (!isEmailValid) {
//       // TODO Send report to moderator and superadmin
//       return res
//         .status(400)
//         .json("University email does not match the required format!");
//     }

//     const hashedPassword = await bcryptjs.hash(password, 10);

//     const newUser = new User({
//       username: universityEmail,
//       universityEmail,
//       password: hashedPassword,
//       university: {
//         name: universityId,
//         campusLocation: campusId,
//       },
//       profile: {
//         username: universityEmail,
//       },

//       role: "student",
//       super_role: "none",
//     });

//     await newUser.save();

//     campus.users.push(newUser._id);
//     uniExists.users.push(newUser._id);

//     return res.status(201).json({ message: "Registration successful!" });
//   } catch (error) {
//     console.error("Error in ", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// router.post("/login/student", async (req, res) => {
//   const { universityId, campusId, email, password } = req.body;
//   try {
//     // if (universityId && campusId) {

//     // }

//     const universityFromUser = await User.findOne({
//       universityEmail: email,
//     }).populate([
//       { path: "university.name", select: "-users _id" },
//       { path: "university.campusId", select: "-users _id" },
//     ]);

//     const isPassMatched = await bcryptjs.compare(
//       password,
//       universityFromUser?.password || ""
//     );

//     if (!universityFromUser || !isPassMatched)
//       return res.status(400).json({ error: "Invalid email or password" });

//     req.session.user = {
//       _id: universityFromUser._id,
//       name: universityFromUser.name,
//       email: universityFromUser.universityEmail
//         ? universityFromUser.universityEmail
//         : universityFromUser.personalEmail,
//       username: universityFromUser.username,
//       profile: universityFromUser.profile,
//       university: universityFromUser.university,
//       super_role: universityFromUser.super_role,
//       role: universityFromUser.role,
//     };
//     // console.log(req.session.user)
//     req.session.references = {
//       university: {
//         name: universityFromUser.university.name.name,
//         _id: universityFromUser.university.name._id,
//       },
//       campus: {
//         name: universityFromUser.university.campusId.name,
//         _id: universityFromUser.university.campusId._id,
//       },
//     };
//     // req.references.save((err) => {
//     //     if (err) {
//     //         console.error('Refferences save error:', err);
//     //         return res.status(500).json({ error: "Internal Server Error" });
//     //     }}
//     // )

//     req.session.save((err) => {
//       if (err) {
//         console.error("Session save error:", err);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }
//       // console.log("Session user in Longin Controller : ", req.session.user)
//     });

//     console.log(req.session.references);
//     return res.status(200).json(req.session.user);
//   } catch (error) {
//     console.error("Error in ", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

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
      role: req.session.user.role,
    });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

router.post("/login", async (req, res) => {
  const { universityId, campusId, email, password } = req.body;
  let user;
  let userRoleBool = false;
  try {
    // console.log("login log", universityId, campusId, email, password);
    const platform = req.headers["x-platform"];

    const query = {
      $or: [
        { universityEmail: email },
        { personalEmail: email },
        { secondaryPersonalEmail: email },
      ],
    };
    console.log(query);

    if (universityId && campusId) {
      query.$and = [
        query, // Include to the existing $or condition
        {
          "university.universityId": universityId,
          "university.campusId": campusId,
        },
      ];
    }

    console.log("later", query);
    user = await User.findOne(query);

    const isPassMatched = await bcryptjs.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPassMatched)
      return res.status(400).json({ error: "Invalid email or password" });

    console.log(
      user.restrictions.blocking.isBlocked,
      user.restrictions.approval.isApproved
    );
    if (user.restrictions.blocking.isBlocked) {
      return res.status(400).json({ error: "User blocked or Up for Review" });
    }
    if (user.role === "alumni" || user.role === "ext_org") {
      if (!user.restrictions.approval.isApproved) {
        return res.status(400).json({ error: "User not approved yet" });
      }
    }

    if (user.role === "student" || user.role === "alumni") {
      userRoleBool = true;
      await user.populate([
        { path: "university.universityId", select: "-users _id" },
        { path: "university.campusId", select: "-users _id" },
      ]);
    }

    console.log("user populated", user.university, "role", userRoleBool);

    if (platform === "app") {
      const payload = {
        _id: user._id,
        name: user.name,
        email:
          user?.universityEmail ||
          user?.personalEmail ||
          user?.secondaryPersonalEmail,
        username: user.username,
        profile: user.profile,
        university: userRoleBool ? user.university : undefined,
        super_role: user.super_role,
        role: user.role,
        references: {
          university: {
            name: user.university.universityId.name,
            _id: user.university.universityId._id,
          },
          campus: {
            name: user.university.campusId.name,
            _id: user.university.campusId._id,
          },
        },
      };
      // console.log("in app type", typeof process.env.JWT_EXPIRY_TIME);

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY_TIME,
      });
      // console.log("in app", token);

      // Send JWT to the client
      res.status(200).json({ token });
    } else if (platform === "web") {
      req.session.user = {
        _id: user._id,
        name: user.name,
        email:
          user.universityEmail ||
          user.personalEmail ||
          user.secondaryPersonalEmail,
        username: user.username,
        profile: user.profile,
        university: userRoleBool ? user.university : undefined,
        super_role: user.super_role,
        role: user.role,
      };

      console.log("User in WEB", req.session.user);

      req.session.references = {
        university: {
          name: user.university.universityId.name,
          _id: user.university.universityId._id,
        },
        campus: {
          name: user.university.campusId.name,
          _id: user.university.campusId._id,
        },
      };

      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        // console.log("Session user in Longin Controller : ", req.session.user)
      });

      console.log(req.session.references);
      // res.setHeader("Authorization", `Bearer ${token}`);

      return res.status(200).json(req.session.user);
    } else {
      return res.status(400).json({ error: "Invalid platform" });
    }
  } catch (error) {
    console.error("Error in ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/register", async (req, res) => {
  const { email, password, universityId, campusId, role } = req.body;
  let user;
  let query;

  console.log(email, password, universityId, campusId, role);
  try {
    const platform = req.headers["x-platform"];

    if (email.includes(".edu")) {
      //make it check that .edu comes after @ and no two @ exists
      query = { universityEmail: email };
    } else {
      query = {
        $or: [{ personalEmail: email }, { secondaryPersonalEmail: email }],
      };
    }

    console.log(query);

    if (universityId && campusId) {
      query.$and = [
        // query, // Include to the existing $or condition
        {
          "university.universityId": universityId,
          "university.campusId": campusId,
        },
      ];
    }

    console.log("later", query);
    user = await User.findOne(query);

    if (user) return res.status(400).json("Registered?"); // already registered
    console.log("No", user);
    if (
      (role === "student" || role === "teacher") &&
      (user?.personalEmail || user?.secondaryPersonalEmail)
    )
      return res.status(400).json("Registered?");
    console.log("here");

    if (!(role === "ext_org")) {
      const uniExists = await University.findOne({ _id: universityId });

      if (!uniExists)
        return res.status(404).json("Hmm.. Seems Odd, this should not happen"); // already registered

      const campus = await Campus.findOne({
        _id: campusId,
        universityOrigin: universityId,
      });

      console.log(campus);
      if (!campus)
        return res.status(404).json("Hmm.. Seems Odd, this should not happen"); // already registered

      const emailPatterns = campus.emailPatterns.studentPatterns.map(
        (pattern) => pattern.replace(/\d+/g, "\\d+")
      );

      const combinedPattern = `^(${emailPatterns.join("|")})$`;
      const regex = new RegExp(combinedPattern);
      const isEmailValid = regex.test(email);
      console.log(emailPatterns);
      // const isEmailValid = emailPatterns.some(pattern => new RegExp(pattern).test(universityEmail));
      console.log("Valid", isEmailValid);

      if (!isEmailValid) {
        // TODO Send report to moderator and superadmin
        return res
          .status(400)
          .json("University email does not match the required format!");
      }

      const hashedPassword = await bcryptjs.hash(password, 10);

      const newUser = new User({
        username: email.split("@")[0] + email.split(".")[0],
        password: hashedPassword,
        university: {
          name: universityId,
          campusLocation: campusId,
        },
        role: role,
        super_role: "none",
      });
      role === "alumni"
        ? (newUser.personalEmail = email)
        : (newUser.universityEmail = email);

      await newUser.save();

      campus.users.push(newUser._id);
      uniExists.users.push(newUser._id);

      await campus.save();
      await uniExists.save();
    } else {
      const hashedPassword = await bcryptjs.hash(password, 10);
      console.log("here2");
      const newUser = new User({
        username: email.split("@")[0],
        password: hashedPassword,
        personalEmail: email,
        role: role,
        super_role: "none",
      });
      await newUser.save();
      console.log("here3");
    }

    return res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Error in ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/register-bulk", async (req, res) => {
  const users = req.body.users; // Expecting an array of user data

  const nowS = new Date();
  const hoursS = String(nowS.getHours()).padStart(2, "0");
  const minutesS = String(nowS.getMinutes()).padStart(2, "0");
  const secondsS = String(nowS.getSeconds()).padStart(2, "0");
  const millisecondsS = String(nowS.getMilliseconds()).padStart(3, "0");

  console.log(
    `START: ${hoursS}hr:${minutesS}min:${secondsS}sec:${millisecondsS}msec`
  );

  if (!Array.isArray(users)) {
    return res.status(400).json({ message: "Invalid data format" });
  }

  const createdUsers = [];
  const errors = [];

  for (let i = 0; i < users.length; i++) {
    const { email, password, universityId, campusId, role } = users[i];
    let user;
    let query;

    try {
      const platform = req.headers["x-platform"];

      if (email.includes(".edu")) {
        query = { universityEmail: email };
      } else {
        query = {
          $or: [{ personalEmail: email }, { secondaryPersonalEmail: email }],
        };
      }

      if (universityId && campusId) {
        query.$and = [
          {
            "university.universityId": universityId,
            "university.campusId": campusId,
          },
        ];
      }

      user = await User.findOne(query);

      if (user) {
        console.log("error " + i);
        errors.push({ email, message: "User already registered" });
        continue; // Skip this user if already registered
      }

      if (
        (role === "student" || role === "teacher") &&
        (user?.personalEmail || user?.secondaryPersonalEmail)
      ) {
        console.log("error " + i);
        errors.push({
          email,
          message: "User already registered with a personal email",
        });
        continue; // Skip this user if already registered
      }

      if (!(role === "ext_org")) {
        const uniExists = await University.findOne({ _id: universityId });

        if (!uniExists) {
          console.log("error " + i);
          errors.push({ email, message: "University does not exist" });
          continue; // Skip if university doesn't exist
        }

        const campus = await Campus.findOne({
          _id: campusId,
          universityOrigin: universityId,
        });

        if (!campus) {
          console.log("error " + i);
          errors.push({ email, message: "Campus does not exist" });
          continue; // Skip if campus doesn't exist
        }

        const emailPatterns = campus.emailPatterns.studentPatterns.map(
          (pattern) => pattern.replace(/\d+/g, "\\d+")
        );

        const combinedPattern = `^(${emailPatterns.join("|")})$`;
        const regex = new RegExp(combinedPattern);
        const isEmailValid = regex.test(email);

        if (!isEmailValid) {
          console.log("error " + i);
          errors.push({
            email,
            message: "University email does not match the required format",
          });
          continue; // Skip if email format is invalid
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = new User({
          username: email.split("@")[0] + email.split(".")[0],
          password: hashedPassword,
          university: {
            name: universityId,
            campusLocation: campusId,
          },
          role: role,
          super_role: "none",
        });

        role === "alumni"
          ? (newUser.personalEmail = email)
          : (newUser.universityEmail = email);

        await newUser.save();

        campus.users.push(newUser._id);
        uniExists.users.push(newUser._id);

        await campus.save();
        await uniExists.save();

        createdUsers.push(newUser);
      } else {
        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = new User({
          username: email.split("@")[0],
          password: hashedPassword,
          personalEmail: email,
          role: role,
          super_role: "none",
        });

        await newUser.save();

        createdUsers.push(newUser);
      }
    } catch (error) {
      console.log("error " + i);
      errors.push({ email, message: "Error processing user" });
      console.error("Error in processing user", email, error.message);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors, createdUsers });
  }

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

  console.log(
    `FINISH: ${hours}hr:${minutes}min:${seconds}sec:${milliseconds}msec`
  );
  return res.status(201).json({
    message: "Bulk registration successful!",
    createdUsers,
    errors,
  });
});

module.exports = router;
