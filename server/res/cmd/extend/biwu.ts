import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { USER } from "../../../core/char/user.js";
import { NPC } from "../../../core/char/npc.js";
import { ROOM } from "../../../core/room/room.js";
import { WORLD } from "../../../core/world.js";
import { UTIL } from "../../../core/util/util.js";
import { EQUIPMENT } from "../../../core/item/equipment.js";
import type { StatsTopEntry } from "../../../types/world.js";

export default class extends COMMAND {
    command = "biwu";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    biwu_step: number = 0;
    biwu_state = {
        allow_busy: false,
        allow_state: false,
        allow_die: false,
    };
    regex = /^(emei|wudang|shaolin|huashan|xiaoyao|gaibang|shashou|none)?\s*(\d+)(?:\s+(ok))?$/;

    enter(me: CHARACTER, fam?: string, type?: string, par?: string) {
        if (!me.can_trans?.()) return;
        if (!WORLD.COMMANDS["events"]?.check_command?.(this.biwu_state, me)) return;
        const index = parseInt(type!);
        if (!(index > 0 && index < 11)) return me.notify("错误的对手编号。");

        if (fam && me.family!.id !== fam.toUpperCase())
            return me.notify("你只能挑战自己门派的高手榜单。");
        const top_key = fam ? "top_fam" : "top";
        const top: number = me.query_temp(top_key, 999) ?? 999;
        if (top === index) {
            return me.notify("你不能挑战自己。");
        }
        if (top <= index)
            return me.notify("你只能挑战积分比你高的对手。");
        const max = Math.floor((me.query_temp("ex_jl", 0) ?? 0) / 40);

        const count: number = me.query_temp("top_c", 0) ?? 0;
        if (count >= max) return me.notify("你今天的挑战次数已经用尽，每日精力每消耗40增加一次挑战机会。");
        if (!par) {
            me.notify(`<hig>当你每消耗40精力后，增加一次挑战机会，当前可挑战次数${count}/${max}</hig>`);
            if (count < max) {
                const famStr = fam ? (fam + " ") : "";
                return me.send_commands("biwu " + famStr + type + " ok", "确定挑战");
            }
            return;
        }
        if (me.state) return me.send("你正在" + me.state.title + "。");
        if (me.status && me.status.length)
            return me.send("你需要清理掉自身的增益效果才可上擂台挑战。");
        if (me.hp / me.max_hp < 0.9 || me.mp / me.max_mp < 0.9)
            return me.send("你先调整好自身的状态再来挑战吧。");

        this.start_biwu(me, fam, index - 1);
    }

    start_biwu(me: CHARACTER, fam: string | undefined, index: number) {
        let tops = WORLD.STATS.TOPS;
        if (fam) tops = WORLD.STATS["tops_" + fam.toUpperCase()] as StatsTopEntry[] | undefined || [];
        if (!tops) return me.send("错误的对手，无法挑战。");

        const topEntry = tops[index];
        if (!topEntry) {
            return me.send("错误的对手。");
        }
        if (me.moveto("yz/leitai/leitai") === false) return;

        const npc = this.create_npc(topEntry, fam);
        const room = me.environment!;

        me.die = challenge_end;
        npc.die = challenge_end;
        room.on_heart_beat = this.on_heart_beat;
        room.biwu_step = 0;
        me.auto_pfm = true;
        const checkPfm = this.check_pfms;
        me.check_pfms = function (this: CHARACTER, target: CHARACTER): boolean | undefined {
            return checkPfm.call(this, target);
        };
        me.init_pfms = this.init_pfms;

        npc.fight_type = 0;
        room.item_changed(npc, true, npc.name + "跳上了擂台。");
        npc.full();
        me.add_temp("top_c", 1, UTIL.diff_time());
        me.set_temp("biwu_fam", fam);
        me.call_interval(
            (x: number) => {
                me.send_message("\n<hic>挑战还有" + (3 - x) + "秒钟正式开始！</hic>", true);
            },
            1000,
            3,
            function () {
                npc.do_kill(me);
            },
        );

        me.send('{type:"dialog",dialog:"stats",close:true}');
    }

    surrender(me: CHARACTER) {
        const room = me.environment!;
        let npc: CHARACTER = room.items![1] as unknown as CHARACTER;
        if (npc.is_player) {
            npc = room.items![0] as unknown as CHARACTER;
        }
        me.end_fight();
        npc.end_fight();
        challenge_over(me, 2);
        challenge_fail(me);
    }

