import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";

export default class extends SKILL {
    name = "杀生决";
    id = "shashengjue";
    grade = 3;
    force_rad = 0.55;
    family = FAMILIES.SHASHOU;
    desc = "杀手楼的高级内功";
    can_enables = ["force"];
    learn_condition = {
    skill: {
        force: 300
    }
};
    pfm = {


    power:
    {
        name: "斩杀",
        distime: 30000,
        enable_skill: "force",
        mp: 20,
        release_time: 0,
        use: function (me, target, lv) {

            var time = 10000 + lv * 5;
            if (time > 20000) time = 20000;
            var gj = 10 + parseInt(lv / 100);
            me.send_room("<hir>$N默运杀生决，全身黑气笼罩，仅剩双眼一片血红，有如杀神降世！\n</hir>", target);
            me.add_status({
                id: "force",
                name: "杀神",
                desc: "你的攻击增加",
                duration: time,
                prop: {
                    gj_per: gj
                }
            });
        },
        query_desc: function (me, lv) {
            var gj = 10 + parseInt(lv / 100);

            var time = 10000 + lv * 5;
            if (time > 20000) time = 20000;
            return "全力战斗，" + (time / 1000) + "秒内增加自己" + gj + "%攻击力";
        }
    }, tuoli: {
        name: "隐杀",
        distime: 45000,
        enable_skill: "force",
        mp: 0,
        release_time: 0,
        no_auto: true,
        allow_busy: true,
        use: function (me, target, lv) {


            if (me.is_rash) return me.notify('你现在无法使用轻功身法。');
            if (!me.environment.exits)
                return me.notify('这里无法逃脱。');
            var list = Object.keys(me.environment.exits);
            // for (var dir in me.environment.exits) {
            //     list.push(dir);
            // }
            if (!list.length) return me.notify('这里无法逃脱。');
            let func = YS_ROOMS[me.environment.path];

            if (func && func(me, list) === false) return;

            me.send_room("\n<blk>$N的身形一闪，渐渐模糊不见了。<blk>\n");
            me.end_fight();
            me.do_command("go", list.random());
            // if (!me.is_in("yz/leitai/leitai") && !me.is_in("yz/leitai/biwu")) {
            //     me.end_fight();
            // }

        },
        query_desc: function (me, lv) {
            var gj = 10 + parseInt(lv / 300);
            var nl = 3000 + lv * 4;
            if (nl > 15000) nl = 15000;
            return "脱离战斗，迅速隐入其他房间";
        }
    }
};

    query_enable_prop(lv) {
    return {
        force: {
            gj: lv * 1.5 + 2,
            bj_per: parseInt(lv / 300) + 1,
            limit_mp: lv * 105,
            desc: "唯一：将你内力的55%转化为气血"
        }
    };
}
}

const YS_ROOMS = {
    "yz/leitai/leitai": function (me) {
        me.send_room("\n<blk>$N的身形一闪，渐渐模糊不见了。<blk>\n");
    },
    'wudao/ta': function (me, list) {
        let lv = me.query_temp('wd_level', 0);
        if (lv >= 89) {
            list.length = 1;
            list[0] = 'out';
        }
    }
};
