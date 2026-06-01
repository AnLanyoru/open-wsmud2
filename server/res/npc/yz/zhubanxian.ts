import { NPC } from "../../../core/char/npc.js";
import { WORLD } from "../../../core/world.js";
import { UTIL } from "../../../core/util/util.js";
import { USERTASK } from "../../../core/task/playertask.js";
import { COMMAND } from "../../../core/command.js";

export default class extends NPC {
    name = "金古易";
    desc = "当代武林泰斗金古易，有时候猛的一看，你还以为是三个人。";
    title = "<hic>武林泰斗</hic>";
    max_hp = 8000000;
    hp = 8000000;
    max_mp = 1000000;
    str = 22;
    con = 22;
    age = 71;
    dex = 22;
    int = 22;
    per = 55;
    gender = 1;
    level = 4;
    pfm_rate = 1;
    no_refresh = true;
    prop = {
    gjsd: 1500,
    add_sh_per: 90,
    diff_sh_per: 135,
    diff_downside_per: 50,
    mz: 20000,
    ds: 20000
};

    constructor() {
        super();
        this.skill_map(
            ["dodge", 3000],
            ["parry", 3000],
            ["force", 3000],
            ["unarmed", 3000],
            ["sword", 3000],
            ["literate", 3000],
            ["yijinjing", 3000, "force"],
            ["yitianjianfa", 3000, "sword"],
            ["lingboweibu", 3000, "dodge"],
            ["taijiquan", 3000, "parry"],
            ["jiuyinbaiguzhao", 3000, "unarmed"]);
        this.add_action("levelup", "提升境界", testLevel);
    }

    on_kill(me) {
    return me.notify_fail('金古易拍了拍你的脑袋。');
}
    tellResult(me) {
    if (me.query_status("force")) {
        return me.notify("金古易摇了摇头对你说道：你目前有内功附加的状态，老头子我实在看不出来" + me.call() + "的境界几何。");
    }
    if (me.level == 0) {
        var check = {};
        for (var sk in me.skills) {
            var item = me.skills[sk];
            if (item.level >= 100) {
                check[sk] = true;
            }
            if (item.enable_skill) {
                check["hassp"] = true;
            }
        }
        if (check["force"] && check["unarmed"] && check["parry"] && check["dodge"] && check["hassp"]
            && me.max_mp >= 1000) {

            me.notify("金古易对你说道：恭喜" + me.call() + "，你已经踏入武士境界，习武之路你才刚起步，努力修炼吧！");
            me.level_up();
            this.send_master(me);
        } else {

            me.notify("金古易对你说道：这位" + me.call() + "，等你把基本内功，基本拳脚，基本招架，基本轻功练到100级，至少装备一种特殊技能，内力到1000就可以提升到武士境界了。");

        }
    } else if (me.level == 1) {
        var check = {};
        for (var sk in me.skills) {
            var item = me.skills[sk];
            if (item.enable_skill && item.level >= 300 && me.skills[item.enable_skill].level >= 300) {
                check[sk] = true;
            }
        }
        if (check["force"] && check["unarmed"] && (check["sword"] || check["blade"] || check["club"] || check["whip"] || check["staff"]) && check["parry"] && check["dodge"]
            && me.max_mp >= 10000) {

            me.notify("金古易对你说道：恭喜" + me.call() + "，你已经踏入武师境界，习武之路荆棘满地，唯有坚持努力方能使你踏上成功之路！");
            me.level_up();
            this.send_master(me);

        } else {

            me.notify("金古易对你说道：这位" + me.call() + "，等你特殊内功，特殊轻功，特殊招架，特殊拳脚，和任意一种特殊武器技能练到300级，内力到10000就可以提升到武师境界了。");

        }
    } else if (me.level == 2) {
        var check = {};
        for (var sk in me.skills) {
            var item = me.skills[sk];
            if (item.enable_skill && item.level >= 800 && me.skills[item.enable_skill].level >= 800) {
                check[sk] = true;
            }
        }
        if (check["force"] && check["unarmed"] && (check["sword"] || check["blade"] || check["club"] || check["whip"] || check["staff"]) && check["parry"] && check["dodge"]
            && me.max_mp >= 100000) {
            if (me.query_temp("rdem")) {
                me.notify("金古易对你说道：恭喜" + me.call() + "成为一代宗师，但要切记，习武之路荆棘满地，唯有戒骄戒躁继续努力方能更进一步！");
                this.do_command("chat", "哈哈，不错，不错，恭喜" + me.name + "成为一代宗师！");

                USERTASK.GET('yamen').on_finish(me);
                USERTASK.GET('sm').on_finish(me);

                me.level_up();
                me.commands_json = null;
                this.send_master(me);
                if (me.query_temp('sr', 0) === 1 && !WORLD.DATA.query_temp('first_sr')) {
                    me.notify("<hig>你获得称号【武馆馆主】。</hig>");
                    me.add_title('武馆馆主', 'sr');
                    WORLD.DATA.set_temp('first_sr', 1);
                }
            } else {
                me.notify("金古易对你说道：这位" + me.call() + "，你只需打通任督二脉就可以提升到宗师境界了。");
            }


        } else {
            me.notify("金古易对你说道：这位" + me.call() + "，等你特殊内功，特殊轻功，特殊招架，特殊拳脚，和任意一种特殊武器技能练到800级，内力到100000，打通任督二脉就可以提升到宗师境界了。");

        }
    } else if (me.level == 3) {
        var check = {};
        for (var sk in me.skills) {
            var item = me.skills[sk];
            if (item.enable_skill && item.level >= 1500 && me.skills[item.enable_skill].level >= 1500) {
                check[sk] = true;
            }
        }
        if (check["force"] && check["unarmed"] && (check["sword"] || check["blade"] || check["club"] || check["whip"] || check["staff"]) && check["parry"] && check["dodge"]
            && me.max_mp >= 500000) {
            if (me.query_temp("shjd") == 3) {
                me.notify("金古易对你抱拳道：恭喜" + me.call() + "更进一步踏入武圣境界，望" + me.call() + "能百尺杆头更进一步！");
                this.do_command("chat", "哈哈哈，圣君出世，武林之福，恭贺新晋武圣" + me.name + "！");
                me.level_up();
            } else {
                me.notify("金古易对你说道：这位" + me.call() + "，你只需练成三花聚顶就可以提升到武圣境界了。");
            }


        } else {

            me.notify("金古易对你说道：这位" + me.call() + "，等你特殊内功，特殊轻功，特殊招架，特殊拳脚，和任意一种特殊武器技能练到1500级，内力到500000，打通三花聚顶就可以提升到武圣境界了。");

        }
    } else {
        me.notify("金古易对你说道：这位圣君，老头子才疏学浅，没办法再继续指点你了。");
    }

}
    send_master(me) {
    if (me.level <= 1) return;
    var shifu = me.query_temp("shifu");
    if (!shifu) return;
    if (me.level > 3) return;


    var name = ["武士", "武师", "宗师"][me.level - 1];
    var str = "你的弟子成功进阶到" + name + "，这是给予你的奖励。";
    var atts = [
        {
            obj: "cash/box#" + (me.level - 1),
            count: 1
        }
    ];

    if (me.level == 3) {
        str = "你的弟子成功进阶到" + name + "，师徒关系自动解除，这是给予你的奖励。";
        me.remove_temp("shifu");
        me.remove_temp("shifu_n");
        me.set_temp("st_leave", 1, UTIL.diff_week_time());
        atts.push(
            {
                obj: "sp/tool/shitu#" + me.id,
                count: 1
            });
        var user = WORLD.getUser(shifu);
        if (user) {
            user.remove_temp("tudi");
            user.remove_temp("tudi_n");
            user.set_temp("st_leave", 1, 3600000 * 24 * 7);
        }
    }
    COMMAND.DO("send", shifu, {
        content: str,
        attach: atts
    });


}
    on_die() {
    this.call_out(this.relive, 10000);
}
}

