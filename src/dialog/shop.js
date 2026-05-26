

import Util from '../utils/util.js';
export default {
    init: function () {
        Dialog.injectStyle(shop_css);
    },
    selected_item: 0,
    close: function () {
        this.element.remove();
        this.isShow = false;
    }, onData: function (data) {
        if (data.money) {
            let ms = data.money ?? [0, 0];
            this.money = ms[0];
            this.cash_money = ms[1];
            if (ms.length > 2) {
                this.footers = ["黄金", "元宝", '活动'];
                this.act_money = ms[2];
                this.act_name = data.mtype ?? "<hic>积分</hic>";
            }
            this.create_footer();
        }
        if (data.remove) {
            let item = this.get_item(data.remove);
            if (item) item.removed = true;
            return this.show_items();
        }
        if (data.item) {
            let [id, count] = data.item;
            let item = this.get_item(id);
            if (item) {
                item.count = count;
                this.show_items();
            }
            return;
        }

        if (!data.idx) return;
        this.idx = data.idx;
        this.list0 = this.format_items(data.selllist[0], 0);
        this.list1 = this.format_items(data.selllist[1], 1);
        if (data.selllist.length > 2)
            this.list2 = this.format_items(data.selllist[2], 2);

        this.show_items();
    },
    footerChanged: function (index) {

        this.selected_item = parseInt(index);
        this.show_items();
        this.create_footer();
    }, footers: ["黄金", "元宝"],
    create_footer: function () {
        if (!this.isShow) return;
        var html = [];
        for (var i = 0; i < this.footers.length; i++) {
            html.push("<span class='footer-item" + (i == this.selected_item
                ? " select" : "") + "' for='" + i + "''>"
                + this.footers[i] + "</span>");
        }
        if (this.selected_item === 0) {
            html.push('<div class="obj-money">',
                this.money > 0 ? "你身上有" + Util.moneyToStr(this.money) : "你身上没有银两"
                , '</div>');
        } else if (this.selected_item === 1) {
            html.push('<div class="obj-money">',
                this.cash_money > 0 ? "你身上有" + this.cash_money
                    + "<hij>元宝</hij>" : "你身上没有元宝"
                , '<span cmd="transmoney">账号转入</span></div>');
        } else if (this.selected_item === 2) {
            html.push('<div class="obj-money">',
                "你身上有", this.act_money > 0 ? this.act_money : 0
                , this.act_name);
        }
        Dialog.footer(html.join(""));
    },
    format_items: function (ary, mtype) {
        let items = [];
        for (let data of ary) {
            if (!data) continue;
            let item = {
                id: data[0], name: data[1],
                desc: data[2], value: data[3], grade: data[4],
                discount: data[5]
            };
            if (data[6]) {
                item.limit = data[6];
                item.count = data[7];
            }
            if (item.discount < 1) {
                if (mtype === 0)
                    item.price0 = "<del>" + item.value + "两黄金</del>";
                else if (mtype === 1)
                    item.price0 = "<del>" + item.value + "元宝</del>";
                else if (mtype === 2)
                    item.price0 = "<del>" + item.value + this.act_name + "</del>";
                item.value = item.value * item.discount;
            }
            if (mtype === 0) {
                if (item.value >= 1)
                    item.price = "<hiy>" + item.value + "两黄金</hiy>";
                else
                    item.price = "<wht>" + (item.value * 100) + "两白银</wht>";
            } else if (mtype === 1) {
                item.price = "<hij>" + item.value + "元宝</hij>";
            } else if (mtype === 2) {
                item.price = item.value + this.act_name;

            }

            items.push(item);
        }
        return items;
    }
    , show_items: function () {
        if (!this.isShow) return;
        this.create_items([this.list0, this.list1, this.list2][this.selected_item]);
    }, get_item: function (id) {

        if (this.list0) for (let item of this.list0) if (item.id === id) return item;
        if (this.list1) for (let item of this.list1) if (item.id === id) return item;
        if (this.list2) for (let item of this.list2) if (item.id === id) return item;
    },
    show: function (data) {
        if (!this.element) {
            this.element = $("<div class='dialog-shop-content'><div class='dialog-shop'></div></div>");
        }
        Dialog.title("商品列表");
        Dialog.icon("shopping-cart");
        this.isShow = true;
        this.element.appendTo(Dialog.contentElement);
        if (!this.idx) SendCommand("shop");
        else SendCommand("shop " + this.idx);
    }, create_items: function (items) {
        let str = [];
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.removed) {
                items.splice(i, 1);
                i--;
                continue;
            }
            str.push("<div class='shop-item");
            str.push(' grade', item.grade);
            str.push("'><div class='flex-1'><div class='shop-item-title'>");

            str.push('<div class="shop-item-name">', item.name, '</div>');
            if (item.limit > 0)
                str.push("(", item.count, "/", item.limit, ")");

            str.push("</div>");
            str.push("<pre class='shop-desc'>");
            str.push(item.desc)
            str.push("</pre></div>");
            str.push("<div class='shop-btn' ");
            str.push('cmd="_confirm shop ', item.id);
            if (item.limit > 0) {
                str.push(' ', item.limit - item.count);
            }
            str.push('">');
            if (item.price0) {
                str.push('&nbsp;', item.price0, '&nbsp;');
            }
            str.push(item.price);
            str.push("</div>");
            str.push("</div>");
        }
        this.element.find('.dialog-shop').html(str.join(""));
    }
};

const shop_css = `

.dialog-shop-content {
    height: 25em;
}

.dialog-shop {
    max-height: 32em;
    padding-bottom: 0.5em;
    margin-top: 0.5em;
}

.dialog-shop>.shop-item {
    border-radius: 6px;
    background-color: #111111;
    border-left-width: 4px;
    border-left-style: solid;
    position: relative;
    margin-bottom: 0.5em;
    padding-left: 0.5em;
    display: flex;
    flex-direction: row;
}

.shop-item-title {
    display: flex;
    flex-direction: row;
    line-height: 2em;
    place-items: 1em;
}

.shop-item-title>.shop-item-name {
    margin: 0px;
    color: var(--border-color);
    font-weight: bold;
}

.shop-item-title>.discount-tag {

    background: linear-gradient(135deg, #ff3e3e 0%, #ff9100 100%);
    color: white;
    width: 4em;
    font-weight: bold;
    text-align: center;
    border-radius: 0.5em;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}



.dialog-shop>.shop-item .shop-desc {
    margin: 0;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    white-space: pre-wrap;
}

.dialog-shop>.shop-item .shop-label {
    background: linear-gradient(110deg, transparent 0%, rgba(255, 159, 28, 0.8) 50%, transparent 100%);

    animation: shine 3s infinite linear;
    color: #fff;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: bold;
}


.dialog-shop>.shop-item>.shop-btn {
    width: 8em;
    display: inline-block;
    border-left: 1px solid var(--border-color);
    text-align: center;
    font-weight: bold;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #222;
    flex-wrap: wrap;
}

.dialog-shop-footer {
    text-align: right;
    padding-right: 0.5em;
}

.dialog-shop-footer>span {
    line-height: 1.8em;
    margin-left: 1em;
    color: #808000;
    display: inline-block;
    padding-right: 1em;
    text-align: center;
    text-decoration: underline;
    border-right: 1px solid #808000;
}

`;
