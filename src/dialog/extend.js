
import Util from '../utils/util.js';
import { ReceiveMessage } from '../client.js';
import Combat from '../combat.js';

export default {
    types: [
        {
            name: "自定义快捷操作", value: "button", for: [
                { name: "动作栏", value: "action" },
                { name: "地图", value: "map" },
                { name: "背包道具", value: "pack" },
                { name: "技能", value: "skill" },
                { name: "师父/随从技能", value: "mskill" },
                { name: "房间物体", value: "item" },
            ]
        }
        // , {
        //     name: "触发", value: "trigger",
        //     for: [
        //         { name: "文本触发", value: "message" },
        //         { name: "事件处理", value: "data" },
        //     ]
        // }, {
        //     name: "过滤", value: "filter",
        //     for: [
        //         { name: "文本过滤", value: "fmessage" },
        //         { name: "事件过滤", value: "fdata" },
        //     ]
        // }
    ],
    init: function (elem) {
        this.element = elem;
        let html = [];
        html.push('<div class="extend-list">');
        this.append_settings(html);
        html.push("</div>");
        this.append_edit(html);
        elem.html(html.join(""));
        elem.on('click', '[ecmd]', this.onButtonClick);
        elem.on('click', '.setting-item', this.onClickRow);
        elem.on("click", ".switch", this.switchClick);
        elem.on("change", "select", this.selectChanged);
        this.edit_elem = this.element.find('.extend-add');
        this.list_elem = this.element.find('.extend-list');
    },
    refresh_list: function () {
        let html = [];
        this.append_settings(html);
        this.list_elem.html(html.join(""));
    },
    append_settings: function (html) {
        let items = this.setting, index = 0;
        for (let item of items) {
            html.push(this.create_item(item, index++));
        }
    },
    action_types: {
        button: "快捷操作",
        trigger: "触发器",
        filter: "过滤器"
    },
    regex: {
        message: true,
        fmessage: true
    },
    for_types: {
        map: "地图",
        action: "动作栏",
        pack: "背包道具",
        skill: "技能",
        item: "房间物体",
        mskill: "师父/随从技能",
        message: "文本",
        data: "事件",
        fmessage: "文本",
        fdata: "事件"
    },
    create_item: function (item, index) {
        let html = [];
        html.push('<div class="setting-item" sid="', index++, '">');
        html.push('<div class="title">');
        html.push(this.for_types[item.for], this.action_types[item.type], '【', item.name, '】');
        html.push('</div>');
        let isopend = false;
        if (item.on && item.on[Process.player]) isopend = true;

        html.push('<span class="switch ', isopend ? "on" : "",
            '"><span class="switch-button"></span><span class="switch-text">开</span></span>');

        html.push('</div>');
        return html.join("");
    },
    selectChanged: function () {
        let elem = $(this);
        if (elem.attr('prop') !== 'type') {
            const fortype = elem.val();
            elem.parent().next().find('.extend-row-header').html(
                Dialog.extend.regex[fortype] ? "正则表达式" : "可选参数"
            );
            return;
        }
        let type = elem.val()
        let items = null;
        for (let item of Dialog.extend.types) {
            if (type === item.value) {
                items = item.for;
                break;
            }
        }
        if (!items) return;
        elem = elem.parent().next().find('select');
        let html = [];
        for (let item of items) {
            html.push('<option value="', item.value, '">', item.name, '</option>');
        }
        elem.html(html.join(""));
    },
    switchClick: function () {
        let elem = $(this);
        let text_elem = elem.find(".switch-text");
        let text = text_elem.text();
        let is_open = text !== "开始记录";
        let is_selected = false;
        if (elem.is(".on")) {
            elem.removeClass("on");
            is_open && text_elem.html("关");
        } else {
            elem.addClass("on");
            is_open && text_elem.html("开");
            is_selected = true;
        }
        if (!is_open) {
            if (is_selected) {
                Dialog.close();
                Dialog.extend.start_record();
            } else {
                Dialog.extend.stop_record();
            }
        } else {
            let item = Dialog.extend.setting[elem.parent().attr("sid")];
            if (item) {
                if (!item.on) item.on = {};
                if (is_selected) {
                    item.on[Process.player] = 1;
                } else {
                    delete item.on[Process.player];
                }
                Dialog.extend.save_extend(item);
            }
        }

        return false;
    },
    start_record: function () {
        if (this.is_record) return;
        this.is_record = true;
        this.prev_time = 0;
        this.record_cmds = [];
        ReceiveMessage('<hic>开始记录你的操作命令。</hic>');
        Process.state({ state: "正在记录你的操作命令" });
    },
    excluded: {
        score: true, score2: true, pack: true, cha: true, tasks: true,
        message: true, relation: true, shop: true, team: true, jh: true
    },
    excluded_check: [
        (x) => x.startsWith('jh') && x.indexOf('start') < 0,
        (x) => x.startsWith('stats'),
        (x) => x.startsWith('map'),
        (x) => x.startsWith('look')
    ],
    record: function (cmd) {
        if (!this.is_record) return;
        if (this.excluded[cmd]) return;
        for (let check of this.excluded_check) {
            if (check(cmd)) return;
        }
        let now = Date.now();
        if (this.prev_time > 0) {
            this.record_cmds.push('#wait ' + (now - this.prev_time));
        }
        this.record_cmds.push(cmd);
        this.prev_time = now;
    },
    stop_record: function () {
        if (!this.is_record) return;
        this.is_record = false;
        ReceiveMessage('<cyn>已停止记录你的操作命令。</cyn>');
        this.edit_elem.find('.switch').removeClass('on');
        if (this.record_cmds.length > 0) {
            Dialog.show('setting');
            Dialog.setting.footerChanged("extend");
            this.edit_elem.show();
            this.list_elem.hide();
            this.edit_elem.find('textarea').val(this.record_cmds.join(";"));
            Process.state();
        }
    },
    helper: "<li ecmd='show_actions'>可用命令参考</li><li ecmd='show_vars'>可用变量参考</li><li ecmd='show_paras'>参数用法参考</li>",
    append_edit: function (html) {
        html.push('<div class="extend-add" style="display:none">');
        html.push('<div class="extend-row">');
        html.push('<input  prop="name" class="extend-input"/>');
        html.push("<div class='extend-row-header'>提示/描述/说明</div>");
        html.push("</div>");

        html.push('<div class="extend-row">');
        html.push('<select prop="type" class="extend-input">');
        for (let item of this.types) {
            html.push('<option value="', item.value, '">', item.name, '</option>');
        }
        html.push("</select><div class='extend-row-header'>扩展类型</div>");
        html.push("</div>");
        let item1 = this.types[0];
        html.push('<div class="extend-row">');
        html.push('<select prop="for" class="extend-input">');
        for (let item of item1.for) {
            html.push('<option value="', item.value, '">', item.name, '</option>');
        }
        html.push("</select><div class='extend-row-header'>可用选项</div>");
        html.push("</div>");

        html.push('<div class="extend-row">');
        html.push('<input  prop="paras" class="extend-input"/>');
        html.push("<div class='extend-row-header'>可选参数</div>");
        html.push("</div>");

        html.push('<div class="extend-row flex-1">');
        html.push('<textarea   prop="content"  class="extend-input"></textarea>');
        html.push("<div class='extend-row-header extend-menus'>");
        html.push('<span class="switch"> <span class="switch-button"> </span><span class="switch-text">开始记录</span></span>');
        html.push("<ul class='extend-help'>");
        html.push(this.helper);
        html.push("</ul><button ecmd='save'>保存</button>");

        html.push("</div></div>");

        html.push("</div>");
    }, onClickRow: function () {
        var elem = $(this);
        var item = Dialog.extend.setting[elem.attr("sid")];
        if (!item) return;
        Dialog.extend.selected_item = item;
        if (!Dialog.extend.edit_button) {
            Dialog.extend.edit_button =
                $('<div class="buttons"><button ecmd="edit">编辑</button><button ecmd="up">上移</button><button ecmd="down">下移</button><button ecmd="remove">移除</button></div>');
        }
        Dialog.extend.edit_button.insertAfter(elem);
    },
    show: function (elem) {
        this.init(elem);
        if (!this.footer_buttons) {//<button ecmd="add">添加新的扩展</button>
            this.footer_buttons = $('<div class="obj-money"><span for="import" class="footer-item">导入</span><span for="export" class="footer-item">导出</span><span for="add" class="footer-item">添加扩展</span></div>');
        }
        Dialog.footerElement.append(this.footer_buttons);
    },
    command: function (cmd) {
        const func = this['cmd_' + cmd];
        if (func) func.call(this);
    },
    cmd_import: function () {
        if (!this.fileinput) {
            let elem = $('<input type="file" style="display:none"  accept=".json" />')[0];
            document.body.appendChild(elem);
            this.fileinput = elem;
            elem.addEventListener('change', function (e) {
                const file = e.target.files[0];
                if (!file) {
                    return ReceiveMessage('<red>未选择扩展文件。</red>');
                }
                const fileExt = file.name.split('.').pop().toLowerCase();
                const validMimeTypes = ['application/json', 'text/json', 'text/plain'];
                if (fileExt !== 'json' && !validMimeTypes.includes(file.type)) {
                    e.target.value = '';
                    return ReceiveMessage('<red>请选择有效的JSON文件！</red>');
                }
                const reader = new FileReader();
                reader.onload = function (event) {
                    try {
                        const jsonObj = JSON.parse(event.target.result);
                        Dialog.extend.setting = jsonObj.items;
                        Dialog.extend.refresh_list();
                        Dialog.extend.save_extend();
                        ReceiveMessage("<cyn>扩展文件加载成功。</cyn>");
                    } catch (error) {
                        console.error("JSON解析错误：", error);
                        ReceiveMessage('<red>扩展文件加载失败。</red>');
                    }
                };
                reader.onerror = function () {
                    console.error("文件读取错误：", reader.error);
                    ReceiveMessage('<red>扩展文件读取失败。</red>');
                };
                reader.readAsText(file, 'utf-8');
            });
        }
        this.fileinput.click();

    },
    cmd_export: function () {
        try {
            let jsonObj = {
                id: Process.player,
                version: "0.1",
                items: Dialog.extend.setting,
            };
            const jsonStr = JSON.stringify(jsonObj, null, 2);
            if (window.android && typeof window.android.saveJsonFile === "function") {
                // 传递文件名和JSON内容给安卓
                window.android.saveJsonFile("武神扩展.json", jsonStr);
                ReceiveMessage(`<cyn>扩展导出为本地文件【武神扩展.json】。</cyn>`);
            } else {
                const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.style.display = "none ";
                a.download = '武神扩展.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                ReceiveMessage(`<cyn>扩展导出为本地文件【武神扩展.json】。</cyn>`);
            }
        } catch (error) {
            console.error("保存JSON文件失败：", error);
            alert("文件保存失败，请重试！");
        }
    },
    hide: function () {
        if (this.is_record) {
            this.stop_record();
        }
        if (this.list_elem.is('.hide')) {
            this.list_elem.removeClass('hide');
            this.edit_elem.hide();
            return false;
        }
        this.footer_buttons.remove();
    }, close: function () {

    },
    default_extend: [
        {
            name: "<red>全部击杀</red>",
            type: "button", for: "action",
            content: "kill @npc"
        },
        {
            name: "<gre>全部拾取</gre>",
            type: "button", for: "action",
            content: "get all from @item(尸体)"
        },
        {
            name: "<gre>返回武庙</gre>",
            type: "button", for: "map",
            paras: "name(扬州)",
            content: "jh fam 0 start;go north;go north;go west"
        },
        {
            name: "练习到指定等级",
            type: "button", for: "skill",
            content: "lianxi @id @input"
        },
        {
            name: "学习到指定等级",
            type: "button", for: "mskill",
            content: "xue @input @id from @master"
        }
    ],
    init_extend: function () {
        if (!this.setting)
            this.setting = Util.storage.getItem('extends') ?? this.default_extend;
        this.init_extend_group();
    },
    init_extend_group: function () {
        this.groups = {};
        for (let item of this.setting) {
            this.init_extend_item(item);
        }
    },
    save_extend: function () {
        Util.storage.setItem('extends', this.setting);
        this.init_extend_group();
        Combat.refActions();
    },
    init_extend_item: function (item) {
        let group = this.groups[item.for];
        if (!group) group = this.groups[item.for] = [];
        let cmd = item.content;
        if (item.on === true) {
            item.on = {};
            item.on[Process.player] = 1;
        }
        if (!cmd || !item.on || !item.on[Process.player]) return;
        if (cmd[0] !== '#') cmd = '#' + cmd;

        group.push({
            name: item.name,
            extend: true,
            check: this.regex[item.for] ?
                this.match(item.paras) : this.condtion(item.paras),
            cmd: cmd
        });
    },
    match: function (paras) {
        try {
            if (!paras) return null;
            return this.express.match.bind(this, new RegExp(paras));
        } catch (e) {
            console.error(e);
            return null;
        }
    },
    exp_reg: /(\w+)\((>=|<=|!=|>|<)?(.+?)\)/g,
    condtion: function (paras) {
        if (!paras) return null;
        let match = null;
        let funcs = [];
        while (match = this.exp_reg.exec(paras)) {
            let prop = match[1];
            let oper = match[2];
            let para = match[3];
            if (!prop || !para) return null;
            if (oper) {
                let func = this.express[oper];
                if (!func) return null;
                funcs.push(func.bind(this, prop, para));
            } else {
                if (para[0] === '/' && para[para.length - 1] === '/')
                    funcs.push(this.express.match_prop.bind(this, prop, new RegExp(para.substring(1, para.length - 1))));
                else
                    funcs.push(this.express.def.bind(this, prop, para));
            }
        }
        return funcs.length > 0 ? funcs : null;
    }, express: {
        ">=": function (prop, value, obj) {
            return obj[prop] >= parseInt(value);
        }, ">": function (prop, value, obj) {
            return obj[prop] > parseInt(value);
        }, "<": function (prop, value, obj) {
            return obj[prop] < parseInt(value);
        }, "<=": function (prop, value, obj) {
            return obj[prop] <= parseInt(value);
        }, "=": function (prop, value, obj) {
            return obj[prop] = parseInt(value);
        }, "!=": function (prop, value, obj) {
            return obj[prop] != parseInt(value);
        },
        match: function (regex, text) {
            let result = regex.exec(text);
            if (!result) return false;
            SCRIPT.lAST_MATCHES = result;
            return true;
        },
        match_prop: function (prop, regex, obj) {
            let str = obj[prop];
            if (!str || !regex) return false;
            return regex.test(str);
        },
        def: function (prop, value, obj) {
            let str = obj[prop];
            if (typeof str === 'number')
                return str === parseInt(value);
            else if (typeof str === 'boolean')
                return str && str.toString() === value;
            return str && str.indexOf(value) > -1;
        }
    },
    query: function (type, para) {
        let cmds = [];
        this.append(cmds, type, para);
        return cmds;
    },
    append: function (cmds, type, para) {
        let items = this.groups[type];
        if (!items) return;
        for (let item of items) {
            if (this.check_para(item, para)) {
                cmds.push(item)
            }
        }
    },
    message_filter: function (mes) {

    },
    data_filter: function () {

    },
    trigger: function (msg) {
        if (!this.groups) return;
        let items = this.groups.message;
        if (!items) return;
        for (let item of items) {
            if (!item.check) continue;
            if (item.check(msg)) {
                SCRIPT.run(item.cmd);
            }
        }
    },
    process: function (data) {
        if (!this.groups) return;
        let items = this.groups.data;
        if (!items) return;
        for (let item of items) {
            if (this.check_para(item, data)) {
                SCRIPT.LAST_DATA = data;
                SCRIPT.run(item.cmd);
            }
        }
    },
    check_para: function (item, para) {
        if (!item.check) return true;
        for (let func of item.check) {
            if (!func(para)) return false;
        }
        return true;
    },
    onButtonClick: function () {
        let paras = $(this).attr('ecmd').split('_');
        let cmd = paras[0];
        paras[0] = $(this);
        let func = Dialog.extend['cmd_' + cmd];
        func && func.apply(Dialog.extend, paras);
    }, cmd_add: function () {
        this.edit_elem.show();
        this.list_elem.addClass('hide');
        this.edit_elem.attr("sid", '-1');
        let elems = this.edit_elem.find('input, textarea');
        for (let elem of elems) {
            $(elem).val("");
        }
    },
    cmd_up: function () {
        this.cmd_move(-1);
    },
    cmd_down: function () {
        this.cmd_move(1);
    },
    cmd_move: function (mv) {
        let item = this.selected_item;
        if (!item) return;
        let index = this.setting.indexOf(item);
        let index2 = this.setting.indexOf(item) + mv;
        if (index2 < 0 || index2 >= this.setting.length)
            return;
        this.setting.splice(index, 1);
        this.setting.splice(index2, 0, item);
        this.refresh_list();
        this.save_extend();

    },
    cmd_edit: function () {
        let item = this.selected_item;
        if (!item) return;
        this.edit_elem.show();
        this.list_elem.hide();
        this.edit_elem.attr("sid", this.setting.indexOf(item));
        let elems = this.edit_elem.find('input, textarea, select');
        for (let elem of elems) {
            let val = $(elem).val();
            let val2 = item[elem.getAttribute('prop')];
            if (val2 !== val) {
                $(elem).val(val2).change();;
            }
        }

    },
    cmd_save: function () {
        let index = parseInt(this.edit_elem.attr('sid'));

        let elems = this.edit_elem.find('input, textarea, select');
        let item = {};
        for (let elem of elems) {
            item[elem.getAttribute("prop")] = elem.value;
        }
        if (!item.name) return this.show_error('name');
        if (!item.type) return this.show_error('type');
        if (!item.content) return this.show_error('content');
        if (item.paras) {
            if (Dialog.extend.regex[item.for]) {
                item.check = this.match(item.paras);
            } else {
                item.check = this.condtion(item.paras);
            }
            if (!item.check) return this.show_error('paras');
        }
        this.hide();
        $(this.create_item(item, this.setting.length)).appendTo(this.list_elem);

        if (index < 0) {
            this.setting.push(item);
        } else {
            item.on = this.setting[index].on;
            this.setting[index] = item;
            this.refresh_list();
        }
        this.save_extend();

    }, cmd_remove: function () {
        let item = this.selected_item;
        if (!item) return;
        this.setting.Remove(item);
        this.refresh_list();
        this.save_extend();
    },
    show_error: function (key) {
        let elem = this.element.find('[prop="' + key + '"]').parent();
        elem.addClass('error-shake');
        setTimeout(() => {
            elem.removeClass('error-shake');
        }, 1500);
    }, cmd_show: function (elem, t) {
        let infos = SCRIPT.helper[t];
        if (!infos) return;
        let html = [];
        for (let i = 0; i < infos.length; i++) {
            html.push('<li>', infos[i], '</li>');
        }
        let ul = elem.parent();
        ul.html(html.join(""));
        ul.next().html('返回').attr('ecmd', 'return');
    },
    cmd_return: function (elem) {
        elem.html('保存').attr('ecmd', 'save').prev().html(this.helper);
    }
};
