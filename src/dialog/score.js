

export default {
    footer: [["属性", null],
    ["详细", null], ["称号", null]],

    selectIndex: 0,
    onData: function (data) {
        console.log(data);
        this.data = data;
        this.init_elem();
        Dialog.titleElement.html(data.name);
        Dialog.icon("user");
        if (data.titles) {
            this.titles = data.titles;
            this.create_titles();
        } else {
            if (data.id && data.id != this.uid) {
                this.uid = data.id;
                if (this.uid != Process.player) {
                    Dialog.footerElement.find(".footer-item:eq(2)").hide();
                } else {
                    Dialog.footerElement.find(".footer-item:eq(2)").show();
                }
            }
            var panel = $(data.name ? this.footer[0][1] : this.footer[1][1]);
            var elems = panel.find("span");
            for (var i = 0; i < elems.length; i++) {
                var elem = $(elems[i]);
                var prop = elem.attr("data-prop");
                if (prop) {
                    elem.html(data[prop] || 0);
                }
            }
        }
    },
    init: function () {
        this.footer[0][1] = $(this.template_score);
        this.footer[1][1] = $(this.template_score2);
        this.footer[2][1] = $(this.template_title);
        Dialog.injectStyle(this.css);
    },
    init_elem: function () {
        Dialog.init();
        Dialog.curItem = "score";
        if (this.isShow) return;
        Dialog.footer("");

        for (var i = 0; i < this.footer.length; i++) {
            $("<span class='footer-item " + (this.selectIndex == i ? "select" : "") + "' for='" + i + "'>"
                + this.footer[i][0] + "</span>").appendTo(Dialog.footerElement);
        }
        this.isShow = true;
        this.footerChanged(this.selectIndex);

    },
    show: function (nosend) {
        if (nosend) return;
        if (!this.selectIndex) SendCommand("score");
        else if (this.selectIndex == 1) SendCommand("score2");
        else SendCommand("score title");
        this.init_elem();
    },
    close: function () {
        this.footer[this.selectIndex][1].remove();
        Dialog.footer("");
        this.isShow = false;
    },
    footerChanged: function (item) {
        item = parseInt(item);
        this.footer[this.selectIndex][1].remove();
        this.selectIndex = item;

        var panel = $(this.footer[this.selectIndex][1]).appendTo(Dialog.contentElement.empty());
        if (item == 1) {
            if (this.uid && Process.player != this.uid)
                SendCommand("score2 " + this.uid);
            else
                SendCommand("score2");
        }
        else if (item == 2) {
            if (!this.titles)
                SendCommand("score title");
            panel.on("click", ".btn-noused", function (e) {
                var elem = $(e.target);
                if (elem.is("red")) elem = elem.parent();
                var index = parseInt(elem.attr("index"));
                for (var i = 0; i < this.titles.length; i++) {
                    if (i == index) this.titles[i].use = this.titles[i].use ? false : true;
                    else this.titles[i].use = false;
                }
                SendCommand("title " + index);
                this.create_titles();
            }.bind(this));
        }
    },

    create_titles: function () {
        var panel = $(".dialog-titles");
        var html = [];
        for (var i = 0; i < this.titles.length; i++) {
            html.push("<div class='title-item", this.titles[i].use ? " selected" : "", "'>");
            html.push(this.titles[i].title);
            html.push("<span class='btn-noused' index='");
            html.push(i);
            html.push("'>");
            html.push(this.titles[i].use ? "<red>取消</red>" : "使用");
            html.push("</span>");

            html.push("</div>");
        }
        panel.html(html.length ? html.join("") : "<div class='empty'>你还没有获得任何称号</div>");
    },


    template_score: `
<div class="dialog-score" cellpadding="0" cellspacing="1">
            <div class="score-section">
                <span class="title">
                    <hic>【性别】</hic>
                </span><span data-prop="gender" class="value"></span>
                <span class="title">
                    <hic>【等级】</hic>
                </span><span data-prop="level" class="value"></span><br />
                <span class="title">
                    <hic>【年龄】</hic>
                </span><span data-prop="age" style="width:10em;" class="value">14</span><br />
                <span class="title">
                    <hic>【经验】</hic>
                </span>
                <hic><span data-prop="exp" class="value">0</span></hic>
                <span class="title">
                    <hic>【潜能】</hic>
                </span>
                <hic><span data-prop="pot" class="value">0</span></hic>
            </div>
            <div class="score-section">
                <div><span class="title">
                        <hig>【气血】</hig>
                    </span>
                    <hig><span data-prop="hp" class="value"
                            style="text-align:right">0</span><span>&nbsp;/&nbsp;</span><span class="value"
                            data-prop="max_hp">0</span></hig>
                </div>
                <div><span class="title">
                        <hig>【内力】</hig>
                    </span>
                    <hig><span data-prop="mp" class="value"
                            style="text-align:right">0</span><span>&nbsp;/&nbsp;</span><span class="value"
                            data-prop="max_mp">0</span></hig>
                </div>
                <span class="title" style="width:6em;">
                    <hic>【内力上限】</hic>
                </span>
                <hic><span data-prop="limit_mp" class="value">0</span></hic><br />
                <span class="title" style="width:6em;">
                    <hic>【精力】</hic>
                </span>
                <hic><span data-prop="jingli" class="value">0</span></hic>
            </div>
            <div class="score-section">
                <span class="title">
                    <hiy>【臂力】</hiy>
                </span><span class="value">
                    <hiy><span data-prop="str">0</span></hiy>
                    <NOR> (+<span data-prop="str_add">0</span>)</NOR>
                </span>
                <span class="title">
                    <hiy>【根骨】</hiy>
                </span><span class="value">
                    <hiy><span data-prop="con">0</span></hiy>
                    <NOR>(+<span data-prop="con_add">0</span>)</NOR>
                </span><br />
                <span class="title">
                    <hiy>【身法】</hiy>
                </span><span class="value">
                    <hiy><span data-prop="dex">0</span></hiy>
                    <NOR>(+<span data-prop="dex_add">0</span>)</NOR>
                </span>
                <span class="title">
                    <hiy>【悟性】</hiy>
                </span><span class="value">
                    <hiy><span data-prop="int">0</span></hiy>
                    <NOR>(+<span data-prop="int_add">0</span>)</NOR>
                </span><br />
                <span class="title">
                    <hiy>【容貌】</hiy>
                </span><span class="value">
                    <hiy><span data-prop="per">0</span></hiy>
                </span>
            </div>
            <div class="score-section">
                <span class="title">
                    <hic>【攻击】</hic>
                </span>
                <hic><span data-prop="gj" class="value">0</span></hic>
                <span class="title">
                    <hic>【防御】</hic>
                </span>
                <hic><span data-prop="fy" class="value">0</span></hic><br />
                <span class="title">
                    <hic>【命中】</hic>
                </span>
                <hic><span data-prop="mz" class="value">0</span></hic>
                <span class="title">
                    <hic>【躲闪】</hic>
                </span>
                <hic><span data-prop="ds" class="value">0</span></hic><br />
                <span class="title">
                    <hic>【招架】</hic>
                </span>
                <hic><span data-prop="zj" class="value">0</span></hic>
                <span class="title">
                    <hic>【暴击】</hic>
                </span>
                <hic><span data-prop="bj" class="value">0</span></hic><br />
                <span class="title" style="width:6em;">
                    <hic>【攻击速度】</hic>
                </span>
                <hic><span data-prop="gjsd" class="value">0</span></hic>
            </div>
            <div class="score-section">
                <span class="title">
                    <hic>【门派】</hic>
                </span>
                <hic><span data-prop="family" class="value">无门无派</span></hic><br />
                <span class="title">
                    <hic>【师傅】</hic>
                </span>
                <hic><span data-prop="master" class="value">无</span></hic><br />
                <span class="title">
                    <hic>【功绩】</hic>
                </span>
                <hic><span data-prop="gongji" class="value">0</span></hic><br />
            </div>
        </div>`,
    template_score2: `     <div class="dialog-score2">
            <span class="title">
                <hic>【最终伤害】</hic>
            </span>
            <hic>
                <span data-prop="add_sh" class="value">0</span>
            </hic>
            <br />
            <span class="title">
                <hic>【忽视防御】</hic>
            </span>
            <hic>
                <span data-prop="diff_fy" class="value">0</span>
            </hic><br />

            <span class="title">
                <hic>【暴击伤害】</hic>
            </span>
            <hic>
                <span data-prop="add_bj" class="value">0</span>
            </hic>
            <br />

            <span class="title">
                <hic>【伤害减免】</hic>
            </span>
            <hic>
                <span data-prop="diff_sh" class="value">0</span>
            </hic>
            <br />
            <span class="title">
                <hic>【暴击抵抗】</hic>
            </span>
            <hic>
                <span data-prop="diff_bj" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【释放时间减少】</hic>
            </span>
            <hic>
                <span data-prop="releasetime" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【忙乱时间】</hic>
            </span>
            <hic>
                <span data-prop="busy" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【忽视忙乱】</hic>
            </span>
            <hic>
                <span data-prop="diff_busy" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【冷却时间减少】</hic>
            </span>
            <hic>
                <span data-prop="distime" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【内力消耗减少】</hic>
            </span>
            <hic>
                <span data-prop="expend_mp" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【负面抵抗】</hic>
            </span>
            <hic>
                <span data-prop="downside_per" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【打坐效率】</hic>
            </span>
            <hic>
                <span data-prop="dazuo_per" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【学习效率】</hic>
            </span>
            <hic>
                <span data-prop="study_per" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【练习效率】</hic>
            </span>
            <hic>
                <span data-prop="lianxi_per" class="value">0</span>
            </hic>
        </div>`,
    template_title: `      <div class="dialog-titles">
        </div>
`,


};
