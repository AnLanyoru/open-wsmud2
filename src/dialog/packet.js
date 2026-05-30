import Setting from '../setting.js';
import Util from '../utils/util.js';
import SCRIPT from '../script.js';
import Combat from '../combat.js';


export default {
    close: function () {
        this.hide();
        this.element.remove();
        //Dialog.footerElement.addClass("hide");
        this.isShow = false;
        this.skill_element_id = null;
        this.element.removeClass("hide-item");
    },
    hide: function () { },
    init: function () {
        if (!this.created) {
            Dialog.injectStyle(packet_css);
            Dialog.injectStyle(list_css);
        }
        this.created = true;
    },
    command_before: '',
    updateitem: function (data) {
        if (data.money != undefined) {
            this.money = data.money;
            this.show_moeny();
        }
        if (data.eq_group !== undefined) {
            this.eq_group = data.eq_group;
            this.show_moeny();
        }
        else if (data.eq != undefined && this.items) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].id == data.id) {
                    this.eqs[data.eq] = this.items[i];
                    this.items.splice(i, 1);

                    break;
                }
            }
            this.show_items();
        } else if (data.uneq != undefined && this.items) {
            var item = this.eqs[data.uneq];
            item.can_eq = 1;
            item.count = 1;
            this.items.push(item);
            this.eqs[data.uneq] = null;

            this.show_items();

        }
        else if (data.locked >= 0) {
            let item = this.get_item(data.id);
            if (item) {
                item.is_lock = data.locked;
                let elem = this.packElement.find('[oindex="' + data.id + '"]');
                item.is_lock ? elem.addClass('lock') : elem.removeClass('lock');
            }
        } else if (data.jldesc) {
            var str = [];
            str.push(data.jldesc);
            str.push("<span class='item-commands'>");
            str.push('<span cmd="' + this.command_before + 'jinglian ' + data.id + ' ok">精炼</span>');
            str.push('<span cmd="' + this.command_before + 'jinglian ' + data.id + ' full">精炼到满级</span>');
            str.push("</span>");
            this.show_sub(str.join(""));
        } else if (data.xqdesc) {
            var str = [];
            str.push(data.xqdesc);
            str.push("<span class='item-commands'>");
            for (var i = 0; i < data.stones.length; i++) {
                var st = data.stones[i];
                str.push('<span cmd="' + this.command_before + 'xiangqian ' + data.id + ' '
                    + st.id + '">镶嵌' + st.name + '</span><br/>');
            }
            str.push("</span>");
            this.show_sub(str.join(""));
        }
        else if (data.desc) {
            var str = [];
            str.push(data.desc);
            str.push("<span class='item-commands'>");
            var from = data.from;
            if (from == "eq") {
                str.push('<span cmd="' + this.command_before + 'uneq ' + data.id + '">取消装备</span>');
            } else if (from == "item") {
                var obj = this.get_item(data.id);
                SCRIPT.LAST_OBJ = obj;
                if (obj) {
                    this.create_item_command(obj, str, data.commands);
                }
            } else if (from == "store") {
                str.push('<span cmd="_confirm qu ' + data.id + '">取出</span>');
            } else if (from == "sj") {
                str.push('<span cmd="_confirm qu ' + data.id + '">取出</span>');
            }
            else {
                str.push('<span cmd="_confirm buy 1 ' + data.id + ' from ' + Dialog.list.seller + '">购买</span>');
            }
            str.push("</span>");
            this.show_sub(str.join(""));
        } else if (data.remove && this.items) {//丢掉的
            var items = this.items;
            for (var i = 0; i < items.length; i++) {
                if (items[i].id == data.id) {
                    if (data.remove >= items[i].count) {
                        items.splice(i, 1);
                        Combat.DisObj(data);
                    } else {
                        items[i].count -= data.remove;
                    }
                    break;
                }
            }
            if (this.isShow)
                this.show_items();
            else return false;

        } else if (data.name && this.items) {//更新的
            var item = this.get_item(data.id);
            if (item) {
                item.count = data.count;
                item.name = data.name;
            } else {
                this.items.push(data);
            }
            if (this.isShow)
                this.show_items();
            else return false;
        } else if (data.max_item_count) {
            this.max_count = data.max_item_count;
            ReceiveMessage((Dialog.pack2.isShow ? Dialog.pack2.target_name : "你") + "的背包容量扩充为" + this.max_count + "。");
            this.show_items();
        } else return false;
        return true;
    },
    get_item: function (id, items) {
        items = items || this.items;
        if (!items) return;
        for (var i = 0; i < items.length; i++) {
            if (items[i] && items[i].id == id) return items[i];
        }
    }, show_sub: function (str) {
        if (this.objelement) this.objelement.remove();
        var parent = this.packElement;

        if (Dialog.list.isShow) {
            parent = Dialog.list.rightElement;
        }
        this.objelement = $("<pre class='obj-desc'>" + str + "</pre>").appendTo(
            parent.parent()).on("click", function () {
                this.objelement.remove();
                this.objelement = null;
                parent.show();
            }.bind(this));
        parent.hide();
    }, onData: function (data) {
        if (data.items) {
            this.eqs = this.formatEqs(data.eqs || []);
            this.money = data.money;
            this.eq_group = data.eq_group;
            this.items = this.formatItems(data.items);
            this.max_count = data.max_item_count;
            if (this.isShow) {
                this.show_items();
                this.show_moeny();
            }
        } else {
            if (Dialog.pack2.isShow && !data.name) return Dialog.pack2.onData(data);
            if (this.updateitem(data)) return;
        }
        if (!this.isShow) {
            if (Dialog.list.isShow) {
                return Dialog.list.update_pack(data);
            }
            if (Dialog.trade.isShow) {
                return Dialog.trade.update_pack(data);
            }
        }

    },
    formatPackItem: function (item) {
        return {
            name: item[0], id: item[1],
            count: item[2], grade: item[3],
            unit: item[4], value: item[5],
            can_eq: item[6], can_use: item[7],
            can_study: item[8], can_open: item[9],
            can_combine: item[10], is_lock: item[11],
            otype: item[12]
        };
    }
    , formatItems: function (data) {
        let items = [];
        for (let item of data) {
            items.push(this.formatPackItem(item));
        }
        return items;
    }, formatEqs: function (data) {
        let items = [];
        for (let item of data) {
            if (!item) items.push(item);
            else items.push({
                name: item[0], id: item[1],
                grade: item[2], can_use: item[3], is_lock: item[4]
            });
        }
        return items;
    },


    show_moeny: function () {
        if (!this.isShow) return;//+ "<span cmd='sell all'>清理包裹</span></div>"
        let mstr = Util.moneyToStr(this.money);
        let str = [];
        for (let i = 0; i < 3; i++) {
            str.push('<span class="footer-item eq-group',
                i === this.eq_group ? " select" : "", '" for="', i + 1, '">', i + 1, '</span>');
        }
        str.push("<div class='obj-money'>");
        if (this.packElement.is('.cleanup')) {

            str.push("<span for='cancle' class='footer-item'>取消</span>");
            str.push("<span for='store' class='footer-item'>自动存仓</span>");
            str.push("<span for='sell' class='footer-item'>清理杂物</span>");
            str.push("<span for='cleanup' class='footer-item'>确定</span></div>");
        } else {
            str.push("你", (mstr ? "身上有"
                + mstr : "身上没有任何银两"));
            str.push("<span for='cleanup' class='footer-item'>整理包裹</span></div>");
        }

        Dialog.footer(str.join(""));

    }, cleanup_cmds: { cleanup: true, cancle: true, store: true, sell: true },
    footerChanged: function (cmd, elem) {
        if (this.cleanup_cmds[cmd])
            return this.cleanup(cmd, elem);
        let index = parseInt(cmd) - 1;
        if (!(index >= 0 && index < 3)) return;
        SendCommand('eqgroup ' + index);
    },
    cleanup: function (cmd, elem) {
        let pack = this;
        elem.removeClass('select');
        if (pack.packElement.is('.cleanup')) {
            if (cmd == 'cleanup') {
                pack.packElement.find('.obj-item>.selected').
                    each(this.cleanup_item);
            } else if (cmd == 'store') {
                SendCommand((this.command_before ?? "") + 'store all');
            } else if (cmd == 'sell') {
                SendCommand((this.command_before ?? "") + 'sell all');
            }
            pack.packElement.removeClass("cleanup");
            this.show_moeny();
        }
        else {
            pack.packElement.find(".item-commands").remove();
            pack.packElement.addClass("cleanup");
            pack.show_items();
            this.show_moeny();
        }
    },
    cleanup_item: function (x, y) {
        let elem = $(y);
        let item = elem.parent().attr('oindex');
        let cmd = elem.attr('cmd');
        SendCommand(cmd + " " + item);
    },
    show_items: function () {
        if (!this.packElement) return;
        this.createItems();
        this.create_eqs();
        Dialog.icon("briefcase");
        var name = this.target_name || "你";
        Dialog.title((this.items && this.items.length) ? (name + "身上共有" + this.items.length + "/" + this.max_count + "件物品") : (name + "身上没有任何东西"));

    },
    init_element: function () {
        if (!this.element) {
            this.element = $('<div class="dialog-pack"><div class="eq-list"><div class="eq-item"><span class="eq-type">武器</span><span class="eq-name"></span></div><div class="eq-item"><span class="eq-type">衣服</span><span class="eq-name"></span>' +
                '</div > <div class="eq-item"><span class="eq-type">鞋</span><span class="eq-name"></span></div> <div class="eq-item"><span class="eq-type">头部</span><span class="eq-name"></span></div> <div class="eq-item">' +
                '<span class="eq-type">披风</span><span class="eq-name"></span></div> <div class="eq-item"><span class="eq-type">戒指</span><span class="eq-name"></span></div> <div class="eq-item"><span class="eq-type">项链</span><span class="eq-name"></span>' +
                '</div> <div class="eq-item"><span class="eq-type">饰品</span><span class="eq-name"></span></div> <div class="eq-item"><span class="eq-type">护腕</span><span class="eq-name"></span></div>' +
                '<div class="eq-item"><span class="eq-type">腰带</span><span class="eq-name"></span></div><div class="eq-item"><span class="eq-type">暗器</span><span class="eq-name"></span></div></div><div class="obj-list"></div></div>');
            this.packElement = this.element.find(".obj-list");
            this.eqElement = this.element.find(".eq-list");
        }
    },
    show: function () {
        if (!Dialog.isShow) Dialog.show();
        if (this.objelement) {
            this.objelement.remove();
            this.objelement = null;
            this.packElement && this.packElement.show();
        }
        if (this.isShow) return SendCommand(this.items ? "pack none" : "pack");
        this.isShow = true;
        this.init_element();
        this.packElement.on("click", ".obj-item", Dialog.pack.item_click)
        this.eqElement.on("click", ".eq-item", Dialog.pack.eqitem_click);
        this.packElement.removeClass('cleanup');
        this.element.appendTo(Dialog.contentElement);

        if (!this.items) SendCommand("pack");
        else {
            SendCommand("pack none");
            this.show_items();
        }
    },

    create_eqs: function () {
        var items = this.eqElement.children();
        for (var i = 0; i < items.length; i++) {
            var eq = this.eqs[i];
            if (eq) {
                $(items[i]).attr('class',
                    'eq-item grade' + eq.grade).attr("oindex", i).find('.eq-name').html(eq.name);
            } else {
                $(items[i]).attr('class',
                    "eq-item empty").attr("oindex", "").find('.eq-name').html("");
            }
        }
    }, levels: {
        "wht": 0, "hig": 1, "hic": 2, "hiy": 3, "hiz": 4, "hio": 5, "ord": 6
    },
    sort_items: function (items) {
        if (!items || !Setting.auto_sortitem) return items;
        var list = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var isok = false;
            for (var j = 0; j < list.length; j++) {
                if (item.grade < list[j].grade) {
                    list.splice(j, 0, item);
                    isok = true;
                    break;
                }
            }
            if (!isok) {
                list.push(item);
            }
        }
        return list;
    },
    createItems: function () {
        if (!this.items) return;
        var items = Dialog.pack.sort_items(this.items);
        var html = [];
        let is_cleanup = this.packElement?.is('.cleanup');
        for (var i = 0; i < this.max_count; i++) {
            var item = items[i];

            if (item) {
                html.push('<div class="obj-item ', item.is_lock ? "lock " : "", 'grade', item.grade, '" oindex="');
                html.push(item.id);
                html.push('">');
                html.push(item.name);
                if (this.show_type == 1) {
                    html.push("<span class='obj-value'>");
                    html.push("每");
                    html.push(item.unit);
                    html.push(Util.moneyToStr(item.value));
                    html.push("：");
                    html.push(item.count);
                    html.push(item.unit);
                    html.push('</span>');
                } else if (item.count > 1) {
                    html.push("<span class='obj-value'>");
                    html.push(item.count);
                    html.push(item.unit);
                    html.push('</span>');
                }
                if (is_cleanup) {
                    if (item.grade > 0) {
                        html.push("<span cmd='store' class='obj-oper"
                            , (item.can_study ? " selected" : " "), "'>存仓库</span>");
                    }
                    if (item.can_combine && item.count >= item.can_combine) {
                        html.push("<span cmd='combine' class='obj-oper'>合成</span>");
                    }
                    if (this.target_name) {
                        html.push("<span cmd='give ", Process.player,
                            ' ', item.count, "' class='obj-oper'>拿来</span>");
                    }
                    if (item.can_eq && item.grade > 0) {
                        html.push("<span cmd='sell' class='obj-oper'>卖掉</span>");
                        html.push("<span cmd='fenjie' class='obj-oper'>分解</span>");
                    } else if (item.value > 0) {
                        html.push("<span cmd='sell' class='obj-oper'>卖掉</span>");
                    } else if (!item.grade) {
                        html.push("<span cmd='drop' class='obj-oper'>丢掉</span>");
                    }
                }
            } else {
                html.push('<div class="obj-item" oindex="">');
            }
            html.push('</div>');
        }
        this.packElement.html(html.join(""));

    }, create_item_command: function (item, html, commands) {
        html.push('<span cmd="_confirm ' + this.command_before + 'drop ' + item.count + ' ' + item.id + '">丢掉</span>');
        //if (item.count > 1) {
        //    html.push('<span cmd="drop ' + item.count + " " + item.id + '">全部丢掉</span>');
        //}
        html.push('<span cmd="lockobj ' + item.id + '">', item.is_lock ? "解锁" : "锁定", '</span>');
        if (item.can_eq) {
            html.push('<span cmd="' + this.command_before + 'eq ' + item.id + '">装备</span>');
            if (!this.command_before) {
                html.push('<span cmd="jinglian ' + item.id + '">精炼</span>');
                html.push('<span cmd="xiangqian ' + item.id + '">镶嵌</span>');
                html.push('<span cmd="shortcut ' + item.id + '">设置快速装备</span>');
            }
            html.push('<span cmd="' + this.command_before + 'fenjie ' + item.id + '">分解</span>');

        }
        if (item.can_use) {
            html.push('<span cmd="' + this.command_before + 'use ' + item.id + '">使用</span>');
            if (!item.can_eq && !this.command_before) {
                html.push('<span cmd="shortcut ' + item.id + '">设置快速使用</span>');
            }
        }
        if (item.can_open) {
            html.push('<span cmd="' + this.command_before + 'open ' + item.id + '">打开</span>');
        }
        if (item.can_study) {
            html.push('<span cmd="' + this.command_before + 'study ' + item.id + '">学习</span>');
        }
        if (item.can_combine && item.count >= item.can_combine) {
            html.push('<span cmd="_confirm ' + this.command_before + 'combine ' + item.id + ' ' + item.can_combine + '">合成</span>');
        }
        if (this.command_before) {
            html.push('<span cmd="_confirm ' + this.command_before + 'give ' + Process.player + ' ' + item.count + ' ' + item.id + '">拿来</span>');
        }
        commands = commands || [];
        Dialog.extend.append(commands, 'pack', item);
        for (var i = 0; i < commands.length; i++) {
            if (commands[i].extend)
                html.push('<span cmd="', commands[i].cmd, '">', commands[i].name, '</span>');
            else
                html.push('<span cmd="packitem ', commands[i].cmd, ' ', item.id, '">', commands[i].name, '</span>');
        }
    }
    , item_click: function (e) {
        let elem = $(e.target);
        let is_cleanup = Dialog.pack.packElement.is('.cleanup');
        if (is_cleanup && elem.is('.obj-oper'))
            return Dialog.pack.item_cleanup(elem);
        elem = $(this);
        var obj = elem.attr("oindex");
        if (!obj) return;
        var item = Dialog.pack.get_item(obj);
        Dialog.pack.packElement.find(".item-commands").remove();
        if (!item) return;
        SCRIPT.LAST_OBJ = item;
        var html = ["<span class='item-commands'>"];
        html.push('<span cmd="checkobj ' + item.id + ' from item">查看</span>');
        Dialog.pack.create_item_command(item, html);
        html.push("</span>");
        elem = $(html.join("")).insertAfter(elem);
        Util.checkScroll(elem);
    },
    eqitem_click: function () {
        var item = Dialog.pack.eqs[$(this).attr("oindex")];
        if (!item) return;
        SendCommand("checkobj " + item.id + " from eq");
    }, item_cleanup: function (elem) {
        if (elem.is('.selected')) elem.removeClass('selected');
        else {
            elem.parent().find('.selected').removeClass('selected');
            elem.addClass('selected');
        }
        return false;
    }
};



