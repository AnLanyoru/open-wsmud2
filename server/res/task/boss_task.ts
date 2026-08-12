import { TASK } from '../../core/task/task.js';
import { COMMAND } from '../../core/command.js';
import { WORLD } from '../../core/world.js';
import { OBJ, type OddsEntry } from '../../core/item/obj.js';
import { UTIL } from '../../core/util/util.js';
import { FAMILIES } from '../../core/skill/family.js';
import { NPC } from '../../core/char/npc.js';
import { ROOM } from '../../core/room/room.js';
import { EVENTS, type EventItem } from '../../core/task/events.js';
import type { USER } from '../../core/char/user.js';
import type { CORPSE } from '../../core/item/corpse.js';

type BossGrade = 1 | 2 | 3 | 4 | 5;
type BossState = 'active' | 'quick-claimable' | 'cleaned';
type ClaimSource = 'corpse' | 'auto' | 'event';

interface BossTemplateConfig {
    id: string;
    bit: number;
    level: BossGrade;
    npcPath: string;
    difficulty: number;
    toolGrade: 1 | 2 | 3 | 4 | 5;
    minFbIndex: number;
    skillLevel: number;
}

interface BossPlayerReward {
    state: 'generated' | 'claimed';
    damage: number;
    damagePercent: number;
    countsDaily: boolean;
    items: OBJ[];
    claimedAt?: number;
    source?: ClaimSource;
}

interface BossRuntime {
    batchId: string;
    grade: BossGrade;
    state: BossState;
    boss: NPC;
    room: ROOM;
    eventId: string;
    template: BossTemplateConfig;
    spawnedAt: number;
    damageSnapshot?: Readonly<Record<string, number>>;
    rewards: Map<string, BossPlayerReward>;
}

const BOSS_LEVELS = ['', '武士', '武师', '宗师', '武圣', '武帝', '武神'];
const EVENT_PREFIX = 'world_boss_';
const UNLOCK_BITS_KEY = 'boss_unlock_bits';
const DAILY_LIMIT = 5;
const TOOL_PATHS = [
    'sp/tool/exp',
    'sp/tool/er2',
    'sp/tool/diao',
    'sp/tool/box',
    'sp/tool/chu',
    'sp/tool/yao',
] as const;
const TOOL_ODDS = [0, 4000, 2000, 500, 200, 10] as const;
const BOSS_STONES = ['st/st_red#0', 'st/st_gre#0', 'st/st_blu#0', 'st/st_yel#0'];

const BOSS_TEMPLATES: readonly BossTemplateConfig[] = [
    {
        id: 'zhao_sanquan',
        bit: 0,
        level: 1,
        npcPath: 'yz/lm/zhao',
        difficulty: 3,
        toolGrade: 1,
        minFbIndex: 1,
        skillLevel: 100,
    },
    {
        id: 'aobai',
        bit: 1,
        level: 1,
        npcPath: 'bj/ao/aobai',
        difficulty: 5,
        toolGrade: 1,
        minFbIndex: 4,
        skillLevel: 200,
    },
    {
        id: 'chen_jinnan',
        bit: 2,
        level: 1,
        npcPath: 'bj/tdh/chen',
        difficulty: 10,
        toolGrade: 2,
        minFbIndex: 6,
        skillLevel: 300,
    },
    {
        id: 'hong_antong',
        bit: 3,
        level: 2,
        npcPath: 'bj/shenlong/hong',
        difficulty: 12,
        toolGrade: 2,
        minFbIndex: 7,
        skillLevel: 400,
    },
    {
        id: 'grandmaster_leader',
        bit: 4,
        level: 3,
        npcPath: 'pub/world_boss#3',
        difficulty: 100,
        toolGrade: 3,
        minFbIndex: 8,
        skillLevel: 1000,
    },
    {
        id: 'martial_saint_leader',
        bit: 5,
        level: 4,
        npcPath: 'pub/world_boss#4',
        difficulty: 300,
        toolGrade: 4,
        minFbIndex: 9,
        skillLevel: 2000,
    },
    {
        id: 'martial_emperor_leader',
        bit: 6,
        level: 5,
        npcPath: 'pub/world_boss#5',
        difficulty: 500,
        toolGrade: 5,
        minFbIndex: 10,
        skillLevel: 3000,
    },
];

