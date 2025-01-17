const User = require('../users/users-model');

function logger(req, res, next) {
    // DO YOUR MAGIC
    const method = req.method;
    const url = req.originalUrl;
    const timeStamp = new Date().toLocaleString();
    console.log(`Method: ${method} \nURL: ${url} \nTimestamp: ${timeStamp}\n`);
    next();
}

async function validateUserId(req, res, next) {
    const { id } = req.params;
    try {
        const user = await User.getById(id);
        if (!user) {
            res.status(404).json({
                message: 'user not found',
            });
        } else {
            req.user = user;
            next();
        }
    } catch (err) {
        res.status(500).json({
            message: 'problem finding user',
        });
    }
}

function validateUser(req, res, next) {
    const { name } = req.body;
    if (!name || !name.trim()) {
        res.status(400).json({
            message: 'missing required name field',
        });
    } else {
        req.name = name.trim();
        next();
    }
}

function validatePost(req, res, next) {
    const { text } = req.body;
    if (!text || !text.trim()) {
        res.status(400).json({
            message: 'missing required text field',
        });
    } else {
        req.text = text.trim();
        next();
    }
}

// do not forget to expose these functions to other modules
module.exports = {
    logger,
    validateUserId,
    validateUser,
    validatePost,
};
