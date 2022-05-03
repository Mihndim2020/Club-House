var User = require('../models/user');

const bcrypt = require('bcryptjs');

var async = require('async');

const { body, validationResult, check } = require('express-validator');
const res = require('express/lib/response');

exports.index = function(req, res) {
    res.render("index", { title: 'Home Page', user: req.user });
};

// Display list of all users.
exports.user_list = function(req, res) {
    res.send('NOT IMPLEMENTED: User list');
};

// Display detail page for a specific user.
exports.user_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: User detail: ' + req.params.id);
};

// Display User create form on GET.
exports.user_create_get = function(req, res, next) {
    res.render('user_registration_form', { title: 'Register a User'});
};

// Handle User create on POST.
exports.user_create_post = [

    // Validate and sanitize fields.
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('last_name').trim().isLength({ min: 1 }).escape().withMessage('Last name must be specified.')
        .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('email').trim().isLength({ min: 1 }).escape().withMessage('email must be specified.'),
    body('username').trim().optional({ checkFalsy: true }),
    body('password').trim().isLength({ min: 6 }).escape().withMessage('password must be specified.'),
    body('confirmPassword').trim().isLength({ min: 6 }).escape().withMessage('confirmed password must be specified.').custom(async (confirmPassword, {req}) => {
        const password = req.body.password
   
        // If password and confirm password not same
        // don't allow to sign up and throw error
        if(password !== confirmPassword){
          throw new Error('Passwords must be same');
          console.log('password missmatch');
        }
      }),   

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('user_registration_form', { title: 'Register a User', user: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {

            // Create a User object with escaped and trimmed data.
                var user = new User(
                    {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        email: req.body.email,
                        username: req.body.username,
                        password: hashedPassword
                    });
                user.save(function (err) {
                    if (err) { return next(err); }
                    // Successful - redirect to home page.
                    res.redirect("/");
                });
             });
        }
    }
];

// Handle User login on POST
exports.user_login_post = function(req, res) {
    res.send('User login controller function is not implemented yet');
};

// Handle User Join the club on POST
exports.user_join_the_club_post = function(req, res, next) {

    if (req.body.passcode === "112233" ){

        async.series({
            user: function (callback) {
                User.findById(req.body.user).exec(callback)
            }
        }, function (err, results) {
            if (err) {return next(err);}
            else {
                var updatedUser = new User(
                    {
                        first_name: results.user.first_name,
                        last_name: results.user.last_name,
                        email: results.user.email,
                        username: results.user.username,
                        password: results.user.password,
                        posts: results.user.posts,
                        member_status: "Member",
                        _id: req.body.user
                    }
                ); 
                
            User.findByIdAndUpdate(req.body.user, updatedUser, {}, function (err, theuser) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
                res.redirect("/");
            });    
            }
        }
        )
    }
    else {
        res.redirect("/join-the-club");
    }

};

// Display User delete form on GET.
exports.user_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: User delete GET');
};

// Handle user delete on POST.
exports.user_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: User delete POST');
};

// Display Author update form on GET.
exports.user_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: User update GET');
};

// Handle User update on POST.
exports.user_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: User update POST');
};