/** FIXME: 6级武神 BOSS 待办，当前 6 级及以上玩家仍沿用 5 级分组。 */
function getBossGrade(userLevel: number): BossGrade | undefined {
    if (!Number.isFinite(userLevel) || userLevel < 1) return;
    return Math.min(5, Math.floor(userLevel)) as BossGrade;
}

function canChallengeBoss(me: USER, grade: BossGrade): boolean {
    return getBossGrade(me.level) === grade;
}

export function calculateNextBossTime(now: Date, randomMinute: number): Date {
    const minute = Math.max(0, Math.min(49, Math.floor(randomMinute)));
    const hour = now.getHours();
    if (hour === 21) {
        const nextMinute = Math.floor(now.getMinutes() / 5) * 5 + 5;
        return new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            21,
            nextMinute,
            20,
        );
    }
    if (hour === 20) {
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 0, 20);
    }
    return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour + 1,
        6 + minute,
        20,
    );
}

class BossTask extends TASK {
    id = 'boss';
    next_time: Date | null = null;
    runtimes = new Map<BossGrade, BossRuntime>();
    private batchSequence = 0;

    startup(): void {
        // 清理由旧版固定 ID 和异常重启遗留的失效活动；新批次会按需重新创建。
        for (let grade = 1; grade <= 5; grade++) {
            EVENTS.remove('boss' + grade);
            EVENTS.remove(EVENT_PREFIX + grade);
        }
        this.scheduleNext();
    }

    stop(): void {
        if (this.time_handler) clearTimeout(this.time_handler);
        this.time_handler = null;
        for (const runtime of this.runtimes.values()) this.cleanupRuntime(runtime, 'task stopped');
        this.runtimes.clear();
        for (let grade = 1; grade <= 5; grade++) EVENTS.remove(EVENT_PREFIX + grade);
    }

    private scheduleNext(now = new Date()): void {
        if (this.time_handler) clearTimeout(this.time_handler);
        this.next_time = calculateNextBossTime(now, this.random(50));
        this.time_handler = this.call_out(this.run, Math.max(1, +this.next_time - +now));
    }

    run(): void {
        this.time_handler = null;
        this.scheduleNext();
        const usersByGrade = this.collectEligibleUsers();
        const usedRooms = new Set(
            Array.from(this.runtimes.values())
                .filter(runtime => runtime.state === 'active' && runtime.boss.environment)
                .map(runtime => runtime.room.path),
        );
        for (let grade = 1 as BossGrade; grade <= 5; grade++ as BossGrade) {
            const users = usersByGrade.get(grade);
            if (!users?.length) continue;
            const runtime = this.spawnBoss(grade, usedRooms);
            if (!runtime) continue;
            for (const user of users) {
                user.send(
                    JSON.stringify({
                        type: 'msg',
                        ch: 'rumor',
                        content: `听说${runtime.boss.name}出现在${runtime.room.long_name()}一带。`,
                    }),
                );
            }
        }
    }

    private collectEligibleUsers(): Map<BossGrade, USER[]> {
        const result = new Map<BossGrade, USER[]>();
        for (const user of WORLD.USERS) {
            if (!user.socket || user.query_temp<number>('bcc', 0) >= DAILY_LIMIT) continue;
            const grade = getBossGrade(user.level);
            if (!grade) continue;
            const users = result.get(grade) ?? [];
            users.push(user);
            result.set(grade, users);
        }
        return result;
    }

