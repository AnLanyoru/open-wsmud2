
import { showFlag } from '../game/tool.js';

const events_css = `

.dialog-events {
    max-height: 32em;
    margin-bottom: 0.5em;
    margin-top: 0.5em;
}

.dialog-events>.empty {
    text-align: center;
    color: gray;
    margin-bottom: 3em;
    margin-top: 3em;
}

.dialog-events>.event-item {
    border-radius: 6px;
    background-color: #111111;
    border-left-width: 4px;
    border-left-style: solid;
    position: relative;
    margin-top: 0.5em;
    padding-left: 0.5em;
}

.event-item h3 {
    margin: 0px;
    padding-top: 0.5em;
    color: var(--border-color)
}

.event-item .event-desc {
    white-space: pre-wrap;
    margin: 0;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
}

.event-item>.event-btn {
    width: 7em;
    border-left: 1px solid var(--border-color);
    text-align: center;
    font-weight: bold;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--border-color);
}

`;

export default {
    unRead: 0,
    init: function () {
        Dialog.injectStyle(events_css);
    },
    hide: function () {
        this.element.remove();
        this.isShow = false;
    }, onData: function (data) {
        if (data.close) return Dialog.hide();
        if (!data.items) {
            if (data.finish) this.unRead--;
            else this.unRead++;
            return this.showUnread();
        }
        this.items = data.items;
        this.create_items();
    }, showUnread: function () {
        showFlag("events", this.unRead);
    },
    show: function () {
        if (!this.element)
            this.element = $("<div class='dialog-events'></div>");
        SendCommand("events");
        if (this.isShow) return;

        Dialog.title("活动");
        Dialog.icon("dashboard");
        this.unRead = 0;
        this.showUnread();
        Dialog.footer("");
        this.element.appendTo(Dialog.contentElement);
        this.isShow = true;
    },
    create_items: function () {
        let str = [];
        for (let i = 0; i < this.items.length; i++) {
            const [id, title, desc, grade, time, command] = this.items[i];
            str.push("<div class='event-item flex-row ");
            str.push('grade', grade);
            str.push("'><div class='flex-1'><h3>");
            str.push(title)
            str.push("</h3>");
            str.push("<pre class='event-desc'>");
            str.push(desc);
            if (time > 0)
                str.push('\n<mem>', this.format_time(time), '</mem>');
            str.push("</pre></div>");

            str.push("<span class='event-btn flex-0'");
            if (command) str.push(" cmd='events ", id, "' >", command);
            else str.push(">进行中");
            str.push("</span>");
            str.push("</div>");
        }
        if (!str.length) str.push('<div class="empty">暂无活动</div>');
        this.element.html(str.join(""));
        Dialog.footer('<span class="obj-money">共有' + this.items.length + '项活动正在进行</span>');

    }, format_time: function (time) {
        let dt = new Date(time);
        let now = new Date();
        let day = dt.getDate();
        let hour = dt.getHours();
        let minu = dt.getMinutes();
        let str = ['持续到'];
        if (now.getFullYear() !== dt.getFullYear())
            str.push(dt.getFullYear(), '年');
        if (now.getMonth() !== dt.getMonth())
            str.push(this.format_num(dt.getMonth() + 1), '月', this.format_num(day), '日');
        else if (day !== now.getDate())
            str.push(this.format_num(day), '日');
        str.push(this.format_num(hour), ':', this.format_num(minu));

        return str.join("");

    }, format_num: function (num) {
        return num > 9 ? num.toString() : "0" + num.toString();
    }
};
