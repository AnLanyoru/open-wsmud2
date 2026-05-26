this.inherits(SKILL);
this.name = "胡家刀法";
this.id = "hujiadaofa";
this.grade = 2;

this.attack_actions = [
    "$N手中$w横推，一招<HIM>「推波助澜」</HIM>，由上至下向$nl砍去",
    "$N一招<HIC>「沙鸥掠波」</HIC>，刀锋自下而上划了个半弧，$w一提一收，平刃挥向$n的颈部",
    "$N使出一招<HIB>「天设牢笼」</HIB>，将$w舞得如白雾一般压向$n",
    "$N一招<HIG>「闭门铁扇」</HIG>，$w缓缓的斜着向$n推去",
    "$N手拖$w，转身跃起，一招<RED>「翼德闯帐」</RED>，一道白光射向$n的胸口",
    "$N挥舞$w，使出一招<HIW>「白鹤舒翅」</HIW>，上劈下撩，左挡右开，齐齐罩向$n",
    "$N一招<GRN>「春风送暖」</GRN>，左脚跃步落地，$w顺势往前，挟风声劈向$n的$l",
    "$N募的使一招<HIM>「八方藏刀」</HIM>，顿时剑光中无数朵刀花从四面八方涌向$n全身"
];
this.parry_actions = SKILL.get("parry").parry_actions;
this.desc = "关外胡家赖以成名的刀法，为胡家始祖飞天狐狸所创。胡斐据家传刀谱练成后与金面佛苗人凤的苗家剑齐名天下。";
//"\+(\w+)\+"(.+?)"\+NOR\+"
//<$1>$2</$1>
this.can_enables = ["blade", "parry"];
this.learn_condition = {
    max_mp: 1000,
    skill: {
        blade: 300
    }
};
this.on_parry_over = function (me, target, par) {
    if (par.is_parry) {
        if (!me.query_temp("sk/hu/parry")) {
            me.do_attack({
                target: target,
                attack_msg: "<hic>$N化守为攻，使出一招「大雪纷纷」，$W发出万长白芒，寒光四射，直劈向$n！</hic>",

            }); me.end_attack(target);
            me.set_temp("sk/hu/parry", 1, 5000);
        }
    }
}
this.query_enable_prop = function (lv) {
    return {
        blade: {
            gj: lv * 1.5 + 10,
            dex: parseInt(lv / 8)
        }, parry: {
            zj: lv * 1.5 + 4,
            desc: "当你招架成功后立刻反击敌人，5秒冷却"
        }
    };
}
this.slots = [
    {
        prop: 'hjdf_sf_per',
        value: (lv) => 20,
        format: (val) => {
            return '八方藏刀绝招释放时间减少20%';
        },
    },
    {
        prop: 'hjdf_mz_per',
        value: (lv) => 10,
        format: (val) => {
            return '八方藏刀命中增加10%';
        }
    },
    {
        prop: 'hjdf_sh_per',
        value: (lv) => 10,
        format: (val) => {
            return '八方藏刀伤害增加10%';
        }
    }
];

this.pfm = {
    chan:
    {
        name: "八方藏刀",
        distime: 10000,
        enable_skill: "blade",
        release_time: 5000,
        weapon_type: WEAPON_TYPE.BLADE,

        releasetime_per_key: 'hjdf_sf_per',
        mp: 20,
        is_weapon_buff: true,
        use: function (me, target, lv) {
            me.send_room("<hiw>$N施出「八方藏刀式」，手中的$W吞吞吐吐，变化莫测，笼罩了$n周身要害！</hiw>", target);

            let mz = me.mz * 1.1;
            mz += me.mz * me.query_prop('hjdf_mz_per') / 100;
            let gj = me.gj;
            gj += me.gj * me.query_prop('hjdf_sh_per') / 100;


            me.call_interval(
                function () {
                    if (!me.can_attack()) return false;

                    target = me.query_enemy();
                    me.do_attack({
                        target: target,
                        gj: gj,
                        mz: mz,
                        attack_before: "<hiw>紧跟着</hiw>",
                        no_append: true
                    });
                    if (!me.end_attack(target)) {
                        return false;
                    }
                },
                625,
                8
            );
        },
        query_desc: function (me, lv) {
            return "快速出刀，释放成功后在5秒内出刀8次，每刀命中增加10%";
        }
    }
};