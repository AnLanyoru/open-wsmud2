/**
 * FAMILY 门派基类
 */
import { BASE } from '../base.js';
import { WORLD } from '../world.js';
import { ITEM } from '../item.js';
import { UTIL } from '../util.js';
import { ROOM } from '../room/room.js';
import { EVENTS } from '../task/events.js';
import { COMMAND } from '../command.js';
import type { NPC } from '../char/npc.js';
import type { USER } from '../char/user.js';
import type { SKILL, SkillSet } from './skill.js';
import type { AREA } from '../room/area.js';
import type { CHARACTER } from '../char/character.js';
import type { CORPSE } from '../item/corpse.js';

export type BattleMode = 'family' | 'party';

export interface BattleContext {
    mode: BattleMode;
    attackerId: string;
    defenderId: string;
    attackerName: string;
    defenderName: string;
    getRoom(ownerId: string, baseRoom: ROOM): ROOM | undefined;
    addScore(actor: USER, value: number): void;
    addGongji(actor: USER, value: number): void;
    canEnter(actor: USER): boolean;
}

export interface FamilyBattleConfig {
    battle_mode: 'family';
    boss_path: string;
    boss_room: string;
    elder_rooms: [string, string];
    purple_rooms: [string, string];
    random_rooms: string[];
    titles: {
        green: string;
        blue: string;
        yellow: string;
        purple: string;
        elder: string;
        boss: string;
    };
    reinforce_count: number;
    random_grade_weights: [number, number, number];
}

// 懒加载 NPC 避免循环依赖: family.ts → npc.ts → character.ts (TDZ)
let _NPC: {
    CLONE: (path: string, ...args: any[]) => any;
    CREATE: (path: string, room?: any) => any;
    GET: (path: string) => any;
} | null = null;
import('../char/npc.js').then((m: Record<string, any>) => {
    _NPC = m.NPC as any;
});

export class FAMILY extends BASE {
    // ============ 核心属性 ============

    /** 门派名称 */
    name: string = '未命名门派';
    /** 门派称谓列表 */
    titles: string[] = [];
    /** 门派NPC列表 */
    npcs: NPC[] = [];
    /** 敌对门派 */
    battle_family: string | null = null;
    /** 门派战积分 */
    battle_score: number = 0;
    /** 门派战奖励 */
    battle_gift: number = 0;
    /** 是否可门派战 */
    can_battle: boolean = false;
    /** 公共门派战五档 NPC 与位置配置 */
    battle_config?: FamilyBattleConfig;
    /** 当前公共门派战上下文；帮派战将使用独立适配器。 */
    battle_context?: BattleContext;

    // ============ 动态属性（资源文件/运行时设置） ============

    /** 门派ID */
    id: string = '';
    /** 按品级缓存的技能索引 */
    skill_levels: SKILL[][] | null = null;
    /** 门派开始回调 */
    on_battle?(enemy: FAMILY): void;
    /** 门派战结算回调 — 触发时机：玩家领取门派战战利品时 */
    battle_settle?: (...args: any[]) => void;

    /** 击杀回调 — 触发时机：门派战中 NPC 被对方门派玩家击杀时（on_npc_die 中，非掌门 NPC 被击杀后） */
    on_kill?(killer: CHARACTER, victim: CHARACTER): void;

    /** 货物缓存（由 goods 任务设置） */
    customer?: Record<string, any>;

    // ============ 资源文件设置属性 ============

    /** 门派武功列表（普通技能，按品级排序） */
    skills: SKILL[] = [];
    /** 门派进阶武功列表（source_skill 来源，非终极） */
    skills2: SKILL[] = [];
    /** 门派终极进阶武功列表（source_skill 来源且 is_ultimate） */
    skills3: SKILL[] = [];
    /** 门派终极武功列表（无 source_skill 且 is_ultimate） */
    skills4: SKILL[] = [];
    /** 门派隐藏/知识类技能列表（type=KNOWLEDGE 或 is_hidden） */
    skills0: SKILL[] = [];

