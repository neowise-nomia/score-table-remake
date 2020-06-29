const $ = require('jquery');
function turn_login() {
    $('.inner.login').addClass('transform');
    setTimeout(function() {
        $('.inner.login').removeClass('transform');
        $('.inner.login').addClass('active');
        $('.inner.signup').removeClass('active');
    }, 300);
}
function turn_signup() {
    $('.inner.signup').addClass('transform');
    setTimeout(function() {
        $('.inner.signup').removeClass('transform');
        $('.inner.signup').addClass('active');
        $('.inner.login').removeClass('active');
    }, 300);
}

module.exports = {
    turn_login: turn_login,
    turn_signup: turn_signup
};