const packet_css = `

.dialog-pack {
    min-width: 360px;
    overflow-x: auto;
    padding-top: 0.5em;
}


.dialog-pack>.obj-list {
    width: 50%;
    display: inline-block;
    overflow-y: auto;
    height: 25.625em;
}


.obj-list>.obj-item {

    margin-left: 0.5em;
}
    
.dialog-pack>.obj-desc {
    padding: 0.25em;
    margin: 0px;
    white-space: pre-wrap;
    width: 45%;
    height: 25.625em;
    display: inline-block;
    float: left;
    overflow-y: auto;
}


.eq-list {
    width: 50%;
    display: inline-block;
    float: left;
}

.eq-list>.eq-item {
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
}

.eq-list>.empty {
    border-color: gray;
    color: gray;
}

.eq-list>.eq-item>.eq-name {
    white-space: nowrap;
    padding-left: 0.3125em;
}

.eq-list>.eq-item>.eq-type {
    background-color: #333;
    color: gray;
    line-height: 1.875em;
    display: inline-block;
    height: 1.875em;
    width: 3em;
    text-align: center;
}

.obj-list>.obj-item {
    background-color: #111;
    line-height: 1.875em;
    min-height: 1.875em;
    padding-left: 0.3125em;

    overflow-x: auto;
    white-space: nowrap;
    margin-bottom: 0.5em;
    border-radius: 4px;
}

.obj-list>.lock:before {
    content: "\\e033";
    font-family: 'Glyphicons Halflings';
    font-size: 0.8em;
    margin-right: 0.2em;
    color: var(--border-color);

}

.obj-item>.obj-oper {
    float: right;
    margin-right: 0.625em;
    padding-left: 0.5em;
    padding-right: 0.5em;
    line-height: 1.5em;
    background-color: #222;
    border-radius: 0.5em;
    margin-top: 0.2em;
    color: gray;
    display: none;
    cursor: pointer;
    user-select: none;
}

.cleanup>.obj-item>.obj-oper {
    display: inline-block;
}

.cleanup>.obj-item>.selected {
    color: #00FF00;
}



.obj-item>.obj-count,
.obj-item>.obj-value {
    float: right;
    margin-right: 0.625em;
}

.cleanup>.obj-item>.obj-value,
.cleanup>.obj-item>.obj-count {
    display: none;
}


.obj-list>.disabled {
    opacity: 0.5;
}



`;

