import { SKILL } from "../../../os/skill/skill.js";

export default class extends SKILL {
    name = "天长掌法";
    id = "tianchangzhang";
    grade = 3;
    attack_actions = [
    "$N使一招<GRN>「青山隐隐」</GRN>，双手划了个半圈，按向$n的$l",
    "$N使一招<MAG>「云霞出海」</MAG>，左手轻轻一挥，劈向$n的$l",
    "$N右手掌心向外，由右向左，使一招<CYN>「星河鹭起」</CYN>，向$n的$l打去",
    "$N使一招<HIM>「彩舟云淡」</HIM>，分击$n的胸口和$l",
    "$N使一招<HIB>「月照幽林」</HIB>，左右掌同时击出，在空中突然左右掌方向互变",
    "$N左手不住晃动，右掌一招<HIW>「白日参辰」</HIW>，向$n的$l打去",
    "$N左手变掌为啄，右掌立掌如刀，一招<HIY>「鹤舞白沙」</HIY>，劈向$n的$l",
    "$N左脚退后半步，右掌使一招<HIC>「水天一色」</HIC>，横挥向$n",
    "$N一招<CYN>「月华流照」</CYN>，左掌先发而后至，右掌后发而先至",
    "$N双掌缩入袖中，双袖飞起扫向$n的$l，却是一招<HIR>「嫦娥奔月」</HIR>，仪态潇洒",
];
    desc = "恒山派绝学掌法";
    can_enables = ["unarmed"];
    learn_condition = {
    max_mp: 10000,
    skill: {
        unarmed: 450
    }
};
    slots = [
    {
        prop: 'str',
        value: (lv) => 1 + Math.floor(lv / 10),
        format: (val) => {
            return '臂力：+' + val;
        }
    },
    {
        prop: 'tcz_sh',
        value: (lv) => 1 + Math.floor(lv / 20),
        format: (val) => {
            return '天长叠掌附加的伤害增加' + val + "%";
        }
    },
];
    pfm = {
    chan:
    {
        name: "天长叠掌",
        distime: 20000,
        enable_skill: "unarmed",
        mp: 20,
        use: function (me, target, lv) {
            var per = 100 + parseInt(lv / 5) + me.query_prop('tcz_sh');
            var per2 = 100 + parseInt(lv / 50);

            me.do_attack({
                target: target,
                gj: me.gj * per / 100,
                mz: me.mz * per2 / 100,
                attack_msg: "<hic>$N施展天长叠掌，左右双掌忽前忽后，掌影重重向$n拍去</hic>",
                no_weapon: true
            });
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 100 + parseInt(lv / 5);
            return "攻击敌人造成" + per + "%的伤害，等级越高命中越高";
        }
    }
};

    query_enable_prop(lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.2) + 20,
            fy: parseInt(lv * 1.3) + 20,
            max_hp: lv * 10
        }
    };
}
}
