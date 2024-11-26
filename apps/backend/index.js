// const cluster = require('cluster');
// const os = require('os');
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoDB = require("./db/connect.mongodb.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
// const protectRoute = require('./middlewares/protectRoute.js')
const path = require("path");
// const RedisStore = require('connect-redis').default;
// const redisClient = require("./db/reddis.js")
// const Redis = require('ioredis');

dotenv.config();

// const redis = new Redis(process.env.REDIS_URL);
// redis.on('error', (err) => {
//     console.error('Redis error:', err);
// });

// Will be using session for now
app.set("trust proxy", 1);
const sessionData = session({
  name: "iidxi",
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: process.env.RESAVE === "true",
  saveUninitialized: process.env.SAVE_UNINTIALIZED === "true", // should be false otherwise empty sessions wil be stored in database
  cookie: {
    maxAge: 140 * 24 * 60 * 60 * 1000, // 140 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true if HTTPS in production
    sameSite: process.env.NODE_ENV === "production" && "lax",
    domain: process.env.COOKIE_DOMAIN || undefined,
  },
  rolling: process.env.ROLLING === "true",
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_DB_URI,
    collectionName: "user-sessions",
    ttl: 14 * 24 * 60 * 60, // 14 days
  }),
});

app.use(sessionData);

app.use(
  cors({
    origin: ["http://localhost:3000", "https://m.bilalellahi.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// generate hash
// const crypto = require('crypto')
// console.log(crypto.randomBytes(6).toString('hex'))

const authRouter = require("./routes/auth.route.js");
// const oAuthRouter = require('./routes/oauth');
// const requestRoute = require('./routes/request');
// const emailRoute = require('./routes/email.route.js');

const protectRoute = require("./middlewares/protect.route.js");
const superProtect = require("./middlewares/super.protect.js");

const superRouter = require("./routes/super/super.route.js");

const universityRouter = require("./routes/university_related/university.route.js");
const campusRouter = require("./routes/university_related/campus.route.js");

const departmentRouter = require("./routes/university_related/department/department.route.js");
const subjectRouter = require("./routes/university_related/subject/subject.route.js");
const teacherRouter = require("./routes/university_related/teacher/teacher.route.js");

const pastpaperRouter = require("./routes/university_related/pastpapers/pastpaper.route.js");
const academicRouter = require("./routes/university_related/pastpapers/academic.format.route.js");
const discussionRouter = require("./routes/university_related/discussion.route.js");

app.use("/api/super", superProtect, superRouter);

app.use("/api/auth", authRouter);
// app.use('/api/oauth', oAuthRouter);
// app.use('/api/request', requestRoute);
// app.use('/email', emailRoute);
app.use("/api/university", protectRoute, universityRouter);
app.use("/api/campus", protectRoute, campusRouter);

app.use("/api/teacher", protectRoute, teacherRouter);
app.use("/api/department", protectRoute, departmentRouter);
app.use("/api/subject", protectRoute, subjectRouter);

app.use("/api/pastpaper", protectRoute, pastpaperRouter);
app.use("/api/academic", protectRoute, academicRouter);
app.use("/api/discussion", discussionRouter);

// Start Server
const startServer = () => {
  app.listen(PORT, () => {
    mongoDB();
    console.log(`Server Running on ${PORT}`);
  });
};

// Error report
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

startServer();

// if (cluster.isMaster) {
//     const numCPUs = os.cpus().length;

//     console.log(`Master ${process.pid} is running`);

//     for (let i = 0; i < numCPUs; i++) {
//         cluster.fork();
//     }

//     cluster.on('exit', (worker, code, signal) => {
//         console.log(`Worker ${worker.process.pid} died`);
//     });
// } else {
//     startServer();
// }
