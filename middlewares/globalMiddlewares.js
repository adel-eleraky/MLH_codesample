const path = require("path")
const express = require("express")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const hpp = require("hpp")
const compression = require("compression")
const cors = require("cors")
const bodyParser = require("body-parser")


const setupGlobalMiddleware = (app) => {

    app.use(helmet())  // set security http headers

    // for compress response
    app.use(compression())

    if (process.env.NODE_ENV === "development") {
        app.use(morgan("dev"))  // development logging
    }

    app.use(bodyParser.json())
    // app.use(express.json())  // body parser , reading data from req.body
    app.use(express.urlencoded({ extended: true }))
    app.use(express.static(path.join(__dirname, "..", "public")))  // serving static files
    app.use(cookieParser())  // cookie parser , reading cookies from req.cookies

    // data sanitization against NoSql query injection , make sure to implement after any body parser
    app.use(mongoSanitize())

    // dat sanitization against xss
    app.use(xss())

    // prevent http parameter pollution
    app.use(hpp({
        whitelist: [
            "duration", "ratingsAverage", "ratingsQuantity", "maxGroupSize", "difficulty", "price"
        ]
    }))

    // trust first proxy 
    app.set("trust proxy", 1)

    // rate limiter
    const limiter = rateLimit({
        max: 100,
        windowMs: 60 * 60 * 1000,
        message: "Too many requests from this ip , please try again in 1 hour! "
    })
    app.use('/api/v1', limiter)  // rate limiting , limit requests from same IP

    // cors
    app.use(cors())

}

module.exports = setupGlobalMiddleware