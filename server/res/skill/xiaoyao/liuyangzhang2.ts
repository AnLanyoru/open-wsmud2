import {SKILL} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "天山六阳掌";
    id = "liuyangzhang2";
    source_skill = "liuyangzhang";
    grade = 4;
    family = FAMILIES.XIAOYAO;
    desc = "逍遥派的天山六阳掌，绝招生死符让人谈虎色变。";
    can_enables = ["unarmed"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];

    slots = [
        {
            prop: 'lyz_ssf',
            value: (lv: number) => 1000 + Math.floor(lv / 200) * 1000,
            format: (val: number) => '生死符释放时间减少' + (val / 1000) + '秒',
        },
        {
            prop: 'lyz_bh',
            value: (lv: number) => 10 + Math.floor(lv / 100),
            format: (val: number) => '白虹掌力额外附加' + val + '%内力',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.7),
                mz: Math.floor(lv * 1.3),
                dex: Math.floor(lv * 0.2),
                desc: "你对种了生死符的敌人伤害增加50%",
            },
        };
    }

    pfm_set: PerformData = {
        zhong: {
            name: "生死符",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 8000,
            releasetime_key: "lyz_ssf",
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                // 逆运真气将阳刚之气转为阴柔，化水为冰，命中敌人后11秒后爆发，
                // 如果最大气血大于敌方当前气血，敌人气血将降为1，
                // 否则将受到当前气血20%的伤害。不可招架
                const sh = me.do_attack({
                    target: target,
                    attack_msg: "<red>$N逆运真气，将阳刚之气转为阴柔，化水为冰，凝于掌中，轻飘飘地拍向$n。</red>",
                    miss_msg: "可是$p急忙闪在一旁，躲了开去。",
                    no_parry: true,
                    no_weapon: true,
                });
                if (sh) {
                    target.add_status({
                        id: "liuyang",
                        duration: 11000,
                        downside: true,
                        name: "生死符",
                        desc: "你被种了生死符，11秒后将爆发",
                        no_clear: true,
                        on_expire: function(p: CHARACTER): void {
                            if (p.hp <= 0) return;
                            if (p.is_fighting(me)) {
                                p.send_room('<hib>$N的生死符发作了，「哇」的一声，吐出一口殷红的<hir>鲜血</hir>。</hib>');
                                if (p.hp > me.max_hp) {
                                    p.damage(Math.floor(me.hp * 20 / 100), me);
                                } else {
                                    p.add_hp(-p.hp + 1);
                                }
                                me.end_attack(p);
                            } else {
                                p.notify("<hiw>由于失去" + me.name + "的真气牵引，你的生死符没有发作。</hiw>");
                            }
                        },
                    }, me);
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number): string {
                return "逆运真气将阳刚之气转为阴柔，化水为冰，命中敌人后11秒后爆发，如果你的最大气血大于敌方当前气血，敌人气血将降为1，否则将受到你当前气血20%的伤害。不可招架";
            },
        },
        san: {
            name: "阳关三叠",
            distime: 12000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                // 以迅猛的掌力瞬间攻击对方三次，造成伤害后下次增加攻击83%，否则增加83%命中
                me.send_room("<hir>$N长笑一声，双掌快如闪电，接连三掌拍向$n，掌力如怒潮狂涌！</hir>", target);
                let mz = me.mz;
                let gj = me.gj;
                const sp = 183; // 183% = 100%基础 + 83%加成
                let before = "";
                for (let i = 0; i < 3; i++) {
                    if (me.do_attack({
                        target: target,
                        gj: gj,
                        mz: mz,
                        attack_before: before,
                        no_weapon: true,
                    })) {
                        gj = Math.floor(gj * sp / 100);
                        before = "<hir>$N掌势愈发凌厉，掌风呼啸，如雷霆万钧般接连压下。\n</hir>";
                    } else {
                        mz = Math.floor(mz * sp / 100);
                        before = "<hic>$N掌势忽变，化刚猛为灵动，掌影飘忽不定，如春风化雨般无孔不入。\n</hic>";
                    }
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number): string {
                return "以迅猛的掌力瞬间攻击对方三次，造成伤害后下次增加攻击83%，否则增加83%命中";
            },
        },
        po: {
            name: "白虹掌力",
            distime: 15000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                // 提起全身真气对敌人造成攻击力附加最大内力20%(+槽位加成)的伤害
                const bh = me.query_prop("lyz_bh");
                const per = 20 + bh;
                me.do_attack({
                    attack_msg: "<hiy>$N提起全身真气，呼的一掌向$n当头劈落，正是白虹掌力的精要所在。</hiy>",
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    no_weapon: true,
                    damage_msg: "<HIR>$n慌忙抵挡，可$N掌劲已如排山倒海般涌入，直震得$p五脏六腑翻腾不已。</HIR>",
                    power_gj: Math.floor(me.max_mp * per / 100),
                });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number): string {
                const bh = me.query_prop("lyz_bh");
                const per = 20 + bh;
                const gj = Math.floor(me.max_mp * per / 100);
                return "提起全身真气对敌人造成你攻击力附加你最大内力" + per + "%(" + gj + ")的伤害。";
            },
        },
    };
}
