import { SKILL } from "../../../os/skill/skill.js";

export default function() {
    const FAMILIES = globalThis.FAMILIES; const WEAPON_TYPE = globalThis.WEAPON_TYPE;
this.inherits(SKILL);
this.name = "太祖长拳";
this.id = "taizuchangquan";
this.grade = 1;

this.is_public = true;
this.family = FAMILIES.GAIBANG;
this.attack_actions = [
    "只见$N身形一矮，大喝声中一个『冲天炮』对准$n的鼻子呼地砸了过去",
    "$N左手一分，右拳运气，一招『拔草寻蛇』便往$n的$l招呼过去",
    "$N右拳在$n面门一晃，左掌使了个『叶底偷桃』往$n的$l狠命一抓",
    "$N步履一沉，左拳拉开，右拳带风，一招『黑虎掏心』势不可挡地击向$n$l",
    "只见$N拉开架式，一招『双风贯耳』使得虎虎有风。底下却飞起一脚踢向$n$l",
    "$N打得兴起，大喝一声：看我这招『龙虎相交』！ \n左手往$n身后一抄，右拳便往$n面门砸了过去",
    "$N拉开后弓步，双掌使了个『如封似闭』往$n的$l一推",
    "只见$N运足气力，一连三拳击向$n$l，力道一拳高过一拳！ \n这一招的名字还相当高雅，叫作『阳关三叠』",
    "$N往后一纵，就势使了个『老树盘根』，右腿扫向$n的$l",
    "$N一个转身，左掌护胸，右掌反手使了个『独劈华山』往$n当头一劈",
    "$N一招『双抄封天』，下半身右脚撇步上前，双手化掌，向前双抄上击$n的$l",
    "$N身体向前冲出，一式『冲步双掌』，双手先抱回腰际後，再向前以双撑掌直推而出",
    "$N全身原步右转，右手向右刁出，左手顺势护肩，『回首双刁』抓向$n的$l",
    "$N提起左腿，伸直右腿成独立步站定，『魁星踢斗』左腿顺势向前直蹬而出",
    "$N一招『进步冲捶』，上右步至左脚旁，双手以双冲拳向$n直击而出",
    "$N出一式『弓步冲打』，左脚向左跨出，身体尽量压低，拉回左手，右拳向前直击而出",
    "$N一式『拍案齐掌』，全身微向下坐，产生後拉之势，收左手，右手化掌向前直压而出",
    "$N保持原弓箭步站定不动，『燕子抄水』右掌原地翻掌，左手以反掌由右掌上方直穿而出",
    "$N出『扭步断肘』，右步跟前，成玉环步蹲定，顺势收回左手，右手向前以平肘直扣而出",
    "$N步法先右後左，连续上步，一式『双采冲捶』右拳向$n的$l直击而出",
    "$N拉回右手，左手化拳向前直击而出，同时『左冲右踢』右腿向前平踢而出",
    "$N右脚向前落步，成马步坐定，『马式挑打』在左手收回腰际，右拳向右直击而出",
    "$N一式『英雄独立』，右拳原地翻掌，左掌化刁手斜刁身后，全式一气呵成，瞬间完成",
    "$N一招『猛虎伏案』，右腿向前直铲而出，成伏虎步坐定，双手以反刁手刁定$n",
    "$N一招『魁星独立』伸直右腿，将重心坐於左脚上，随著拔起之势，右掌向$n直挑而出",
    "$N原势不动，一招『窜步偷心』快速窜前，提起右腿向前快踢，同时左掌向前平推而出",
    "$N向前一招『双龙探爪』，双手变掌为爪，先右後左，连续向$n的$l击出",
    "$N向前一窜，『猛虎出洞』将左刁手向後回勾，与右刁手同置身后再刁撇而出"
];
this.desc = "相传为宋太祖赵匡胤所创，以攻击迅猛直来直去为其特征，在江湖中颇有声誉";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["unarmed"];
this.learn_condition = {
    max_mp: 200,
    skill: {
        unarmed: 100
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: lv * 1 + 20
        }
    };
}
this.slots = [
    {
        prop: "tzcq_sh",
        value: lv => lv / 100,
        format: (val) => {
            return "太祖八式的伤害增加" + val + "%";
        }
    }, {
        prop: "tzcq_rt",
        value: lv => 25,
        format: (val) => {
            return "太祖八式的释放时间减少" + val + "%";
        }
    }
];
this.pfm = {
    zhen:
    {
        name: "太祖八式",
        distime: 16000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 20,
        release_time: 8000,
        use: function (me, target, lv) {

            me.send_room("<hiy>只见$N跨立马步，稳定下盘，双拳有章有法的依次击向$n全身各处。</hiy>", target);
            target = null;
            var count = 0;
            var txt = ["一", "二", "三", "四", "五", "六", "七", "八"];

            let gj = me.gj + me.gj * me.query_prop('tzcq_sh') / 100;
            var time = this.query_releasetime(me, lv);
            time -= time * me.query_prop('tzcq_rt') / 100;
            if (time > 80) {
                me.is_rash = time;
                me.call_interval(
                    function () {
                        if (!me.is_fighting()) return false;
                        target = me.query_enemy();
                        me.do_attack({
                            target: target,
                            gj: gj,
                            mz: me.mz,
                            attack_before: "<hiy>第" + txt[count] + "式</hiy>\n",
                            no_weapon: true
                        });
                        count++;
                        if (!me.end_attack(target)) {
                            return false;
                        }
                    },
                    time / 8,
                    8,
                    function () {
                        me.is_rash = 0;
                    }
                );
            } else {
                target = me.query_enemy();
                for (let i = 0; i < 8; i++) {
                    me.do_attack({
                        target: target,
                        gj: gj,
                        mz: me.mz,
                        attack_before: "<hiy>第" + txt[i] + "式</hiy>\n",
                        no_weapon: true
                    });
                }
                me.end_attack(target);
            }



        },
        query_desc: function (me, lv) {
            var t = this.query_releasetime(me, lv);
            return "跨立马步，稳定下盘，放弃防御专注进攻，" + Math.floor(t / 100) / 10 + "秒内快速出拳8次，攻击期间你无法躲闪";
        }
    }
};
}