    private spawnBoss(grade: BossGrade, usedRooms: Set<string>): BossRuntime | undefined {
        const fbIndexValue = Number(WORLD.DATA.query_temp('fb_index', 0));
        const fbIndex = Number.isFinite(fbIndexValue) ? Math.max(0, Math.floor(fbIndexValue)) : 0;
        const templates = BOSS_TEMPLATES.filter(
            template => template.level === grade && template.minFbIndex <= fbIndex,
        );
        if (!templates.length) {
            console.error(`[world-boss] grade=${grade} has no available template at fb_index=${fbIndex}`);
            return;
        }
        const room = this.selectBossRoom(usedRooms);
        if (!room) {
            console.error(`[world-boss] grade=${grade} has no available room`);
            return;
        }
        const template = templates[this.random(templates.length)];
        const boss = this.createBoss(template, grade);
        if (!boss) {
            console.error(`[world-boss] failed to clone template=${template.npcPath}`);
            return;
        }

        const previous = this.runtimes.get(grade);
        if (previous) this.cleanupRuntime(previous, 'replaced');

        const runtime: BossRuntime = {
            batchId: `${Date.now().toString(36)}-${grade}-${++this.batchSequence}`,
            grade,
            state: 'active',
            boss,
            room,
            eventId: EVENT_PREFIX + grade,
            template,
            spawnedAt: Date.now(),
            rewards: new Map(),
        };
        boss.event_id = runtime.eventId;
        boss.on_died = (killer: USER, corpse: CORPSE) =>
            this.handleBossDefeated(runtime, killer, corpse);
        boss.on_kill = (me: USER) => this.checkBossEnemy(boss, runtime.grade, me);
        boss.on_heart_beat = () => this.recordQuickClaimUnlocks(runtime);
        room.item_changed(boss, true);
        usedRooms.add(room.path);
        this.runtimes.set(grade, runtime);
        EVENTS.add(this.createEvent(runtime));
        return runtime;
    }

    private selectBossRoom(usedRooms: Set<string>): ROOM | undefined {
        if (!ROOM.public_rooms) ROOM.RANDOM();
        const candidates = (ROOM.public_rooms ?? []).filter(
            room =>
                !usedRooms.has(room.path) &&
                !room.no_fight &&
                !room.is_fb() &&
                !room.is_copy() &&
                !room.is_full(1) &&
                room.max_item_count > 1,
        );
        if (!candidates.length) return;
        return candidates[this.random(candidates.length)];
    }

    private createBoss(template: BossTemplateConfig, grade: BossGrade): NPC | undefined {
        const boss = NPC.CLONE(template.npcPath);
        if (!boss) return;
        boss.boss_index = template.bit;
        boss.min_fbindex = template.minFbIndex;
        for (const [skillId] of boss.skills) boss.skills.get(skillId)!.level = template.skillLevel;
        boss.diff_level = template.difficulty;
        boss.hp = boss.max_hp = template.difficulty * template.difficulty * 500;
        boss.mp = boss.max_mp = boss.max_hp / 2;
        boss.prop = {};
        boss.level = grade;
        boss.init();
        boss.recount();
        boss.pfm_rate = 1;
        boss.record_damage = true;
        boss.on_enter = undefined;
        boss.no_fight = true;
        boss.no_refresh = true;
        boss.on_die = undefined;
        return boss;
    }

    /** 兼容召唤令：创建一只当前世界进度已开放、但不注册活动批次的首领。 */
    create_boss(playerLevel = 1): NPC | undefined {
        const grade = getBossGrade(playerLevel) ?? 1;
        const fbIndexValue = Number(WORLD.DATA.query_temp('fb_index', 0));
        const fbIndex = Number.isFinite(fbIndexValue) ? Math.max(0, Math.floor(fbIndexValue)) : 0;
        let templates = BOSS_TEMPLATES.filter(
            template => template.level === grade && template.minFbIndex <= fbIndex,
        );
        if (!templates.length) {
            templates = BOSS_TEMPLATES.filter(template => template.minFbIndex <= fbIndex);
        }
        if (!templates.length) return;
        const template = templates[this.random(templates.length)];
        return this.createBoss(template, template.level);
    }

