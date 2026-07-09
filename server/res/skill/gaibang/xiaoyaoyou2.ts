import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";
import type { PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";
import type { PropMap } from "../../../types/props.js";

/**
 * 逍遥游进阶 — 完善度90
 *
 * 数据来源：正式服 checkskill xiaoyaoyou2
 */
export default class extends SKILL {
  name = "逍遥游";
  id = "xiaoyaoyou2";
  source_skill = "xiaoyaoyou";
  grade = 4;
  family = FAMILIES.GAIBANG;
  desc = "逍遥游身法之进阶，步法洋洋洒洒，来去如风，趋退若电，敌莫能测";
  can_enables = ["dodge"];
  dodge_actions = [
    "$n一招「蜻蜓点水」，足尖轻点地面，身形倏地飘开数尺，躲过了$N这一招。\n",
    "$n身形向后一纵，使出一招「细胸巧翻云」，如飞燕掠空，轻巧避过了$N的攻击。\n",
    "$n双袖一拂，使出一式「虚怀若谷」，身如轻烟般荡开，$N的招式尽数落空。\n",
    "却见$n身形飘忽，足下生风，轻轻一纵便已到了数丈之外，早已避开。\n",
    "$n身形微晃，步踏逍遥，有惊无险地避开了$N这一招。\n",
  ];

  slots = [
    {
      prop: "xyy_fy",
      value: (_lv: number) => 10,
      format: (_val: number) => "仙游额外增加10%防御力",
    },
    {
      prop: "xyy_gj",
      value: (_lv: number) => 10,
      format: (_val: number) => "仙游额外增加10%攻击力",
    },
  ];

  query_enable_prop(lv: number): EnablePropMap {
    return {
      dodge: {
        ds: 30 + int((lv * 9) / 5),
        mz: 30 + int((lv * 8) / 5),
        str: 3 + int(lv * 0.25),
      },
    };
  }

  pfm_set: PerformData = {
    xian: {
      name: "仙游",
      distime: 30000,
      enable_skill: "dodge",
      mp: 20,
      release_time: 0,
      use_type: 2,
      use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        const duration = xianDuration(lv);
        const mzPer = xianMzPer(lv);
        const fyBonus = me.query_prop("xyy_fy");
        const gjBonus = me.query_prop("xyy_gj");

        const prop: PropMap = {
          mz_per: mzPer,
        };
        if (fyBonus) prop.fy_per = fyBonus;
        if (gjBonus) prop.gj_per = gjBonus;

        me.send_room(
          "<hiw>$N身子微晃，足尖轻点，施出「<hig>仙游诀</hig>」满场游走，步法洋洋洒洒，时而如飞燕掠波，时而如游龙戏水，瞻之在前，忽焉在后，直如御风而行，甚为飘逸。</hiw>",
        );
        me.add_status({
          id: "dodge",
          name: "仙游",
          start_msg: "<hiw>$N身形飘忽，步法如仙，似要乘风归去。</hiw>",
          finish_msg: "<hiw>$N步法渐缓，仙游之势已收。</hiw>",
          desc: "逍遥游之仙游诀，步法灵动，大幅增加命中",
          duration: duration,
          prop: prop,
        });
        me.set_temp("xyy_xian", 1, duration);
        me.reauto_attack();
      },
      query_desc: function (me: CHARACTER, lv: number): string {
        const duration = xianDuration(lv);
        const mzPer = xianMzPer(lv);
        return toSec(duration) + "秒内增加你" + mzPer + "%命中。";
      },
    },
  };
}

// 共享计算函数 — 保证 query_desc 与实际效果一致性

/** 仙游：持续时间 (ms) */
function xianDuration(lv: number): number {
  return 10000 + lv * 10;
}

/** 仙游：命中增加百分比 */
function xianMzPer(lv: number): number {
  return 20 + int(lv / 100);
}
