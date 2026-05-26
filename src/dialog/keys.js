
import Util from '../utils/util.js';
import SCRIPT from '../script.js';

const Keys = {
    groups: [{
        name: "移动",
        items: [
            { name: "左", key: null, cmd: "#go @dir(left)" },
            { name: "右", key: null, cmd: "#go @dir(right)" },
            { name: "上", key: null, cmd: "#go @dir(up)" },
            { name: "下", key: null, cmd: "#go @dir(down)" },
            { name: "左上", key: null, cmd: "#go @dir(leftup)" },
            { name: "左下", key: null, cmd: "#go @dir(leftdown)" },
            { name: "右上", key: null, cmd: "#go @dir(rightup)" },
            { name: "右下", key: null, cmd: "#go @dir(rightdown)" }
        ]
    }, {
        name: "菜单",
        items: [
            { name: "属性", key: null, cmd: "#menu score" },
            { name: "背包", key: null, cmd: "#menu pack" },
            { name: "技能", key: null, cmd: "#menu skills" },
            { name: "任务", key: null, cmd: "#menu tasks" },
            { name: "商城", key: null, cmd: "#menu shop" },
            { name: "社交", key: null, cmd: "#menu message" },
            { name: "排行", key: null, cmd: "#menu stats" },
            { name: "设置", key: null, cmd: "#menu setting" },
            { name: "动作", key: null, cmd: "#menu showcombat" },
            { name: "活动", key: null, cmd: "#menu events" },
            { name: "聊天", key: null, cmd: "#menu showchat" },
            { name: "停止", key: null, cmd: "#menu stopstate" },
            { name: "江湖", key: null, cmd: "#menu jh" }
        ]
    }
    ],
    setting: null,
    show: function (elem) {
        this.element = elem;
        this.init();
        elem.on('click', '.skey-item', this.item_clicked);
        document.body.addEventListener('keydown', this.record_press);
    }, hide: function () {
        document.body.removeEventListener('keydown', this.record_press);
    }, close: function () {
        document.body.removeEventListener('keydown', this.record_press);
    },
    record_press: function (e) {
        let item = Dialog.keys.select_item;
        if (!item) return;
        let keyitem = Dialog.keys.get_item(item.attr("sid"));
        if (!keyitem) return;
        if (e.keyCode === 8 || e.keyCode === 27) {
            Dialog.keys.save_setting(keyitem, null);
            return item.find('.skey-key').html('');
        }
        let code = Dialog.keys.get_key_code(e);
        Dialog.keys.save_setting(keyitem, code);
        item.find('.skey-key').html(keyitem.key);
        e.preventDefault();
        e.stopPropagation();
    }, get_key_code: function (e) {
        let code = e.code;
        if (e.ctrlKey) {
            if (e.key === "Control") return;
            code = "Ctrl+" + code;
        }
        if (e.altKey) {
            if (e.key === "Alt") return;
            code = "Alt+" + code;
        }
        if (e.shiftKey) {
            if (e.key === "Shift") return;
            code = "Shift+" + code;
        }
        return code;

    }, save_setting: function (item, key) {
        item.key = key;
        if (!this.setting) this.setting = {};
        if (!key) {
            key = this.id2keys[item.id];
            if (key) delete this.setting[key];
            delete this.id2keys[item.id];
        }
        else if (key) {
            if (this.setting[key]) {
                if (this.setting[key] === item.id) {
                    return;
                }
                let old_item = this.get_item(this.setting[key]);
                if (old_item) {
                    old_item.key = null;
                    this.element.find('.skey-item[sid="'
                        + old_item.id + '"]>.skey-key').html("");
                }
            }
            this.setting[key] = item.id;
        }
        Util.storage.setItem('keys', this.setting);
    }, get_item: function (id) {
        if (this.groups.length === 2) this.init();
        let sid = id.split('_');
        let group = Dialog.keys.groups[parseInt(sid[0])];
        if (!group) return;
        let keyitem = group.items[parseInt(sid[1])];
        return keyitem;
    },
    default_keys: {
        "KeyW": "0_2", "KeyA": "0_0", "KeyR": "0_6",
        "KeyD": "0_1", "KeyS": "0_3", "KeyQ": "0_4"
    },
    init_key: function () {
        if (this.load_storage) return;
        if (Util.isMobile) return;
        this.load_storage = true;
        this.setting = Util.storage.getItem('keys');
        window.addEventListener('keydown', this.keypress);
        this.id2keys = {};
        if (!this.setting) return;
        for (let key in this.setting) {
            this.id2keys[this.setting[key]] = key;
        }
    },
    keypress: function (e) {
        if (e.target !== document.body) return;
        let setting = Dialog.keys.setting;
        if (!setting) return;
        let code = Dialog.keys.get_key_code(e);
        if (setting[code]) {
            let item = Dialog.keys.get_item(setting[code]);
            if (item) {
                SCRIPT.run(item.cmd);
                e.preventDefault();
            }
        }
    },
    item_clicked: function () {
        let item = Dialog.keys.select_item;
        if (item) item.removeClass('selected');
        Dialog.keys.select_item = $(this).addClass('selected');

    },
    init: function () {
        if (this.groups.length > 2) return;
        let setting = this.id2keys || {}, id = null, j = 0;
        for (let group of this.groups) {
            for (let i = 0; i < group.items.length; i++) {
                id = j + "_" + i;
                group.items[i].id = id;
                group.items[i].key = setting[id];
            } j++;
        }
        let group = { name: "动作栏", items: [] };
        for (let i = 0; i < 12; i++) {

            id = "2_" + i;
            group.items.push({
                name: "栏位" + (i + 1), id: id,
                cmd: "#action " + i, key: setting[id]
            });
        }
        this.groups.push(group);
        group = { name: "技能栏", items: [] };
        for (let i = 0; i < 12; i++) {
            id = "3_" + i;
            group.items.push({
                name: "栏位"
                    + (i + 1), id: id, cmd: "#pfm " + i, key: setting[id]
            });
        }
        this.groups.push(group);
        this.element && this.create_html();
    },
    create_html: function () {
        let html = [];
        let i = 0, j = 0;
        for (let group of this.groups) {
            html.push('<h3>', group.name, '</h3>');
            j = 0;
            for (let item of group.items) {
                html.push('<div class="skey-item" sid="', item.id, '">');
                html.push('<div class="skey-name">', item.name, '</div>');
                html.push('<div class="skey-key">', item.key, '</div>');
                html.push('</div>');
                j++;
            }
            i++;
        }
        this.element.html(html.join(""));
    }
};

export default Keys;
