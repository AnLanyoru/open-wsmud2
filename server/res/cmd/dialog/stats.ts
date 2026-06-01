import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { WORLD } from "../../../core/world.js";
import { EQUIP_TYPE } from "../../../core/const.js";
import type { StatsTopEntry, ScoreRankEntry, WeaponRankEntry } from "../../../types/world.js";
import type { USER } from "../../../core/char/user.js";

export default class extends COMMAND {
    command = "stats";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;
    regex = /^(\w+)(?:\s+([a-z]+))?(?:\s+(\d+))?$/;

    /**
     * @param me - 执行命令的角色
     */
    enter(me: CHARACTER, par?: string, fam?: string, index?: string): void {
  
    if (!par) {
        return;
    }
    if (par === "top") {
        if (index) {

            return render_top_item(me, fam, index);
        }
        return renderTops(me, fam);
    }
    if (par === "weapon") {
        if (index) {

            return render_eq(me,fam,index);
        }
        return renderWeapons(me, fam);
    }
    if (par === "score") {

        if (index)
            return render_score_item(me,fam, index);
        return renderScore(me, fam);
    }


    if (par === "exp") {
        if (index)
            return this.render_item(me,EXP_STATS, fam, index);

        this.renderExp(me, fam);
    }
    if (par === "mp") {
        if (index)
            return this.render_item(me,MP_STATS,fam, index);
        this.renderMP(me, fam);
    }
    if (par === "money") {
        if (index)
            return this.render_item(me, MONEY_STATS, fam, index);
        this.renderMoney(me, fam);
    }
  
}
    render_item(me: CHARACTER, cache: Record<string, UserStatsInst | undefined>, fam?: string, index?: string): void {
    if (!fam) fam = "all";
    const stats = cache[fam];

    if (!stats || !stats.result) return me.send('你要看什么？');
    const idx = Number(index) - 1;
    if (!(idx >= 0 && idx < stats.result.length))
        return  me.send('你要看什么？');
    const item = stats.result[idx];
    if (!item) return me.send('没有这个人。');
    const user = WORLD.getUser(item.id);
    if (!user) return me.send(item.name + "现在不在线。");
    if (user.query_desc) {
        me.notify(user.query_desc(me, "look1"));
    }
}
    renderExp(me: CHARACTER, fam?: string): void {
    let stype = fam;
    if (!stype) stype = "all";
    let stats: UserStatsInst | undefined = EXP_STATS[stype];

    if (!stats) {
        stats = new (UserStats as unknown as new (...args: any[]) => UserStatsInst)(
            (me: CHARACTER, item: { value: number }) => { return me.exp < item.value },
            (me: CHARACTER) => {
                return {
                    id: me.id,
                    value: me.exp,
                    name: me.color_name
                };
            });
        stats.type = "exp";
        stats.fam = fam;
        EXP_STATS[stype] = stats;
    }
    if (stats!.isExpire()) {
        stats!.order();
    }
    me.send(stats!.cache!);
}
    renderMoney(me: CHARACTER, fam?: string): void {
    let stype = fam;
    if (!stype) stype = "all";
    let stats: UserStatsInst | undefined = MONEY_STATS[stype];

    if (!stats) {
        stats = new (UserStats as unknown as new (...args: any[]) => UserStatsInst)(
            (me: CHARACTER, item: { value: number }) => { return me.money < item.value },
            (me: CHARACTER) => {
                return {
                    id: me.id,
                    value: me.money,
                    name: me.color_name
                };
            });
        stats.type = "money";
        stats.formatter = function (this: void, value: number): string {
            if (value >= 10000) {
                return '"' + Math.floor(value / 10000) + "两黄金" + '"';
            }
            if (value > 100) {
                return '"' + Math.floor(value / 100) + "两白银" + '"';
            }
            if (value > 0) {
                return '"' + Math.floor(value / 100) + "个铜板" + '"';
            }
            return '""';
        };
        stats.fam = fam;
        MONEY_STATS[stype] = stats;
    }
    if (stats!.isExpire()) {
        stats!.order();
    }
    me.send(stats!.cache!);
}
    renderMP(me: CHARACTER, fam?: string): void {
    let stype = fam;
    if (!stype) stype = "all";
    let stats: UserStatsInst | undefined = MP_STATS[stype];

    if (!stats) {
        stats = new (UserStats as unknown as new (...args: any[]) => UserStatsInst)(
            (me: CHARACTER, item: { value: number }) => { return me.max_mp < item.value },
            (me: CHARACTER) => {
                return {
                    id: me.id,
                    value: me.max_mp,
                    name: me.color_name
                };
            });
        stats.type = "mp";
        stats.fam = fam;
        MP_STATS[stype] = stats;
    }
    if (stats!.isExpire()) {
        stats!.order();
    }
    me.send(stats!.cache!);
}
}

