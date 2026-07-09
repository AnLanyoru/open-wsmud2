import { SKILL, PERFORM } from "../../../core/skill/skill.js";
import { SKILL_TYPES, WEAPON_TYPE } from "../../../core/const.js";
import { FAMILIES } from "../../../core/skill/family.js";
import type { PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { SkillSlotDef } from "../../../types/props.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

/** 完成度 70 */
export default class extends SKILL {
  name = "燃木刀法";
  id = "ranmudao3";
  grade = 6;
  family = FAMILIES.SHAOLIN;
  is_hidden = true;
  desc = "少林寺七十二绝技之燃木刀法";
  can_enables = ["blade", "parry"];
  attack_actions = SKILL.get("blade")?.attack_actions || [];

  slots: SkillSlotDef[] = [
    {
      prop: "ranmu_fy",
      value: (lv: number) => 15 + int(lv / 80),
      format: (val: number) => "护体真焰额外附加" + val + "%防御",
    },
    {
      prop: "ranmu_cd",
      value: (lv: number) => 4500,
      format: (val: number) => "护体真焰冷却时间减少" + toSec(val) + "秒",
    },
  ];

  query_enable_prop(lv: number): EnablePropMap {
    const burnDmg = ranmuBurnDmg(lv);
    return {
      blade: {
        gj: 10 + lv * 2,
        str: 10 + lv * 1,
        mz_per: 10,
        fy_per: 10,
        desc: "燃木真焰：攻击命中后对敌人造成" + burnDmg + "点灼烧伤害",
      },
      parry: {
        zj: Math.floor(lv * 2.1),
        fy: Math.floor(lv * 2.1),
        con: Math.floor(lv * 0.5),
        max_hp: lv * 33,
      },
    };
  }

  // 燃木真焰：攻击命中后附加灼烧伤害
  on_attack(me: CHARACTER, target: CHARACTER, par: DoAttackPar): number {
    const lv = me.query_skill("ranmudao3", 0);
    const dmg = ranmuBurnDmg(lv);
    me.send_combat("<red>$n被烈焰划过，身上一道焦黑</red>", target);
    return dmg;
  }

  // 护体真焰：被命中后灼伤敌人，招架成功伤害翻倍
  on_parry_over(me: CHARACTER, target: CHARACTER, par: DoAttackPar): void {
    const recoil: number = me.query_temp("sk_ranmu", 0);
    if (recoil) {
      const dmg: number = par.is_parried ? recoil * 2 : recoil;
      target.send_combat("<HIR>$N的护体真焰灼伤了$n的真元！！</HIR>", target);
      target.damage3(dmg, me);
      me.end_attack(target);
    }
  }

  pfm_set: PerformData = {
    hu: {
      name: "护体真焰",
      distime: 28500,
      enable_skill: "blade",
      mp: 20,
      release_time: 0,
      use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        const time: number = 8000 + lv * 5;
        const dur: number = time > 200000 ? 200000 : time;
        const bonusFyPer: number = me.query_prop("ranmu_fy");
        const fyPer: number = 20 + Math.floor(lv / 100) + bonusFyPer;
        const recoilDmg: number = ranmuRecoilDmg(lv);
        me.send_room(
          "<HIR>$N仰天怒吼，全身登时腾起滔天烈焰，真焰护体，万邪不侵！</HIR>\n",
          target,
        );
        me.set_temp("sk_ranmu", recoilDmg, dur);
        me.add_status({
          id: "weapon",
          name: "真焰",
          desc: "真焰护体，增加你的防御，被命中时灼伤敌人",
          duration: dur,
          prop: {
            fy_per: fyPer,
          },
          finish_msg: "$N周身的护体真焰渐渐熄灭。",
        });
      },
      query_desc: function (me: CHARACTER, lv: number): string {
        const time: number = 8000 + lv * 5;
        const dur: number = time > 200000 ? 200000 : time;
        const recoilDmg: number = ranmuRecoilDmg(lv);
        const bonusFyPer: number = me.query_prop("ranmu_fy");
        const fyPer: number = 20 + Math.floor(lv / 100) + bonusFyPer;
        return (
          "真焰护体，持续" +
          toSec(dur) +
          "秒，增加你" +
          fyPer +
          "%的防御，被敌人命中后对敌人造成" +
          recoilDmg +
          "的真实伤害，招架成功伤害翻倍。"
        );
      },
    },
    fen: {
      name: "焚尽八荒",
      distime: 19000,
      enable_skill: "blade",
      weapon_type: WEAPON_TYPE.BLADE,
      mp: 20,
      use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        me.send_room(
          "<HIy>$N双手持刀，对天咆哮，所施正是燃木刀法绝学「焚尽八荒」。霎时呼啸声大作，但见一股澎湃无比的罡劲至$N刀间涌出，贯向$n而去！</HIy>",
          target,
        );
        const count: number = 8;
        for (let i: number = 0; i < count; i++) {
          me.do_attack({
            target: target,
            gj: me.gj,
            mz: me.mz,
            attack_msg: "<hir>一道罡气燃烧着熊熊烈焰向$n呼啸而去</hir>",
          });
        }
        me.end_attack(target);
      },
      query_desc: function (me: CHARACTER, lv: number): string {
        return "燃木刀法绝学「焚尽八荒」，瞬间用罡气攻击敌方8次，每次攻击造成100%伤害";
      },
    },
  };
}

/** 燃木真焰灼烧伤害（被动 on_attack 使用） */
function ranmuBurnDmg(lv: number): number {
  return 512 + lv + Math.floor((lv * lv) / 500);
}

/** 护体真焰反弹伤害（绝招使用） */
function ranmuRecoilDmg(lv: number): number {
  return 800 + lv + Math.floor((lv * lv) / 400);
}
