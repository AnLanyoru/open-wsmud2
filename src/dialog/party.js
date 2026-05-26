

const party_css = `
.dialog-party>wht {
    display: inline-block;
    height: 15rem;
    line-height: 15rem;
    text-align: center;
    width: 100%;
}

.dialog-party>.dialog-party-add {
    margin-top: 2em;
    text-align: center;
}

.dialog-party>.dialog-party-add>input {
    border: 1px solid gray;
    background-color: transparent;
    color: unset;
    resize: none;
    margin-top: 1em;
    margin-bottom: 1em;
    line-height: 2em;
    border-radius: 0.5em;
    text-align: center;
}

.dialog-party>.party-title {
    font-size: 2rem;
    width: 100%;
    text-align: center;
    height: 2rem;
    line-height: 2rem;
    margin-top: 0.25em;
    margin-bottom: 0.25em;
    opacity: 0.7;
    font-weight: bold;

}

.dialog-party>.party-notice {
    padding-top: 0.25em;
    padding-bottom: 0.25em;
    color: #00FFFF;
    line-height: 2em;
}

.dialog-party>.party-notice>*>span {

    width: 3em;
    display: inline-block;
    padding-right: 0.5em;
}

.dialog-party>.party-title>.party-count {

    font-size: 1rem;
}

.dialog-party>.party-title>*>.glyphicon {

    padding-right: 0.5em;
    float: left;
}

.dialog-party>.party-roles {

    overflow-x: hidden;
    overflow-y: auto;
}

.dialog-party>.party-roles>.party-role,
.dialog-party>.party-item {

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

.dialog-party>.party-item {
    display: flex;
}

.dialog-party>.party-item>.party-item-name {
    padding-left: 0.5em;
    flex: 1;
}

.dialog-party>.party-item>.party-item-sc {

    flex: 0;
    margin-left: 1em;
    margin-right: 1em;
}

.dialog-party>.party-item>.party-item-cmd {
    flex: 0;
    background-color: #222;
    padding-left: 1em;
    padding-right: 1em;
}

.dialog-party>.party-roles>.party-role>.role-level {

    width: 3em;
    display: inline-block;
}

.dialog-party>.party-roles>.party-role>.role-name {
    padding-left: 0.5em;
}

.dialog-party>.party-roles>.party-role>.role-sc {
    float: right;
    padding-right: 0.5rem;

}
`;

export default {
    init: function () {
        Dialog.injectStyle(party_css);
    },
    createElement: function () {
        return $('<div class="dialog-party"></div>');
    },
    inner_show: function () {
        //需要优化
        SendCommand("party load");
        this.isShow = true;
        Dialog.title("");
        this.element.on("click", '.party-role', this.show_commands);
        Dialog.icon("flag");
    },
    levels: ["", "<hio>帮主<hio>", "<hiz>副帮主</hiz>", "<hiy>长老</hiy>", "<hic>堂主</hic>", "帮众"],
    level_roles: [1, 20, 30, 40, 50, 60],
    level: 5,
    get_role: function (id) {
        if (!this.roles) return;
        for (var i = 0; i < this.roles.length; i++) {
            if (this.roles[i].id == id) return this.roles[i];
        }
    },
    command: function (type) {
        if (type === 'create') {

            let str = ['<div class="dialog-party-add">'];
            str.push('<div>创建帮派需要500两<hiy>黄金</hiy>，请输入帮派名称(2-5字中文)：</div>');

            str.push('<input type="text" ></input>');

            str.push("<div class='item-commands'><span cmd='_party cancle'>取消</span><span cmd='_party create2'>确定</span></div>");
            str.push('</div>');
            this.element.html(str.join(""));
        } else if (type === 'cancle') {
            this.empty('你还没有加入帮派');
        } else if (type === 'create2') {
            let val = $('.dialog-party-add>input').val();
            if (!val || val.length > 5 || val.length < 2)
                return ReceiveMessage("帮派名字需要是2-5中文字符。");
            SendCommand('party create2 ' + val);
        }

    }, empty: function (str) {
        this.element.html("<wht>" + str + "</wht><div class='item-commands'><span cmd='_party create'>创建帮派</span><span cmd='party list'>加入帮派</span></div>");

    },
    show_list: function (data) {
        if (!data.list.length) return this.empty('现在没有已经创建的帮派');
        var str = [];
        for (let item of data.list) {
            str.push("<div class='party-item'>");
            str.push("<span class='party-item-name'>");
            str.push(item[0]);
            str.push("</span>");
            str.push("<span class='party-item-sc'>人数：");
            str.push(item[1]);
            str.push("</span>");
            str.push("<span class='party-item-cmd' cmd='party join ", item[0], "'>加入</span>");
            str.push("</div>");
        }
        this.element.html(str.join(""));
    },
    onData: function (data) {
        if (data.list) return this.show_list(data);
        if (!data.name) {
            return this.empty('你还没有加入帮派');
        }
        var party = data;

        Dialog.title('帮派【' + party.name + '】 <nor>' + data.roles.length + "/" + this.level_roles[data.level] + "</nor>");
        var str = [];
        // str.push("<div class='party-title'><hio>");
        // str.push(party.name);
        // str.push("</hio><span class='party-count'><nor>(" + data.roles.length + "/" + this.level_roles[data.level] + ")</nor></span>");
        // str.push("</div>");
        if (party.notice) {
            str.push("<div class='party-notice'>");
            str.push(party.notice);
            str.push("</div>");
        }
        str.push("<div class='party-roles'>");
        for (var i = 0; i < party.roles.length; i++) {
            var role = party.roles[i];
            if (role.id == Process.player) {
                this.level = role.level;
            }
            str.push("<div class='party-role' roleid='" + role.id + "'>");
            str.push("<span class='role-level'>");
            str.push(this.levels[role.level]);
            str.push("</span>");
            str.push("<span class='role-name'>");
            str.push(role.name);
            str.push("</span>");
            str.push("<span class='role-sc'>");
            str.push(role.sc);
            str.push("</span>");
            str.push("</div>");
        }
        str.push("</div>");
        this.roles = data.roles;
        this.element.html(str.join(""));
    }, show_commands: function () {
        var role = Dialog.party.get_role($(this).attr("roleid"));
        if (!role) return;
        var html = ["<div class='item-commands'>"];


        if (role.id == Process.player) {
            html.push('<span cmd="party out">退出帮派</span>');
            if (Dialog.party.level == 1) {
                html.push('<span cmd="party dissmiss">解散</span>');
            }
        } else {
            if (role.level > Dialog.party.level - 1 && role.level > 2)
                html.push('<span cmd="party uplevel ' + role.id + '">提升为' + (Dialog.party.levels[role.level - 1]) + '</span>');
            if (role.level > Dialog.party.level && role.level < 5) {
                html.push('<span cmd="party downlevel ' + role.id + '">降级为' + (Dialog.party.levels[role.level + 1]) + '</span>');
            }
            if (Dialog.party.level == 1 && role.level == 2) {
                html.push('<span cmd="party trans ' + role.id + '">让位</span>');
            }
            if (role.level > Dialog.party.level)
                html.push('<span cmd="party remove ' + role.id + '">开除</span>');
            if (role.online) {
                html.push('<span cmd="team add ' + role.id + '">邀请组队</span>');
            }
        }
        if (html.length == 1) return;
        html.push("</div>");
        Dialog.party.element.find(".item-commands").remove();
        $(html.join("")).insertAfter(this);
    },
    inner_close: function () {
        this.element.remove();
        this.isShow = false;
    }
};
