import Util from '../utils/util.js';
import {ReceiveMessage} from '../client.js';
import Combat from '../combat.js';
import SCRIPT from '../script.js';

export default {
    types: [
        {
            name: "自定义快捷操作", value: "button", for: [
                {name: "动作栏", value: "action"},
                {name: "地图", value: "map"},
                {name: "背包道具", value: "pack"},
                {name: "技能", value: "skill"},
                {name: "师父/随从技能", value: "mskill"},
                {name: "房间物体", value: "item"},
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
        elem.off('.extend');
        elem.on('click.extend', '[ecmd]', this.onButtonClick);
        elem.on('click.extend', '.setting-item', this.onClickRow);
        elem.on('click.extend', '.switch', this.switchClick);
        elem.on('change.extend', 'select', this.selectChanged);
        this.edit_elem = this.element.find('.extend-add');
        this.list_elem = this.element.find('.extend-list');
    },
    refresh_list: function () {
        let html = [];
        this.append_settings(html);
        this.list_elem.html(html.join(""));
        this.selected_item = null;
        if (this.edit_button) this.edit_button.remove();
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
                if (Dialog.extend.start_record() !== false) Dialog.close();
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
        if (this.is_record) return false;
        const editor = this.capture_editor();
        if (!editor) return false;
        this.record_editor = content => ({
            sid: editor.sid,
            values: {...editor.values, content}
        });
        this.is_record = true;
        this.prev_time = 0;
        this.record_cmds = [];
        ReceiveMessage('<hic>开始记录你的操作命令。</hic>');
        Process.state({state: "正在记录你的操作命令"});
        return true;
    },
    capture_editor: function () {
        if (!this.edit_elem || !this.edit_elem.length) return null;
        const values = {};
        this.edit_elem.find('input, textarea, select').each(function () {
            values[this.getAttribute('prop')] = this.value;
        });
        return {
            sid: this.edit_elem.attr('sid') || '-1',
            values
        };
    },
    restore_editor: function (editor) {
        if (!editor) return;
        if (!(Dialog.isShow && Dialog.curItem === 'setting')) {
            Dialog.show('setting');
        }
        Dialog.setting.footerChanged("extend");
        // Rebuild the editor from the captured data instead of relying on the
        // DOM that was hidden when recording started.
        this.init(this.element);
        this.edit_elem.attr('sid', editor.sid);
        const elems = this.edit_elem.find('input, textarea, select');
        for (const elem of elems) {
            const prop = elem.getAttribute('prop');
            if (prop === 'type') {
                $(elem).val(editor.values[prop] || '').change();
            }
        }
        for (const elem of elems) {
            const prop = elem.getAttribute('prop');
            if (prop === 'type') continue;
            const value = editor.values[prop] ?? '';
            $(elem).val(value);
            if (elem.tagName === 'SELECT') $(elem).change();
        }
        this.edit_elem.show();
        this.list_elem.css('display', '').addClass('hide');
    },
    excluded: {
        score: true, score2: true, score3: true, pack: true, cha: true, tasks: true,
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
        if (this.edit_elem) this.edit_elem.find('.switch').removeClass('on');
        // Always leave the recording state, even when no command was captured.
        // Otherwise Process.state remains stuck at "正在记录..." indefinitely.
        Process.state();
        const rebuildEditor = this.record_editor;
        this.record_editor = null;
        if (!rebuildEditor) return;
        this.restore_editor(rebuildEditor(this.record_cmds.join(";")));
    },
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
        html.push("<button type='button' ecmd='help'>扩展帮助</button>");
        html.push("<div class='extend-help'></div>");
        html.push("<button type='button' ecmd='save'>保存</button>");

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
                        if (!jsonObj || !Array.isArray(jsonObj.items)) {
                            throw new Error("扩展文件格式无效");
                        }
                        Dialog.extend.setting = Dialog.extend.normalize_settings(jsonObj.items);
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
                const blob = new Blob([jsonStr], {type: "application/json;charset=utf-8"});
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
        this.close_help();
        if (this.is_record) {
            this.stop_record();
        }
        if (this.list_elem.is('.hide')) {
            this.list_elem.removeClass('hide');
            this.edit_elem.hide();
            Dialog.footerElement.find(".footer-item.select").removeClass("select");
            Dialog.footerElement.find(".footer-item[for='extend']").addClass("select");
            return false;
        }
        this.footer_buttons.remove();
    }, close: function () {
        this.close_help();
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
        if (!this.setting) {
            const stored = Util.storage.getItem('extends');
            this.setting = this.normalize_settings(stored || this.default_extend);
        }
        this.init_extend_group();
    },
    normalize_settings: function (settings) {
        if (!Array.isArray(settings)) return [];
        return settings.filter(item => item && typeof item === "object").map(item => ({...item}));
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
                this.match(item.paras) : this.condition(item.paras),
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
    exp_reg: /(\w+)\((>=|<=|!=|=|>|<)?(.+?)\)/g,
    condition: function (paras) {
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
    },
    // Keep the old misspelled method for extensions that call it directly.
    condtion: function (paras) {
        return this.condition(paras);
    },
    express: {
        ">=": function (prop, value, obj) {
            return obj[prop] >= parseInt(value, 10);
        }, ">": function (prop, value, obj) {
            return obj[prop] > parseInt(value, 10);
        }, "<": function (prop, value, obj) {
            return obj[prop] < parseInt(value, 10);
        }, "<=": function (prop, value, obj) {
            return obj[prop] <= parseInt(value, 10);
        }, "=": function (prop, value, obj) {
            const actual = obj[prop];
            const expected = typeof actual === "number" ? parseInt(value, 10) : value;
            return actual === expected;
        }, "!=": function (prop, value, obj) {
            const actual = obj[prop];
            const expected = typeof actual === "number" ? parseInt(value, 10) : value;
            return actual !== expected;
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
                return str === parseInt(value, 10);
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
        this.list_elem.css('display', '').addClass('hide');
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
        this.list_elem.css('display', '').addClass('hide');
        this.edit_elem.attr("sid", this.setting.indexOf(item));
        let elems = this.edit_elem.find('input, textarea, select');
        for (let elem of elems) {
            let val = $(elem).val();
            let val2 = item[elem.getAttribute('prop')];
            if (val2 !== val) {
                $(elem).val(val2).change();
            }
        }

    },
    cmd_save: function () {
        const rawIndex = Number(this.edit_elem.attr('sid'));
        const index = Number.isInteger(rawIndex) && rawIndex >= 0 && rawIndex < this.setting.length
            ? rawIndex : -1;

        let elems = this.edit_elem.find('input, textarea, select');
        let item = {};
        for (let elem of elems) {
            item[elem.getAttribute("prop")] = elem.value;
        }
        if (!item.name || !item.name.trim()) return this.show_error('name');
        if (!item.type) return this.show_error('type');
        if (!item.content || !item.content.trim()) return this.show_error('content');
        if (item.paras) {
            if (Dialog.extend.regex[item.for]) {
                item.check = this.match(item.paras);
            } else {
                item.check = this.condition(item.paras);
            }
            if (!item.check) return this.show_error('paras');
        }
        this.hide();
        if (index < 0) {
            this.setting.push(item);
        } else {
            item.on = this.setting[index].on;
            this.setting[index] = item;
        }
        this.save_extend();
        // Re-render from the source array so every row gets a fresh, matching
        // sid.  Appending only the newly-created row left stale indices in the
        // DOM after add/edit/delete sequences.
        this.refresh_list();

    }, cmd_remove: function () {
        let item = this.selected_item;
        if (!item) return;
        const index = this.setting.indexOf(item);
        if (index >= 0) this.setting.splice(index, 1);
        this.selected_item = null;
        this.edit_button && this.edit_button.remove();
        this.refresh_list();
        this.save_extend();
    },
    show_error: function (key) {
        let input = this.element.find('[prop="' + key + '"]');
        let elem = input.parent();
        input.addClass('error-shake');
        elem.addClass('error-shake');
        input.trigger('focus');
        setTimeout(() => {
            input.removeClass('error-shake');
            elem.removeClass('error-shake');
        }, 1500);
    }, render_helper: function () {
        let html = [];
        const sections = [
            ['命令参考', 'actions'],
            ['变量参考', 'vars'],
            ['条件参数', 'paras']
        ];
        for (const [title, key] of sections) {
            html.push('<div class="fb-action"><span class="action-desc"><ul>');
            for (const info of SCRIPT.helper[key] || []) {
                html.push('<li>', info, '</li>');
            }
            html.push('</ul></span><span class="action-name">', title, '</span></div>');
        }
        return html.join('');
    }, cmd_help: function () {
        this.close_help();
        const overlay = document.createElement('div');
        overlay.className = 'float-dialog-overlay';
        const help = document.createElement('div');
        help.className = 'float-dialog-unified';
        const container = document.querySelector('.container');
        if (container) help.style.fontSize = getComputedStyle(container).fontSize;
        help.innerHTML = '<div class="unified-header">' +
            '<span class="unified-title">扩展使用帮助</span>' +
            '<span class="unified-close glyphicon glyphicon-remove-circle"></span>' +
            '</div><div class="fb-actions">' + this.render_helper() + '</div>' +
            '<div class="unified-fade"></div>';
        const close = () => this.close_help();
        overlay.addEventListener('click', close);
        help.querySelector('.unified-close').addEventListener('click', close);
        const fade = help.querySelector('.unified-fade');
        const updateFade = () => {
            const atBottom = help.scrollTop + help.clientHeight >= help.scrollHeight - 6;
            fade.style.opacity = atBottom ? '0' : '1';
        };
        help.addEventListener('scroll', updateFade);
        document.body.appendChild(overlay);
        document.body.appendChild(help);
        this.help_overlay = overlay;
        this.help_window = help;
        requestAnimationFrame(updateFade);
    }, close_help: function () {
        if (this.help_overlay) this.help_overlay.remove();
        if (this.help_window) this.help_window.remove();
        this.help_overlay = null;
        this.help_window = null;
    }
};