    /** 门派npc武功配置列表 */
    npc_skills: SkillSet = [];
    /** 门派掌门/长老使用的进阶武功配置列表 */
    boss_skills: SkillSet = [];
    /** 默认NPC定义 */
    def_npcs?: string[][];
    /** 掌门NPC路径 */
    boss_path?: string;
    /** 掌门NPC */
    boss?: NPC;
    /** 首席弟子NPC */
    first_npc?: NPC;
    /** 首席弟子称谓 */
    top_name?: string;
    /** 是否已初始化首席弟子 */
    is_init_first?: boolean;
    /** 首席弟子经验值 */
    first_npc_exp?: number;
    /** 掌门护卫房间配置 */
    boss_guard?: string[];
    /** 守卫掌门NPC */
    battle_boss?: NPC;
    /** 掌门驱动的绿/蓝/黄弟子刷新心跳计数。 */
    battle_heartbeat_count: number = 0;
    /** 掌门号令当前层数，仅通过 NPC 生成/死亡增量维护。 */
    battle_command_count: number = 0;
    /** 门派战超时结算定时器句柄 */
    battle_over_handler?: ReturnType<typeof setTimeout>;
    /** 门派所属区域 */
    area: AREA | null = null;
    /** 门派性别(用于生成名字) */
    gender?: number;
    /** 门派功绩排行榜 */
    tops?: Record<string, { name: string; score: number }>;

    // ============ 回调（由资源文件覆写为方法） ============

    /** 门派称谓回调 — 传入角色，返回该角色在门派的称呼 */
    call(me: CHARACTER, isbad?: boolean): string {
        return '';
    }

    /** 自称回调 — 传入角色，返回该角色在门派的自称 */
    call_me(me: CHARACTER, isbad?: boolean): string {
        return '';
    }

    // ============ ITEM方法借用(FAMILY不继承ITEM,但复用其temp方法) ============

    query_temp: <T = any>(name: string, def?: T) => T = ITEM.prototype.query_temp as any;
    set_temp: (name: string, value: any, time?: number) => void = ITEM.prototype.set_temp as any;
    remove_temp: (name: string) => void = ITEM.prototype.remove_temp as any;
    add_temp: (name: string, value: number, time?: number) => number = ITEM.prototype
        .add_temp as any;

    // ============ 称谓管理 ============

    /**
     * 设置门派称谓
     */
    set_titles(...args: string[]): void {
        for (let i = 0; i < args.length; i++) {
            this.titles.push(args[i]);
        }
    }

    // ============ 生命周期 ============

    /**
     * 创建回调 - 注册到FAMILIES
     * @param path
     */
    create(path: string): void {
        FAMILIES[this.id] = this;
    }

    /**
     * 更新回调
     * @param path
     */
    update(path: string): void {
        FAMILIES[this.id] = this;
    }

    // ============ 门派功能 ============

    /**
     * 查询指定等级的称谓
     * @param level
     */
    query_title(level: number): string {
        return this.titles[level];
    }

    /**
     * 向门派所有在线成员发送消息
     * @param str
     */
    send(str: string): void {
        for (let i = 0; i < WORLD.USERS.length; i++) {
            if (WORLD.USERS[i].family == this) {
                WORLD.USERS[i].send(str);
            }
        }
    }

    /** 门派战世界频道发言人：掌门阵亡后由首席弟子代为发话。 */
    battle_chat(message: string): void {
        const speaker = (this.boss?.hp ?? 0) > 0 ? this.boss : this.first_npc;
        if (!speaker || (speaker.hp ?? 0) <= 0) return;
        const content = JSON.stringify({
            type: 'msg',
            ch: 'chat',
            content: UTIL.htmlEncode(UTIL.replace_word(message)),
            uid: speaker.id,
            lv: speaker.level || 0,
            name: speaker.name,
            lv6: 0,
        });
        for (const user of WORLD.USERS) {
            if (!user.query_setting('off_chat')) user.send(content);
        }
    }

    /** 获取当前代表门派发言的掌门或首席弟子。 */
    query_battle_speaker(): NPC | undefined {
        if ((this.boss?.hp ?? 0) > 0) return this.boss;
        if ((this.first_npc?.hp ?? 0) > 0) return this.first_npc;
    }

    /**
     * 是否与指定门派交战
     * @param fam
     */
    is_battle(fam: FAMILY): boolean {
        return this.battle_family == fam.id;
    }

    /**
     * 增加门派积分
     * @param me
     * @param sc
     */
    add_score(me: Record<string, any>, sc: number): void {
        this.battle_score += sc;
    }

    // ============ CHARACTER原型补丁 ============

    /**
     * 向CHARACTER.prototype添加send_fam方法
     */
    static addSendFamToCharacter(): void {
        import('../char/character.js').then((m: Record<string, any>) => {
            const CHAR = m.CHARACTER as { prototype: Record<string, any> } | undefined;
            if (CHAR && CHAR.prototype) {
                CHAR.prototype.send_fam = function (this: Record<string, any>, str: string) {
                    this.family.send(str);
                };
            }
        });
    }

    // ============ NPC管理 ============