const list_css = `

.dialog-list {
    width: 100%;
    white-space: nowrap;
    overflow-x: auto;
    padding-top: 0.5em;
    display: flex;
    flex-direction: row;
}

.dialog-list>.otype-list {
    width: 6em;
}

.dialog-list>.otype-list>.otype-item {
    white-space: nowrap;
    line-height: 2em;
    width: 5em;
    text-align: center;
    background-color: #111;
    border-radius: 4px;
    margin-bottom: 0.5em;
    margin-right: 0.5em;
    margin-left: 0.5em;
    text-align: center;
    cursor: pointer;
}

.dialog-list>.otype-list>.select {
    background-color: #222;
    color: #00ff00;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: #00ff00;
}

.dialog-list>.trade-list,
.dialog-list>.obj-list {

    height: 21.25em;
    display: inline-block;
    overflow-y: auto;
    flex: 1;
}


.dialog-list>.obj-desc {
    padding: 0.25em;
    margin: 0px;
    white-space: pre-wrap;
    flex: 1;
    overflow-y: auto;
}

.dialog-list>.trade-list {

    height: 21.25em;
    display: inline-block;
    overflow-y: auto;
    flex: 1;
}
.trade-list>.obj-item {
    background-color: #111;
    line-height: 1.875em;
    min-height: 1.875em;
    padding-left: 0.3125em;

    overflow-x: auto;
    white-space: nowrap;
    margin-bottom: 0.5em;
    border-radius: 4px;
}

.trade-list>.lock:before {
    content: "\\e033";
    font-family: 'Glyphicons Halflings';
    font-size: 0.8em;
    margin-right: 0.2em;
    color: var(--border-color);

}

@media (max-width: 480px) {
    .dialog-list>.otype-list {
        width: 2.5em;
    }

    .dialog-list>.otype-list>.otype-item {
        writing-mode: vertical-rl;
        width: 2em;
        padding-top: 0.5em;
        padding-bottom: 0.5em;
    }
}
`;
