const OUT_ERROR_DEFAULT_OPTIONS = { 
    message: "Internal server error",
    code: 500,
    error: null
}

/**
 * Utility manager for errors in every routes. If in staging mode it will log the error. 
 * @param {ExpressResponse} res 
 * @param {object} options 
 * @param {string} [options.message] response message, default `Internal server error`
 * @param {number} [options.code] response status code, default `500`
 * @param {Error} [options.error] error occurred, instance of js Error
 * @returns {ExpressResponse}
 */
const outError = (res, options = { ...OUT_ERROR_DEFAULT_OPTIONS }) => {
    options = { ...OUT_ERROR_DEFAULT_OPTIONS, ...options };

    if (process.env.SERVER_ENV === "staging") {
        console.log(options.error);
    } else {
        //TODO: manage error in production
    }

    return res.status(options.code).json({ message: options.message });
}

module.exports = { 
    outError
}