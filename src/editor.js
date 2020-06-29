(function () {
    const $ = require('jquery');

    $('.side-bar .header .button').click(function () {
        $('.side-bar .header .button').toggleClass('active');
    });

    load_subject_list();

    // open_load(
    //     function () {

    //     }, function () {

    //     }
    // );

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
        /**@type {{name: string, id: string, created: string, description: string, sbj: {name: string, id: number}[]}} */
        let data = JSON.parse(sessionStorage[`selected_table`]);
        $('.side-bar .header .title span')[0].innerText = data.name;

        for (let i = 0; i < data.sbj.length; ++i) {
            let card = document.createElement('div');
            card.className = 'subject';
            card.style.setProperty('--element-pos', i+1);
            card.innerHTML = `<div class="content f c v"><span></span></div><div class="status" style="--status-color: #0f0;"><div class="nar"></div></div>`;
            card.children[0].children[0].innerText = data.sbj[i].name;
            // need to get status
            $('.side-bar .list')[0].appendChild(card);
        }
    }
}).call(this);