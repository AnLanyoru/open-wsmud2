import { ROOM } from "../../../../core/room/room.js";
import type { CHARACTER } from "../../../../core/char/character.js";
import type { NPC } from "../../../../core/char/npc.js";

export default class MapRoom extends ROOM {
    name = "黑鹰厅";
    desc = "高约三丈的穹顶下，黑檀木横梁上悬着一块鎏金 “奉旨缉拿” 匾额，边缘镶着铜质云纹，匾额下方垂着三盏羊角宫灯，灯影在青砖地面投下晃动的光斑。西侧墙根处有一扇半尺厚的<cmd cmd='look men'>铁门</cmd>，门框与石壁严丝合缝。";
    exits = { "south": "yz/hy/jiaochang5" };

    constructor() {
        super();
        this.set_npc('yz/hy/tiehu');
        this.set_item("men", "铁门", "一扇半尺厚的铁门，严丝合缝的嵌合在墙壁内", [
            ["tui", "推开", function (this: MapRoom, me: CHARACTER) {

                if (this.query_exits("down"))
                    return me.notify("铁门已经被你推开了。");

                me.send_room("$N大喝一声，使出全身力气推向铁门。");
                if (me.str > 25) {
                    me.send_room("<hic>铁门发出一阵沉闷的声响，缓缓打开了。</hic>");
                    this.add_exit('down', 'yz/hy/dilao');
                    this.call_out(this.close_men, 60000)
                } else {
                    me.send_room("<cyn>结果比$P的脸憋的通红，铁门仍然纹丝不动。</cyn>");
                }

            }]
        ]);
    }

    on_enter(me: CHARACTER) {
    if (me.is_player) {
        let npc = this.find_by_path('yz/hy/tiehu');
        if (npc && 'fight_type' in npc) {
            if ('on_kill' in npc && typeof npc.on_kill === 'function') npc.on_kill(me);
            if ('do_kill' in npc && typeof npc.do_kill === 'function') npc.do_kill(me);
        }
    }
}
    close_men() {
    if (this.query_exits("down")) {
        this.remove_exit("down");
        this.send("<cyn>铁门发出一阵沉闷的声响，又缓缓的关上了。</cyn>");
        const dilao = ROOM.Get('yz/hy/dilao');
        if (dilao) dilao.send("<cyn>铁门发出一阵沉闷的声响，又缓缓的关上了。</cyn>");
    }
}
}