    /**
     * 创建门派随机名字
     */
    create_name(npc?: Record<string, any>): string {
        return UTIL.random_name(this.gender ?? 0);
    }

    /**
     * 确保技能品级索引已构建
     */
    private _ensure_skill_levels(): SKILL[][] {
        if (!this.skill_levels) {
            this.skill_levels = [];
            for (let i = 0; i < this.skills.length; i++) {
                if (!this.skill_levels[this.skills[i].grade]) {
                    this.skill_levels[this.skills[i].grade] = [];
                }
                this.skill_levels[this.skills[i].grade].push(this.skills[i]);
            }
        }
        return this.skill_levels;
    }

    /**
     * 随机查询指定品级的技能
     * @param grade - 品级
     */
    query_skill(grade: number): SKILL | undefined {
        const levels = this._ensure_skill_levels();
        if (grade >= levels.length) grade = levels.length - 1;
        return levels[grade].random();
    }

    /**
     * 查询指定品级的所有技能
     * @param grade
     */
    query_skills(grade: number): SKILL[] {
        const levels = this._ensure_skill_levels();
        if (grade >= levels.length) grade = levels.length - 1;
        return levels[grade];
    }

    /**
     * 增加门派贡献
     * @param me
     * @param count
     */
    add_gongji(me: Record<string, any>, count: number): void {
        if (!count) return;
        me.add_temp('gongji', count);
        if (count < 0) return;
        if (!this.tops) this.tops = {};
        const old = this.tops[me.id];
        if (!old) this.tops[me.id] = { name: me.name, score: count };
        else {
            old.score += count;
        }
    }

    // ============ 门派方法(由extends合并) ============

    /**
     * 初始化门派NPC — 遍历 def_npcs 配置，克隆 NPC 到对应房间，
     * 绑定死亡/复活回调，并识别掌门 boss
     */
    init(): void {
        if (!this.def_npcs) return;
        for (let item of this.def_npcs) {
            let rm = WORLD.getRoom(item[1]);
            if (!rm) throw new Error('房间' + item[1] + '不存在');
            let npc = _NPC!.CLONE(item[0]);
            if (!npc) throw new Error('npc ' + item[0] + '不存在');
            rm.items.push(npc);
            rm.max_item_count = 100;
            npc.environment = rm;
            if (npc.is(this.boss_path) && !this.boss) {
                this.boss = npc;
            }
            npc.on_died = this.on_npc_die.bind(npc);
            npc.relive = this.on_famnpc_relive.bind(npc);
        }
    }

    /**
     * 热更新门派 NPC — 根据路径前缀匹配并重建指定 NPC
     * @param path - NPC 资源路径前缀
     */
    update_npc(path: string): void {
        for (let item of this.def_npcs!) {
            let spath = item[0];
            if (spath.startsWith(path)) {
                let rm = WORLD.getRoom(item[1]);
                if (!rm) continue;
                let npc = rm.find_obj_bypath(spath);
                if (npc) npc.destroy();
                let new_npc = _NPC!.CREATE(spath, rm);
                if (new_npc.is(this.boss_path)) {
                    this.boss = new_npc;
                }
                new_npc.on_died = this.on_npc_die.bind(new_npc);
                new_npc.relive = this.on_famnpc_relive.bind(new_npc);
            }
        }
    }

    /**
     * 门派NPC复活回调(这里的this通过bind绑定到NPC实例)
     */
    on_famnpc_relive(this: NPC): void {
        if (!this.die_room) return;
        this.die_room.item_changed(this, true);
        this.die_room = undefined;

        if (this.equipment && this.items?.[0] && !this.equipment[0]) {
            this.equip(this.items[0]);
        }
    }

    /**
     * 门派NPC死亡回调(这里的this通过bind绑定到NPC实例)
     */
    on_npc_die(this: NPC, me: USER): void {
        var fam = FAMILIES[this.family.id];
        if (!me) return;
        var fam2 = FAMILIES[me.family.id];
        if (fam == fam2) {
            me.notify('<cyn>你残害同门，门派功绩减少。</cyn>');
            me.add_temp('gongji', -1);
            return;
        }
        if (!fam || !fam2 || fam == FAMILIES.NONE || fam2 == FAMILIES.NONE) return;

        me.add_temp('killer_' + fam.id, 1, 600000);
        me.notify(
            '<red>你击杀了' + fam.name + '的弟子，对方门派在10分钟内可以对你发出追杀令。</red>',
        );
        if (fam.battle_family || fam2.battle_family) {
            return;
        }
        fam.check_battle(this, me);
    }

