const crypt = require('../algorithm/cryption');
const {create_id} = require('../algorithm/fix_string')

function check_use() {
    return localStorage['used'];
}
/**
 * 
 * @param {string} user_name
 * @param {string} password 
 */
function sign_up(user_name, password) {
    if (!user_name) 
        throw new Error('Please put Username');
    if (!password) 
        throw new Error('Please put Password');
    if (user_name != create_id(user_name)) 
        throw new Error('Invalid Character Username, Username must contain en character, number,  "_"');
    if (password != create_id(password)) 
        throw new Error('Invalid Character Password, Password must contain en character, number,  "_"');
    localStorage[crypt.sha256(user_name)] = crypt.sha256(password);
}

function login(user_name, password) {
    if (user_name != create_id(user_name)) 
        throw new Error('Inalid Character Username');
    if (password != create_id(password)) 
        throw new Error('Invalid Character Password');
    if (localStorage[crypt.sha256(user_name)] == undefined) 
        throw new Error('Unidentified username');
    if (localStorage[crypt.sha256(user_name)] != crypt.sha256(password))
        throw new Error('Wrong password');
    return !(localStorage[crypt.sha256(user_name)] != crypt.sha256(password));
}

function create_user() {
    localStorage['used'] = true;
    localStorage['table_list'] = JSON.stringify([]);
}

module.exports = {
    check_use: check_use,
    sign_up: sign_up,
    login: login,
    create_user: create_user
}