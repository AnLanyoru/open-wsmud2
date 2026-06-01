import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { WORLD } from "../../../core/world.js";
import { OBJ } from "../../../core/item/obj.js";
import { FAMILIES } from "../../../core/skill/family.js";
import { AREA } from "../../../core/room/area.js";
import { ROOM } from "../../../core/room/room.js";

export default class extends COMMAND {
    declare command: string;
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;
    fbs_json: string | null = null;
    fbs: AREA[] = [];
    families: AREA[] = [];
    areas: AREA[] = [];
    regex = /^(\w+)?\s?(lock|\d+)?(?:\s(start[1|2|3]?))?$/;

    /**
     * @param me - 执行命令的角色
     */
    enter(me: CHARACTER, type?: string, arg?: string, isstart?: string): void {
    if (!me.is_player) return;
    const unlock = me.query_temp("fb", 0) ?? 0;
    const unlock2 = me.query_temp("fb2", 0) ?? 0;
    if (arg == "lock")
        return me.send(`{type:"dialog",dialog:"jh",unlock:${unlock},unlock2:${unlock2}}`);
    if (!this.map_json) {
        this.map_json = this.getAllMaps();
    }
    if (!arg && !type) {
        me.send(this.map_json);
        me.send(`{type:"dialog",dialog:"jh",unlock:${unlock},unlock2:${unlock2}}`);
    } else {

        const index = parseInt(arg!);
        if (!isstart) {
            if (type == "fb") return this.return_fbdesc(me, index);
            if (type == "fam") return this.return_famdesc(me, index);
            else return this.return_areadesc(me, index);
        } else {
            if (me.check_command({
                allow_busy: false, allow_state: false,
                allow_die: false, allow_faint: false,
                allow_fight: false,
                enter: () => true
            }) == false) return;

            if (type == "fb") {
                const fb = this.fbs[index];
                if (fb.is_lock) {
                    return me.notify("暂未开放，正在修复");
                }
                if (fb.unlock_index) {
                    if (fb.unlock_index > unlock) {
                        return me.notify("你需要完成" + this.fbs[fb.unlock_index - 1].name + "才能解锁" + fb.name + "。");
                    }
                } else if (index > unlock) {
                    return me.notify(fb.name + "尚未解锁。");
                }
                if (!me.environment) return me.notify("你不知道在哪。");
                if (me.environment.is_fb()) return me.notify("你现在正在副本区域。");

                if (!fb || !fb.id) return me.notify("没有这个副本。");

                if (fb.start_room && !me.is_in(fb.start_room))
                    return me.notify('你要进入哪个副本？');
                if (isstart == "start1") {
                    //  if (me.team) return me.notify("你目前处于队伍当中，无法进入单人副本。");
                    const count = me.query_temp("fbc_0_" + fb.fb_index, 0);
                    if (count) {

                        me.notify("即将进入副本(" + fb.name + ")区域，已完成" + count + "次，本次副本需要消耗" + fb.expend + "点精力。\n当前精力：" + me.query_jingli!());
                    } else {
                        me.notify("即将进入副本(" + fb.name + ")区域，本次副本需要消耗" + fb.expend + "点精力。\n当前精力：" + me.query_jingli!());
                    }
                    let can_sd = false;
                    if (fb.unlock_index) {
                        can_sd = me.query_temp('fb_sao' + index, Number(0)) === 1;
                    } else {
                        const sdVal = me.query_temp('fb_sao0', Number(0));
                        can_sd = sdVal !== undefined && sdVal >= index;
                    }
                    if (can_sd) {
                        return me.send_commands('cr ' + fb.id, "进入副本", "cr " + fb.id + " 0 1", "扫荡一次",
                            "cr " + fb.id + " 0 10", "扫荡十次");
                    } else {
                        return me.send_commands('cr ' + fb.id, "进入副本");
                    }
                } else if (isstart == "start2") {
                    //   if (me.team) return me.notify("你目前处于队伍当中，无法进入单人副本。");
                    const count = me.query_temp("fbc_1_" + fb.fb_index, 0);
                    if (count) {
                        me.notify("即将进入副本(" + fb.name + ")<hir>困难区域</hir>，已完成" + count + "次，本次副本需要消耗" + fb.expend + "点精力。\n当前精力：" + me.query_jingli!());
                    } else {
                        me.notify("即将进入副本(" + fb.name + ")<hir>困难区域</hir>，本次副本需要消耗" + fb.expend + "点精力。\n当前精力：" + me.query_jingli!());
                    }
                    let can_sd = false;
                    if (fb.unlock_index) {
                        can_sd = me.query_temp('fb_sao' + fb.index, Number(0)) === 2;
                    } else {
                        const sdVal = me.query_temp('fb_sao1', Number(0));
                        can_sd = sdVal !== undefined && sdVal >= index;
                    }
                    if (can_sd) {
                        return me.send_commands('cr ' + fb.id + " 1 0", "进入副本", "cr " + fb.id + " 1 1",
                            "扫荡一次", "cr " + fb.id + " 1 10", "扫荡十次");
                    } else {
                        return me.send_commands('cr ' + fb.id + " 1 0", "进入副本");
                    }

                } else if (isstart == "start3") {
                    if (!me.team) return me.notify("你目前没有在队伍当中，无法进入组队副本。");
                    for (let i = 0; i < me.team.length; i++) {
                        const tm = me.team[i];
                        if (tm.environment && tm.environment.is_fb() &&
                            tm.environment.parent != fb) {
                            return me.notify(tm.name + "现在正在副本【" + tm.environment.parent!.name + "】区域，无法开启其它副本。");
                        }
                    }


                    me.send("即将组队进入副本(" + fb.name + ")区域，本次副本需要消耗" + fb.expend + "点精力。\n当前精力：" + me.query_jingli!() + "/100");
                    return me.send_commands('cr ' + fb.id + " 2 0", "进入副本");

                }

            } else if (type === 'ar') {
                if (!me.can_trans!()) return;
                const fb = this.areas[index];
                if (!fb || !fb.id) return me.notify("没有这个禁地区域。");
                if (!(fb.jd_index! >= 0)) return me.notify("没有这个禁地区域。");
                if (fb.is_lock) return me.notify("暂未开放，正在修复");
                let diff = 0;
                if (me.team) diff = 2;
                if (!me.isenable_area!(fb)) return me.notify("未解锁区域");

                if (fb.is_copy && !fb.not_fb) {//禁地类型的副本
                    this.enter_ar_fb(me, fb, diff);
                } else {
                    if (fb.on_enter(me) == false) {
                        return;
                    }
                    me.moveto(fb.first!, me.name + "走了。", me.name + "来了。");
                }
            } else {
                if (!me.can_trans!()) return;
                const fb = this.families[index];
                if (!fb || !fb.first) return me.notify("没有这个门派。");
                if (fb.on_enter(me) == false) {
                    return;
                }
                me.moveto(ROOM.Get(fb.first)!, me.name + "走了。", me.name + "来了。");
            }
            me.send('{type:"dialog",dialog:"jh",close:true}');

        }


    }

}
    enter_ar_fb(me: CHARACTER, fb: AREA, diff: number = 0): void {
    const count: number | undefined =
        me.query_temp(fb.count_key ?? ("fbc_0_" + fb.fb_index), 0);

    if (count) {
        me.notify("即将进入禁地副本(" + fb.name
            + ")区域，已完成" + count +
            "次，本次副本需要消耗<hic>" + fb.expend
            + "</hic>点精力。\n当前精力：" + me.query_jingli!());
    } else {
        me.notify("即将进入禁地副本(" + fb.name
            + ")区域，本次副本需要消耗<hic>" + fb.expend
            + "</hic>点精力。\n当前精力：" + me.query_jingli!());
    }
    const can_sd = me.query_temp('fb_sao' + fb.fb_index, Number(0)) === 1;

    if (can_sd) {
        let sd_diff = diff;
        if (sd_diff === 2) sd_diff = 0;
        return me.send_commands('cr ' + fb.id + " " + diff + " 0",
            "进入副本", "cr " + fb.id + " " + sd_diff + " 1",
            "扫荡一次", "cr " + fb.id + " " + sd_diff + " 10", "扫荡十次");
    } else {
        return me.send_commands('cr ' + fb.id + " " + diff + " 0",
            "进入副本");
    }
}

