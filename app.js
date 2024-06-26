const express = require("express")
const setupGlobalMiddleware = require("./middlewares/globalMiddlewares")
const AppError = require('./utils/appError')
const globalErrorMiddleware = require("./middlewares/errorMiddleware")
const authRouter = require("./routes/authRouter")

const app = express()

// global middlewares
setupGlobalMiddleware(app)

// Routes
app.use("/api/v1/users", authRouter)


// unhandled Routes
app.all("*", (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404, 'fail'));
})

// global error handling middleware
app.use(globalErrorMiddleware)

module.exports = app