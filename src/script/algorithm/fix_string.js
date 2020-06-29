/**
 * 
 * @param {string} str 
 * @param {number} count 
 */
function fix_num(str, count) {
    let z_count = count - str.length;
    if (z_count <= 0) return str;
    let tmp = '';
    for (let i = 0; i < z_count; ++i) tmp += '0';
    return tmp + str;
}

/**
 * 
 * @param {string} str 
 */
function fix_id(str) {
    var AccentsMap = [
        "aàảãáạăằẳẵắặâầẩẫấậ",
        "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
        "dđ", "DĐ",
        "eèẻẽéẹêềểễếệ",
        "EÈẺẼÉẸÊỀỂỄẾỆ",
        "iìỉĩíị",
        "IÌỈĨÍỊ",
        "oòỏõóọôồổỗốộơờởỡớợ",
        "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
        "uùủũúụưừửữứự",
        "UÙỦŨÚỤƯỪỬỮỨỰ",
        "yỳỷỹýỵ",
        "YỲỶỸÝỴ",
        "_., '\"`~!@#$%^&*()+=-"
    ];
    for (var i = 0; i < AccentsMap.length; i++) {
        var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
        var char = AccentsMap[i][0];
        str = str.replace(re, char);
    }
    while (str != (str = str.replace('__', '_'))) {}
    return str.toLowerCase();
}

module.exports = {
    fix_num_string: fix_num,
    create_id: fix_id
}