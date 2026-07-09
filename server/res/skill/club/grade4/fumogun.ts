import { SKILL } from "../../../../core/skill/skill.js";
import type {
  PerformData,
  EnablePropMap,
} from "../../../../core/skill/skill.js";
import type { CHARACTER } from "../../../../core/char/character.js";

// ============================================================
// 伏魔棍 — 净念禅院绝世武功
// ============================================================

export default class extends SKILL {
  name = "伏魔棍";
  id = "fumogun";
  grade = 4;

  desc =
    "净念禅院的武器功法，棍势刚猛无俦，含佛门降魔之法，一棍既出，万邪辟易。";
  can_enables = ["club"];
  attack_actions = [
    "$N步踏金刚法度，$W破空而出，棍风猎猎，挟佛门降魔之势直捣$n的$l",
    "$N口中低诵梵音，$W划出一道金色弧光，以韦陀献杵之势击向$n的$l",
    "$N身形不动如山，$W蓦地一抖，棍影重重如罗汉列阵，笼罩$n的$l",
    "$N沉腰坐马，$W自下而上撩起，劲风呼啸间如天龙翻腾，扫向$n的$l",
    "$N双目圆睁作金刚怒目相，$W携无上威严横扫而出，棍未至而$n已觉劲风扑面",
    "$N手腕轻转，$W化作一道残影，以般若之力点向$n的$l要穴",
    "$N足踏莲花步，$W随身形而动，一记「普度众生」向$n的$l劈下",
    "$N气沉丹田，$W缓缓推出，看似平淡无奇却含万钧之力，压向$n的$l",
  ];

  query_enable_prop(lv: number): EnablePropMap {
    return {
      club: {
        gj: 15 + lv * 2,
        mz: 15 + lv * 2,
        fy: 15 + lv * 2,
        diff_sh_per: query_fmg_diff_sh_per(lv),
      },
    };
  }

  pfm_set: PerformData = {
    jing: {
      name: "金刚伏魔",
      distime: 20000,
      enable_skill: "club",
      mp: 20,
      use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        const multiplier = query_fmg_damage_multiplier(lv);
        const busyTime = query_fmg_busy_time(lv);

        me.send_room(
          "<hiy>$N面露金刚怒目之色，手中$W棍势如山，挟雷霆万钧之力向$n当头劈落，正是净念禅院绝学——「金刚伏魔」！</hiy>",
          target,
        );

        const sh = me.do_attack({
          target,
          gj: Math.floor((me.gj * multiplier) / 100),
          mz: me.mz,
          attack_msg:
            "<hiy>$N的$W金光大盛，棍端隐隐现出「卍」字法印，携降魔大力轰向$n！</hiy>",
          damage_msg:
            "<hir>$n被$N一棍击中，霎时如遭雷殛，佛门降魔之力透体而入，震得$n心神俱颤！</hir>",
        });

        if (sh) {
          target.add_status(
            {
              id: "busy",
              is_busy: true,
              name: "忙乱",
              downside: true,
              desc: "你被金刚伏魔之力震慑，心神不宁，无法行动。",
              duration: busyTime,
              start_msg:
                "<hiz>$n被$N的金刚伏魔之力所震慑，心神大乱，手足无措！</hiz>",
              finish_msg: "$n长长舒了一口气，终于从震慑中缓过神来。",
            },
            me,
          );
        }

        me.end_attack(target);
      },
      query_desc: function (_me: CHARACTER, lv: number): string {
        const multiplier = query_fmg_damage_multiplier(lv);
        const busyTime = query_fmg_busy_time(lv);
        return `金刚伏魔，造成${multiplier}%攻击力的伤害，命中后震慑敌人使敌人忙乱${toSec(busyTime)}秒。`;
      },
    },
  };
}

// ============================================================
// 伏魔棍 — 公共计算函数（use 与 query_desc 共用，保证一致）
// ============================================================

/** 伤害减免百分比 */
function query_fmg_diff_sh_per(lv: number): number {
  return 1 + Math.floor(lv / 500);
}

/** 金刚伏魔：伤害百分比（如 220 表示 220% 攻击力） */
function query_fmg_damage_multiplier(lv: number): number {
  return 120 + Math.floor(lv / 5);
}

/** 金刚伏魔：震慑忙乱时间（毫秒），上限 8000ms */
function query_fmg_busy_time(lv: number): number {
  return Math.min(8000, 2000 + lv * 4);
}
