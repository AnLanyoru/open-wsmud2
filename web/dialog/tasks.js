const task_css = `

.dialog-tasks {
    max-height: 32em;
    margin-bottom: 0.5em;
    margin-top: 0.5em;
}

.dialog-tasks>.task-item {
    border-radius: 6px;
    background-color: var(--bg-surface);
    border-left-width: 4px;
    border-left-style: solid;
    position: relative;
    margin-top: 0.5em;
    padding-left: 0.5em;
}

.dialog-tasks>.none {
    border-left-color: var(--mud-hik)
}



.dialog-tasks>.finish {
    border-left-color: var(--dialog-highlight)
}

.dialog-tasks>.over {
    border-left-color: var(--mud-cyn)
}

.dialog-tasks>.none>.task-btn {
    border-left-color: var(--mud-hik);
    color: var(--mud-hik);
}

.dialog-tasks>.finish>.task-btn {
    border-left-color: var(--dialog-highlight);
    color: var(--dialog-highlight);
    background-color: var(--dialog-highlight-bg);
}

.dialog-tasks>.over>.task-btn {
    border-left-color: var(--mud-cyn);
    color: var(--mud-cyn);
}

.task-item h3 {
    margin: 0px;
    padding-top: 0.5em;
}

.task-item .task-desc {

    margin: 0;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    white-space: pre-wrap;
}

.task-item>.task-btn {
    width: 4.5em;
    display: inline-block;
    border-left: 1px solid var(--border-primary);
    text-align: center;
    font-weight: bold;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.task-item>.task-btn:hover {
    background-color: var(--bg-surface2);
}

.dialog-tasks>.task-item>.start {
    color: var(--text-muted);
}

.dialog-tasks>.task-item>.finish {
    color: var(--dialog-highlight);
}

.dialog-tasks>.task-item>.over {
    color: #ebebeb;
}
`;

export default {
    init: function () {

        Dialog.injectStyle(task_css);
    },
    close: function () {
        this.element.remove();
        this.isShow = false;
    }, update_item: function (data) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].id == data.id) {
                if (data.state) {
                    this.items[i].title = data.title;
                    this.items[i].state = data.state;
                    this.items[i].desc = data.desc;
                } else {
                    this.items.splice(i, 1);
                }

                break;
            }
        }
        this.create_items();
    }, onData: function (data) {

        if (data.id) return this.update_item(data);
        Dialog.title("任务列表");
        Dialog.icon("exclamation-sign");
        this.items = data.items;
        this.create_items();
    },
    show: function () {
        if (!this.element)
            this.element = $("<div class='dialog-tasks'></div>");
        SendCommand("tasks");
        if (this.isShow) return;
        this.element.appendTo(Dialog.contentElement);

        this.isShow = true;
    },
    status_css: ['', 'none', 'finish', 'over'],
    create_items: function () {
        var str = [];
        var has_fin = false;
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            str.push("<div class='task-item flex-row ");
            str.push(this.status_css[item.state]);
            str.push("'><div class='flex-1'><h3>");
            str.push(item.title)
            str.push("</h3>");
            str.push("<pre class='task-desc'>");
            str.push(item.desc);

            //str.push('<span class="glyphicon glyphicon-info-sign"></span>');
            str.push("</pre></div>");
            str.push("<span class='task-btn flex-0'");
            if (item.state == 1) {
                str.push(">进行中");
            } else if (item.state == 2) {
                str.push(" cmd=\"task ");
                str.push(item.id);
                str.push(' fin"');
                has_fin = true;
                str.push(">可领取");
            } else if (item.state == 3) {
                str.push(">已完成");
            }
            str.push("</span>");
            str.push("</div>");
        }
        this.element.html(str.join(""));

        Dialog.footer("");
    }
};
