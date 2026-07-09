import { SKILL } from "../../../../core/skill/skill.js";
import { SKILL_TYPES } from "../../../../core/const.js";
import type {
  PerformData,
  EnablePropMap,
} from "../../../../core/skill/skill.js";
import type { LearnCondition } from "../../../../types/events.js";
import type {
  CHARACTER,
  DoAttackPar,
} from "../../../../core/char/character.js";

export default class extends SKILL {
  name = "不老长春功";
  id = "bahuanggong";
  grade = 5;
  force_rad = 0.95;

  desc = "天长地久不老长春功，又名八荒六合唯我独尊，是灵鹫宫天山童姥的绝学。";
  can_enables = ["force"];
  learn_condition: LearnCondition = {
    con1: 40,
  };

  query_enable_prop(lv: number): EnablePropMap {
    return {
      force: {
        max_hp: lv * 20 + 100,
        hp_per: 5 + Math.floor(lv / 300),
        con: 5 + Math.floor(lv / 3),
        diff_fy_per: 3 + Math.floor(lv / 300),
        limit_mp: lv * 285,
        desc: "命中后对敌人造成附加伤害(年龄越大伤害越高)\n唯一：将你内力的95%转化为气血",
      },
    };
  }

  /**
   * 年龄附加伤害：年龄越大，命中后附加的伤害越高。
   * 公式：power_gj += Math.floor(me.age * lv / 100)
   */
  on_attack(me: CHARACTER, _target: CHARACTER, par: DoAttackPar): number {
    const lv = me.query_skill("bahuanggong", 0);
    if (lv > 0) {
      if (!par.power_gj) par.power_gj = 0;
      par.power_gj += Math.floor((me.age * lv) / 100);
    }
    return 0;
  }

  pfm_set: PerformData = {
    buchang: {
      name: "不老长春",
      distime: 28000,
      enable_skill: "force",
      mp: 20,
      use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        const pct = buchang_dmg_pct(lv);
        const enemies = me.get_nearby_enemies();
        if (!enemies.length) {
          const sh = me.do_attack({
            target,
            gj: me.gj,
            mz: me.mz,
            no_weapon: true,
            attack_msg:
              "<hio>$N默运玄功，长春真气如岳如渊，掌含八荒之势，挟万钧之力朝$n当胸印去！</hio>",
          });
          if (sh > 0) {
            const heal = Math.floor((sh * pct) / 100);
            me.add_hp(heal);
            me.send_combat(`<hio>$N长春真气流转，化伤为生！</hio>\n`, target);
          }
          me.end_attack(target);
          return;
        }

        me.send_room(
          "<hio>$N默运玄功，长春真气如岳如渊，掌含八荒之势，挟万钧之力朝四周涤荡开来！</hio>",
        );

        let totalSh = 0;
        let first = true;
        for (const enemy of enemies) {
          const sh = me.do_attack({
            target: enemy,
            gj: me.gj,
            mz: me.mz,
            no_weapon: true,
            attack_msg: first
              ? "<hio>$N的长春真气如岳如渊，含八荒之势，挟万钧之力朝$n席卷而来！</hio>"
              : undefined,
          });
          if (first) first = false;
          totalSh += sh;
        }

        if (totalSh > 0) {
          const heal = Math.floor((totalSh * pct) / 100);
          me.add_hp(heal);
          me.send_combat(`<hio>$N长春真气流转，化伤为生！</hio>\n`, target);
        }
        me.end_attack(target);
      },
      query_desc: function (_me: CHARACTER, lv: number): string {
        const pct = buchang_dmg_pct(lv);
        return `对附近敌人造成${pct}%的伤害，并且吸收伤害转化为自身气血。`;
      },
    },
    weiwu: {
      name: "唯我独尊",
      distime: 40000,
      enable_skill: "force",
      mp: 40,
      use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        const enemies = me.get_nearby_enemies();
        if (!enemies.length) {
          me.end_attack(target);
          return;
        }

        const duration = weiwu_duration(lv);
        const slowAmount = weiwu_slow_amount(lv);

        me.send_room(
          "<hir>$N周身真气爆发，气势磅礴，如君临天下！一股睥睨万物的威压笼罩四周！</hir>",
        );

        for (const enemy of enemies) {
          enemy.add_status(
            {
              id: "bahuanggong_weiwu",
              name: "震慑",
              desc: "被不老长春功震慑，技能释放速度和冷却时间减慢",
              duration: duration,
              downside: true,
              no_diff: true,
              prop: {
                releasetime: slowAmount,
                distime: slowAmount,
              },
            },
            me,
          );
        }

        me.end_attack(target);
      },
      query_desc: function (_me: CHARACTER, lv: number): string {
        const duration = weiwu_duration(lv);
        const slowAmount = weiwu_slow_amount(lv);
        return `震慑附近敌人，使对方难以释放技能，${toSec(duration)}秒内技能释放速度和冷却时间减慢${toSec(slowAmount)}秒。`;
      },
    },
  };
}

// ═══════════════════════════════════════════
// 不老长春功 — 公共计算函数
// ═══════════════════════════════════════════

/** 不老长春伤害百分比：100 + Math.floor(lv / 10) */
function buchang_dmg_pct(lv: number): number {
  return 100 + Math.floor(lv / 10);
}

/** 唯我独尊持续时间（毫秒）：15000 + lv * 2 */
function weiwu_duration(lv: number): number {
  return 15000 + lv * 2;
}

/** 唯我独尊减慢时间（毫秒）：1000 + Math.floor(lv / 500) * 1000 */
function weiwu_slow_amount(lv: number): number {
  return 1000 + Math.floor(lv / 500) * 1000;
}
