import { SKILL } from "../../../../core/skill/skill.js";
import type {
  PerformData,
  EnablePropMap,
} from "../../../../core/skill/skill.js";
import type {
  CHARACTER,
  DoAttackPar,
} from "../../../../core/char/character.js";

// ============================================================
// 惊鸿步 — 公共绝世武功（清音阁）
// ============================================================

export default class extends SKILL {
  name = "惊鸿步";
  id = "jinghongbu";
  grade = 4;

  desc = "传说是已经消失的清音阁的轻功身法，其形如惊鸿，身如游龙";
  can_enables = ["dodge"];

  dodge_actions = [
    "$n身如惊鸿掠水，足尖一点已飘然远去，$N的招式尽数落空。\n",
    "$n步法翩若游龙，身形夭矫而起，$N只见一道残影掠过，攻势已失目标。\n",
    "只见$n一式「鸿飞冥冥」，衣袂翻飞间已掠至数丈之外，$N追之不及。\n",
    "$n宛若惊鸿照影，身形忽左忽右飘忽不定，$N眼花缭乱，招招落空。\n",
    "$n步踏清音之律，身随乐韵流转，$N的攻击如击水中之月，徒留涟漪。\n",
    "$n双臂轻展如鸿雁翔空，身形借势飘然而起，$N的攻势堪堪擦过$n足底。\n",
  ];

  slots = [
    {
      prop: "jhb_cd",
      value: (_lv: number) => 5000,
      format: (val: number) => "掠影冷却时间减少" + toSec(val) + "秒",
    },
    {
      prop: "jhb_count",
      value: (_lv: number) => 2,
      format: (val: number) => "掠影闪避攻击次数+" + val,
    },
  ];

  pfm_set: PerformData = {
    lueying: {
      name: "掠影",
      distime: 45000,
      enable_skill: "dodge",
      mp: 60,
      release_time: 1000,
      use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        const baseCount = query_jhb_count(lv);
        const extraCount = me.query_prop("jhb_count");
        const totalCount = baseCount + extraCount;
        // 设置足够长的窗口期，确保在战斗中能消耗完次数
        const duration = 10000;

        me.set_temp("jhb_ly", totalCount, duration);

        me.add_status({
          id: "jhb_ly",
          name: "掠影",
          duration: duration,
          is_miss: true,
          finish_msg: "$N的掠影身法已散，身形不再飘忽难测。",
        });

        me.send_room(
          "<HIC>$N身形如惊鸿般掠起，步法飘忽若幻，刹那间仿佛化作数道残影，令人难以捉摸！</HIC>",
          target,
        );
      },
      query_desc: function (_me: CHARACTER, lv: number): string {
        const count = query_jhb_count(lv);
        return (
          "闪避接下来的" + count + "次攻击。(优先级低于定身和无法躲闪的攻击)"
        );
      },
    },
  };

  /** 掠过：每次成功闪避扣除一次掠影次数 */
  on_dodge_over(target: CHARACTER, me: CHARACTER, _par: DoAttackPar): void {
    const remaining = me.query_temp("jhb_ly", 0);
    if (remaining > 0) {
      me.set_temp("jhb_ly", remaining - 1);
      if (remaining <= 1) {
        me.remove_status("jhb_ly");
      }
    }
  }

  query_enable_prop(lv: number): EnablePropMap {
    return {
      dodge: {
        ds: Math.floor(lv * 1.5) + 25,
        gj: Math.floor(lv * 0.6) + 8,
        con: Math.floor(lv * 0.1) + 8,
        dex: Math.floor(lv * 0.1) + 8,
      },
    };
  }
}

// ============================================================
// 惊鸿步 — 公共计算函数
// ============================================================

/** 掠影：基础闪避次数 */
function query_jhb_count(lv: number): number {
  return 3 + Math.floor(lv / 1000);
}
