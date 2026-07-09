import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";
import type { PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER } from "../../../core/char/character.js";

/**
 * 飞龙探云手 — 六扇门拳脚功夫（高级技能）
 * 六扇门捕快用以搜查取证的独门手法，虽不擅长正面搏杀，却有一手神不知鬼不觉的妙用。
 * 完善度：50%
 */
export default class extends SKILL {
  name = "飞龙探云手";
  id = "feilongshou";
  grade = 2;
  family = FAMILIES.LIUSHAN;
  desc =
    "六扇门的拳脚功夫，虽正面搏杀不出众，却练就了一手掏摸取物的独门手法——「探龙」。";
  can_enables = ["unarmed"];

  attack_actions = SKILL.get("unarmed")?.attack_actions || [];

  slots = [
    {
      prop: "flts_td",
      value: (_lv: number) => 250,
      format: (val: number) => "飞龙探云手偷盗的有效等级增加" + val,
    },
  ];

  query_enable_prop(lv: number): EnablePropMap {
    return {
      unarmed: {
        mz: 24 + lv * 2,
      },
    };
  }

  pfm_set: PerformData = {
    tan: {
      name: "探龙",
      distime: 18000,
      enable_skill: "unarmed",
      mp: 20,
      allow_safe: true,
      use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        // 必须是NPC
        if (!target || target.is_player) {
          me.notify("你只能对NPC使用探龙手法。");
          return;
        }

        const effectiveLv = lv + me.query_prop("flts_td");
        const targetLv = target.level || 1;

        // 成功率基于有效等级与目标等级的比值
        const successRate = Math.min(
          0.9,
          (effectiveLv / (targetLv + effectiveLv)) * 1.2,
        );
        const roll = Math.random();

        if (roll > successRate) {
          // 失败：目标察觉
          me.send_room(
            "<cyn>$N伸手向$n怀中探去，$n似有所觉，侧身避开。</cyn>",
            target,
          );
          me.notify("你的探龙手法被" + target.name + "察觉了！");
          // 失败后可能引发战斗
          target.add_enemy(me);
          return;
        }

        // 成功：从目标身上获取物品
        const items = target.items;
        if (!items || items.length === 0) {
          me.notify(target.name + "身上空空如也，什么也没摸到。");
          me.send_room("<cyn>$N探手向$n摸去，却什么也没找到。</cyn>", target);
          return;
        }

        const idx = Math.floor(Math.random() * items.length);
        const stolen = items[idx];

        // 转移物品
        target.remove_item(stolen, 1);
        if (!me.items) {
          me.items = [];
        }
        me.items.push(stolen);

        me.send_room(
          "<HIC>$N身形一晃，探手间已从$n身上取走一物，手法之快，令人咋舌！</HIC>",
          target,
        );
        me.notify(
          "你以飞龙探云手从" +
            target.name +
            "身上摸到了「" +
            (stolen.name || "物品") +
            "」。",
        );
      },
      query_desc: function (_me: CHARACTER, _lv: number): string {
        return "偷盗你附近NPC的物品，只可在非公共区域使用。";
      },
    },
  };
}
