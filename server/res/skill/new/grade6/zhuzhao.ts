import { SKILL, PERFORM } from "../../../../core/skill/skill.js";
import type { PerformData } from "../../../../core/skill/skill.js";
import type { PropMap } from "../../../../types/props.js";
import type {
  CHARACTER,
  DoAttackPar,
} from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
  name = "太阳烛照";
  id = "zhuzhao";
  grade = 6;

  desc =
    "上古太阳星中诞生的至阳生灵，掌控烈焰之力，其光灼灼，其势煌煌，万物莫能挡";
  can_enables = [];

  query_prop(lv: number): PropMap {
    return {
      gj: lv * 3,
      mz: lv * 3,
      fy: lv * 3,
      zj: lv * 3,
      ds: lv * 3,
    };
  }

  pfm_set: PerformData = {
    yan: {
      name: "烈焰",
      distime: 30000,
      enable_skill: "force",
      mp: 34170,
      release_time: 0,
      use: function (me: CHARACTER, target: CHARACTER, lv: number) {
        me.send_room(
          "<HIR>$N周身腾起滔天烈焰，化作一道火柱朝$n席卷而去！</HIR>",
          target,
        );
        me.do_attack({ target, gj: Math.floor(me.gj * 2.5), mz: me.mz });

        if (target.hp > 0) {
          var dmg = Math.floor(lv * 5);
          target.add_status(
            {
              id: "zhuzhao_shaoshang",
              name: "灼烧",
              desc: "被太阳烛照的烈焰灼烧",
              duration: 12000,
              duration_count: 4,
              downside: true,
              override: 1,
              on_interval: function (t, count) {
                t.from_attack(
                  dmg,
                  999999,
                  "",
                  "<HIR>$n身上的烈焰仍在燃烧！</HIR>",
                );
              },
              finish_msg: "<HIW>$n身上的烈焰终于熄灭。</HIW>",
            },
            me,
          );
        }

        me.end_attack(target);
      },
      query_desc: function (me: CHARACTER, lv: number) {
        return "灼烧敌人";
      },
    },
    hou: {
      name: "怒吼",
      distime: 7000,
      enable_skill: "force",
      mp: 44880,
      use: function (me: CHARACTER, target: CHARACTER, lv: number) {
        me.send_room(
          "<HIR>$N一声怒吼，周身烈焰暴涨，炽热的气浪朝$n猛扑而去！</HIR>",
          target,
        );
        me.add_status({
          id: "zhuzhao_nouhou",
          name: "蓄力",
          duration: 3000,
          prop: {
            gj_per: 40,
            mz_per: 40,
          },
          finish_msg: "<HIW>$N的怒吼余威渐散。</HIW>",
        });
        me.do_attack({
          target,
          gj: Math.floor(me.gj * 2),
          mz: Math.floor(me.mz * 2),
        });
        me.end_attack(target);
      },
      query_desc: function (me: CHARACTER, lv: number) {
        return "吸气攻击";
      },
    },
  };
}
