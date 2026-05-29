import { COMMAND } from "../../../os/command.js";

export default function() {
    const WORLD = globalThis.WORLD;
this.inherits(COMMAND);
this.command = "look1";
this.allow_busy = true;
this.allow_state = true;
this.regex = /^(\d+)(?:\sof\s(\w+))?$/;
//只能看排行榜的物品
this.enter = function (player, index, from) {
    index = parseInt(index);
    if (from) {
        var paras = from.split('_');
        let tops = WORLD.STATS.TOPS;
        if (paras[1]) tops = WORLD.STATS['tops_' + paras[1]] ?? [];
        let parent = tops[parseInt(paras[2])];
        if (!parent) {
            return player.notify("你要看什么？");
        }
        if (!(index >= 0 && index < 11)) return player.notify("你要看什么？");
        var item = parent.equipment[index];

        if (!item) return player.notify(parent.name + "没有装备你要看的东西。");
        player.notify(item.get_desc(parent));

    } else {
        var obj = WORLD.STATS.TOPS[index - 1];
        if (!obj) {
            return player.notify("你要看什么？");
        }
        if (obj.query_desc) {
            player.notify(obj.query_desc(player, "look1"));
        }
    }
}
}