    /**
     * 检查并触发门派战 — NPC 被杀后调用，满足条件时开启门派战争
     * @param npc - 被杀的 NPC
     * @param killer - 击杀者（玩家）
     * @param target - 目标门派（当 killer 为空时使用）
     */
    check_battle(npc: CHARACTER, killer?: USER, target?: FAMILY): void {
        var to_fam = killer ? killer.family : target;
        if (!to_fam || !to_fam.can_battle || !this.can_battle) return;

        if (this.battle_family || to_fam.battle_family) return;
        if (this.query_temp('battle') || to_fam.query_temp('battle') || !this.boss || !to_fam.boss)
            return;
        this.battle_family = to_fam.id;
        to_fam.battle_family = this.id;
        if (killer) {
            if (npc !== this.boss) {
                this.on_kill?.(npc, killer);
            } else {
                this.battle_chat(
                    killer.family.name +
                        '欺人太甚，门下弟子' +
                        killer.name +
                        '击杀我派' +
                        npc.name +
                        '，' +
                        this.name +
                        '众弟子听令，对' +
                        killer.family.name +
                        '弟子格杀勿论！',
                );
            }
            to_fam.on_battle?.(this);
        } else {
            this.battle_chat(`${to_fam.name}欺人太甚，今日我${this.name}便讨教高下！`);
            to_fam.on_battle?.(this);
        }

        this.begin_attack(to_fam);
        to_fam.begin_attack(this);
        npc.send_fam(
            '<hiy>\n你的门派和' +
                to_fam.name +
                '的战斗开始了，请回门派防守或者进攻对方门派。\n战斗时间30分钟，结束条件是对方或己方掌门被击杀。</hiy>',
        );
        to_fam.send(
            '<hiy>\n你的门派和' +
                this.name +
                '的战斗开始了，请回门派防守或者进攻对方门派。\n战斗时间30分钟，结束条件是对方或己方掌门被击杀。</hiy>',
        );
    }

    /**
     * 开始门派战 — 创建副本房间、生成守卫 NPC、注册活动事件
     * @param fam - 敌对门派
     */
    begin_attack(fam: FAMILY): void {
        this.battle_score = 0;
        this.battle_heartbeat_count = 0;
        this.battle_command_count = 0;
        this.battle_context = this.create_battle_context(fam);
        this.set_temp('battle', 1, 3600000);
        this.battle_over_handler = this.call_out(this.battle_over, 30 * 60000, 'timeout');

        this.area!.rooms[0].create_copy(this.id, 0);

        this.area!.notify_update();

        this.create_guards();
        this.create_npcs();

        EVENTS.add(this.create_event());
    }

    /** 创建公共门派战适配器；帮派模式可复用 NPC 核心而替换此适配器。 */
    create_battle_context(fam: FAMILY): BattleContext {
        return {
            mode: 'family',
            attackerId: fam.id,
            defenderId: this.id,
            attackerName: fam.name,
            defenderName: this.name,
            getRoom: (ownerId, baseRoom) => baseRoom.query_copy(ownerId),
            addScore: (actor, value) => actor.family?.add_score(actor, value),
            addGongji: (actor, value) => actor.family?.add_gongji(actor, value),
            canEnter: () => true,
        };
    }

    /**
     * 创建门派战活动事件 — 供 EVENTS.add 注册到活动面板
     * @returns 活动事件对象
     */
    create_event(fam?: FAMILY): any {
        let target_fam = FAMILIES[this.battle_family!];
        const desc = '你的门派正在和' + target_fam.name + '发生战争，击杀对方弟子会获得丰厚奖励。';
        return {
            id: 'family_' + this.id + '_bat',
            name: '门派战争',
            desc,
            query_desc: (me?: USER) =>
                `${desc}\n<mem>今日奖励：${me?.query_temp('mp_battle_drop', 0) ?? 0}/10　` +
                `今日贡献：${me?.query_temp('sssc', 0) ?? 0}/${500 + (me?.query_prop('shashou') ?? 0)}</mem>`,
            time: Date.now() + 30 * 60000,
            grade: 2,
            command: '进入战场',
            check: (me: USER) => me.family === this,
            on_command: function (me: USER) {
                me.do_command('goto', 'fam3 ' + target_fam.id);
            },
        };
    }

    /**
     * 获取门派副本房间 — 根据门派 ID 查询对应副本
     * @param rm - 基础房间
     * @returns 副本房间实例
     */
    get_room(rm: Record<string, any>): ROOM | undefined {
        return rm.query_copy(this.id);
    }

