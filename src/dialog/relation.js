

function format_time_span(time) {
    let diff = Math.floor(time / 1000);
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
    init: function () { },
    createElement: function () {
        return $('<div class="dialog-relation"></div>');
    },
    inner_show: function () {
        SendCommand("relation");
        this.isShow = true;
        Dialog.title("关系");
        Dialog.icon("heart");
    },
    onData: function (data) {
        var str = [];
        str.push("<div class='relation-item'>");
        str.push("<div class='relation-desc'>");
        if (data.husband) {
            str.push("你的丈夫：");
            str.push(data.husband);
        } else if (data.wife) {
            str.push("你的妻子：");
            str.push(data.wife);
        } else {
            str.push("你目前没有结婚。");
        }
        str.push("</div>");
        if (data.wife || data.husband) {
            str.push("<div class='relation-cmd' cmd='_confirm greet wife'><him>❀送花❀</him></div>");
            str.push("<div class='relation-cmd' cmd='rel marry'>解除关系</div>");
        }
        str.push("</div>");

        str.push("<div class='relation-item'>");
        str.push("<div class='relation-desc'>");
        if (data.shifu) {
            str.push("你的师父：");
            str.push(data.shifu);
        } else if (data.tudi) {
            str.push("你的徒弟：");
            str.push(data.tudi);

        } else {
            str.push("你目前没有拜师，也没有收徒。");
        }
        str.push("</div>");
        if (data.shifu) {
            str.push("<div class='relation-cmd' cmd='greet master'><hig>请安</hig></div>");
            str.push("<div class='relation-cmd' cmd='rel st'>出师</div>");

            str.push("</div>");
        } else if (data.tid) {
            str.push("<div class='relation-cmd' cmd='rel st'>解除关系</div>");
        }
        str.push("</div>");

        if (data.st != undefined) {
            str.push("<div class='relation-item'><div class='relation-desc'>");
            str.push("当师徒组队完成副本后将获得额外奖励，本周已完成" + data.st + "/10。", '</div>');
            str.push("<div class='relation-cmd' cmd='team add ",
                data.tid ?? data.shifu, "'>邀请组队</div>");
            str.push("</div>");
        }
        if (data.reward) {
            str.push("<div class='relation-item'>");
            str.push(data.reward)
            str.push("</div>");
        }
        str.push("</div>");
        if (data.fls) {
            for (let item of data.fls) {
                if (!item) continue;
                str.push("<div class='relation-item'>");
                str.push("<div class='relation-desc'>你的家人：", item[0]);
                if (item[2]) {
                    str.push('，已', item[2], format_time_span(item[3]));
                    str.push('</div>');
                    str.push("<div class='relation-cmd' cmd='rel ", item[1], " stop'>停止</div>");
                } else {
                    str.push('空闲中</div>');
                    str.push("<div class='relation-cmd' cmd='rel ", item[1], " caiyao'><hic>采药</hic></div>");
                    str.push("<div class='relation-cmd' cmd='rel ", item[1], " diaoyu'><hic>钓鱼</hic></div>");
                    str.push("<div class='relation-cmd' cmd='rel ", item[1], " wk'><hic>挖矿</hic></div>");
                }
                str.push("</div>");
            }
        }
        this.element.html(str.join(""));
    },
    inner_close: function () {
        this.element.remove();
        this.isShow = false;
    }
};
