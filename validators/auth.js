const { check } = require('express-validator');

exports.userSignupValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required'),
    check('college')
        .not()
        .isEmpty()
        .withMessage('College Name is required'),    
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('mobile')
        .isLength({ min: 10 , max:10 })
        .withMessage('Mobile Number must be 10 digits long'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')  
];

exports.userSigninValidator = [
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];