    /** 创建掌门、两名长老与四名紫色弟子。 */
    create_guards(): void {
        const config = this.battle_config;
        if (!config || !this.boss) return;

        const boss = this.create_npc(5, 'boss');
        if (boss) {
            boss.name = this.boss.name;
            boss.desc = this.boss.desc;
            boss.title = `<ora>${config.titles.boss}</ora>`;
            boss.age = this.boss.age;
            boss.gender = this.boss.gender;
            this.register_battle_npc(boss, config.boss_room);
            this.battle_boss = boss;
            boss.add_event('on_heart_beat', this.on_battle_boss_heartbeat.bind(this));
        }
        for (const room of config.elder_rooms) {
            const elder = this.create_npc(5, 'elder');
            if (elder) this.register_battle_npc(elder, room);
        }
        let purpleCount = 0;
        for (const room of config.purple_rooms) {
            for (let i = 0; i < 2; i++) {
                const purple = this.create_npc(4, 'disciple');
                if (purple && this.register_battle_npc(purple, room)) purpleCount++;
            }
        }
        this.change_boss_command(purpleCount);
    }

    /** 掌门心跳事件：累计 60 次后补刷绿/蓝/黄弟子。 */
    on_battle_boss_heartbeat(): void {
        if (!this.battle_boss || !this.battle_family) return;
        this.battle_heartbeat_count++;
        if (this.battle_heartbeat_count >= 60) {
            this.battle_heartbeat_count = 0;
            this.create_npcs();
        }
    }

    /**
     * 移除门派 NPC — 从 npcs 列表中移除；号令层数由死亡流程增量扣除
     * @param npc - 要移除的 NPC
     */
    remove_npcs(npc: NPC): void {
        this.npcs.remove(npc);
    }

    /**
     * 创建单个门派 NPC（按等级）
     * @param level - NPC 等级（0-2 决定品级）
     * @returns 创建的 NPC 实例
     */
    create_npc(level: number, role: 'disciple' | 'elder' | 'boss' = 'disciple'): NPC | undefined {
        var npc = _NPC!.CLONE('pub/menpai');
        npc.init_from(this, level, role);
        npc.on_died = (killer: CHARACTER | undefined, corpse: CORPSE) =>
            this.on_battle_npc_die(npc, killer, corpse);
        return npc;
    }

    /** 注册战场克隆体，确保副本、列表和死亡回调三者一致。 */
    register_battle_npc(npc: NPC, roomPath: string): boolean {
        const baseRoom = WORLD.getRoom(roomPath);
        const room = baseRoom && this.get_room(baseRoom);
        if (!room) return false;
        this.npcs.push(npc);
        room.item_changed(npc, true);
        return true;
    }

    /** 持续创建门派NPC */
    create_npcs(): void {
        const config = this.battle_config;
        if (!config || !this.area || !this.battle_family) return;
        const aliveReinforcements = this.npcs.filter(
            (npc) => npc.hp > 0 && (npc.battle_grade ?? 0) <= 3,
        ).length;
        const missing = Math.max(0, config.reinforce_count - aliveReinforcements);
        const roomPaths = config.random_rooms?.length
            ? config.random_rooms
            : this.area.rooms.map((room) => room.path);
        const weights = config.random_grade_weights;
        const totalWeight = weights.reduce((sum, value) => sum + value, 0);
        for (let i = 0; i < missing; i++) {
            let roll = Math.random() * totalWeight;
            let grade = 1;
            for (let index = 0; index < weights.length; index++) {
                roll -= weights[index];
                if (roll < 0) {
                    grade = index + 1;
                    break;
                }
            }
            const npc = this.create_npc(grade);
            if (npc && this.register_battle_npc(npc, roomPaths.random())) {
                this.change_boss_command(1);
            }
        }
    }

    /** 按 NPC 生成/死亡增量维护掌门号令层数，不扫描全图。 */
    change_boss_command(delta: number): void {
        const boss = this.battle_boss;
        this.battle_command_count = Math.max(0, this.battle_command_count + delta);
        if (!boss || boss.hp <= 0) return;
        const oldHpRatio = boss.max_hp > 0 ? boss.hp / boss.max_hp : 1;
        boss.remove_status('boss', true);
        if (this.battle_command_count > 0) {
            boss.add_status({
                id: 'boss',
                name: '号令',
                prop: { fy_per: 30, ds_per: 30, mz_per: 30 },
                no_clear: true,
                override: 1,
                count: this.battle_command_count,
                max_count: 100,
                duration: 0,
                desc: '每名存活的本派战场 NPC 使掌门防御、躲闪和命中提高30%。',
            });
        }
        boss.recount();
        boss.recount_max_hp();
        boss.hp = Math.max(1, Math.min(boss.max_hp, Math.round(boss.max_hp * oldHpRatio)));
        boss.notify_hp();
    }

