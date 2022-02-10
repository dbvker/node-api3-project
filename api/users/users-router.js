const express = require('express');
const { validateUserId, validateUser, validatePost } = require('../middleware/middleware');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const User = require('./users-model');
const Post = require('../posts/posts-model');

const router = express.Router();

router.get('/', (req, res, next) => {
    User.get()
      .then(users => {
        res.json(users)
      })
      .catch(next)
});

router.get('/:id', validateUserId, (req, res, next) => {
    const user = req.user;
    res.json(user);
});

router.post('/', validateUser, (req, res, next) => {
    User.insert({ name: req.name })
      .then(newUser => {
        res.json(newUser);
      })
      .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
    User.update(req.params.id, { name: req.name })
      .then(updatedUser => {
        res.json(updatedUser);
      })
      .catch(next);
});

router.delete('/:id', validateUserId, (req, res, next) => {
    User.remove(req.params.id)
      .then(() => {
        res.json(req.user);
      })
      .catch(next)
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
    User.getUserPosts(req.params.id)
      .then(posts => {
        res.json(posts)
      })
      .catch(next);
});

router.post('/:id/posts', validateUserId, validatePost, (req, res, next) => {
    Post.insert({
      user_id: req.params.id,
      text: req.text,
    })
      .then(post => {
        res.json(post);
      })
      .catch(next);
});

router.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        customMessage: 'There was an error in posts router.',
        message: err.message,
        stack: err.stack,
    });
});

// do not forget to export the router
module.exports = router;
