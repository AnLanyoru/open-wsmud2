

import { showFlag } from '../game/tool.js';
export default {
    init: function () {

        Dialog.injectStyle(message_css);
    },
    close: function () {

        this.element.remove();
        this.isShow = false;
    }, hide: function () {
        if (this.detailID) {
            this.hide_detail();
            return false;
        }
    }, hide_detail: function () {
        this.element.removeClass("detail");
        this.detailID = null;
        Dialog.footerElement.find('.item-commands').empty();
    },
    selected_item: 0,
    messages: [],
    isLoad: false,
    unRead: 0,
    onData: function (data) {
        if (data.receive) return this.updateMessageState(data.receive, data.index);
        if (data.items) {
            return this.createMessageDetail(data.id, data.items);
        }
        if (data.clear) return this.clear_message(data.clear);

        if (data.unRead != undefined) {
            this.unRead = data.unRead;
        }
        if (data.messages) {
            for (var i = 0; i < data.messages.length; i++) {
                this.addMessage(data.messages[i]);
            }
        }

        if (data.message) {
            if (!this.isShow) this.unRead++;
            if (this.messages)
                this.addMessage(data.message);
            if (data.message.id == "notice") {
                this.showNotice(data.message);
            }
        }
        if (this.element)
            this.showMessages();
        if (this.isShow) {
            if (data.message && this.element.is(".detail")
                & this.detailID == data.message.id) {
                this.detailElement.prepend($(this.createMessageDetailItem(data.message.id,
                    data.message.name, data.message)));
            }
        } else
            this.showUnread();

    }, showUnread: function () {
        if (this.unRead) showFlag("message", this.unRead);
        else showFlag("message", 0);
    },
    addMessage: function (msg) {
        for (let i = 0; i < this.messages.length; i++) {
            if (this.messages[i].id == msg.id) {
                this.messages[i] = msg;
                return;
            }
        }
        this.messages.push(msg);
    }, clear_message: function (type) {
        for (let i = 0; i < this.messages.length; i++) {
            let from = this.messages[i].id;
            if ((type === true && from !== 'notice') || from == type) {
                this.messages.splice(i, 1);
                i--;
            }
        }
        this.showMessages();
        if (!this.isShow) return;
        if (this.element.is(".detail")
            & (type === true || this.detailID == type)) {
            this.hide_detail();
        }
    },
    show: function (data) {
        this.unRead = 0;
        this.showUnread();
        if (this.isShow) return;
        this.isShow = true;
        Dialog.title("消息");
        Dialog.icon("envelope");
        this.create_footer();
        this.footerChanged(this.selected_item);
        if (this.isLoad) return;
        SendCommand("message");
        this.isLoad = true;

        //  this.element.on("click", ".detail-item", this.showDetailCommand);
    },
    inner_show: function () {

        Dialog.title("消息");
        Dialog.icon("envelope");
        this.element.on("click",
            ".message-item", this.showMessageDetail);
    },
    inner_close: function () {
        this.element.remove();
        this.isShow = false;
    },
    footers: ["消息", "队伍", "关系", "帮派"],
    footerElements: ["message", "team", "relation", "party"],
    create_footer: function () {
        var html = [];
        for (var i = 0; i < this.footers.length; i++) {
            html.push("<span class='footer-item" + (i == this.selected_item ? " select" : "") + "' for='" + i + "''>"
                + this.footers[i] + "</span>");
        }
        html.push('<dic class="item-commands"></div>');
        Dialog.footer(html.join(""));


    }, footerChanged: function (index) {
        //if (index == this.selected_item) return;
        this.selected_item = index;
        Dialog.footerElement.find('.item-commands').empty();
        this.showChild();
    }, showChild: function () {
        var child = Dialog[this.footerElements[this.selected_item]];
        //if (this.selectedChild == child) return;
        if (this.selectedChild) this.selectedChild.inner_close();
        if (!child.element) child.element = child.createElement();
        Dialog.contentElement.empty().append(child.element);
        child.inner_show();

        this.selectedChild = child;
    }, showNotice: function (nt) {
        var str = ["\n<hiy>系统公告</hiy>\n"];
        var dt = new Date(nt.time);
        str.push(dt.getFullYear());
        str.push("年");
        str.push(dt.getMonth() + 1);
        str.push("月");
        str.push(dt.getDate());
        str.push("日 ");
        str.push(dt.getHours());
        str.push("时");
        str.push(dt.getMinutes());
        str.push("分\n<hic>");
        str.push(nt.content);
        str.push("\n</hic>");
        ReceiveMessage(str.join(""));
    }, showMessages: function (newmsg) {
        var str = [];
        for (var i = 0; i < this.messages.length; i++) {
            var msg = this.messages[i];
            str.push("<div class='message-item' fromid=\"");
            str.push(msg.id);
            str.push("\"><div class='message-title'>");
            str.push(msg.name);

            str.push("<span class='message-time'>");
            str.push(this.getTimedesc(msg.time));
            str.push("</span>");
            str.push("</div>");
            str.push("<div class='message-content'>");
            str.push(msg.content);
            str.push("</div>");
            str.push("</div>");
        }
        if (!str.length) str.push('<div class="empty">暂无新消息</div>');
        if (!this.listElement) this.listElement = this.element.find(".message-list");
        this.listElement.html(str.join(""));

    }, getTimedesc: function (long) {
        var now = new Date();
        var time = new Date(long);
        var dt = (now - time) / 1000;
        if (dt < 60) return "刚刚";
        else if (dt < 3600) return parseInt(dt / 60) + "分钟前";
        else if (time.getFullYear() == now.getFullYear() && time.getMonth() == now.getMonth()) {
            var diff_day = time.getDate() - now.getDate();
            var msg = "今天 " + this.add_zero(time.getHours()) + ":" + this.add_zero(time.getMinutes());
            if (diff_day == 0) return msg;
            else if (diff_day == 1) return "昨天 " + msg;
            else if (diff_day == 2) return "前天 " + msg;

        }
        var str = (time.getMonth() + 1) + "月" + time.getDate() + "日 " + this.add_zero(time.getHours()) + "：" + this.add_zero(time.getMinutes());
        if (now - time > 2332800000) {
            str += "<mem>即将过期</mem>";
        }
        return str;

    }, add_zero: function (num) {
        if (num < 10) return "0" + num;
        return num;
    }, showMessageDetail: function () {
        var id = $(this).attr("fromid");
        if (!id) return;
        SendCommand("message " + id);
        Dialog.message.element.addClass("detail");

    }, getMessageitem: function (id) {
        for (var i = 0; i < this.messages.length; i++) {
            if (this.messages[i].id == id) return this.messages[i];
        }
    }, createMessageDetail: function (id, items) {
        if (!this.detailElement) {
            this.detailElement = this.element.find(".detail-list");
        }
        var msg = this.getMessageitem(id);
        if (!msg) return;
        var str = [];
        this.detailID = id;
        let has_rec = false;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            str.push(this.createMessageDetailItem(id, msg.name, item));
            if (item.attach && !item.rec) {
                has_rec = true;
            }
        }
        this.detailElement.html(str.join(""));
        let cmds = "";
        if (id !== 'notice') {
            cmds = `<span cmd="message delete ${id}">删除</span><span cmd="receive ${id}">领取全部</span>`;
        }
        Dialog.footerElement.find('.item-commands').html(cmds);

    }, createMessageDetailItem: function (id, name, item) {
        var str = [];
        str.push("<div class='detail-item' rec='",
            item.attach && !item.rec ? 1 : 0,
            "' fid='", id, "' index='" + item.index + "'>");
        str.push("<span class='detail-name'>");
        str.push(name);
        str.push("</span>");
        str.push("<span class='detail-time'>");
        str.push(this.getTimedesc(item.time));
        str.push("</span>");
        str.push("<pre class='detail-content'>");
        str.push(item.content);
        str.push("</pre>");
        if (item.attach) {
            for (var j = 0; j < item.attach.length; j++) {
                str.push("<div class='detail-attach'>");
                str.push(item.attach[j].name);
                str.push("</div>");
            }
            if (item.rec) {
                str.push("<div class='detail-rec'>已领取</div>");
            } else {
                str.push("<div  class='detail-rec' cmd='receive " + id
                    + " " + item.index + "'><hig>领取</hig></div>");
            }
        }
        str.push("</div>");
        return str.join("");
    },
    createElement: function () {
        return $('<div class="dialog-message"><div class="message-list"></div><div class="detail-list"></div></div>');
    }, updateMessageState: function (rec, index) {
        if (this.detailID != rec) return;
        const elem = this.detailElement.find(".detail-item[index='" + index + "']>.detail-rec");
        elem.html("已领取").removeAttr('cmd');
    }
};
const message_css = `

.dialog-message{
    height: 25em;
    max-height: 30em;
}

.dialog-message>.message-list>.empty{
    color: #505050;
    padding-top: 1em;
    text-align: center;
}

.dialog-message>.message-list>.message-item {

    padding-left: 1em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;

}

.dialog-message>.message-list>.message-item>.message-title {
    color: #FFFF00;
    line-height: 2em;
}

.dialog-message>.message-list>.message-item>.message-content {
    white-space: break-spaces;
    word-wrap: break-word;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-bottom: 0.5em;
}

.dialog-message>.message-list>.message-item>.message-title>.message-time {
    float: right;
    margin-right: 0.5em;

}

.detail {
    min-height: 25em;
    max-height: 25em;
}

.detail>.message-list {
    display: none;
}

.dialog-message>.detail-list {
    display: none;
}

.detail>.detail-list {
    display: block;
}


.dialog-team,
.dialog-party,
.dialog-relation {
    height: 25em;
    max-height: 30em;
}

.dialog-team>.empty {
    color: #505050;
    padding-top: 1em;
    text-align: center;
}

.dialog-team>.team-item {
    padding-left: 0.5em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    background-color: #111;
    line-height: 2em;
    cursor: pointer;
}

.dialog-team>.team-item>.item-commands {
    padding-left: 2em;
}

.dialog-team>.team-item>.team-flag {
    width: 2em;
    display: inline-block;
    text-align: center;
    color: #FFFF00
}

.dialog-team>.team-item>.team-name {
    display: inline-block;
}

.dialog-relation>.relation-item {
    padding-left: 0.5em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    background-color: #111;
    line-height: 2em;
    display: flex;
    flex-direction: row;
}

.dialog-relation>.relation-item>.relation-desc {
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.dialog-relation>.relation-item>.relation-cmd {
    flex: 0;
    background-color: #222;
    padding-left: 1em;
    padding-right: 1em;
    cursor: pointer;
    border-left: 2px solid #111;
}

.detail-item {
    margin-bottom: 0.5em;
    margin-top: 0.5em;
    padding: 0.5em;
    background-color: #111;
    padding-left: 1em;
    border-radius: 4px;
    border-top-width: 2px;
    border-top-style: solid;
    border-top-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    background-color: #111;
}

.detail-item>.detail-name {
    color: #FFFF00;
}

.detail-item>.detail-time {
    margin-left: 1em;
    color: gray;
}

.detail-item>.detail-content {
    white-space: pre-wrap;
}

.detail-item>.detail-rec {
    margin-top: 1em;
    background-color: #222;
    color: gray;
    display: inline-block;
    font-size: 0.8em;
    padding-left: 1em;
    padding-right: 1em;
    border-radius: 1em;
    cursor: pointer;
}

`;
