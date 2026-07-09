import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";
import type { PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

/**
 * 狂风快剑进阶 (品级5)
 * 完善度50
 */
export default class extends SKILL {
  name = "狂风快剑";
  id = "kuangfengkuaijian2";
  source_skill = "kuangfengkuaijian";
  grade = 5;
  family = FAMILIES.HUASHAN;
  desc = "华山派的剑宗的立宗剑法，以快闻名";
  can_enables = ["sword", "dodge"];
  attack_actions = SKILL.get("kuangfengkuaijian")?.attack_actions || [];
  dodge_actions = SKILL.get("kuangfengkuaijian")?.dodge_actions || [];

  query_enable_prop(lv: number): EnablePropMap {
    return {
      sword: {
        gj: 10 + lv * 2,
        mz: 10 + lv * 2,
        dex: int(lv / 4),
        gjsd: 250,
        bj_per: 2 + int(lv / 400),
      },
      dodge: {
        ds: 16 + int(lv * 1.9),
        dex: int(lv / 3),
        gjsd: 250,
      },
    };
  }

  pfm_set: PerformData = {
    duoming: {
      name: "夺命连环",
      distime: 30000,
      enable_skill: "sword",
      mp: 20,
      use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        if (me.query_temp("kuangfeng", 0))
          return me.notify("你的夺命连环还没释放完。");
        me.send_room(
          "<hir>$N一声清啸，手中$W快如狂风骤雨，劈头盖脸向$n刺去！</hir>\n",
          target,
        );
        let isMiss: boolean = false;
        for (let i: number = 0; i < 3; i++) {
          if (
            !me.do_attack({
              target: target,
              gj: me.gj,
              mz: me.mz,
              no_append: true,
            })
          ) {
            isMiss = true;
          }
        }
        if (isMiss) {
          me.send_room("<hic>$N一击未能尽功，当即收剑回防。</hic>");
        } else {
          me.set_temp("kuangfeng", 1, 5000);
        }
        me.end_attack(target);
      },
      query_desc: function (me: CHARACTER, lv: number): string {
        let per: number = 10 - int(lv / 100);
        if (per < 3) per = 3;
        return (
          "夺命连环三仙剑是剑宗狂风剑法的精髓，瞬间攻出三剑，如果三剑全部命中" +
          toSec(me.gjsd) +
          "秒后会继续触发夺命连环但是命中会降低" +
          per +
          "%"
        );
      },
    },
  };

  // 夺命连环追击
  on_attack_over(me: CHARACTER, target: CHARACTER, par: DoAttackPar): void {
    const kf_count: number = me.query_temp("kuangfeng", 0);
    if (kf_count) {
      me.send_room(
        "<hir>$N一击奏效，剑势如狂风不息，手中快剑连环追刺！</hir>\n",
      );

      let per: number = 10 - int(me.query_skill("kuangfengkuaijian2", 0) / 100);
      if (per < 3) per = 3;

      let mz: number = me.mz;
      mz = int(mz - (mz * (kf_count - 1) * per) / 100);
      if (mz < 0) mz = 0;

      let isMiss: boolean = false;
      for (let i: number = 0; i < 3; i++) {
        if (
          !me.do_attack({
            target: target,
            gj: me.gj,
            mz: mz,
            no_append: true,
          })
        ) {
          isMiss = true;
        }
      }
      if (isMiss) {
        me.send_room("<hic>$N剑势一顿，收招后退。</hic>");
        me.remove_temp("kuangfeng");
      } else {
        me.set_temp("kuangfeng", kf_count + 1, 5000);
      }
      if (par.is_dodged || par.is_parried) me.end_attack(target);
    }
  }
}
