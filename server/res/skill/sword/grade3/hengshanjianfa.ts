import { SKILL, PERFORM } from "../../../../core/skill/skill.js";
import { SKILL_TYPES, WEAPON_TYPE } from "../../../../core/const.js";
import type {
  PerformData,
  EnablePropMap,
} from "../../../../core/skill/skill.js";
import type {
  CHARACTER,
  DoAttackPar,
} from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
  name = "恒山剑法";
  id = "hengshanjianfa";
  grade = 3;

  desc =
    "绵密严谨，长于守御，而往往是在最令人出其不意之处突出杀招，剑法绵密有余，凌厉不足，正是适于女子所使用的武功。";
  can_enables = ["sword"];
  attack_actions = [
    "$N手中$w一圈，剑势<HIG>绵密</HIG>如细雨，看似守势，实则暗藏杀机，直取$n$l",
    "$N$w斜斜一指，剑走轻灵，一招<HIG>「金针渡劫」</HIG>，看似柔和却暗蕴内劲刺向$n",
    "$N剑法<HIC>连绵不绝</HIC>，$w划出一个又一个剑圈，圈中套圈，层层叠叠涌向$n的$l",
    "$N$w缓缓递出，剑势<HIG>圆转如意</HIG>，守中带攻，正是恒山剑法的精要所在",
    "$N突然$w一抖，<HIY>寒星点点</HIY>，刹那间由守转攻，剑光如<HIG>雨打梨花</HIG>般洒向$n",
  ];
  slots = [
    {
      prop: "ly_qj",
      value: (lv: number) => 10,
      format: (val: number) => "绵里藏针命中后将触发一次流云七剑",
    },
    {
      prop: "mz_hs",
      value: (lv: number) => 10,
      format: (val: number) => "绵里藏针的后手将无法躲闪，并增加100%伤害",
    },
  ];

  query_enable_prop(lv: number): EnablePropMap {
    return {
      sword: {
        gj: 20 + lv * 1,
        mz: 200 + Math.floor(lv * 1.5),
      },
    };
  }

  pfm_set: PerformData = {
    liu: {
      name: "流云七剑",
      distime: 20000,
      enable_skill: "sword",
      mp: 20,
      use: function (me: CHARACTER, target: CHARACTER, lv: number) {
        var per = calcLYPer(lv);
        me.send_room(
          "<HIG>$N一声清啸，$W舞动如行云流水，剑光连绵，一招「流云七剑」源源不绝地攻向$n！</HIG>",
          target,
        );
        for (var i = 0; i < 7; i++) {
          me.do_attack({
            target: target,
            gj: (me.gj * per) / 100,
            mz: me.mz,
            attack_before: i > 0 ? "<HIG>紧跟着剑光又至</HIG>" : undefined,
          });
        }
        me.end_attack(target);
      },
      query_desc: function (me: CHARACTER, lv: number) {
        var per = calcLYPer(lv);
        return "行云流水般连出七招，每招造成你攻击力" + per + "%的伤害";
      },
    },
    mian: {
      name: "绵里藏针",
      distime: 15000,
      enable_skill: "sword",
      mp: 20,
      use: function (me: CHARACTER, target: CHARACTER, lv: number) {
        var per = calcMZPer(lv);
        var per2 = calcMZPer2(lv);
        me.send_room(
          "<HIY>$N长剑微颤，剑势柔和中略带颤抖，似是力不从心，实则暗藏杀机！</HIY>",
          target,
        );
        var sh = me.do_attack({
          target: target,
          gj: (me.gj * per) / 100,
          mz: me.mz,
        });
        if (!sh) {
          me.do_attack({
            target: target,
            gj: (me.gj * per2) / 100,
            mz: me.mz * 2,
            attack_msg:
              "<HIR>$N先前一剑竟是虚招，此刻才是真正的杀着，剑势陡然凌厉无匹！</HIR>",
          });
        }
        me.end_attack(target);
      },
      query_desc: function (me: CHARACTER, lv: number) {
        var per = calcMZPer(lv);
        var per2 = calcMZPer2(lv);
        return (
          "先手示弱对敌人造成" +
          per +
          "%的伤害，如果未命中，后手会增加你" +
          per2 +
          "%的伤害和命中"
        );
      },
    },
  };
}

function calcLYPer(lv: number): number {
  return 30 + int(lv / 30);
}

function calcMZPer(lv: number): number {
  return 50 + int(lv / 30);
}

function calcMZPer2(lv: number): number {
  return 100 + int(lv / 15);
}
