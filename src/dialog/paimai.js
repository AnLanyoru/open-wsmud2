

const paimai_css = `
.dialog-pms {
    max-height: 32em;
    margin-bottom: 0.5em;
}

.dialog-pms>.empty {
    text-align: center;
    margin-top: 3em;
    margin-bottom: 3em;
    color: gray;
}

.dialog-pms>.pm-item {
    border-radius: 6px;
    background-color: #111111;
    border-left-width: 4px;
    border-left-style: solid;
    border-left-color: gray;
    position: relative;
    padding-left: 0.5em;
    line-height: 2em;
    margin-top: 0.5em;
    cursor: pointer;
}

.dialog-pms>.selected {
    border-left-color: #00ff00;
    background-color: #222;
}

.dialog-pms>.pm-item>.pm-title {
    width: 10em;

}

.dialog-pms>.pm-item>.pm-desc {
    min-width: 10em;
    flex: 1;
}

.dialog-pms>.pm-item>.pm-mem {

    padding-right: 1em;
    color: gray;
    font-size: 0.8em;
}

.dialog-pms>.pm-item>.pm-add {
    width: 4em;
    border-left: 1px solid #343434;
    text-align: center;
    color: #008080
}

.dialog-pms>.pm-item>.pm-add:hover {
    background-color: #333;
}
`;

function format_time_span(time) {
    let diff = Math.floor((time) / 1000);
    if (diff < 0) diff = 0;
    if (diff > 3600) {
        let str = Math.floor(diff / 3600) + "小时";
        diff = diff % 3600;
        str += Math.floor(diff / 60) + "分";
        return str;
    }
    let str = Math.floor(diff / 60) + "分";
    diff = diff % 60;

    return str + diff + "秒";

}

export default {
    init: function () {
        Dialog.injectStyle(paimai_css);
    },
    close: function () {
        this.element.remove();
        this.isShow = false;
    }, onData: function (data) {
        if (data.list) {
            this.show();
            this.create_items(data.list);
        } else if (data.item) {
            this.update_item(data.item);
        }
    },
    show: function () {
        if (!Dialog.isShow || Dialog.curItem != "pm")
            Dialog.show("pm");
        if (!this.element)
            this.element = $("<div class='dialog-pms'></div>");
        if (this.isShow) return;
        Dialog.title("拍卖行");
        Dialog.icon("shopping-cart");
        Dialog.footer("");
        this.element.appendTo(Dialog.contentElement);
        this.element.on('click', '.pm-item', this.select_item);
        this.isShow = true;
    },
    select_item: function () {
        let elem = $(this);
        let dialog = Dialog.pm;
        if (dialog.selected_item)
            dialog.selected_item.removeClass('selected');
        dialog.selected_item = elem;
        dialog.selected_item.addClass('selected');
    }, update_item: function (item) {
        let elem = this.element.find('.pm-item[oid="' + item[0] + '"]');
        if (elem) elem.replaceWith(this.create_item(item));
    },
    create_items: function (list) {
        let str = [];
        for (let i = 0; i < list.length; i++) {
            str.push(this.create_item(list[i]));
        }
        if (!str.length) str.push('<div class="empty">暂无拍卖</div>');
        this.element.html(str.join(""));
        Dialog.footer('<span class="obj-money">共有'
            + list.length + '项道具正在拍卖</span>');

    }, create_item: function (item) {
        let str = [];
        const [id, name, money, time, uname] = item;
        str.push("<div class='pm-item grade0 flex-row' oid='", id, "'>");
        str.push("<div class='pm-title' cmd='pm show ", id, "'>");
        str.push(name);
        str.push("</div>");

        str.push("<div class='pm-desc flex-1'>");
        if (uname) {
            str.push(uname, '最后出价', moneyToStr(money),);
        } else {
            str.push('当前价格', moneyToStr(money),);
        }
        str.push("</div>");

        str.push("<div class='pm-mem'>");
        str.push('剩余：', format_time_span(time), '');
        str.push("</div>");
        str.push("<div class='pm-add' cmd='pm add ", id, "'>");
        str.push('出价');
        str.push("</div>");
        str.push("</div>");
        return str.join("");
    },
    format_num: function (num) {
        return num > 9 ? num.toString() : "0" + num.toString();
    }
};