    on_heart_beat(this: ROOM, _dt: number) {
        this.biwu_step = (this.biwu_step || 0) + 1;
        if (this.biwu_step! < 60) return;
        if (!this.items!.length) {
            return;
        }
        let me: CHARACTER = this.items![0] as unknown as CHARACTER;
        let npc: CHARACTER | undefined = this.items![1] as unknown as CHARACTER;
        if (npc && npc.is_player) {
            me = npc;
            npc = this.items![0] as unknown as CHARACTER;
        }
        me.end_fight();
        npc?.end_fight();
        challenge_over(me, 2);
        challenge_fail(me);
        me.notify("<yel>挑战超时，自动离开擂台。</yel>");
    }

    create_npc(player: CHARACTER | StatsTopEntry, fam?: string): NPC {
        const npc = NPC.CLONE("pub/gaoshou1");
        for (let i = 0; i < COPY_PROPS.length; i++) {
            const key = COPY_PROPS[i] as keyof StatsTopEntry;
            const val = player[key];
            if (val !== undefined) {
                (npc as unknown as Record<string, unknown>)[key] = val;
            }
        }
        npc.equipment = [];
        if (player.equipment) {
            const eqs = player.equipment;
            for (let i = 0; i < eqs.length; i++) {
                if (!eqs[i]) continue;
                const obj = eqs[i]!.clone(player as unknown as CHARACTER);
                npc.equipment[obj.eq_type] = obj;
                if (obj.on_eq) obj.on_eq(npc);
            }
        }
        npc.skills = {};
        if (player.skills) {
            for (const sk in player.skills) {
                const item = player.skills[sk];
                if (typeof item === "number") {
                    npc.skills[sk] = { level: item, exp: 0, enable_skill: null };
                }
            }
        }
        npc.attack_count = 3;
        npc.title = player.title || "";
        npc.age = player.age || 20;
        npc.score = player.score || 0;
        npc.top_index = 0;

        const playerUserid = "userid" in player ? (player as StatsTopEntry).userid : undefined;
        if (playerUserid) {
            npc.userid = playerUserid;
            npc.id = "top_" + (fam ? fam.toUpperCase() : "") + "_" + (npc.top_index - 1);
        }

        for (const key of COPY_TEMPS) {
            const value = player.temp ? player.temp[key] : undefined;
            if (value != null) {
                npc.set_temp(key, value);
            }
        }
        npc.clear_prop();
        npc.init();
        npc.recount = this.recount;
        npc.recount();
        npc.check_pfms = this.check_pfms;
        npc.init_pfms = this.init_pfms;

        if (npc.force_skill?.on_relive) {
            npc.force_skill.on_relive(npc);
        }

        npc.hp = npc.max_hp;

        return npc;
    }

    recount(this: CHARACTER) {
        this.max_hp = Math.floor(this.con * 5 + (this.max_mp * this.query_force_rad() + this.query_prop("max_hp") + this.query_prop("con") * this.con) * (100 + this.query_prop("hp_per")) / 100);

        if (this.max_hp < 1) this.max_hp = 1;
        if (this.hp > this.max_hp) this.hp = this.max_hp;

        this.gjsd = 4000 - this.query_prop("gjsd");
        if (this.gjsd > 500) {
            this.gjsd = Math.floor(this.gjsd - (this.gjsd * this.query_prop("gjsd_per") / 100));
        }
        if (this.gjsd < 500) this.gjsd = 500;

        this.gj = Math.floor(this.str + (this.query_prop("gj") + this.query_prop("str") * this.str / 10) * (100 + this.query_prop("gj_per")) / 100);
        this.fy = Math.floor(((this.str + this.con) / 10 + this.query_prop("fy") + this.query_prop("con") * this.con / 10) * (100 + this.query_prop("fy_per")) / 100);
        this.mz = Math.floor((this.dex / 2 + this.query_prop("mz")) * (100 + this.query_prop("mz_per")) / 100);
        this.ds = Math.floor((this.dex / 2 + this.query_prop("ds") + this.query_prop("dex") * this.dex / 10) * (100 + this.query_prop("ds_per")) / 100);
        this.zj = Math.floor((this.str / 2 + this.query_prop("zj") + this.query_prop("str") * this.str / 10) * (100 + this.query_prop("zj_per")) / 100);
        this.bj = Math.floor(this.dex / 10 + this.query_prop("bj_per"));
        if (this.parry_skill?.on_recount_parry) {
            this.zj += this.parry_skill.on_recount_parry(this);
        }
        if (this.dodge_skill?.on_recount_dodge) {
            this.ds += this.dodge_skill.on_recount_dodge(this);
        }
        this.diff_sh_per = this.query_prop("diff_sh_per");
        if (this.diff_sh_per > 80) {
            this.diff_sh_per = 80 + Math.sqrt((this.diff_sh_per - 80) * 4);
            if (this.diff_sh_per > 99.9999) this.diff_sh_per = 99.9999;
        }
        this.diff_sh_per += this.query_prop("diff_sh_per2");
    }

