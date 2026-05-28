

const STATS_SILDER1 = [["总榜", ''], ["武当派", 'wudang'], ["少林派", 'shaolin'], ["华山派", 'huashan'],
["峨眉派", 'emei'], ["逍遥派", 'xiaoyao'], ["丐帮", 'gaibang'], ["杀手楼", 'shashou'],
["无门无派", 'none']];
const STATS_SILDER2 = [
    ["武器", ""], ["衣服", "cloth"], ["鞋", "shoes"], ["头部", "head"],
    ["披风", "cape"], ["戒指", "ring"], ["项链", "necklace"], ["饰品", "jewels"],
    ["护腕", "wrist"], ["腰带", "waist"], ["暗器", "throwing"]
];
export default {
    footers: [{ cmd: "score", name: "综合榜", selected_silder: "", silder: STATS_SILDER1 },
    { cmd: "top", name: "高手榜", selected_silder: "", silder: STATS_SILDER1 },
    { cmd: "weapon", name: "兵器谱", selected_silder: "", silder: STATS_SILDER2 },
    { cmd: "exp", name: "经验榜", selected_silder: "", silder: STATS_SILDER1 },
    { cmd: "mp", name: "内力榜", selected_silder: "", silder: STATS_SILDER1 },
    { cmd: "money", name: "富豪榜", selected_silder: "", silder: STATS_SILDER1 }
    ],
    selectedItem: 0,
    init: function () {
        Dialog.injectStyle(stats_css);
    },
    close: function () {
        this.element.remove();
        this.isShow = false;
    }, onData: function (data) {
        if (data.close) return Dialog.hide();
        if (data.tops) {
            if (data.top) {
                this.show_desc("你目前在第" + data.top + "名，积分" + data.sc);
            } else {
                this.show_desc("你目前没有上榜，积分：" + data.sc);
            }

            return this.create_tops(data.tops, data);
        }
        if (data.weapons) {
            this.show_desc("");
            return this.create_weapons(data.weapons);
        }
        if (data.scores) {
            this.show_desc("你目前的评分：" + data.score);
            return this.create_scores(data.scores);
        }
        if (data.items) {
            this.create_other(data.items, data.st);
            let dt = new Date(data.time);
            data.fam = data.fam ?? "";
            this["last_" + data.st + data.fam] = {
                items: data.items,
                time: data.time + 60000,
                score: data.score
            };
            if (data.score)
                this.show_desc("你目前的评分：" + data.score);
            else
                this.show_desc("上次更新：" + dt.getHours() + ":" + dt.getMinutes());
        }

    }, create_other: function (items, type) {
        var html = [];
        for (var i = 0; i < 20; i++) {
            html.push("<div class='top-item");
            if (i < 3) html.push(' top', i + 1);
            html.push("' top='");
            html.push(i + 1);
            html.push("'><span class='top-title'>");
            html.push(this.top_names[i]);
            html.push("、</span>");
            html.push("<span class='top-name'>");
            let role = items[i] ?? ["无", 0];
            html.push(role[0]);
            html.push("</span>");
            html.push("<span class='top-sc'>");
            html.push(role[1]);
            html.push("</span>");
            html.push("</div>")
        }
        this.container.html(html.join(""));
    },
    silderClick: function () {
        let elem = $(this);
        let type = elem.attr("stype");
        let item = Dialog.stats.selectedItem;
        if (item.selected_silder === type) return;
        item.selected_silder = type;
        elem.parent().find('.select').removeClass('select');
        elem.addClass('select');
        Dialog.stats.load_stats();
    },
    create_silder: function (items) {
        let str = [];
        items = items || [];
        let tab = this.selectedItem;
        for (let item of items) {
            str.push('<div class="stats-silder ',
                (tab.selected_silder === item[1] ? "select" : ""),
                '" stype="', item[1], '">', item[0], "</div>");
        }
        this.left_silder.html(str.join(""));
    },
    top_names: ["一　", "二　", "三　", "四　", "五　",
        "六　", "七　", "八　", "九　", "十　",
        "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十"],
    create_scores: function (items, data) {
        var html = [];
        for (var i = 0; i < 20; i++) {
            html.push("<div class='top-item scores");
            if (i < 3) html.push(' top', i + 1);
            html.push("' top='");
            html.push(i + 1);
            html.push("'><span class='top-title'>");
            html.push(this.top_names[i]);
            html.push("、</span>");
            html.push("<span class='top-name'>");
            let role = items[i] ?? ["无", ""];
            html.push(role[0]);
            html.push("</span>");
            html.push("<span class='top-sc'>");
            html.push(role[1]);
            html.push("</span>");
            html.push("</div>")
        }
        this.container.html(html.join(""));

    },
    fam_names: {
        emei: "峨眉第", wudang: "武当第", huashan: "华山第",
        xiaoyao: "逍遥第", gaibang: "丐帮第", shaolin: "少林第", shashou: "杀手第",
        none: "散修第"
    },
    create_tops: function (items, data) {
        var html = [];
        for (var i = 0; i < items.length; i++) {
            html.push("<div class='top-item top ");
            if (i < 3) html.push(' top', i + 1);
            html.push("' top='");
            html.push(i + 1);
            html.push("'><span class='top-title'>");
            html.push(data.fam ? this.fam_names[data.fam] : "天下第");
            html.push(this.top_names[i]);
            html.push("</span>");
            html.push("<span class='top-name'>");
            html.push(items[i][0]);
            html.push("</span>");
            html.push("<span class='top-sc'>");
            html.push(items[i][1]);
            html.push("</span>");
            html.push("</div>")
        }
        this.container.html(html.join(""));
        this.top = data.top;
    }, create_weapons: function (items) {
        var html = [];
        for (var i = 0; i < 10; i++) {
            html.push("<div class='top-item weapon top")
            html.push(i + 1);
            html.push("' top='");
            html.push(i + 1);
            html.push("'><span class='top-title'>");
            let role = items[i] ?? ["无", ""];
            html.push(this.top_names[i]);
            html.push("、</span>");
            html.push("<span class='top-name'>");
            html.push(role[0]);
            html.push("</span>");
            html.push("<span class='top-sc'>");
            html.push(role[1]);
            html.push("</span>");
            html.push("</div>")
        }
        this.container.html(html.join(""));
    },
    show: function () {
        if (!this.selectedItem) this.selectedItem = this.footers[0];
        this.load_stats();
        if (!this.element) {

            this.element = $("<div class='stats-container'><div class='stats-container-left'></div></div>");

            this.container = $("<div class='dialog-stats'></div>").appendTo(this.element);
            this.left_silder = this.element.find('.stats-container-left');
            this.create_silder(this.selectedItem.silder);
        }
        if (this.isShow) return;
        this.create_footer();
        Dialog.icon("stats");
        Dialog.title(this.selectedItem.name);

        Dialog.contentElement.empty().append(this.element);
        this.element.on("click", ".top-item", this.itemClick);
        this.left_silder.on("click", ".stats-silder ", this.silderClick);
        this.isShow = true;
    }, load_stats: function () {
        let type = this.selectedItem.cmd;
        let fam = this.selectedItem.selected_silder;
        //if (this.ban_silder[fam]) fam = "";
        let data = this["last_" + type + fam];
        if (data && data.time > Date.now()) {
            let dt = new Date(data.time);
            let str = "";
            if (data.score) str = "你目前的评分：" + data.score;
            else str = "上次更新：" + dt.getHours() + ":" + dt.getMinutes();
            this.show_desc(str);
            return this.create_other(data.items, type);
        }
        let str = "stats " + type;
        if (fam) str = str + " " + fam;
        SendCommand(str);
    }, create_footer: function () {
        var html = [];
        for (var i = 0; i < this.footers.length; i++) {
            var foot = this.footers[i];
            html.push("<span class='footer-item" + (foot == this.selectedItem ? " select" : "") + "' for='" + i + "''>"
                + foot.name + "</span>");
        }
        html.push("<span class='stats-span'></span>");
        Dialog.footer(html.join(""));
    }, show_desc: function (msg) {
        Dialog.footerElement.find(".stats-span").html(msg);
    },
    footerChanged: function (index) {
        var item = this.footers[index];
        if (item == this.selectedItem) return;
        this.selectedItem = item;
        Dialog.title(this.selectedItem.name);
        this.create_silder(this.selectedItem.silder);
        this.load_stats();


    },
    itemClick: function () {
        var elem = $(this);
        var index = parseInt(elem.attr("top"));
        var type = Dialog.stats.selectedItem.cmd;

        var html = ["<div class='item-commands'>"];
        var stype = Dialog.stats.selectedItem.selected_silder;
        if (type === 'top') {
            html.push('<span cmd="stats ' + type + ' ' + stype + " " + index + '">查看</span>');
            if (!Dialog.stats.top || index < Dialog.stats.top) {
                html.push('<span cmd="biwu ' + stype + " " + index + '">挑战</span>');
            }
            html.push('<span cmd="reward top ' + index + '">查看规则和奖励</span>');
        } else {
            html.push('<span cmd="stats ' + type + ' ' + stype + " " + index + '">查看</span>');
            html.push('<span cmd="reward ' + type + " " + index + '">查看奖励</span>');
        }
        html.push("</div>");
        Dialog.stats.element.find(".item-commands").remove();
        $(html.join("")).insertAfter(elem);
    }
};

