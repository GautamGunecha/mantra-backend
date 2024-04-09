require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const colors = require("colors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const FileStore = require("session-file-store")(session);

const connectToMongoDB = require("./configs/mongoose");
const { apiNotFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: new FileStore({
      path: "./sessions",
      retries: 0,
    }),
  })
);
app.use(cookieParser());

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