    private checkBossEnemy(boss: NPC, grade: BossGrade, me: USER): boolean | void {
        if (canChallengeBoss(me, grade)) return;
        if (boss.family === FAMILIES.MONSTER) {
            return me.notify_fail(boss.name + '目露凶光狠狠地瞪着你。');
        }
        return me.notify_fail(
            `${boss.name}对你拱手说道：这位${me.call()}，不知${boss.callme()}有何得罪之处？`,
        );
    }

    private createEvent(runtime: BossRuntime): EventItem {
        const isActive = runtime.state === 'active';
        const desc = isActive
            ? `听说${runtime.boss.name}出现在${runtime.room.long_name()}一带，你可以前往尝试挑战，根据造成的伤害获得奖励。`
            : `${runtime.boss.name}被击败了，解锁快速领取可直接领取基础掉落，并增加一次参与次数。`;
        return {
            id: runtime.eventId,
            name: `${BOSS_LEVELS[runtime.grade]}BOSS挑战`,
            desc,
            time: this.next_time?.getTime() ?? 0,
            grade: runtime.grade,
            command: isActive ? '前往挑战' : '领取奖励',
            check: (me: USER) => canChallengeBoss(me, runtime.grade),
            on_command: (me: USER, confirmation?: string) => {
                const current = this.runtimes.get(runtime.grade);
                if (current !== runtime || runtime.state === 'cleaned') {
                    me.notify('该场世界BOSS活动已经结束。');
                    return;
                }
                if (!canChallengeBoss(me, runtime.grade)) {
                    me.notify('你的等级不符合这场世界BOSS活动。');
                    return;
                }
                if (runtime.state === 'active') return this.teleportToBoss(me, runtime);
                if (me.query_temp<number>('bcc', 0) >= DAILY_LIMIT) {
                    me.notify(`<hiy>你今日的BOSS奖励领取次数已满（${DAILY_LIMIT}/${DAILY_LIMIT}）。</hiy>`);
                    return;
                }
                const damage = runtime.damageSnapshot?.[me.id] ?? 0;
                const unlockedByThisBatch = damage >= runtime.boss.max_hp * 0.1;
                if (!me.query_bool(UNLOCK_BITS_KEY, runtime.template.bit) && !unlockedByThisBatch) {
                    me.notify('<hiy>你尚未解锁该世界BOSS的领取奖励功能。</hiy>');
                    return;
                }
                if (confirmation !== 'ok') {
                    me.notify(
                        `<hiy>是否确认领取${runtime.boss.name}的奖励？每日最多领取${DAILY_LIMIT}次。</hiy>`,
                    );
                    me.send_commands(`events ${runtime.eventId} ok`, '确认领取');
                    return;
                }
                this.claimBossReward(me, runtime, 'event');
            },
        };
    }

    private teleportToBoss(me: USER, runtime: BossRuntime): boolean | void {
        if (me.state) return me.send('你正在' + me.state.title + '。');
        if (me.query_temp<number>('bcc', 0) >= DAILY_LIMIT)
            return me.send('你今日的BOSS挑战次数已满。');
        if (!me.can_trans()) return;
        if (runtime.room.is_full(1)) return me.send('那里人太多了，你过不去。');
        me.moveto(runtime.room.path, '$N离开了。', '$N走了过来。');
        return true;
    }

    private handleBossDefeated(runtime: BossRuntime, _killer: USER, corpse: CORPSE): void {
        if (runtime.state !== 'active') return;
        this.recordQuickClaimUnlocks(runtime);
        runtime.damageSnapshot = Object.freeze({ ...(runtime.boss.damages ?? {}) });
        runtime.state = 'quick-claimable';
        corpse.items = [];
        corpse.no_alloc = true;
        corpse.query_items = (me: USER) => this.queryCorpseReward(me, runtime);
        corpse.clear_items = (me: USER, notTaken?: OBJ[]) => {
            if (notTaken?.length) return;
            this.commitReward(me, runtime, 'corpse');
        };
        corpse.query_damage = () => this.queryDamage(runtime);
        EVENTS.add(this.createEvent(runtime));
    }

