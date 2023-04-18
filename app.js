var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("./model/user");
const flash = require("connect-flash");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const passcodeRouter = require("./routes/passcode");
const messageRouter = require("./routes/message");

var app = express();
const PORT = process.env.PORT || 3000

require("dotenv").config();

// Set up mongoose connection
// const mongoose = require("mongoose");
// const mongoDb = process.env.DB_URL;
// mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "mongo connection error"));

// Set up mongoose connection deployment
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({ secret: "pirates", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.username_err = req.flash("username_err");
  res.locals.password_err = req.flash("password_err");
  next();
});

passport.use(
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(
            null,
            false,
            req.flash(
              "username_err",
              "Username does not exist. Please try again."
            )
          );
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            // password matched! log user in
            return done(null, user);
          } else {
            // password do not match
            return done(
              null,
              false,
              req.flash("password_err", "Incorrect password")
            );
          }
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/passcode", passcodeRouter);
app.use("/create-message", messageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
      console.log("listening for requests");
  })
})

module.exports = app;
