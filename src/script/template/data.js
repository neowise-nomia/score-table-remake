// const table = require("../algorithm/table");
const fix_string = require('../algorithm/fix_string');
const fs = require('fs');
const crypt = require('../algorithm/cryption');
const path = require('path');
/**@type {Database} */
let db = openDatabase('app_db', '1.0', 'Table Data Base', 5 * 1024 * 1024);

// const openDatabase = require('websql');
/**
 * create database from local storage
 * @param {table} data 
 */
function get_db() {
    return db;
}

/**
 * 
 * @param {string} tabel 
 * @param {string} dirname 
 * @param {string} filename 
 * @param {string} password 
 */
function _exports(table, dirname, filename, password) {
    // execute(
    //     `SELECT * FROM ${fix_string.create_id(table)} WHERE id > ?`,
    //     [0],
    //     function (tx, result) {
    //         try {
    //             console.log(result);
    //             fs.writeFileSync(
    //                 path.join(dirname, filename) + '.trk',
    //                 crypt.encrypt(JSON.stringify({ name: table ,data: result.rows, len: result.rows.length}), password),
    //                 { encoding: 'utf8' }
    //             );
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     }
    // );
}

function _import(dirname, filename, password) {
    // /**@type {{name: string, data: {id: number, subject: string, type: number, mark: number, modified: string}[]}} */
    // let data;
    // try {
    //     data = fs.readFileSync(path.join(dirname, filename), { encoding: 'utf8' });
    // } catch (err) {
    //     console.log(err);
    // }
    // try {
    //     data = crypt.decrypt(data, password);
    //     data = JSON.parse(data);
    // } catch (err) {
    //     return 'ERROR Password';
    // }
    // create_table(data.name);
    // console.log(data);
    // for (let ex = 0; ex < data.len; ++ex) {
    //     append_row(data.name, data.data[ex].subject, data.data[ex].type, data.data[ex].mark);
    // }
}

/**
 * 
 * @param {string} query 
 * @param {[]} args 
 * @param {SQLStatementCallback} callback
 */
function execute(query, args, callback = function (tx, re) { }) {
    get_db().transaction(function (tx) {
        console.log('executing query: ' + query);
        tx.executeSql(query, args, function (tr, re) {
            callback(tr, re);
        });
    }, function (err) {
        console.log(err);
    }, function () {
        console.log('transaction success');
    });
}

function change_mark(table_id, subject_id, type, new_mark_list) {
    execute(
        `UPDATE ${table_id} SET t${type} = ? WHERE id = ?`,
        [JSON.stringify(new_mark_list), subject_id]
    );
}
/**
 * 
 * @param {string} table_name 
 * @param {string} subject 
 */
function add_subject(table_name, subject, id) {
    let tb = get_table_des(table_name);
    let sbjID = id;
    tb.table.sbj.push({ name: subject, id: sbjID });
    let tmp = JSON.parse(localStorage[`table_list`]);
    tmp[tb.pos] = tb.table;
    localStorage[`table_list`] = JSON.stringify(tmp);
    execute(
        `INSERT INTO ${tb.table.id} (id, sbj, t1, t2, t3) VALUES (?, ?, ?, ?, ?)`,
        [sbjID, subject, JSON.stringify([]), JSON.stringify([]), JSON.stringify([])]
    );
    return sbjID;
}

/**
 * data will push into callback function
 * @param {string} table_name
 * @param {string | number} subject
 * @param {1 | 2 | 3} type
 * @param {function ({rows: {id: string, sbj: string, t1: string, t2: string, t3: string}[]})} _callback 
 */
function get_data(table_id, _callback) {
    execute(
        `SELECT * FROM ${table_id} WHERE id > 0`,
        [],
        function (tx, re) { _callback(re); }
    );
}

function get_table_des(name) {
    /**@type {{name: string, created: string, description: string, id: string, sbj: {name: string, id: number}[]}[]} */
    let rv = JSON.parse(localStorage[`table_list`]);
    /**@type {{name: string, created: string, description: string, id: string, sbj: {name: string, id: number}[]}} */
    let target;
    let tmp = [];
    let i = 0;
    for (; i < rv.length; ++i)
        if (name === rv[i].name) {
            target = rv[i];
            break;
        }
    return { pos: i, table: target };
}

function delete_table(name, _on_success) {
    /**@type {{name: string, created: string, description: string, id: string}[]} */
    let rv = JSON.parse(localStorage[`table_list`]);
    /**@type {{name: string, created: string, description: string, id: string}} */
    let target;
    let tmp = [];
    for (let i = 0; i < rv.length; ++i)
        if (name === rv[i].name) {
            target = rv[i];
        } else {
            tmp.push(rv[i]);
        }
    localStorage[`table_list`] = JSON.stringify(tmp);
    execute(`DROP TABLE IF EXISTS ${target.id}`, [], function() {
        _on_success();
    });
}

function create_table(name, description = '') {
    let id = Date.now();
    let des = {
        name: name,
        created: new Date().toLocaleString(),
        description: description,
        id: `t${id}`,
        sbj: []
    };
    /**@type {{name: string, created: string, description: string, id: number}[]} */
    let rv = JSON.parse(localStorage[`table_list`]);
    for (let i = 0; i < rv.length; ++i)
        if (des.name == rv[i].name) throw new Error('Table Already Exists');

    rv.push(des);
    localStorage[`table_list`] = JSON.stringify(rv);
    execute(`CREATE TABLE IF NOT EXISTS t${id} (id NVARCHAR(30), sbj NVARCHAR(30), t1 JSON, t2 JSON, t3 JSON)`);
}

module.exports = {
    get: get_db,
    execute: execute,
    create_table: create_table,
    delete_table: delete_table,
    add_subject: add_subject,
    _change: change_mark,
    get_data: get_data,
    // export_to_file: _exports,
    // import_from_file: _import,
}