    check_pfms(this: CHARACTER & { auto_eqs?: EQUIPMENT[] }, target: CHARACTER) {
        if (!this.auto_skills) this.init_pfms!();
        if (!this.equipment![0] && this.items![0] && this.random(3) === 0) {
            return this.equip(this.items![0]);
        }
        if ((this.auto_eqs?.length || 0) > 0 && this.random(3) === 1) {
            const eqs: EQUIPMENT[] = [];
            for (let i = 0; i < this.auto_eqs!.length; i++) {
                const obj = this.auto_eqs![i];
                const key = "disobj_" + (obj.distype || obj.id);
                if (obj.distime && this.query_temp(key)) {
                    continue;
                }
                eqs.push(obj);
            }
            if (eqs.length > 0) {
                const obj = eqs.random();

                if (obj.on_use && obj.on_use(this) !== false) {
                    if (obj.distime) {
                        this.set_temp("disobj_" + (obj.distype || obj.id), 1, obj.distime);
                    }
                    return;
                }
            }
        }
        return CHARACTER.prototype.check_pfms.call(this, target);
    }

    init_pfms(this: CHARACTER & { auto_eqs?: EQUIPMENT[] }) {
        CHARACTER.prototype.init_pfms.call(this);
        this.auto_eqs = [];
        for (let i = 1; i < (this.equipment?.length || 0); i++) {
            if (this.equipment![i]?.on_use) {
                this.auto_eqs.push(this.equipment![i]!);
            }
        }
    }

    setStatsTitle(player: CHARACTER, index: number, fam?: string) {
        if (fam) return;

        if (index < 10) {
            const title = "天下第" + TOPS[index];
            player.add_title?.(title, "top");
            player.notify("<hiy>你的高手榜称号变动为【" + title + "】。</hiy>");
        } else player.add_title?.(null, "top");
    }

    checkStats(player: CHARACTER) {
        let top: number | undefined = player.query_temp("top");
        if (top) {
            this.check_fams_stats(player, WORLD.STATS.TOPS, top);
        }
        top = player.query_temp("top_fam");
        if (top) {
            this.check_fams_stats(player, WORLD.STATS["tops_" + player.family!.id] as StatsTopEntry[] | undefined || [], top, player.family!.id);
        }
    }

    check_fams_stats(player: CHARACTER, tops: StatsTopEntry[], top: number, fam?: string) {
        const npc = tops[top - 1];
        if (!npc) return;
        const top_key = fam ? "top_fam" : "top";
        if (npc.userid !== player.id) {
            for (let i = 0; i < tops.length; i++) {
                if (tops[i]!.userid === player.id) {
                    player.set_temp(top_key, i + 1);
                    return this.setStatsTitle(player, i, fam);
                }
            }
            player.remove_temp(top_key);
            this.setStatsTitle(player, 9999, fam);
        }
    }

    updateTopStats(top: StatsTopEntry, index: number, fam?: string) {
        const top_user = top.userid ? WORLD.getUser(top.userid) : null;
        const top_key = fam ? "top_fam" : "top";
        if (index > 0) {
            (top as Record<string, unknown>).top_index = index + 1;
            top.userid = top.userid;
            if (top_user) {
                top_user.set_temp(top_key, index + 1);
                this.setStatsTitle(top_user, index, fam);
            }
        } else {
            (top as Record<string, unknown>).top_index = -1;
            if (top_user) {
                top_user.remove_temp(top_key);
                this.setStatsTitle(top_user, 10, fam);
            }
        }
    }

    checkTopindex(sc: number, tops: StatsTopEntry[]): number {
        let index = -1;
        for (let i = tops.length - 1; i >= 0; i--) {
            const item = tops[i]!;
            if (item.score! >= sc) return index;
            index = i;
        }
        return 0;
    }