    /** 战场克隆 NPC 的统一死亡流程。 */
    on_battle_npc_die(npc: NPC, killer: CHARACTER | undefined, corpse: CORPSE): void {
        if (npc.battle_death_handled) return;
        npc.battle_death_handled = true;
        const actor = this.resolve_battle_user(killer);
        const eligible = new Set<USER>();
        const canGainMerit = (user?: USER) => {
            const familyId = user?.family?.id;
            return !!familyId && familyId !== this.id &&
                (familyId === this.battle_family || familyId === 'SHASHOU');
        };
        if ((npc.battle_grade ?? 1) >= 3 && npc.damages) {
            const minDamage = npc.max_hp * 0.03;
            for (const [id, damage] of Object.entries(npc.damages)) {
                if (damage < minDamage) continue;
                const user = WORLD.getUser(id);
                if (canGainMerit(user)) eligible.add(user!);
            }
        } else if (canGainMerit(actor)) {
            eligible.add(actor!);
        }
        if (eligible.size === 0 && canGainMerit(actor)) eligible.add(actor!);

        const merit = npc.battle_role === 'boss' ? 500 : npc.battle_role === 'elder' ? 200 :
            ([0, 10, 20, 50, 100] as number[])[npc.battle_grade ?? 1] ?? 0;
        for (const user of eligible) {
            this.battle_context?.addScore(user, merit);
            this.battle_context?.addGongji(user, merit);
            user.notify(`<hiy>你在门派战中获得了${merit}点门派功绩。</hiy>`);
        }
        npc.prepare_battle_corpse?.(corpse, Array.from(eligible, (user) => user.id));

        if (npc.battle_role === 'disciple' && (npc.battle_grade ?? 0) <= 4) {
            this.change_boss_command(-1);
        }
        this.remove_npcs(npc);
        if (npc.battle_role === 'boss' && this.battle_family) {
            const winner = FAMILIES[this.battle_family];
            winner?.battle_over('suc');
            this.battle_over('die');
        }
    }

    /** 将随从、召唤物的击杀归属到在线主人。 */
    resolve_battle_user(actor?: CHARACTER): USER | undefined {
        if (!actor) return;
        if (actor.check_player()) return actor as USER;
        return actor.master ? WORLD.getUser(actor.master) : undefined;
    }

    /**
     * 门派战结束处理 — 清理 NPC、计算胜负、发放奖励
     * @param suc_type - 结束类型: "suc"=击杀对方掌门获胜, "die"/"fail"=本方掌门被杀, "timeout"=超时按积分判
     */
    battle_over(suc_type: string): void {
        if (!this.battle_family) return;
        var fam = FAMILIES[this.battle_family];
        if (!fam) return;
        this.battle_family = null!;
        this.battle_heartbeat_count = 0;
        this.battle_command_count = 0;
        if (this.battle_over_handler) clearTimeout(this.battle_over_handler);
        this.battle_over_handler = undefined;
        if (this.battle_boss) this.battle_boss.remove_status('boss', true);
        for (var i = 0; i < this.npcs.length; i++) {
            if (this.npcs[i].hp > 0) {
                this.npcs[i].send_room('$N急匆匆的走掉了。');
                this.npcs[i].destroy();
            }
        }
        this.npcs.length = 0;
        if (suc_type == 'suc') {
            COMMAND.DO(
                'sys',
                '' +
                    this.name +
                    '和' +
                    fam.name +
                    '的战斗结束了，' +
                    this.name +
                    '获得了最终胜利，接下来的一小时' +
                    this.name +
                    '所有弟子练功效率提高50%。',
            );

            this.add_battle_status(50);
            EVENTS.add(this.finish_event(50, fam));
        } else if (suc_type == 'die') {
            this.send('<hir>由于你的门派掌门被击杀，和' + fam.name + '的战斗失败了。</hir>');
        } else if (suc_type == 'fail') {
            this.send('<hir>由于你的门派掌门被击杀，和' + fam.name + '的战斗失败了。</hir>');
        } else {
            if (this.battle_score > fam.battle_score) {
                this.send(
                    '<hiy>和' +
                        fam.name +
                        '的战斗结束了，你的门派占得优势，接下来的一小时' +
                        this.name +
                        '所有弟子练功效率提高20%。</hiy>',
                );
                this.add_battle_status(20);
                EVENTS.add(this.finish_event(20, fam));
            } else {
                this.send('<hiy>和' + fam.name + '的战斗结束了，你的门派没有取得优势。</hiy>');
                EVENTS.add(this.finish_event(0, fam));
            }
        }
        if (FAMILIES['SHASHOU'] && FAMILIES['SHASHOU'].query_temp('ss_target') === this.id) {
            let sc = 0;
            if (suc_type === 'suc') sc = 0;
            else if (suc_type === 'fail') sc = 50;
            else sc = this.battle_score > fam.battle_score ? 0 : 20;
            EVENTS.remove('family_' + FAMILIES['SHASHOU'].id + '_bat');
            EVENTS.add(FAMILIES['SHASHOU'].finish_event(sc, this));
            FAMILIES['SHASHOU'].remove_temp('ss_target');
            if (sc > 0) {
                FAMILIES['SHASHOU'].add_battle_status(sc);
                FAMILIES['SHASHOU'].send(
                    '<hiy>和' +
                        this.name +
                        '的战斗结束了，你的门派占得优势，接下来的一小时所有弟子练功效率提高' +
                        sc +
                        '%。</hiy>',
                );
            } else {
                FAMILIES['SHASHOU'].send(
                    '<hiy>和' + this.name + '的战斗结束了，你的门派没有取得优势。</hiy>',
                );
            }
        }
        if (this.battle_boss) this.battle_boss.destroy();
        this.battle_boss = undefined;
        this.battle_context = undefined;
        this.area!.notify_update();
        this.call_out(this.clear_room, 300000);
        EVENTS.remove('family_' + this.id + '_bat');
    }