const stats_css = `

.stats-container {
    display: flex;
    flex-direction: row;
    height: 25em;
    margin-top: 0.5em;
}

.stats-container>.stats-container-left {
    overflow-y: auto;
}

.stats-container-left>.stats-silder {
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

.stats-container-left>.select {
    background-color: #222;
    color: #00ff00;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: #00ff00;
}

.dialog-stats {
    flex: 1;
    overflow: auto;
}

.dialog-stats>.top-item {
    white-space: nowrap;
    line-height: 2em;
    padding-left: .5em;
    border-radius: 4px;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
    color: inherit;
}

.dialog-stats>.top-item>.top-title {
    display: inline-block;
    font-weight: bold;
    height: 1.875em;
    line-height: 1.875em;
    padding-left: 1em;
    margin-right: 1em;
}

.dialog-stats>.top-item>.top-sc {
    float: right;
    margin-right: 1em;
    line-height: 1.875em;
    font-weight: bold;
    font-style: italic;
}



.dialog-stats>.top1>.top-sc {
    color: #FFA500;
}

.dialog-stats>.top2>.top-sc {
    color: #912CEE;
}

.dialog-stats>.top3>.top-sc {
    color: #FFD700;
}

.dialog-stats>.top-item>.top-name {
    height: 1.875em;
    line-height: 1.875em;
}

.dialog-stats>.top-item>.item-commands {
    padding-left: 3.125em;
}

.stats-span {
    float: right;
    padding-right: 10px;
    color: #C0C0C0;
    line-height: 2.5em;
}
`;
