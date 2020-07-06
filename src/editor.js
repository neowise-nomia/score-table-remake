(function () {
    const $ = require('jquery');
    const db = require('./script/template/data');
    const { remote } = require('electron');
    const path = require('path');
    const url = require('url');

    /**@type {{name: string, id: string, created: string, description: string, sbj: {name: string, id: number}[]}} */
    let data = JSON.parse(sessionStorage[`selected_table`]);
    /**@type {{id: string, sbj: string, t1: [], t2: [], t3: []}[]} */
    let table = [];

    $('.side-bar .header .button').click(function () {
        _toggle_menu_side();
    });

    $('#menu-discard-change').click(function () {
        table = [];
        $('.editor .details').removeClass('active');
        $('.side-bar .list .subject').removeClass('focused');
        _toggle_menu_side();
        open_load(
            function () {
                load_all_summary();
            }, function () {
                $('.editor .summary').addClass('active');
            }
        );
    });

    $('#menu-delete-table').click(function () {
        db.delete_table(data.name, function () {
            remote.getCurrentWindow().loadURL(url.format({
                protocol: 'file:',
                pathname: path.join(__dirname, 'select.html'),
                slashes: true
            }));
        });

    });

    load_subject_list();

    open_load(
        function () {
            load_all_summary();
        }, function () {
            $('.editor .summary').toggleClass('active');
        }
    );

    $('#menu-edit-mode').click(function () {
        _toggle_edit_mode();
    });

    $('.side-bar .header .title').click(function () {
        reload_summary();
        $('.editor .summary').addClass('active');
        $('.editor .loading').removeClass('active');
        $('.editor .details').removeClass('active');
        $('.side-bar .list .subject').removeClass('focused');
    });


    function open_load(_call_back, _on_success) {
        $('.editor .loading').addClass('active');
        set_load_status(0);
        _call_back();
        let _wait = setInterval(function () {
            if ($('.editor .loading .status span')[1].innerText >= 100) {
                $('.editor .loading').removeClass('active');
                _on_success();
                clearInterval(_wait);
            }
        });
    }

    function set_load_status(percent) {
        $('.editor .loading .status span')[1].innerText = `${percent}`;
    }

    function load_subject_list() {
        $('.side-bar .header .title span')[0].innerText = data.name;
        for (let i = 0; i < data.sbj.length; ++i) {
            let card = document.createElement('div');
            card.className = 'subject';
            card.style.setProperty('--element-pos', i + 1);
            card.innerHTML = `<div class="content f c v"><span></span></div><div class="status" style="--status-color: #0f0;"><div class="nar"></div></div>`;
            card.children[0].children[0].innerText = data.sbj[i].name;
            // need to get status
            card.addEventListener('click', function () {
                if (card.classList.contains('focused')) return;
                $('.side-bar .list .subject').removeClass('focused');
                $('.editor .summary').removeClass('active');
                card.classList.add('focused');
                if (!$('.editor .details').hasClass('active'))
                    $('.editor .details').addClass('active');
                else
                    $('.editor .details').removeClass('transi');
                setTimeout(function () {
                    $('.editor .details').addClass('transi');
                    setTimeout(function () {
                        load_details(i);
                    }, 150);
                }, 100);
            });
            $('.side-bar .list')[0].appendChild(card);
        }
    }

    function load_all_summary() {
        db.get_data(data.id, function (result) {
            set_load_status(50);
            remote.getCurrentWindow().setTitle(`Editor - ${data.name}`);
            $('#date-created')[0].innerText = data.created;
            $('#table-description')[0].innerText = data.description === '' ? 'Description is empty' : data.description;
            set_load_status(60);
            for (let i = 0; i < result.rows.length; ++i) {
                table.push(result.rows[i]);
                for (let rex = 1; rex <= 3; ++rex) {
                    table[i][`t${rex}`] = JSON.parse(table[i][`t${rex}`]);
                }
            }
            set_load_status(80);
            reload_summary();
            set_load_status(100);
        });
    }

    function reload_summary() {
        let count = {
            t1: 0, t2: 0, t3: 0
        };
        for (let i = 0; i < table.length; ++i)
            for (let rex = 1; rex <= 3; ++rex)
                count[`t${rex}`] += table[i][`t${rex}`].length;
        $('#all-quanties')[0].innerText = count.t1 + count.t2 + count.t3;
        for (let rex = 1; rex <= 3; ++rex)
            $(`#quanties-t${rex}`)[0].innerText = count[`t${rex}`];
    }

    function load_details(_subject_id) {
        let _selection = table[_subject_id];
        for (let rex = 1; rex <= 3; ++rex) {
            $(`#details-mark-t${rex}`)[0].innerHTML = '';
            _selection[`t${rex}`].forEach(element => {
                $(`#details-mark-t${rex}`)[0].innerHTML += `<span>${element}</span>`;
            });
        }
    }

    function _toggle_edit_mode() {
        _toggle_menu_side();
        $('#menu-edit-mode').toggleClass('focus');
        $('.--btn-edit').toggleClass('focusable');
    }

    function _toggle_menu_side() {
        $('.side-bar .header .button').toggleClass('active');
        $('.app-menu').toggleClass('active');
    }
}).call(this);