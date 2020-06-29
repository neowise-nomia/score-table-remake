const $ = require('jquery');
function toggle_history() {
    $('body .header').addClass('active');
    $('body .header .card.history').addClass('active');
    $('body .header .card.create').removeClass('active');
    $('body .header .card.import').removeClass('active');
    $('.panel.history')[0].className = 'panel history focus active f';
    $('.panel.create')[0].className = 'panel create hidden f a v';
    $('.panel.import')[0].className = 'panel import hidden f a v';
}

function toggle_create() {
    $('body .header').addClass('active');
    $('body .header .card.history').removeClass('active');
    $('body .header .card.create').addClass('active');
    $('body .header .card.import').removeClass('active');
    $('.panel.history')[0].className = 'panel history wait1 f';
    $('.panel.create')[0].className = 'panel create focus active f a v';
    $('.panel.import')[0].className = 'panel import hidden f a v';
}

function toggle_import() {
    $('body .header').addClass('active');
    $('body .header .card.history').removeClass('active');
    $('body .header .card.create').removeClass('active');
    $('body .header .card.import').addClass('active');
    $('.panel.history')[0].className = 'panel history wait2 f';
    $('.panel.create')[0].className = 'panel create wait f a v';
    $('.panel.import')[0].className = 'panel import focus active f a v';
}

function remove_focus_all() {
    $('body .header')[0].className = 'header f a';
    $('.panel.history')[0].className = 'panel history hidden f';
    $('.panel.create')[0].className = 'panel history hidden f v a';
    $('.panel.import')[0].className = 'panel history hidden f v a';
}

module.exports = {
    _history: toggle_history,
    _create: toggle_create,
    _import: toggle_import,
    _reset: remove_focus_all
}