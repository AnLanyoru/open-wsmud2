import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";
import type { PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
  name = "九阴白骨爪";
  id = "jiuyinbaiguzhao2";
  source_skill = "jiuyinbaiguzhao";
  grade = 4;
  family = FAMILIES.EMEI;
  desc = "九阴真经里记载的外门功夫，阴狠毒辣";
  can_enables = ["unarmed", "parry"];
  attack_actions = [
    "$N阴恻恻一声冷笑，五指成爪，指尖泛起幽幽青芒，疾向$n的$l抓去",
    "$N身形如鬼魅般欺近，双爪划破空气发出嗤嗤异响，直取$n的$l",
    "$N十指箕张，指节咯咯作响，漫天爪影将$n的$l笼罩其中",
    "$N眼中杀机一闪，一爪探出快如闪电，五指如铁钩般扣向$n的$l",
    "$N厉啸声中，双爪连环抓出，每一爪都带着阴寒劲风，招招不离$n的$l要害",
    "$N身形一转，反手一爪自不可思议的角度抓向$n的$l，狠辣诡异",
  ];

  slots = [
    {
      prop: "jybgz_dp_sh",
      value: (_lv: number) => 30,
      format: (val: number) => "夺魄造成的伤害增加" + val + "%",
    },
    {
      prop: "jybgz_fj_count",
      value: (_lv: number) => 1,
      format: (val: number) => "风卷残云最低攻击次数+" + val,
    },
  ];

  query_enable_prop(lv: number): EnablePropMap {
    return {
      unarmed: {
        gj: 20 + lv * 2,
        mz: 20 + lv * 2,
        diff_fy_per: 3 + Math.floor(lv / 300),
        desc:
          "对方气血每降低1%，你的九阴白骨爪伤害和命中增加" +
          (lv >= 2000 ? "2%" : "1%"),
      },
      parry: {
        zj: 20 + lv * 2,
        fy: 20 + lv * 2,
        max_hp: lv * 20,
      },
    };
  }

  /**
   * 九阴白骨爪 — 对方气血越低，伤害和命中越高（仅拳脚攻击）
   * 每降低1%气血，伤害和命中 +1%（lv≥2000 时为 +2%）
   */
  on_before_attack(me: CHARACTER, target: CHARACTER, par: DoAttackPar): void {
    const lv = me.query_skill("jiuyinbaiguzhao2", 0);
    if (!lv) return;

    const missingPct = Math.floor(100 - (target.hp * 100) / target.max_hp);
    if (missingPct <= 0) return;

    const perLv = lv >= 2000 ? 2 : 1;
    const bonus = missingPct * perLv;

    par.gj = Math.floor(((par.gj ?? me.gj) * (100 + bonus)) / 100);
    par.mz = Math.floor(((par.mz ?? me.mz) * (100 + bonus)) / 100);
  }

  pfm_set: PerformData = {
    duo: {
      name: "夺魄",
      distime: 18000,
      enable_skill: "unarmed",
      mp: 20,
      use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        const bonusPer = me.query_prop("jybgz_dp_sh");
        const dmgPer = 200 + Math.floor(lv / 10) + bonusPer;
        const sh = me.do_attack({
          target: target,
          gj: Math.floor((me.gj * dmgPer) / 100),
          mz: me.mz,
          no_weapon: true,
          attack_msg:
            "<hiy>$N冷笑数声，手指微微弯曲成爪，身形疾转，飞向$n头顶抓下</hiy>",
          damage_msg:
            "<hir>$n哪里料到$N竟有如此变招，不及躲闪，被$P抓了个鲜血淋漓，头痛欲裂。</hir>",
        });
        if (sh) {
          const time = Math.min(10000, 3000 + lv * 5);
          target.add_status(
            {
              id: "faint",
              name: "昏迷",
              desc: "你陷入了昏迷状态",
              is_faint: true,
              duration: time,
              downside: true,
            },
            me,
          );
        }
        me.end_attack(target);
      },
      query_desc: function (_me: CHARACTER, lv: number): string {
        const dmgPer = 200 + Math.floor(lv / 10);
        const time = Math.min(10000, 3000 + lv * 5);
        return (
          "快速狠辣的攻击，命中后对敌人造成你攻击力" +
          dmgPer +
          "%的伤害，并使敌方昏迷" +
          toSec(time) +
          "秒。"
        );
      },
    },
    juan: {
      name: "风卷残云",
      distime: 18000,
      enable_skill: "unarmed",
      mp: 20,
      use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        const extraCount = me.query_prop("jybgz_fj_count");
        const threshold = Math.max(10, 30 - Math.floor(lv / 100));
        const baseCount = 3 + extraCount;
        const hpPct = (target.hp * 100) / target.max_hp;
        const bonusCount = Math.floor((100 - hpPct) / threshold);
        const count = baseCount + bonusCount;
        me.send_room(
          "<hir>$N一声厉啸，手指弯曲成爪，身形疾转，双爪化为一片残影，飞向$n抓去</hir>\n",
          target,
        );
        for (let i = 0; i < count; i++) {
          me.do_attack({
            target: target,
            gj: me.gj,
            mz: me.mz,
            no_weapon: true,
          });
        }
        me.end_attack(target);
      },
      query_desc: function (_me: CHARACTER, lv: number): string {
        const threshold = Math.max(10, 30 - Math.floor(lv / 100));
        return (
          "对敌人进行快速攻击，对方的气血每降低" +
          threshold +
          "%，你的攻击次数增加1次"
        );
      },
    },
  };
}
