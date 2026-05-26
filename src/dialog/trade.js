
import Util from '../utils/util.js';

export default {
    init: function () {
        Dialog.pack.init();
    },
    hide: function () {
        this.element.remove();
        this.isShow = false;
    },
    close: function () {
        this.hide();
    }, onData: function (data) {
        if (!this.isShow) {
            Dialog.show("trade");
        }
        Dialog.title("和" + data.name + "交易中");
        var items = Dialog.pack.items;
        this.trade_target = data.target;
        this.trade_list.length = 0;
        if (!Dialog.pack.items) SendCommand("pack");
        else this.update_pack();
        Dialog.pack.isShow = false;
        this.create_items(this.leftElement.empty(), this.trade_list, this.max_count);
    },
    update_pack: function (data) {
        this.create_items(this.rightElement.empty(), Dialog.pack.items, Dialog.pack.max_count);
    },
    max_count: 10,
    trade_list: [],
    show: function (data) {
        if (this.isShow) return;
        Dialog.init();
        Dialog.curItem = "trade";
        if (!this.element) {
            this.element = $('<div class="dialog-list"><div class="obj-list"></div><div class="obj-list"></div></div >');
            this.leftElement = $(this.element.children()[0]);
            this.rightElement = $(this.element.children()[1]);
        }
        this.leftElement.on("click", ".obj-item", this.left_click);
        this.rightElement.on("click", ".obj-item", this.right_click);
        this.element.appendTo(Dialog.contentElement.empty());
        this.create_footer();
        this.isShow = true;

    }, create_footer: function () {
        var html = ["<div class='item-commands'>"];
        html.push("<span cmd='_trade ok'>确定</span>");
        html.push("<span  cmd='_trade cancle'>取消</span>");
        html.push('</div>');
        Dialog.footer(html.join(""));
    }, confirm: function (cmd) {
        if (cmd === 'ok' && this.trade_list.length) {
            for (var i = 0; i < this.trade_list.length; i++) {
                SendCommand("give " + this.trade_target
                    + " " + this.trade_list[i].count + " " + this.trade_list[i].id);
            }
        }
        Dialog.hide();

    },
    create_items: function (elem, items, max) {
        var html = [];
        items = Dialog.pack.sort_items(items);
        for (var i = 0; i < max; i++) {
            var item = items[i];
            html.push('<div class="obj-item');

            if (item) {
                html.push(item.is_lock ? " lock" : "", ' grade', item.grade);
                html.push('"');

                html.push(" oindex='" + item.id + "'>");
                html.push(item.name);
                if (item.count > 1) {
                    html.push("<span class='obj-value'>");
                    html.push(item.count);
                    html.push(item.unit);
                    html.push('</span>');
                }
            } else {
                html.push('">');
            }
            html.push('</div>');
        }
        elem.html(html.join(""));
    }, left_click: function () {
        var elem = $(this);
        var obj = elem.attr("oindex");
        if (!obj) return;
        var item = null;
        for (var i = 0; i < Dialog.trade.trade_list.length; i++) {
            if (Dialog.trade.trade_list[i].id == obj) {
                item = Dialog.trade.trade_list[i];
                break;
            }
        }
        if (!item) return;
        Dialog.trade.cancle_trade(item);
        return false;
    }, enable_item: function (obj, isenable) {
        var elem = this.rightElement.find(".obj-item[oindex='" + obj.id + "']");
        if (!elem.length) return;
        if (isenable) {
            elem.removeClass("disabled");
        } else {
            elem.addClass("disabled");
        }
    }
    ,
    right_click: function () {
        var elem = $(this);
        if (elem.is(".disabled")) return;
        var obj = elem.attr("oindex");
        if (!obj) return;

        var item = Dialog.pack.get_item(obj);

        if (!item) return;
        if (item.count > 1) {
            Confirm.Show_trade_add(item);
        } else {
            Dialog.trade.add_trade(item);
        }
        return false;
    }, add_trade: function (obj) {
        for (var i = 0; i < this.trade_list.length; i++) {
            if (obj.id == this.trade_list[i].id) {
                this.trade_list[i].count += obj.count;
                return this.create_items();
            }
        }
        this.trade_list.push(obj);
        this.create_items(this.leftElement.empty(), this.trade_list, this.max_count);
        this.enable_item(obj, false);
    },
    cancle_trade: function (obj) {
        for (var i = 0; i < this.trade_list.length; i++) {
            if (obj.id == this.trade_list[i].id) {
                this.trade_list.splice(i, 1);
                i--;
            }
        }
        this.create_items(this.leftElement.empty(), this.trade_list, this.max_count);
        this.enable_item(obj, true);
    }
}
