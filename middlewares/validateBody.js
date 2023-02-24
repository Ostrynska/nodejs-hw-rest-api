const {HttpError} = require("../helpers");

const validateBody = schema => {
    const fn = (req, res, next)=> {
        const { error } = schema.validate(req.body);
        if (error) {
            next(HttpError(400, 'Missing required name field'));
        }
        next()
    }

    return fn;
}

const updateValidateBody = schema =>
{
        const fn = (req, res, next)=> {
        const { error } = schema.validate(req.body);
        if (error) {
            next(HttpError(400, 'Missing field'));
        }
        next()
    }
    return fn;
};

const updateValidateFavorite = schema =>
{
        const fn = (req, res, next)=> {
        const { error } = schema.validate(req.body);
        if (error) {
            next(HttpError(400, 'Missing field favorite'));
        }
        next()
    }
    return fn;
};

module.exports = {validateBody, updateValidateBody, updateValidateFavorite};