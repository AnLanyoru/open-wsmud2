import {SKILL} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "天山六阳掌";
    id = "liuyangzhang3";
    grade = 6;
    family = FAMILIES.XIAOYAO;
    is_hidden = true;
    desc = "逍遥派的天山六阳掌，绝招生死符让人谈虎色变。";

    attack_actions = [
        "$N一招「<YEL>落日熔金</YEL>」，左掌叠于右掌之上，劈向$n的$l",
        "$N一招「<RED>安禅制毒龙</RED>」，面色凝重，双掌轻飘飘地拍向$n的$l",
        "$N一招「<MAG>日斜归路晚霞明</MAG>」，双掌幻化一片掌影，将$n笼罩于内。",
        "$N一招「<HIC>阳关三叠</HIC>」，向$n的$l连击三掌",
        "$N一招「<WHT>阳春一曲和皆难</WHT>」，只见一片掌影攻向$n的$l",
        "$N双掌平挥，一招「<HIW>云霞出海曙</HIW>」击向$n的$l",
        "$N一招「<HIR>白日参辰现</HIR>」，只见一片掌影攻向$n的$l",
        "$N左掌虚晃，右掌一记「<RED>云霞出薛帷</RED>」击向$n的头部",
        "$N施出「<HIC>青阳带岁除</HIC>」，右手横扫$n的$l，左手攻向$n的胸口",
        "$N施出「<YEL>阳歌天钧</YEL>」，双掌同时击向$n的$l",
    ];

    can_enables = ["unarmed"];

    query_enable_prop(lv: number): EnablePropMap {
        const descVal = 30 + Math.floor(lv / 50);
        return {
            unarmed: {
                gj: lv * 3,
                mz: lv * 3,
                dex: 2 + lv,
                desc: "你对种了生死符的敌人伤害增加" + descVal + "%",
            },
        };
    }

    pfm_set: PerformData = {
        sheng: {
            name: "生死符",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const time = Math.max(9000, 12000 - lv);
                const fu = 10 + Math.floor(lv / 100);

                const sh = me.do_attack({
                    target: target,
                    attack_msg: "<red>$N逆运真气，化水为冰，凝于掌中，轻飘飘地拍向$n。</red>",
                    miss_msg: "<cyn>可是$p急忙闪在一旁，躲了开去。</cyn>",
                    no_parry: true,
                });

                if (sh) {
                    target.add_status({
                        id: "liuyang",
                        duration: time,
                        downside: true,
                        name: "生死符",
                        desc: "你被种了生死符，" + (time / 1000) + "秒后爆发",
                        no_clear: true,
                        on_expire: function (p: CHARACTER): void {
                            if (p.hp <= 0) return;
                            if (p.is_fighting(me)) {
                                p.send_room("<hib>$N的生死符发作了，\"哇\"的一声，吐出一口殷红的<hir>鲜血</hir>。</hib>");
                                if (p.hp > me.max_hp) {
                                    p.damage(Math.floor(me.hp * fu / 100), me);
                                } else {
                                    p.add_hp(-p.hp + 1);
                                }
                                me.end_attack(p);
                            } else {
                                p.notify("<hiw>由于失去" + me.name + "的真气牵引，你的生死符没有发作。</hiw>");
                            }
                        },
                    });
                    me.end_attack(target);
                }
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const time = Math.max(9000, 12000 - lv);
                const fu = 10 + Math.floor(lv / 100);
                return "逆运真气将阳刚之气转为阴柔，化水为冰，命中敌人后" + (time / 1000) + "秒后爆发，如果你的最大气血大于敌方当前气血，敌人气血将降为1，否则将受到你当前气血" + fu + "%的伤害。不可招架";
            },
        },

        yang: {
            name: "阳关三叠",
            distime: 12000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                me.send_room("<hir>$N长笑一声，双掌快速拍向$n，竟如惊涛骇浪般汹涌而去！</hir>", target);

                let gj = me.gj;
                let mz = me.mz;
                const sp = 150 + Math.floor(lv / 30);
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
                        before = "<hir>$N长笑一声，运掌如风，掌力更加迅猛\n</hir>";
                    } else {
                        mz = Math.floor(mz * sp / 100);
                        before = "<hic>$N气随意转，掌风突变，化刚为柔，又如春风般无孔不入\n</hic>";
                    }
                }
                me.end_attack(target);
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const sp = 50 + Math.floor(lv / 30);
                return "以迅猛的掌力瞬间攻击对方三次，造成伤害后下次增加攻击" + sp + "%，否则增加" + sp + "%命中";
            },
        },

        bai: {
            name: "白虹贯日",
            distime: 15000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                let per = 10 + Math.floor(lv / 100);
                if (per > 20) per = 20;
                const powerGj = Math.floor(me.max_mp * per / 100);

                me.do_attack({
                    attack_msg: "<hiy>$N全身真气迸发，呼的一掌向$n头顶猛然贯落。</hiy>",
                    target: target,
                    gj: me.gj,
                    damage_msg: "<HIR>$n慌忙抵挡，可已然不及，$N掌劲如洪水般涌入体内，接连震断数根肋骨。</HIR>",
                    mz: me.mz,
                    power_gj: powerGj,
                });
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                let per = 10 + Math.floor(lv / 100);
                if (per > 20) per = 20;
                const gj = Math.floor(me.max_mp * per / 100);
                return "提起全身真气对敌人造成你攻击力附加你最大内力" + per + "%(" + gj + ")的伤害。";
            },
        },
    };
}