    /** 清理门派战场副本房间 */
    clear_room(): void {
        const rm = this.area!.rooms[0];
        rm.parent && rm.clear_by_area(rm.parent, this.id);
    }

    /**
     * 创建门派战结算事件
     * @param suc - 胜利加成百分比（0/20/50）
     * @param target_fam - 敌对门派
     * @returns 结算活动事件对象
     */
    finish_event(suc: number, target_fam: FAMILY): any {
        let msg =
            suc > 0
                ? '你的门派占得优势，所有弟子获得鼓舞，练功效率+' + suc + '%。'
                : '你的门派没有取得优势。';
        return {
            id: 'family_' + this.id + '_settle',
            name: '门派战争',
            desc: '你的门派和' + target_fam.name + '战斗结束了，' + msg,
            time: this.query_temp_expiry('battle'),
            grade: 2,
            command: '领取战利品',
            check: (me: USER) => me.family === this,
            on_command: (me: USER) => {
                this.battle_settle?.(me);
            },
        };
    }

    /**
     * 添加门派战胜利 buff — 设置练功/学习/打坐效率加成
     * @param t - 加成百分比
     */
    add_battle_status(t: number): void {
        this.battle_gift = t;
        this.add_temp('lianxi_per', t, 3600000);
        this.add_temp('study_per', t, 3600000);
        this.add_temp('dazuo_per', t, 3600000);
    }

    /**
     * 玩家登录门派回调 — 首席弟子上线时广播门派消息
     * @param me - 登录的玩家
     */
    on_login(me: Record<string, any>): void {
        if (this.first_npc && me.id == this.first_npc.userid) {
            if (!this.is_init_first) this.init_dadizi(this.first_npc, me);
            this.send(
                '{type:"msg",ch:"fam",content:"' +
                    this.first_npc.title +
                    me.name +
                    '上线了。",uid:0,name:"",fam:"' +
                    this.name +
                    '"}',
            );
        }
    }

    /**
     * 设置首席弟子 — 保存到全局数据并初始化 NPC 属性
     * @param id - 玩家 ID
     * @param name - 玩家名称
     */
    set_dadizi(id: string, name: string): void {
        this.tops = {};

        if (this.boss)
            this.boss.do_command(
                'fam',
                '本门弟子' + name + '表现突出，提升为' + this.top_name + '。',
            );

        this.is_init_first = false;
        WORLD.DATA.set_temp(this.id + '_top', id);
        WORLD.DATA.set_temp(this.id + '_top_name', name);
        var npc = this.first_npc;
        if (!npc) return;

        if (npc.environment?.is_shadow) {
            var rm = WORLD.getRoom(npc.environment.path);
            if (rm) {
                var shadow_npc = rm.find_obj_bypath('pub/dadizi#' + this.id) as NPC;
                if (shadow_npc) {
                    this.first_npc = npc = shadow_npc;
                } else {
                    this.first_npc = undefined;
                    return;
                }
            }
        }
        this.init_dadizi(npc, WORLD.getUser(id));
        this.area?.notify_update();
    }

