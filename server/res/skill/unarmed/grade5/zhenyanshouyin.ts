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
  name = "真言手印";
  id = "zhenyanshouyin";
  grade = 5;

  desc =
    "九字真言手印含天地之秘，通过人体而与宇宙沟通，达致天人合一之境，明心见性，即身成佛。";
  can_enables = ["unarmed"];
  attack_actions = [
    "$N双手结印，口中诵出「<HIC>临</HIC>」字真言，一股不动明王之气势自掌间涌向$n的$l",
    "$N手印变幻，真言「<HIC>兵</HIC>」字出口，掌势如金刚降世，刚猛无匹地击向$n的$l",
    "$N结出「<HIC>斗</HIC>」字印，身形与天地共鸣，一掌穿越虚空直取$n的$l",
    "$N手印再变，「<HIC>者</HIC>」字真言化作万道佛光，掌力绵绵不绝地罩向$n的$l",
    "$N口诵「<HIC>皆</HIC>」字真言，手印如莲花绽放，佛力激荡间拍向$n的$l",
    "$N双手合十，「<HIC>阵</HIC>」字真言脱口而出，掌势如列阵般层层叠叠涌向$n的$l",
    "$N手中「<HIC>列</HIC>」字印一成，掌力纵横如天罗地网，铺天盖地卷向$n的$l",
    "$N结「<HIC>前</HIC>」字印，身形骤然消失再出现，一掌已印至$n的$l",
    "$N「<HIC>行</HIC>」字真言响彻云霄，身印合一，掌力突破时空界限击向$n的$l",
  ];

  query_enable_prop(lv: number): EnablePropMap {
    return {
      unarmed: {
        gj: 20 + Math.floor(lv * 1.9),
        str: 2 + Math.floor(lv / 3),
        mz: 3 + Math.floor(lv * 1.8),
      },
    };
  }

  pfm_set: PerformData = {
    zi: {
      name: "九字真言",
      distime: 15000,
      enable_skill: "unarmed",
      mp: 50,
      use: function (me: CHARACTER, target: CHARACTER, lv: number) {
        var words = ["临", "兵", "斗", "者", "皆", "阵", "列", "前", "行"];
        var idx = me.random(words.length);
        var word = words[idx];
        me.send_room(
          `<hiy>$N神色肃穆，双手如莲花般绽放，变幻出九种玄奥手印，最后口诵真言「<HIC>${word}</HIC>」字，一掌挟无上佛威拍向$n！</hiy>`,
          target,
        );
        var sh = me.do_attack({
          target: target,
          gj: Math.floor((me.gj * (100 + idx * 10)) / 100),
          mz: me.mz,
          attack_msg:
            "<hiy>「<HIC>" +
            word +
            "</HIC>」字真言化作一道金色卍字佛印，带着浩瀚佛力印向$n！</hiy>",
          miss_msg:
            "<cyn>$n只觉得一股沛然佛力扑面而来，急忙运功抵御，堪堪避开。</cyn>",
          damage_msg:
            "<hir>卍字佛印正中$n胸口，$n只觉体内气血翻腾，一口鲜血夺口而出！</hir>",
        });
        me.end_attack(target);
      },
      query_desc: function (me: CHARACTER, lv: number) {
        return "真言伤人，随机从九字真言中诵出一字，威力随字序递增";
      },
    },
    fa: {
      name: "不死法印",
      distime: 60000,
      enable_skill: "unarmed",
      mp: 70,
      use: function (me: CHARACTER, target: CHARACTER, lv: number) {
        var pct = 105 + Math.floor(lv / 20);
        if (pct > 150) pct = 150;
        var fy_val = Math.floor((me.gj * pct) / 100);
        me.send_room(
          "<hiy>$N双手结成「<HIC>不死法印</HIC>」，口诵真言，周身佛光普照，一道金色的护体法印在身前浮现！</hiy>",
          target,
        );
        me.add_status({
          id: "zhenyan_busi",
          name: "不死法印",
          duration: 8000,
          prop: {
            fy: fy_val,
          },
          desc: "不死法印护体，将" + pct + "%的攻击力转化为固额免伤",
          start_msg:
            "<hiz>$N身前的不死法印金光大放，形成一道坚不可摧的护盾！</hiz>",
          finish_msg: "<cyn>$N身前的不死法印渐渐消散，佛光隐去。</cyn>",
        });
        me.reauto_attack();
      },
      query_desc: function (me: CHARACTER, lv: number) {
        var pct = 105 + Math.floor(lv / 20);
        if (pct > 150) pct = 150;
        return "真言守护，将你的" + pct + "%的攻击力转化为固额免伤，持续8秒";
      },
    },
  };
}
