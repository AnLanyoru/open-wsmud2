import { SKILL, PERFORM } from "../../../../core/skill/skill.js";
import type {
  PerformData,
  EnablePropMap,
} from "../../../../core/skill/skill.js";
import type { LearnCondition } from "../../../../types/events.js";
import type {
  CHARACTER,
  DoAttackPar,
} from "../../../../core/char/character.js";

/** 完成度 80 */
export default class extends SKILL {
  name = "雷霆斧法";
  id = "leitingfufa";
  grade = 2;

  // 原始描述：传说中已经消失的开山门绝学，招式大开大合，刚猛无匹，一斧开天，雷霆万钧
  desc = "传说中已经消失的开山门绝学，招式大开大合，刚猛无匹";
  can_enables = ["staff"];
  attack_actions = [
    "$N大喝一声，$W挟风雷之势直劈$n的$l，势不可挡",
    "$N单臂抡起$W，一招「开天辟地」自上而下猛砸$n",
    "$N身形一转，$W横扫千军，拦腰斩向$n",
    "$N双掌握$W，以雷霆万钧之势向$n的$l劈落",
    "$N踏步上前，$W自下而上撩起，劲风呼啸直取$n",
    "$N怒喝一声，$W化作一道乌光，当头向$n砸下",
  ];
  learn_condition: LearnCondition = {
    skill: {
      "guanshanjue:10": 0,
    },
  };

  slots = [
    {
      prop: "ltff_kai_sd",
      value: (lv: number) => 1000,
      format: (val: number) => "雷霆开山的释放时间减少" + toSec(val) + "秒",
    },
    {
      prop: "ltff_kai_sh",
      value: (lv: number) => 40,
      format: (val: number) => "雷霆开山的伤害增加" + val + "%",
    },
  ];

  query_enable_prop(lv: number): EnablePropMap {
    return {
      staff: {
        gj: 10 + Math.floor(lv * 1.2),
        str: 2 + Math.floor(lv / 10),
      },
    };
  }

  pfm_set: PerformData = {
    kai: {
      name: "雷霆开山",
      distime: 4000,
      enable_skill: "staff",
      mp: 20,
      release_time: 7000,
      releasetime_key: "ltff_kai_sd",
      use: function (me: CHARACTER, target: CHARACTER, lv: number) {
        const kaiSh = me.query_prop("ltff_kai_sh");
        var dmgMulti = 3 + lv / 1000 + kaiSh / 100;
        var strBonus = Math.floor(me.str * 2);

        me.send_room(
          "<HIW>$N仰天怒吼，$W高高抡起，以开山之势猛劈向$n！罡风呼啸，天地为之变色！</HIW>",
          target,
        );
        me.do_attack({
          target,
          gj: Math.floor(me.gj * dmgMulti) + strBonus,
          mz: me.mz,
        });
        me.end_attack(target);
      },
      query_desc: function (_me: CHARACTER, lv: number) {
        return (
          "使出全身气力劈向敌人，造成" +
          (300 + lv / 10) +
          "%伤害，臂力加成越高伤害越高"
        );
      },
    },
  };
}
