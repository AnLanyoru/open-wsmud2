import { COMMAND } from "../../../os/command.js";

export default function() {
    const FOLLOWER = globalThis.FOLLOWER;
this.inherits(COMMAND);
this.command = "dismiss";
this.regex = /^(\w+)(\s+ok)?$/;
this.enter = function (me, objid, isok) {
    var npc = me.find_obj(objid, me.environment);
    if (!npc) return me.notify("你要遣散谁？");
    if (!npc.master || npc.master != me.id) return me.notify("你不能遣散" + npc.call3() + "。");
    if (npc.team) return me.notify(npc.name+"需要离开队伍才可以遣散。");
    if (isok) {
       
        for (var i = 0; i < me.follower.length; i++) {
            if (me.follower[i].id == objid) {
                me.follower.splice(i, 1);
                npc.set_state(null);
                npc.environment && npc.environment.item_changed(npc, false);
                FOLLOWER.STORES.delete(me.id + "_" + npc.id);

                return me.notify(npc.name + "遣散成功，以后" + npc.call3()+"和你再没有任何关系了。");
            }
        }
        me.notify("遣散失败。");

    } else {
        me.notify("<hir>是否确认遣散" + npc.name + "？" + npc.call3() + "的背包，技能，装备将会被清空，随从将被删除，该操作无法恢复。</hir>");

        me.send_commands("dismiss " + objid + " ok", "确定遣散");
    }
}
}
