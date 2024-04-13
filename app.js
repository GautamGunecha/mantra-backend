require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const colors = require("colors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");
const { rateLimit } = require("express-rate-limit");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");

const connectToMongoDB = require("./configs/mongoose");
const { apiNotFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(cookieParser());
app.use(limiter);
app.use(xssClean());
app.use(hpp());
app.use(mongoSanitize());

global.fs = fs;
global.path = path;

colors.setTheme({
  silly: "rainbow",
  input: "grey",
  verbose: "cyan",
  prompt: "grey",
  info: "green",
  data: "grey",
  help: "cyan",
  warn: "yellow",
  debug: "blue",
  error: "red",
});

connectToMongoDB();

app.use("/api", require("./routes"));
app.use(apiNotFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server running on port: ${port}`.info));
