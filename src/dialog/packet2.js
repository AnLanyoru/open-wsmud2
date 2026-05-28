import SCRIPT from '../script.js';
import Util from '../utils/util.js';

var _show = function () {
    if (!Dialog.isShow) Dialog.show("pack2");
    if (this.objelement) {
        this.objelement.remove();
        this.objelement = null;
        this.packElement && this.packElement.show();
    }
    if (this.isShow) return;
    this.isShow = true;
    this.init_element();
    this.packElement.on("click", ".obj-item", Dialog.pack2.item_click);
    this.eqElement.on("click", ".eq-item", Dialog.pack2.eqitem_click);
    this.packElement.removeClass('cleanup');
    this.element.appendTo(Dialog.contentElement);
};

var _onData = function (data) {
    this.show();
    if (data.items) {
        this.eqs = this.formatEqs(data.eqs || []);
        this.money = data.money;
        this.id = data.id;
        this.command_before = "dc " + this.id + " ";
        this.items = this.formatItems(data.items);
        this.target_name = data.name;
        this.max_count = data.max_item_count;
        this.show_items();
        this.show_moeny();
    } else {
        this.updateitem(data);
    }
};

var _show_moeny = function () {
    if (!this.isShow) return;
    var mstr = Util.moneyToStr(this.money);
    var str = [];
    str.push("<div class='obj-money'>");
    if (this.packElement.is('.cleanup')) {
        str.push("<span for='cancle' class='footer-item'>取消</span>");
        str.push("<span for='store' class='footer-item'>自动存仓</span>");
        str.push("<span for='sell' class='footer-item'>清理杂物</span>");
        str.push("<span for='cleanup' class='footer-item'>确定</span></div>");
    } else {
        str.push(this.target_name, (mstr ? "身上有" + mstr : "身上没有任何银两"));
        str.push("<span for='cleanup' class='footer-item'>整理</span></div>");
    }
    Dialog.footer(str.join(""));
};

var _hide = function () {
    this.element.remove();
    this.isShow = false;
};

var _cleanup_item = function (x, y) {
    var elem = $(y);
    var item = elem.parent().attr('oindex');
    var cmd = elem.attr('cmd');
    SendCommand(Dialog.pack2.command_before + " " + cmd + " " + item);
};

var _item_click = function (e) {
    var elem = $(e.target);
    var is_cleanup = Dialog.pack2.packElement.is('.cleanup');
    if (is_cleanup && elem.is('.obj-oper'))
        return Dialog.pack2.item_cleanup(elem);
    elem = $(this);
    var obj = elem.attr("oindex");
    if (!obj) return;
    var item = Dialog.pack2.get_item(obj);
    Dialog.pack2.packElement.find(".item-commands").remove();
    if (!item) return;
    SCRIPT.LAST_OBJ = item;
    var html = ["<span class='item-commands'>"];
    html.push('<span cmd="' + Dialog.pack2.command_before + ' checkobj ' + item.id + ' from item">查看</span>');
    Dialog.pack2.create_item_command(item, html);
    html.push("</span>");
    elem = $(html.join("")).insertAfter(elem);
    Util.checkScroll(elem);
};

var _eqitem_click = function () {
    var item = Dialog.pack2.eqs[$(this).attr("oindex")];
    if (!item) return;
    SendCommand(Dialog.pack2.command_before + " checkobj " + item.id + " from eq");
};

var _init = function () {
    Dialog.pack.init();
    Object.assign(this, Dialog.pack);
    this.show = _show;
    this.onData = _onData;
    this.show_moeny = _show_moeny;
    this.hide = _hide;
    this.cleanup_item = _cleanup_item;
    this.item_click = _item_click;
    this.eqitem_click = _eqitem_click;
};

export default {
    init: _init,
    onData: _onData,
    show: _show,
    show_moeny: _show_moeny,
    hide: _hide,
    cleanup_item: _cleanup_item,
    item_click: _item_click,
    eqitem_click: _eqitem_click
};
