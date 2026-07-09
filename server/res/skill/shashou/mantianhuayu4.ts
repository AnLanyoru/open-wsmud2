import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";
import type { PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import { CHARACTER } from "../../../core/char/character.js";
import type { DoAttackPar } from "../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
  name = "天谕";
  id = "mantianhuayu4";
  grade = 6;
  family = FAMILIES.SHASHOU;
  is_ultimate = true;
  desc = "上古法家不传之秘，替天行法";
  can_enables = ["throwing"];
  attack_actions = [
    "$N指尖一捻，一道金光乍现，化作天谕法印直取$n的$l",
    "$N双手结印，九天之上雷云翻涌，一道紫雷应召而落劈向$n的$l",
    "$N扬手间金光如练，凝为无形法印，压向$n的$l",
    "$N掌心雷光闪烁，紫电如龙而出，直贯$n的$l",
    "$N双目微阖掐诀念咒，金光化作天罚之力笼罩$n的$l",
    "$N手捏法印凌空一指，金光破空而至，直射$n的$l",
  ];

  query_enable_prop(lv: number): EnablePropMap {
    return {
      throwing: {
        gj: lv * 3,
        mz: lv * 3,
        bj_per: 5 + int(lv / 400),
        mz_per: 5 + int(lv / 300),
        add_sh_per: 5 + int(lv / 200),
        diff_fy_per: 5 + int(lv / 200),
        desc: "你无需装备暗器",
      },
    };
  }

  pfm_set: PerformData = {
    shen: {
      name: "审判",
      distime: 60000,
      enable_skill: "throwing",
      mp: 1120,
      pass_weapon_check: true,
      use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        const time: number = shenpan_time(lv);
        me.send_room(
          "<ord>$N双目微阖，双手结印，朗声道：「天谕在上，代天行法——审判！」</ord>\n<ord>霎时间，九天之上雷云翻涌，一道金光破空而下，将$n笼罩其中！</ord>\n",
          target,
        );
        me.do_attack({
          target: target,
          gj: me.gj,
          mz: me.mz,
          attack_msg: "<ord>$N扬手间金光盘旋而至，法印如山，压向$n！</ord>",
          damage_msg:
            "<hir>金光贯体，$n全身剧震，已被天谕法印牢牢镇住，动弹不得！</hir>",
          miss_msg: "<cyn>$n见势不妙，拼命翻滚躲避，堪堪避过金光笼罩。</cyn>",
          is_throwing: true,
        });
        target.add_status(
          {
            id: "shenpan",
            name: "审判",
            desc: "被天谕法印镇压，无法移动",
            duration: time,
            is_rash: true,
            downside: true,
            finish_msg: "<ord>$N周身金光碎裂，审判法印终于消散。</ord>\n",
            start_msg: "<ord>$N周身金光大盛，已被天谕法印镇压！</ord>\n",
          },
          me,
        );
        me.end_attack(target);
      },
      query_desc: function (me: CHARACTER, lv: number): string {
        return `代天行法，发起审判，使敌人无法移动`;
      },
    },
    fa: {
      name: "天罚",
      distime: 13000,
      enable_skill: "throwing",
      mp: 1910,
      pass_weapon_check: true,
      use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        const is_shenpan: boolean = !!target.query_status("shenpan");
        const extra_gj: number = tianfa_extra_gj(lv, is_shenpan);
        if (is_shenpan) {
          me.send_room(
            "<ord>$N仰天长啸，双手指天——「天谕既出，天罚当至！」</ord>\n<ord>九天之上雷云骤聚，万道紫雷如怒龙般狂啸而下！</ord>\n",
            target,
          );
        } else {
          me.send_room(
            "<ord>$N抬手引诀，指尖雷光闪烁，一道天雷破空而至！</ord>\n",
            target,
          );
        }
        const par: DoAttackPar = {
          target: target,
          gj: Math.floor((me.gj * extra_gj) / 100),
          mz: me.mz,
          attack_msg: is_shenpan
            ? "<ord>$N周身雷光如狱，引九天紫雷贯顶而下，直劈$n！</ord>"
            : "<ord>$N扬手间一道雷光划破长空，轰然击向$n！</ord>",
          damage_msg: is_shenpan
            ? "<hir>万钧雷霆轰然落下，$n避无可避，被紫雷透体而过，全身焦黑，惨嚎震天！</hir>"
            : "<hir>雷光正中$n，炸开一片焦痕！</hir>",
          miss_msg: "<cyn>$n慌忙闪避，堪堪躲过了天雷一击。</cyn>",
          is_throwing: true,
        };
        if (is_shenpan) {
          par.no_dodge = true;
          par.cirt = () => true;
        }
        me.do_attack(par);
        me.end_attack(target);
      },
      query_desc: function (me: CHARACTER, lv: number): string {
        const extra: number = tianfa_extra_gj(lv, true);
        return `使用暗器引天雷攻击敌人，对审判中的敌人造成额外伤害并无法抵抗暴击`;
      },
    },
  };
}

// ========== 公共计算函数 ==========

/** 审判持续时间（毫秒） */
export function shenpan_time(lv: number): number {
  const t: number = 5000 + lv * 5;
  return t > 15000 ? 15000 : t;
}

/** 天罚额外攻击倍率（对审判目标），倍率 + 额外倍率 */
export function tianfa_extra_gj(lv: number, is_shenpan: boolean): number {
  const base: number = int(100 + lv / 20);
  if (!is_shenpan) return base;
  return base * 2;
}
