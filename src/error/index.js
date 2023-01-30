
module.exports.handleApiError = function (err, res, next) {
    if (!err) {
        next();
        return;
    }
    res
        .status(400)
        .json({
            'errorCode': 400,
            'errorDetail': err.message
        })
        .end();
};