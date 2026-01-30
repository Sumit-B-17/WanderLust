const User = require('../models/user.js');

module.exports.renderSignUpForm = (req, res) => {
    res.render('users/signup');
};

module.exports.signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to WanderLust!');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }   
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back!');
    // const redirectUrl = req.session.returnTo || '/listings';
    // delete req.session.returnTo;
    // res.redirect(redirectUrl);
    res.redirect(res.locals.redirectUrl || '/listings');
};

module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { 
            return next(err); 
        }
        req.flash('success', "Goodbye!");
        res.redirect('/listings');
    });
};


