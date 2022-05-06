var Post = require('../models/post');
var async = require('async');
var User = require('../models/user');

const { body,validationResult } = require("express-validator");

// Display list of all Posts.
exports.post_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Post list');
};

// Display detail page for a specific Post.
exports.post_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Post detail: ' + req.params.id);
};

// Display Post create form on GET.
exports.post_create_get = function(req, res) {
    res.render('message_form', { title: 'Create New Message', errors:[] });
};

// Handle Post create on POST.
exports.post_create_post = [
        // Validate and sanitize fields.
    body('title').trim().isLength({ min: 1 }).escape().withMessage('Title must be specified.'),
    body('content').trim().isLength({ min: 1 }).escape().withMessage('Content of the post most be entered.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        async.series({
            user: function (callback) {
                User.findById(req.body.user).exec(callback)
            }
        },  function (err, results) {
            if (err) {return next(err);}
            else {
                
                var message = new Post(
                    {
                        title: req.body.title,
                        user_id: results.user._id,
                        author: results.user.username, 
                        content: req.body.content,
                        time_stamp:  Date.now(),
                    }
                ); 
                
        
            if (!errors.isEmpty()) {
                // There are errors. Render form again with sanitized values/errors messages.
                res.render('message_form', { title: 'Create New Message', message: message, errors: errors.array() });
                return;
            }
            else {
                // Data from form is valid.
        
                // Save message.
                message.save(function (err) {
                    if (err) { return next(err); }
                    // Successful - redirect to the index page.
                    res.redirect('/');
                });
            }

            }
        });
       
    }    
];

// Display Post delete form on GET.
exports.post_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Post delete GET');
};

// Handle Post delete on POST.
exports.post_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Post delete POST');
};

// Display Post update form on GET.
exports.post_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Post update GET');
};

// Handle Post update on POST.
exports.post_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Post update POST');
};
