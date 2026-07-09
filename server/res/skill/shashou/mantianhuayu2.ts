import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";
import type { PropMap } from "../../../types/props.js";
import type { PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
  name = "漫天花雨";
  id = "mantianhuayu2";
  source_skill = "mantianhuayu";
  grade = 5;
  family = FAMILIES.SHASHOU;
  desc = "杀手楼的暗器武功，使用的时候如漫天星光而得名";
  can_enables = ["sword", "throwing"];
  attack_actions = SKILL.get("mantianhuayu")?.attack_actions || [];

  query_prop(lv: number, me?: CHARACTER): PropMap {
    return {
      bj_per: 5 + int(lv / 300),
    };
  }

  query_enable_prop(lv: number): EnablePropMap {
    return {
      throwing: {
        gj: 4 + Math.floor(lv * 1.5),
        mz: 4 + Math.floor(lv * 1.5),
        mz_per: 7 + int(lv / 500),
        add_sh_per: 7 + int(lv / 500),
        diff_fy_per: 7 + int(lv / 500),
      },
      sword: {
        gj: 4 + Math.floor(lv * 1.5),
        mz: 4 + Math.floor(lv * 1.5),
        bj_per: 10,
        diff_busy_per: 7 + int(lv / 500),
        add_bjsh_per: 7 + int(lv / 500),
      },
    };
  }

  pfm_set: PerformData = {
    luo: {
      name: "落花",
      distime: 20000,
      enable_skill: "sword",
      mp: 25,
      use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        me.send_room(
          "<hiy>$N手中$W一抖，幻出万点星光，如朵朵落花般撒向$n</hiy>",
          target,
        );
        const count: number = Math.min(10, 1 + int(me.bj / 5));
        for (let i = 0; i < count; i++) {
          me.do_attack({
            target: target,
            attack_msg: "",
            gj: me.gj,
            mz: me.mz,
            no_append: true,
          });
        }
        me.end_attack(target);
      },
      query_desc: function (me: CHARACTER, lv: number): string {
        return "漫天暗器攻击敌人，每5%暴击增加一次攻击和5%的命中，最多10次";
      },
    },
    wu: {
      name: "定影",
      distime: 30000,
      enable_skill: "sword",
      mp: 20,
      release_time: 0,
      use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        const time: number = dingying_time(lv);
        me.do_attack({
          target: target,
          gj: me.gj,
          mz: me.mz,
          attack_msg:
            "<hiy>$N手中青光冒出，一瞬间$W已飞向$n化作点点星光笼罩$p周身大穴！</hiy>",
        });
        target.add_status(
          {
            id: "rash",
            name: "定影",
            duration: time,
            is_rash: true,
            downside: true,
          },
          me,
        );
        me.end_attack(target);
      },
      query_desc: function (me: CHARACTER, lv: number): string {
        return `使用暗器攻击敌人，如果命中则使敌人定身${toSec(dingying_time(lv))}秒`;
      },
    },
  };
}

// ========== 公共计算函数 ==========

/** 定影定身时间（毫秒） */
export function dingying_time(lv: number): number {
  const t: number = 5000 + lv * 3;
  return t > 15000 ? 15000 : t;
}