const STATS = WORLD.STATS;
function render_top_item(me: CHARACTER, fam: string | undefined, index: string | undefined): void {
    const tops: StatsTopEntry[] = STATS.TOPS;
    let items: StatsTopEntry[];
    if (fam) items = (STATS['tops_' + fam.toUpperCase()] ?? []) as unknown as StatsTopEntry[];
    else items = tops;
    const item = items[Number(index) - 1];
    if (!item) return me.send('你要看什么？');
    return me.notify(item.query_desc!(item as unknown as CHARACTER, 'look1'));
}
function render_score_item(me: CHARACTER, fam: string | undefined, index: string | undefined): void {
    const tops: ScoreRankEntry[] = STATS.SCORE;
    let items: ScoreRankEntry[];
    if (fam) items = (STATS.SC_STATS[fam.toUpperCase()] ?? []) as unknown as ScoreRankEntry[];
    else items = tops;
    const item = items[Number(index) - 1];
    if (!item) return me.send('你要看什么？');
    const user = WORLD.getUser(item.id);
    if (!user) return me.send('对方不在线。');
    return me.notify(user.query_desc(me));
}
function renderScore(me: CHARACTER, fam?: string): void {
    const tops: ScoreRankEntry[] = STATS.SCORE;
    const items: ScoreRankEntry[] = fam ? (STATS.SC_STATS[fam.toUpperCase()] ?? []) as unknown as ScoreRankEntry[] : tops;

    const str: string[] = ['{"type":"dialog","dialog":"stats","scores":['];
    for (let i = 0; i < items.length; i++) {
        if (i > 19) break;
        const item = items[i];
        if (i > 0) str.push(",");
        str.push('["');
        str.push(item.name ?? "");
        str.push('",');
        str.push(String(item.score));
        str.push(']');
    }
    str.push('],score:');
    str.push(String(me.score));
    str.push("}");
    me.send(str.join(""));
}
function renderTops(me: CHARACTER, stype?: string): void {
    const tops: StatsTopEntry[] = STATS.TOPS;
    let famid: string | null = null;
    let items: StatsTopEntry[];
    if (stype) {
        famid = stype.toUpperCase();
        const found = STATS["tops_" + famid];
        if (!found) return me.send('没有这个榜单。');
        items = found as unknown as StatsTopEntry[];
    } else {
        items = tops;
    }
    const str: string[] = ['{"type":"dialog","dialog":"stats","tops":['];

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (i > 0) str.push(",");
        str.push('["', item.long_name!(),'",',String(item.score),']');
    }
    if (!stype || famid === me.family!.id) {
        str.push('],top:', String(me.query_temp(stype ? "top_fam" : "top", 0) ?? 0));
        str.push(',sc:', String(me.query_temp(stype ? "top_fam_sc" : "top_sc", 0) ?? 0));
    } else {
        str.push('],top:0');
        str.push(',sc:0');
    }

    str.push(',fam:"', stype ?? '','"');
    str.push("}");
    me.send(str.join(""));
}
function render_eq(me: CHARACTER, type: string | undefined, index: string | undefined): void {

    if (!type) type = 'weapon';
    const eqs: WeaponRankEntry[] = STATS.EQ_STATS[EQUIP_TYPE[type.toUpperCase()]] ?? [];
    const wea = eqs[Number(index) - 1];
    if (wea) me.send(wea.desc);
}
function renderWeapons(me: CHARACTER, type?: string): void {
    const str: string[] = ['{"type":"dialog","dialog":"stats","weapons":['];
    if (!type) type = 'weapon';

    const eqs: WeaponRankEntry[] = STATS.EQ_STATS[EQUIP_TYPE[type.toUpperCase()]] ?? [];
    for (let i = 0; i < eqs.length; i++) {
        if (i > 9) break;
        const item = eqs[i];
        if (i > 0) str.push(",");
        str.push('["');
        if (item.name) {
            str.push('<wht>');
            str.push(item.name);
            str.push('的</wht>');
            str.push(item.wname);
        } else {
            str.push('无');
        }
        str.push('",',String(item.score),']');
    }
    str.push(']');
    str.push("}");
    me.send(str.join(""));
}