    private queryDamage(runtime: BossRuntime): string {
        const lines: string[] = [];
        for (const [userId, damage] of Object.entries(runtime.damageSnapshot ?? {})) {
            const user = WORLD.getUser(userId);
            if (!user) continue;
            const percent = Math.min(100, Math.max(0, (damage * 100) / runtime.boss.max_hp));
            lines.push(`${user.name}：${damage}==${Math.floor(percent)}%`);
        }
        return lines.join('\n');
    }

    private recordQuickClaimUnlocks(runtime: BossRuntime): void {
        if (runtime.state !== 'active') return;
        for (const [userId, damage] of Object.entries(runtime.boss.damages ?? {})) {
            if (damage < runtime.boss.max_hp * 0.1) continue;
            const user = WORLD.getUser(userId);
            if (!user) continue;
            if (!user.query_bool(UNLOCK_BITS_KEY, runtime.template.bit)) {
                user.set_bool(UNLOCK_BITS_KEY, runtime.template.bit, true);
            }
        }
    }

    private queryCorpseReward(me: USER, runtime: BossRuntime): OBJ[] | undefined {
        const result = this.prepareReward(me, runtime);
        if (typeof result === 'string') {
            me.notify(result);
            return;
        }
        return result.items;
    }

    private prepareReward(
        me: USER,
        runtime: BossRuntime,
    ): BossPlayerReward | string {
        if (runtime.state === 'cleaned') return '该场世界BOSS奖励已经失效。';
        if (!canChallengeBoss(me, runtime.grade)) return '你的等级不符合这场世界BOSS活动。';
        const existing = runtime.rewards.get(me.id);
        if (existing?.state === 'claimed') return '你已经领取过该场世界BOSS奖励。';
        if (existing) return existing;
        const damage = runtime.damageSnapshot?.[me.id] ?? runtime.boss.damages?.[me.id] ?? 0;
        if (!(damage > 1)) return '你没有对该世界BOSS造成有效伤害。';
        const damagePercent = Math.min(1, Math.max(0, damage / runtime.boss.max_hp));
        const countsDaily = damagePercent >= 0.01;
        if (countsDaily && me.query_temp<number>('bcc', 0) >= DAILY_LIMIT)
            return '你今日的BOSS挑战次数已满。';

        const items = countsDaily
            ? this.createFullReward(runtime, damagePercent)
            : [OBJ.CREATE('money/silver', 1 + this.random(10))].filter(Boolean);
        if (!items.length) return '奖励生成失败，请稍后重试。';
        const reward: BossPlayerReward = {
            state: 'generated',
            damage,
            damagePercent,
            countsDaily,
            items,
        };
        runtime.rewards.set(me.id, reward);
        return reward;
    }

    private createFullReward(runtime: BossRuntime, damagePercent: number): OBJ[] {
        const templateDrops = OBJ.create_by_odds(runtime.boss.drop_list ?? []);
        const difficultyBonus = Math.max(0, runtime.template.difficulty - 20);
        const baseDrops: OddsEntry[] = [
            { obj: 'st/xuanjing', min: 1, max: 10 },
            {
                obj: BOSS_STONES,
                odds: Math.min(10000, 5000 + difficultyBonus * 10 + damagePercent * 10000),
            },
        ];
        const items = [...templateDrops, ...OBJ.create_by_odds(baseDrops)];
        const tool = this.createToolReward(runtime.template.toolGrade);
        if (tool) items.push(tool);
        return items.filter(Boolean);
    }