    /**
     * 初始化首席弟子 NPC — 复制目标玩家属性、技能、装备到 NPC
     * @param npc - 首席弟子 NPC 实例
     * @param me - 目标玩家（可选，用于首次初始化）
     */
    init_dadizi(npc: NPC, me?: Record<string, any>): void {
        this.first_npc = npc;
        npc.name = (WORLD.DATA.query_temp(this.id + '_top_name') as string) || this.top_name || '';
        npc.title = this.top_name || '';
        npc.userid = (WORLD.DATA.query_temp(this.id + '_top') as string) || '';
        if (!me) return;
        npc.level = me.level;
        var copy_prop = [
            'str',
            'con',
            'dex',
            'int',
            'gender',
            'max_mp',
            'exp',
            'pot',
            'kar',
            'per',
            'name',
            'skills',
            'hp',
            'max_hp',
            'mp',
        ];
        for (var i = 0; i < copy_prop.length; i++) {
            npc[copy_prop[i]] = me[copy_prop[i]];
        }
        npc.equipment = [];
        if (me.equipment) {
            var eqs = me.equipment;
            for (var i = 0; i < eqs.length; i++) {
                if (!eqs[i]) continue;
                var obj = eqs[i].clone(me);
                npc.equipment[obj.eq_type] = obj;
            }
        }
        npc.max_hp = npc.hp = npc.max_hp * 2;
        npc.age = me.query_age();
        npc.clear_prop();
        npc.init();
        npc.recount();
        npc.auto_skills = null;
        npc.environment && npc.environment.item_changed(npc, true);
        this.is_init_first = true;
        this.first_npc_exp = npc.exp;
    }

    /**
     * 发送门派频道消息
     * @param me - 发送者（null 则为门派管理）
     * @param msg - 消息内容
     */
    send_channel(me: Record<string, any>, msg: string): void {
        var msg =
            '{type:"msg",ch:"fam",content:"' +
            msg +
            '",fam:"' +
            this.name +
            '", name:"' +
            (me ? me.name : '门派管理') +
            '" }';
        this.send(msg);
    }

    /**
     * 查询玩家在门派的师门任务称谓
     * @param me - 玩家
     * @returns 完整的师门称谓（如"武当入门弟子"）
     */
    query_task_title(me: Record<string, any>): string {
        let level = me.query_temp('sm_level', 0);
        return me.family.name + TITLES[level];
    }

    /**
     * 查询指定品级师门任务称谓
     * @param level - 品级（0-5）
     * @returns 称谓文本
     */
    query_job_title(level: number): string {
        return TITLES[level];
    }

    // ============ 静态方法(由extends合并) ============

    /**
     * 热更新所有门派中匹配路径的 NPC
     * @param path - NPC 资源路径前缀
     */
    static UPDATE_NPC(path: string): void {
        for (let key in FAMILIES) {
            let fam = FAMILIES[key];
            if (!fam.def_npcs) continue;
            fam.update_npc(path);
        }
    }

    /**
     * 序列化所有门派持久数据（排行榜、临时数据等）
     * @deprecated 未使用 — FAMILY.temp 全为短生命周期数据（最长1h），SAVE/LOAD 从未接入持久化链路
     * @returns JSON 字符串
     */
    static SAVE(): string {
        var obj: Record<string, any> = {};
        for (var key in FAMILIES) {
            var fam = FAMILIES[key];
            if (fam.tops) {
                obj[key + '_tops'] = fam.tops;
            }
            obj.temp = fam.temp;
        }
        return JSON.stringify(obj);
    }

    /**
     * 从 JSON 字符串恢复门派持久数据
     * @deprecated 未使用 — 见 SAVE()
     * @param str - JSON 字符串
     */
    static LOAD(str: string): void {
        var obj = JSON.toObject(str);
        if (!obj) return;
        for (var key in FAMILIES) {
            var fam = FAMILIES[key];
            if (obj[key + '_tops']) {
                fam.tops = obj[key + '_tops'];
            }
            fam.temp = obj.temp;
        }
    }
}

/** 所有门派注册表 — 必须在 FAMILY class 之后定义以避免循环依赖 TDZ */
export const FAMILIES: Record<string, FAMILY> = { NONE: new FAMILY() };

const TITLES: string[] = ['入门弟子', '弟子', '执事', '护法', '长老', '供奉'];

// 使FAMILIES全局可用
(globalThis as Record<string, any>).FAMILIES = FAMILIES;
