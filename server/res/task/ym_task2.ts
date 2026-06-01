import { USERTASK } from "../../core/task/playertask.js";
import { WORLD } from "../../core/world.js";
import { NPC } from "../../core/char/npc.js";
import type { CHARACTER } from "../../core/char/character.js";
import type { USER } from "../../core/char/user.js";
import { ROOM } from "../../core/room/room.js";

interface YmRequest {
    npc: NPC | null;
    time: number;
    handler: ReturnType<typeof setTimeout>;
    wz: string;
}

export default class extends USERTASK {
    id = "yamen2";
    requests: Map<string, YmRequest> = new Map();

    on_create() {
    var task = USERTASK.GET('yamen2');
    if (task) {
        this.requests = (task as typeof this).requests;
    }
}
    query_title(player?: CHARACTER): string | undefined {
    if (!player) return;
    let tag = TAGS[player.query_temp('ym_level', 0) ?? 0];

    return `<${tag}>衙门追捕</${tag}>`;
}
    query_desc(player?: CHARACTER): string | undefined {
    if (!player) return;
    let request = this.query_request(player);
    if (!request) { player.remove_temp('ym_task'); return; }
    var str: string[] = ["扬州知府委托你追杀逃犯："];
    if (request && request.npc) {
        str.push(request.npc.name);
        str.push("，据说最近在");
        str.push(request.wz);
        str.push("出现过，你还有");
        var time = request.time - Date.now();
        if (time <= 0) {
            this.clear(player);
            return "你的任务失败了。";
        }
        str.push(String(parseInt(String(time / 60000))));
        str.push("分");
        str.push(String(parseInt(String((time % 60000) / 1000))));
        str.push("秒去寻找他。\n");
        let level = player.query_temp('ym_level', 0) ?? 0;
        let level2 = player.query_temp('ym_lv2', 0) ?? 0;
        if (level > 0)
            str.push("<mem>追捕成功后(", String(level2), '/', String(UPGRADE_COUNT[level]),
                ")，将提升为", TITLES[level + 1], "。</mem>");
        else
            str.push("<mem>追捕成功后将加入衙门兼职,每日获得衙门发放的报酬。</mem>");
    } else {
        str.push("找不到了。");
    }

    return str.join("");
}
    query_state(player?: CHARACTER): number | undefined {
    if (!player) return 0;
    let request = this.query_request(player);
    if (player.query_temp("ym_task") && request)
        return 1;
    return 0;
}
    start(player?: CHARACTER) {
    if (!player) return;
    if (player.query_temp("ym_task")) {
        var request = this.requests.get(player.id);
        if (request)
            return player.notify("程药发对你说道：你不是在追捕吗？ 好好干。");
    }
    let lv = player.query_temp('ym_level', 0) ?? 0;

    if (lv >= TITLES.length)
        return player.notify("程药发对你说道：你已经是最高等级的神捕，不用再证明自己。");

    const lv2 = player.query_temp('ym_lv2', 0);

    const npc = NPC.CLONE("pub/yamen");
    npc.init_from(player, lv, lv2);

    const rm = ROOM.RANDOM()!;
    rm.item_changed(npc, true);
    this.set_request(player, npc, rm.long_name());

    if (lv > 0) {
        player.notify("程药发对你说道：你来的正好，" + npc.name + "作恶多端，还请" + player.call() + "为民除害，听说他最近在" + rm.long_name() + "出现过。");

        player.send_commands('goto yamen2', '过去');
    }
    else {
        player.notify("程药发对你说道：这位" + player.call() + "，你还没加入衙门吧，这样，你去除掉" + npc.name + "，我就收了你，听说他最近在" + rm.long_name() + "出现过。");
    }

    player.set_temp("ym_task", npc.id);
    npc.set_temp("player", player.id);
    npc.on_died = this.check.bind(this, npc);
    npc.on_kill = this.check_player;
}
    to_taofan(player: CHARACTER) {
    var request = this.requests.get(player.id);
    if (request) {
        let npc = request.npc;
        if (npc && npc.hp > 0) {
            player.moveto(npc.environment, player.name + '离开了。', player.name + "走了过来。");
        }
    }
}
    query_request(me: CHARACTER) {
    return this.requests.get(me.id);
}
    set_request(me: CHARACTER, npc: NPC, wz: string) {
    this.requests.set(me.id, {
        npc: npc,
        time: Date.now() + 600000,
        handler: this.call_out(this.clear, 600000, me, npc),
        wz: wz
    });
}
    /** 分配给 NPC.on_kill 回调，this 指向 NPC 实例 */
    check_player(this: NPC, me: USER) {
    if (me.id != this.query_temp("player")) {
        return me.notify_fail(this.name + "对你喊道：" + me.call(true) + "，别多管闲事！");
    }
}
    remove_request(me: CHARACTER, isremove: boolean) {
    var request = this.requests.get(me.id);
    if (!request) return;
    if (isremove && request.npc) {
        request.npc.destroy();
        request.npc.send_room("<cyn>$N向后跃开三尺，高声喊道：青山不改，绿水长流，咱们走着瞧！</cyn>\n");
    }
    request.npc = null;
    clearTimeout(request.handler);
    this.requests.delete(me.id);
}
    check(npc: NPC, killer: USER, corpse: unknown) {
    var user = String(npc.query_temp("player") ?? '');
    if (!killer || killer.id != user || killer.query_temp("ym_task") != npc.id) {
        var real_player = WORLD.getUser(user);
        if (real_player) {
            real_player.notify("<hic>你追捕的逃犯被别人击杀，你的任务失败了。</hic>");
            real_player.remove_temp("ym_task");
            this.remove_request(real_player, false);
        }
        return;
    }
    const player = killer;
    this.remove_request(player, false);

    player.remove_temp("ym_task");

    let level = player.query_temp("ym_level", 0) ?? 0;
    if (level >= TITLES.length) return;

    if (level === 0) {
        player.notify("<hic>你成功帮助衙门追捕犯人，获得称号【衙役】</hic>");
        player.add_title(TITLES[1], "ym");
        player.add_temp("ym_level", 1);
        player.set_temp("ym_tm", Math.floor(Date.now() / 100000));
        player.notify("\n<hiy>扬州衙门将对你持续发放报酬，从任务栏领取。</hiy>\n");
    } else {
        let level2 = player.add_temp("ym_lv2", 1);
        if (level2 >= UPGRADE_COUNT[level]) {

            USERTASK.GET('yamen')!.on_finish(player);
            level = player.add_temp("ym_level", 1);
            player.remove_temp("ym_lv2");
            player.notify("<hic>你帮助衙门连续追捕犯人，获得称号：" + TITLES[level] + "。</hic>");
            player.add_title(TITLES[level], "ym");
            player.notify("<hiy>你的衙门报酬等级提高了。</hiy>");
        } else {

            player.notify("<hic>追捕成功，当前级别" + TITLES[level] + "(" + level2 + "/" + UPGRADE_COUNT[level] + ")。</hic>");

        }
        let obj = player.add_obj(["st/st_blu#",
            "st/st_gre#", "st/st_red#", "st/st_yel#"].random() + Math.min(level, 4));
        if (obj) {
            player.notify("你获得" + obj.unit_name(1) + "。");
        }
        let exp = [5000, 8000, 12000, 16000, 20000, 25000][level - 1];
        player.add_exp(exp, exp);
    }


}
    clear(player: CHARACTER, npc?: NPC) {
    this.giveup(player);
    player.notify("<red>你的追捕任务失败了。</red>");
}
    giveup(player: CHARACTER) {
    player.remove_temp("ym_task");
    this.remove_request(player, true);
}
}

const TAGS = ['wht', 'hic', 'hiy', 'hiz', 'hio', 'ora'];
const TITLES = ['', '衙役', '捕快', '捕头', '总捕头', '巡检 ', '神捕'];
const UPGRADE_COUNT = [1, 10, 10, 10, 10, 10];
const LEVEL_LIMIT = [0, 1000000, 5000000, 17000000, 80000000, 300000000, 1000000000];
const LEVEL_LIMIT2 = [0, 0, 0, 0, 23000000, 50000000, 1500000000];