    updatePlayerStats(player: CHARACTER, sc: number, fam?: string) {
        let tops = WORLD.STATS.TOPS;
        let top_key = "top";
        if (fam) {
            tops = (WORLD.STATS as Record<string, StatsTopEntry[]>)["tops_" + fam.toUpperCase()] || [];
            top_key = "top_fam";
        }
        if (!tops) return;
        const index = this.checkTopindex(sc, tops);
        if (index < 0) {
            return;
        }
        let top: number = player.query_temp(top_key, 0) ?? 0;
        if (top > 0) {
            tops[top - 1]!.score = sc;
            if (top <= index + 1) return;
            tops.splice(top - 1, 1);
        }
        player.set_temp(top_key, index + 1);
        const newNpc = this.create_npc(player, fam);
        tops.splice(index, 0, newNpc as unknown as StatsTopEntry);
        if (tops.length > 10) {
            const removed = tops.splice(tops.length - 1)[0];
            if (removed) this.updateTopStats(removed, -1, fam);
        }
        if (top === 0) {
            top = tops.length;
        }
        for (let i = index + 1; i < top; i++) {
            this.updateTopStats(tops[i]!, i, fam);
        }
        if (!fam) {
            this.setStatsTitle(player, index);
        }
    }

    biwu_watch(_me: CHARACTER) {}
}

function challenge_end(this: CHARACTER & { on_die?: (killer: CHARACTER) => boolean | void }, killer: CHARACTER): boolean | undefined {
    if (this.on_die && this.on_die(killer) === false) {
        this.hp = 1;
        return false;
    }
    let me: CHARACTER;
    let npc: CHARACTER;
    if (this.is_player) {
        npc = killer;
        me = this;
    } else {
        me = killer;
        npc = this;
    }
    if (me.hp <= 0) me.hp = 1;
    me.end_fight();
    npc.end_fight();
    if (killer === me) {
        challenge_over(me, 1, npc);
        challenge_success(me, npc);
    } else {
        challenge_over(me, 0, npc);
        challenge_fail(me, npc);
    }
}

function challenge_over(me: CHARACTER, result: number, npc?: CHARACTER) {
    const room = me.environment!;
    room.on_heart_beat = undefined;
    me.die = USER.prototype.die;
    me.auto_pfm = false;
    me.auto_skills = null;

    me.check_pfms = USER.prototype.check_pfms;
    me.init_pfms = USER.prototype.init_pfms;

    const leitai = me.environment!;
    if (result === 0)
        me.moveto("yz/leitai/ltx", undefined, me.name + "被" + npc!.name + "一脚踢下了擂台。", "fightend");
    else if (result === 1) {
        me.moveto("yz/leitai/ltx", undefined, me.name + "走了下来。", "fightend");
    } else {
        me.moveto("yz/leitai/ltx", undefined, me.name + "被赶下来。", "fightend");
    }
    leitai.items = [];
    me.clear_downside(true);
}

function challenge_fail(me: CHARACTER, _npc?: CHARACTER) {
    me.notify("<cyn>挑战失败，擂台积分保持不变。</cyn>");
    me.remove_temp("biwu_fam");
}

function challenge_success(me: CHARACTER, npc: CHARACTER) {
    const fam: string | undefined = me.query_temp("biwu_fam");
    const top_key = fam ? "top_fam_sc" : "top_sc";
    let sc: number = me.query_temp(top_key, 0) ?? 0;
    const target_sc = npc.score ?? 0;
    let add = Math.floor((target_sc - sc) / 2);
    if (add === 0) {
        add = 1;
    }
    if (add > 0) {
        sc += add;
        me.set_temp(top_key, sc);
    } else {
        add = 0;
    }
    if (fam)
        me.notify("<hig>挑战成功，当前" + me.family!.name + "榜单积分" + sc + "。</hig>");
    else
        me.notify("<hig>挑战成功，当前总榜积分" + sc + "。</hig>");
    if (add > 0)
        WORLD.COMMANDS.biwu?.updatePlayerStats?.(me, sc, fam);
    me.remove_temp("biwu_fam");
}

const COPY_TEMPS = ["copy_pfm_sword", "copy_pfm_unarmed", "jiuyang", "zyy"];
const COPY_PROPS = ["str", "con", "dex", "int", "gender", "max_mp", "exp", "pot", "kar", "per", "name", "hp", "max_hp", "mp"];
const TOPS = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
