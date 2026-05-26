

export default {
    init: function () { },
    createElement: function () {
        return $('<div class="dialog-team"></div>');
    },
    inner_show: function () {
        SendCommand("team");
        this.isShow = true;
        Dialog.title("队伍");
        this.element.on("click", ".team-item", this.clickItem);
        Dialog.icon("list");
    },
    items: [],
    onData: function (data) {
        if (data.items) {
            this.items = data.items;
            if (data.items.length) this.isCap = data.items[0].id == Process.player;
            else this.isCap = 0;
        }
        if (data.dismiss) {
            this.items.length = 0;
            this.isCap = false;
        }
        if (data.remove) {
            if (!this.items.length) return;
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].id == data.remove) {
                    this.items.splice(i, 1);
                    break;
                }
            }
        }
        this.createItems();
    },
    inner_close: function () {
        this.element.remove();
        this.isShow = false;
    }, createItems: function () {
        if (!this.element) return;
        var str = [];
        for (var i = 0; i < this.items.length; i++) {
            var msg = this.items[i];
            str.push("<div class='team-item' index='" + i + "'>");
            str.push("<span class='team-flag'>");
            str.push(i > 0 ? "" : "<span class='glyphicon glyphicon-flag'></span>");
            str.push("</span>");
            str.push("<span class='team-title'>");
            str.push(msg.name);
            str.push("</span>");
            str.push("</div>");
        }
        if (!str.length) str.push('<div class="empty">你还没有加入任何队伍。</div>');
        this.element.html(str.join(""));
    }, clickItem: function () {
        var elem = $(this);
        var item = Dialog.team.items[elem.attr("index")];
        if (!item) return;
        var html = ["<div class='item-commands'>"];
        html.push('<span cmd="look3 ' + item.id + '">查看</span>');
        var isCap = Dialog.team.items[0].id == Process.player;
        if (isCap && item.id != Process.player) {
            html.push('<span cmd="team remove ' + item.id + '">移出队伍</span>');
        } else if (item.id == Process.player) {
            html.push('<span cmd="team out ' + item.id + '">退出队伍</span>');
        }
        if (isCap && item.id == Process.player) {
            html.push('<span cmd="team set">更改分配方式</span>');
        }
        html.push("</div>");
        Dialog.team.element.find(".item-commands").remove();
        $(html.join("")).appendTo(elem);
    }
};
