import {ROOM} from "../../../core/room/room.js";
import {FOLLOWER} from "../../../core/char/follower.js";
import type {CHARACTER} from "../../../core/char/character.js";
import { USER } from "../../../core/char/user.js";

export default class MapRoom extends ROOM {
    name = "卧室";
    desc = "这是你的卧室，房间不大陈设也不多，但是收拾的干净整洁，房间里面除了一张楠木大床，一张书桌，一个箱子就没别的东西了。";
    exits = {"out": "yz/home"};
    allow_store = true;

    constructor() {
        super();
        this.add_action("store", "打开仓库", function (this: MapRoom) {
        });
        this.add_action("xiulian", "修炼", function (this: MapRoom) {
        });
        this.add_action("fenpei", "分配属性", function (this: MapRoom) {
        });
        this.add_action("sleep", "睡觉", function (this: MapRoom, me: CHARACTER) {

            me.notify("你躺到床上被子一盖，不一会就呼呼的睡着了。");
        });
    }

    on_enter(me: USER | FOLLOWER) {
        if (me instanceof USER && me.follower) {
            for (var i = 0; i < me.follower.length; i++) {
                FOLLOWER.CREATE(me, me.follower[i], this.on_npc_create.bind(this, me));
            }
        }
        if (me instanceof FOLLOWER && me.master) {
            me.action_list = [
                {cmd: "makelove " + me.id, name: "和" + me.name + "双修"}
            ];
            me.master_json = null;
        }
        me.add_status({
            id: "room",
            duration: 0,
            desc: "你在自己的房间，身心得到放松，提高修炼效率",
            name: "静心",
            prop: {
                study_per: 10,
                lianxi_per: 10,
                dazuo_per: 10
            }
        });
    }

    on_leave(me: USER | FOLLOWER) {
        if (me instanceof FOLLOWER && me.master) {
            me.action_list = null;
            me.master_json = null;
        }
        me.remove_status("room");
    }

    on_npc_create(me: USER, npc: FOLLOWER) {
        if (!npc) return;
        if (npc.environment?.parent?.id == "home") {
            if (!npc.team || npc.team != me.team) return;
        }
        if (!npc.hp) npc.hp = 1;
        if (npc.state) npc.set_state(null);
        npc.moveto(this, npc.name + "离开了。", npc.name + "走了过来。");

        npc.on_master_enter && npc.on_master_enter(me);
    }
}

