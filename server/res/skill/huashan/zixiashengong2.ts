import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";
import type { PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

/**
 * 紫霞神功进阶 (品级4)
 * 完善度50
 */
export default class extends SKILL {
  name = "紫霞神功";
  id = "zixiashengong2";
  source_skill = "zixiashengong";
  grade = 4;
  force_rad = 0.7;
  family = FAMILIES.HUASHAN;
  desc = "华山派的内功心法，气宗的立派根本，以修炼时身上紫气环绕而得名";
  can_enables = ["force"];

  slots: Array<{
    prop: string;
    value: (lv: number) => number;
    format: (val: number) => string;
  }> = [
    {
      prop: "zxsg_nl_max",
      value: (lv: number) => 120000,
      format: (val: number) => "内力上限：+" + val,
    },
    {
      prop: "zxsg_cd",
      value: (lv: number) => 5000,
      format: (val: number) => "紫气东来招冷却时间减少" + toSec(val) + "秒",
    },
  ];

  query_enable_prop(lv: number): EnablePropMap {
    return {
      force: {
        gj: 10 + int(lv * 1.6),
        mz: 10 + int(lv * 1.5),
        add_sh_per: 1 + int(lv / 300),
        limit_mp: lv * 160,
        desc: "唯一：将你内力的70%转化为气血",
      },
    };
  }

  pfm_set: PerformData = {
    xi: {
      name: "紫气东来",
      distime: 60000,
      enable_skill: "force",
      mp: 20,
      release_time: 0,
      use_type: 2,
      use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        const per: number = 20 + int(lv / 100);
        const time: number = 20000 + lv * 10;
        me.send_room(
          "<mag>$N微一凝神，运起紫霞神功，霎时间周身紫气大盛，如朝霞映日，气贯长虹！</mag>\n",
          target,
        );
        me.add_status({
          id: "force",
          name: "紫气东来",
          desc: "紫霞真气激荡，战力大幅提升",
          duration: time,
          prop: {
            add_sh_per: per,
            mz_per: per,
          },
          finish_msg: "$N的紫霞神功运行完毕，周身紫气缓缓收回丹田。",
        });
      },
      query_desc: function (me: CHARACTER, lv: number): string {
        const per: number = 20 + int(lv / 100);
        const time: number = 20000 + lv * 10;
        return (
          "使用紫霞神功提升战力，增加你的最终伤害" +
          per +
          "%，命中增加" +
          per +
          "%，持续" +
          toSec(time) +
          "秒"
        );
      },
    },
  };
}

// ========== 公共计算函数 ==========

/** 紫气东来百分比加成 */
export function xi_per(lv: number): number {
  return 20 + int(lv / 100);
}

/** 紫气东来持续时间 */
export function xi_time(lv: number): number {
  return 20000 + lv * 10;
}
