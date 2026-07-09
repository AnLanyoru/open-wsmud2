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
import type { LearnCondition } from "../../../../types/events.js";

/** 完成度 50 */
export default class extends SKILL {
  name = "彼岸剑法";
  id = "bianjianfa";
  grade = 4;

  // 原始描述：慈航静斋镇派剑法，剑意超然物外，渡尽世间一切苦厄，直指彼岸。
  desc = "慈航静斋的剑法";
  can_enables = ["sword", "parry"];
  attack_actions = [
    "$N手中$w轻挥，一式「<HIC>慈航普渡</HIC>」，剑光如琉璃净水，涤荡世间万般尘埃，洒向$n的$l",
    "$N长吟一声，剑势化为「<HIG>彼岸花开</HIG>」，朵朵剑花绽放在$n周身，似幻似真",
    "$N眉间隐现慈悲，$w缓缓递出，正是「<HIW>渡尽劫波</HIW>」，剑意浩瀚如海，直向$n的$l涌去",
    "$N身形飘忽，一招「<HIM>苦海无涯</HIM>」，剑光如月华泻地，渺渺茫茫罩向$n",
    "$N脚踏莲台之形，$w凌空画圆，一式「<HIY>超然物外</HIY>」，剑气如天河倒泻，席卷$n的$l",
    "$N闭目凝神，$w信手挥洒，正是「<HIC>一苇渡江</HIC>」，剑光似有还无，穿透虚空直指$n",
    "$N清啸一声，剑招突变「<HIM>彼岸无岸</HIM>」，剑气纵横交错，化作无边苦海将$n淹没",
    "$N$w轻颤，剑鸣如梵唱，一式「<HIG>明心见性</HIG>」，剑光直透$n心神",
  ];
  parry_actions = [
    "$n剑势一转，使出「<HIC>回头是岸</HIC>」，剑光化作一道屏障，将$P的攻势尽数化解\n",
    "$n闭目挥剑，一招「<HIW>万象皆空</HIW>」，剑意空灵，$P只觉得剑招如泥牛入海\n",
    "$n$w轻点，一式「<HIG>拈花一笑</HIG>」，竟在间不容发之际将$P的攻势化解于无形\n",
    "$n身形不动，$w缓缓画弧，正是「<HIY>不滞于物</HIY>」，将$P的凌厉攻势尽数引开\n",
  ];
  learn_condition: LearnCondition = {
    max_mp: 15000,
    skill: {
      sword: 300,
    },
  };

  query_enable_prop(lv: number): EnablePropMap {
    return {
      sword: {
        gj: 10 + Math.floor(lv * 2),
        mz: 20 + Math.floor(lv * 1.6),
        dex: Math.floor(lv * 0.127),
        mz_per: 8,
      },
      parry: {
        zj: 10 + Math.floor(lv * 2.3),
        mz_per: 4,
        dex: Math.floor(lv * 0.127),
      },
    };
  }

  pfm_set: PerformData = {
    ba: {
      name: "彼岸九式",
      distime: 35000,
      enable_skill: "sword",
      mp: 40,
      release_time: 3000,
      attack_msgs: [
        "<hic>$N手中$w一振，一式「苦海无边」，剑光如潮涌向$n</hic>",
        "<hic>$N剑势一转，「回头是岸」，剑光化作一道金桥直击$n</hic>",
        "<hic>$N$w连点，「花开彼岸」，朵朵剑莲在$n周身绽放</hic>",
        "<hic>$N长吟一声，「慈航普渡」，剑意如春风化雨笼罩$n</hic>",
        "<hic>$N剑招突变，「一苇渡江」，一道惊鸿剑光直破$n的$l</hic>",
        "<hic>$N$w横削，「超然物外」，剑光似有还无飘向$n</hic>",
        "<hic>$N身形旋转，「六道轮回」，剑光化作六道轮环罩向$n</hic>",
        "<hic>$N$w直刺，「明心见性」，一道清澈剑光直透$n心脉</hic>",
        "<hic>$N双手握剑，「彼岸花开」，九式归一化作一道惊天长虹直贯$n</hic>",
      ],
      use: function (me: CHARACTER, target: CHARACTER, lv: number) {
        var self = this as PERFORM;
        var count = 9;
        me.send_room(
          "<him>$N面色恬静，$w轻振，剑意如莲花绽放，层层叠叠向$n涌去！</him>\n",
          target,
        );
        for (var i = 0; i < count; i++) {
          me.do_attack({
            target: target,
            attack_msg: self.attack_msgs![i] || self.attack_msgs!.random(),
          });
        }
        me.end_attack(target);
      },
      query_desc: function (me: CHARACTER, lv: number) {
        return "慈航静斋无上剑法，连出九式，式式相连，如苦海渡舟，直指彼岸。";
      },
    },
  };
}