    return_famdesc(me: CHARACTER, index: number): void {

    if (!(index >= 0 && index < this.families.length)) return me.notify("没有这个门派。");
    const fb = this.families[index];
    if (!fb) return me.notify("没有这个门派。");
    if (fb.json) return me.send(fb.json);
    const obj: Record<string, unknown> = {
        type: "dialog",
        dialog: "jh",
        index: index,
        ref: fb.no_cache ? 0 : 1,
        desc: fb.query_desc(),
        actions: fb.query_actions(me),
        sp: fb.sp,
        t: "fam",
    };

    if (fb.family) {
        const fam = FAMILIES[fb.family];
        if (fam) {
            fb.skills = fam.skills;
            fb.skills2 = fam.skills2;
            fb.skills4 = fam.skills4;
        }
    }
    const str: string[] = [];
    if (fb.skills) {
        str.push("门派武功：\n");
        for (let i = 0; i < fb.skills.length; i++) {
            str.push("<span cmd='checkskill ");
            str.push(fb.skills[i].id!);
            str.push(" help'>");
            str.push(fb.skills[i].color_name);
            str.push("</span>\n");
        }
    }

    if (str.length) obj.skills = str.join("");
    fb.json = JSON.stringify(obj);
    me.send(fb.json);
}
    return_areadesc(me: CHARACTER, index: number): void {
    if (!(index >= 0 && index < this.areas.length)) return me.notify("没有这个副本。");
    const fb = this.areas[index];
    if (!fb) return me.notify("没有这个区域。");
    if (fb.json) return me.send(fb.json);

    const obj: Record<string, unknown> = {
        type: "dialog",
        dialog: "jh",
        t: "ar",
        index: index,
        desc: fb.desc,
        actions: fb.query_actions(me),
        reward: "掉落或解谜奖励：\n" + this.fb_drops(fb),
    };

    fb.json = JSON.stringify(obj);
    me.send(fb.json);
}
    return_fbdesc(me: CHARACTER, index: number): void {
    if (!(index >= 0 && index < this.fbs.length)) return me.notify("没有这个副本。");
    const fb = this.fbs[index];
    if (!fb) return me.notify("没有这个副本。");
    if (fb.json) return me.send(fb.json);
    const obj: Record<string, unknown> = {
        type: "dialog",
        dialog: "jh",
        t: "fb",
        index: index,
        desc: fb.desc,
    };

    obj.status = this.fb_status(fb);
    const str: string[] = [];
    const exp = fb.query_exp();
    str.push("获得");
    str.push(String(exp));
    str.push("点经验，");
    str.push(String(exp));
    str.push("点潜能\n掉落或解谜奖励：\n");

    str.push(this.fb_drops(fb));
    obj.reward = str.join("");
    obj.diffs = [1, fb.is_diffi ? 1 : 0, fb.is_multi ? 1 : 0];
    fb.json = JSON.stringify(obj);
    me.send(fb.json);
}
    fb_drops(fb: AREA): string {
    const json: string[] = [];
    const drops: string[] = fb.drops || [];
    fb.drop_items = [];
    for (let i = 0; i < drops.length; i++) {
        const oitem = OBJ.CREATE(drops[i]);
        if (oitem) {
            json.push("<span cmd='look3 " + fb.drop_items.length
                + " of fb_" + fb.area_index + "'>" + oitem.color_name + "</span>");

            fb.drop_items.push(oitem);
        }
    }
    return json.join("\n");
}
    fb_status(fb: AREA): ([number, string] | null)[] {
    const status: ([number, string] | null)[] = [];
    const fblock = fb.fb_index + 1;
    let fb_key = "fb_first_" + fblock + "_0";
    let ss_0 = WORLD.DATA.query_temp(fb_key);
    if (ss_0) {
        status[0] = [1, ss_0 as string];
    } else {
        status[0] = [0, fb.is_diffi ? "" : (fb.ss_title ?? "")];
    }
    if (fb.is_diffi) {
        fb_key = "fb_first_" + fblock + "_1";
        ss_0 = WORLD.DATA.query_temp(fb_key);
        if (ss_0) {
            status[1] = [1, ss_0 as string];
        } else {
            status[1] = [0, fb.ss_title ?? ""];
        }
    } else {
        status[1] = null;
    }
    if (fb.is_multi) {
        fb_key = "fb_first_" + fblock + "_2";
        ss_0 = WORLD.DATA.query_temp(fb_key);
        if (ss_0) {
            status[2] = [1, ss_0 as string];
        } else {
            status[2] = [0, ""];
        }
    }
    return status;
}
    init(): void {

    this.map_json = this.getAllMaps();
}
    getAllMaps(me?: CHARACTER): string {
    const map: {
        type: string;
        dialog: string;
        fbs: string[];
        families: (string | undefined)[];
        areas: (string | undefined)[];
    } = {
        type: "dialog",
        dialog: "jh",
        fbs: [],
        families: [],
        areas: [],
    };

    this.fbs = [];
    this.families = [];
    this.areas = [];
    for (let i = 0; i < WORLD.AREAS.length; i++) {
        const area = WORLD.AREAS[i];
        area.area_index = i;
        const areasVal = AREAS[area.id];
        if (areasVal !== undefined && areasVal >= 0) {
            const index = areasVal;
            map.families[index] = area.name;
            this.families[index] = area;
        } else {
            const fbVal = FBS[area.id];
            if (typeof fbVal === 'number' && fbVal >= 0) {
                area.fb_index = fbVal;
                map.fbs.push(area.name);
                this.fbs.push(area);
                FBS[area.id] = area;
            } else {
                const jdVal = JDS[area.id];
                if (jdVal !== undefined && jdVal >= 0) {
                    const index = jdVal;
                    area.jd_index = index;

                    this.areas[index] = area;
                    map.areas[index] = area.name;
                }
            }
        }
    }
    AREA.FBS = this.fbs;
    return JSON.stringify(map);
}
    get_area(id: string): AREA | null {
    if (!this.areas) this.getAllMaps();
    const index = AREAS[id];
    if (index !== undefined && index >= 0) {
        return this.areas[index];
    }
    return null;
}
}

AREA.Get_FB = function (this: void, id: string): AREA | undefined {
    const val = FBS[id];
    return val instanceof AREA ? val : undefined;
};
const AREAS: Record<string, number> = {
    yz: 0, wudang: 1, shaolin: 2, huashan: 3, emei: 4,
    xiaoyao: 5, gaibang: 6, shashou: 7, xiangyang: 8, wudao: 9
};
const FBS: Record<string, number | AREA> = {
    "lw": 0, "cuifu": 1, "lmw": 2, "lcy": 3,
    "by": 4, "zhuang": 5, "ao": 6, "tdh": 7
};
const JDS: Record<string, number> = {
    heiying: 0,
};
