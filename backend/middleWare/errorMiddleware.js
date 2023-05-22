const errorHandler = (err, req, res, next) => {

    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode)
    // how its working video number 60 timestamp 6:00
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : null
    })
};

module.exports = errorHandler;