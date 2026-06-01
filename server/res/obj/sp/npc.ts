import { OBJ } from "../../../core/item/obj.js";
import { SKILL } from "../../../core/skill/skill.js";
import { NPC } from "../../../core/char/npc.js";
import { FOLLOWER } from "../../../core/char/follower.js";

export default class extends OBJ {
    unit = "张";
    name = "契约";
    desc = "一张契约";
    value = 100000;
    grade = 5;
    npcs = {
    wang: "follower/wang",
    shuang: "follower/shuang",
    zhou: "follower/zhou",
    cheng: "follower/cheng",
    xiaozhao: "follower/xiaozhao",
    zhang: "follower/zhang",
    xia: "follower/xia",
    wen: "follower/wenyi",
    liumang: "yz/lm/xiaolm",
    wei: "yz/lcy/weichunfang",
    aobai: "bj/ao/aobai",
    qufeiyan: "wuyue/henshan/qufeiyan",
    huang: "follower/huang",
    azi: "follower/azi",
    azhu: "murong/azhu",
    abi: "murong/abi",
    long: "follower/xiaolongnv",
    qing: "follower/qing",
    qin: "follower/qin",
    lang: "follower/lang",
    dini: "follower/dini",
    shimei: "follower/shimei"
};

    on_use(me, par) {
    if (!me.is_player) return me.notify_fail("你不能使用契约书。");
    if (me.environment.parent.id != "home") return me.notify_fail("你只能在自己家使用契约。");
    if (!this.npc_path) return me.notify("你使用了契约书，可是没有任何反应。");
    var npc = NPC.CLONE(this.npc_path);
    if (!npc) return me.notify("你使用了契约书，可是没有任何反应。");
    var max = me.query_temp("max_follower", 3);
    var is_max = false;
    if (me.follower && me.follower.length >= max) is_max = true;
    if (!par && is_max) {
        var str = ["{type:\"cmds\",items:["];
        for (var i = 0; i < me.follower.length; i++) {
            if (me.follower[i].path == npc.path) {
                return me.notify_fail("你已经拥有" + npc.name + "了。");
            }
            var follower = FOLLOWER.GET(me, me.follower[i]);
            if (!follower) return me.notify_fail("未能读取到你的追随者，请尝试出去住所重新进入。");
            if (str.length > 1) str.push(",");
            str.push("{cmd:\"use ");
            str.push(this.id);
            str.push(" ");
            str.push(follower.id);
            str.push("\",name:\"继承");
            str.push(follower.name);
            str.push("的属性\"}");
        }
        me.send("你家的位置已经不多了，请选择如何安置" + npc.name
            + "：\n<hir>会继承你选择的随从的经验，潜能，背包，装备。技能取两者的最高等级，进阶后的技能将保持等级不变</hir>");
        str.push("]}");
        me.send(str.join(""));
        return false;
    } else if (par) {
        for (var i = 0; i < me.follower.length; i++) {
            if (me.follower[i].path == npc.path) {
                return me.notify_fail("你已经拥有" + npc.name + "了。");
            }
        }
        var follower = FOLLOWER.GET(me, { id: par });
        if (!follower) return me.notify_fail("你家没有这个人。");
        // for (let sk in follower.skills) {
        //     let skill = follower.skills[sk];
        //     if (skill.addin && skill.addin.length)
        //         return me.notify_fail(follower.name
        //             + "的技能" +
        //             SKILL.get(sk).query_color_name(follower) + "已经进阶，取消进阶才可以覆盖。");
        // }
        let old_name = follower.name;
        FOLLOWER.REPLACE(me, follower, npc);
        follower.master_json = null;
        if (follower.actions) {
            for (let item of follower.actions) {
                item.name = item.name.replace(old_name, npc.name);
            }
        }
        me.notify("<him>恭喜你获得了" + npc.name + "的追随。</him>");
    } else {
        if (me.add_follower(npc)) {
            me.notify("<him>恭喜你获得了" + npc.name + "的追随。</him>");
            me.environment.item_changed(FOLLOWER.GET(me, npc), true);
        } else {
            return me.notify_fail("召唤失败。");
        }
    }


}
    on_create(path, par) {
    if (!par) {
        return;
    }
    path = this.npcs[par.substr(1)];
    if (!path) return;
    var npc = NPC.CLONE(path);
    if (!npc) return;
    this.name = "契约：" + npc.name;
    this.desc = "这是一张契约书，在你的家里使用就可以拥有" + npc.name + "，你最多可以拥有三个追随者，新增的会继承原先NPC的技能，装备，物品。";
    this.npc_path = path;
}
}