function testLevel(me) {

    me.send_room("$N向$n恭敬的问道：敢问老先生，" + me.callme() + "武功境界如何？\n", this);



    if (me.level == 4) {
        return checkWS(me);

    } else if (me.level == 5) {
        return me.notify("金古易对你恭敬一揖：老朽金古易，拜见" + me.name + "帝君！");
    }
    this.tellResult(me);
}
function checkWS(me) {
    if (me.query_temp("wd")) {

        return me.notify("金古易对你说道：武道塔的守门人，连我都看不出他的境界，他肯定知道些什么。");
    }

    var check = {};
    for (var sk in me.skills) {
        var item = me.skills[sk];
        if (item.enable_skill && item.level >= 2200 &&
            me.skills[item.enable_skill].level >= 2200) {
            check[sk] = true;
        }
    }

    if (check["force"] && check["unarmed"] && (check["sword"] || check["blade"] || check["club"] || check["whip"] || check["staff"]) && check["parry"] && check["dodge"]
        && me.max_mp >= 1200000) {
        me.set_temp("wd", 1);


        me.notify("金古易对你哈哈一笑道：这位" + me.call() + "，你我同为圣君，指点可不敢当！\n顿了顿，金古易又对你说道：你可以去试着寻找武道塔的守门人，或许他可以指点你。");
    } else {
        me.notify("金古易对你哈哈一笑道：这位" + me.call() + "，你我同为圣君，指点可不敢当！\n顿了顿，金古易又对你说道：传说中武圣之上还有帝君，只是中原武林传承断裂，日渐式微，如何成就帝君就恕老朽孤陋寡闻了。");
    }

}