interface UserStatsResult {
    id: string;
    value: number;
    name: string;
}

interface UserStatsInst {
    result: UserStatsResult[] | null;
    cache: string | null;
    time: number;
    lessThan: (me: CHARACTER | USER, item: UserStatsResult) => boolean;
    addItem: (me: CHARACTER | USER) => UserStatsResult;
    maxCount: number;
    type: string | null;
    fam: string | undefined;
    formatter: (this: void, value: number) => string;
    isExpire: () => boolean;
    order: (append?: string) => void;
    queue: (me: CHARACTER | USER) => void;
}

const EXP_STATS: Record<string, UserStatsInst | undefined> = {};
const MONEY_STATS: Record<string, UserStatsInst | undefined> = {};
const MP_STATS: Record<string, UserStatsInst | undefined> = {};
function UserStats(this: UserStatsInst, order: (me: CHARACTER, item: UserStatsResult) => boolean, added: (me: CHARACTER) => UserStatsResult): void {
    this.result = null;
    this.cache = null;
    this.time = 0;
    this.lessThan = order;
    this.addItem = added;
    this.maxCount = 20;
    this.type = null;
}
UserStats.prototype.formatter = function (this: UserStatsInst, val: number): string {
    return String(val);
};
UserStats.prototype.isExpire = function (this: UserStatsInst): boolean {
    return Date.now() - this.time > 0;
};
UserStats.prototype.order = function (this: UserStatsInst, append?: string): void {
    this.result = [];
    this.time = Date.now() + 60000;
    let fam = this.fam;
    if (fam) fam = fam.toUpperCase();
    for (let i = 0; i < WORLD.USERS.length; i++) {
        const user = WORLD.USERS[i];
        if (user.user_level > 4) continue;
        if (fam && user.family!.id !== fam)
            continue;
        this.queue(user);
    }
    const str: string[] = ['{"type":"dialog","dialog":"stats","items":['];
    for (let i = 0; i < this.result!.length; i++) {
        const u = this.result![i];
        if (i > 0) str.push(",");
        str.push('["', u.name, '",', this.formatter(u.value),']');
    }
    str.push(']');
    str.push(',"time":', String(Date.now()), '');
    str.push(',"st":"', this.type ?? '', '"', append ?? "");
    str.push(',"fam":"', this.fam ?? '','"');

    str.push("}");
    this.cache = str.join("");
};
UserStats.prototype.queue = function (this: UserStatsInst, me: CHARACTER | USER): void {
    let index = this.result!.length - 1;
    if (index < 0) {
        this.result!.push(this.addItem(me));
        return;
    }
    let user = this.result![index];
    if (this.result!.length >= this.maxCount && this.lessThan(me, user)) {
        return;
    }
    while (index >= 0) {
        user = this.result![index];
        if (this.lessThan(me, user)) {
            this.result!.splice(index + 1, 0, this.addItem(me));
            break;
        }
        index--;
    }
    if (index < 0) {
        this.result!.splice(0, 0, this.addItem(me));
    }
    if (this.result!.length >= this.maxCount) {
        this.result!.length = this.maxCount;
    }
};