    private createToolReward(toolGrade: 1 | 2 | 3 | 4 | 5): OBJ | undefined {
        let selectedGrade = 0;
        for (let grade = toolGrade; grade >= 1; grade--) {
            const odds = grade === toolGrade ? TOOL_ODDS[grade] : Math.min(10000, TOOL_ODDS[grade] * 2);
            if (Math.random() * 10000 < odds) {
                selectedGrade = grade;
                break;
            }
        }
        if (!selectedGrade) return;
        const path = TOOL_PATHS[this.random(TOOL_PATHS.length)];
        return OBJ.CREATE(`${path}#${selectedGrade}`);
    }

    private claimBossReward(me: USER, runtime: BossRuntime, source: 'event'): void {
        if (runtime.state !== 'quick-claimable') {
            me.notify('当前没有可以领取的世界BOSS奖励。');
            return;
        }
        if (me.query_temp<number>('bcc', 0) >= DAILY_LIMIT) {
            me.notify(`<hiy>你今日的BOSS奖励领取次数已满（${DAILY_LIMIT}/${DAILY_LIMIT}）。</hiy>`);
            return;
        }
        const damage = runtime.damageSnapshot?.[me.id] ?? 0;
        const unlockedByThisBatch = damage >= runtime.boss.max_hp * 0.1;
        if (!me.query_bool(UNLOCK_BITS_KEY, runtime.template.bit) && !unlockedByThisBatch) {
            me.notify('你尚未解锁该世界BOSS的领取奖励功能。');
            return;
        }
        if (unlockedByThisBatch && !me.query_bool(UNLOCK_BITS_KEY, runtime.template.bit)) {
            me.set_bool(UNLOCK_BITS_KEY, runtime.template.bit, true);
        }
        const damagePercent = Math.max(
            0.01,
            Math.min(1, Math.max(0, damage / runtime.boss.max_hp)),
        );
        const items = this.createFullReward(runtime, damagePercent);
        if (!items.length) {
            me.notify('奖励生成失败，请稍后重试。');
            return;
        }
        if (me.is_full(items.length)) {
            me.notify('你身上没有足够的空间存放本次奖励。');
            return;
        }
        let money = 0;
        for (const item of items) {
            const itemName = item.unit_name();
            if (!me.add_obj(item)) {
                me.notify('奖励发放失败，请整理背包后重试。');
                return;
            }
            if (item.is_money) money += item.value * item.count;
            else me.notify('你获得了' + itemName + '。');
        }
        if (money) me.notify('你获得了' + UTIL.moneyToStr(money) + '。');
        this.completeClaim(me, runtime, 'event', damage, true, true);
    }

    private commitReward(me: USER, runtime: BossRuntime, source: ClaimSource): void {
        const reward = runtime.rewards.get(me.id);
        if (!reward || reward.state === 'claimed') return;
        reward.state = 'claimed';
        reward.claimedAt = Date.now();
        reward.source = source;
        reward.items = [];
        this.completeClaim(me, runtime, source, reward.damage, reward.countsDaily, false);
    }

    /** 统一处理成功领取后的次数、提示、全服播报和日志。 */
    private completeClaim(
        me: USER,
        runtime: BossRuntime,
        source: ClaimSource,
        damage: number,
        countsDaily: boolean,
        quickClaim: boolean,
    ): void {
        if (countsDaily) me.add_temp('bcc', 1, UTIL.diff_time());
        if (quickClaim) {
            me.notify(
                `<hiy>世界BOSS快速完成，今日已完成${me.query_temp<number>('bcc', 0)}/${DAILY_LIMIT}。</hiy>`,
            );
        } else {
            me.notify('你领取了本次世界BOSS奖励。');
        }
        COMMAND.DO('rumor', `${me.name}领取了${runtime.boss.name}的世界BOSS奖励。`);
    }

    private cleanupRuntime(runtime: BossRuntime, reason: string): void {
        if (runtime.state === 'cleaned') return;
        runtime.state = 'cleaned';
        if (runtime.boss.environment) {
            runtime.boss.end_fight();
            runtime.boss.destroy('$N离开了。');
        }
        runtime.rewards.clear();
    }
}

export default BossTask;
