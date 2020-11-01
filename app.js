if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const flash = require("express-flash");
const compression = require("compression");
const helmet = require("helmet");
const csurf = require("csurf");
const engine = require("ejs-mate");
const pino = require("pino-http")();
const database = require("./app/config/database");
const cors = require("cors");
const methodOverride = require("method-override");
const embedUser = require("./app/middlewares/embedUser");

const routes = require("./app/routes");

const app = express();

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app/views"));

app.use(compression());
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
// app.use(pino);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(csurf({ cookie: true }));
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({
			uri: process.env.MONGO_URI,
			collection: "sessions",
		}),
	})
);
app.use(flash());
app.use(embedUser);

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(routes);
app.use((err, req, res, next) => {
	if (err) {
		res.json(err);
	}
});

module.exports = app;
