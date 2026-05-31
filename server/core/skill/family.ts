/**
 * FAMILY 门派基类
 */
import { BASE } from "../base.js";
import { WORLD } from "../world.js";
import { ITEM } from "../item.js";
import { UTIL } from "../util.js";
import { ROOM } from "../room/room.js";
import { EVENTS } from "../task/events.js";
import { COMMAND } from "../command.js";
import type { NPC } from '../char/npc.js';
import type { SKILL } from './skill.js';
import type { AREA } from '../room/area.js';

// 懒加载 NPC 避免循环依赖: family.ts → npc.ts → character.ts (TDZ)
let _NPC: {
    CLONE: (path: string, ...args: any[]) => any;
    CREATE: (path: string, room?: any) => any;
    GET: (path: string) => any;
} | null = null;
import("../char/npc.js").then((m: Record<string, unknown>) => { _NPC = m.NPC as any; });

export class FAMILY extends BASE {

    // ============ 核心属性 ============

    /** 门派名称 */
    name: string = "未命名门派";
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

    // ============ 动态属性（资源文件/运行时设置） ============

    /** 门派ID */
    id: string = "";
    /** 临时数据 */
    temp: Record<string, unknown> | null = null;
    /** 门派战结算 */
    battle_settle?: number;
    /** 击杀回调 — 触发时机：门派战中 NPC 被对方门派玩家击杀时（on_npc_die 中，非掌门 NPC 被击杀后） */
    on_kill?: (killer: Record<string, any>, victim: Record<string, any>) => void;

    // ============ 资源文件设置属性 ============

    /** 门派武功列表 */
    skills: SKILL[] = [];
    skills2: SKILL[] = [];
    skills3: SKILL[] = [];
    skills4: SKILL[] = [];
    skills0: SKILL[] = [];
    /** 默认NPC定义 */
    def_npcs?: [string, string][];
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
    /** 创建NPC的定时器句柄 */
    create_handler?: ReturnType<typeof setTimeout>;
    /** 门派所属区域 */
    area: AREA | null = null;
    /** 门派性别(用于生成名字) */
    gender?: number;
    /** 门派功绩排行榜 */
    tops?: Record<string, { name: string; score: number }>;

    // ============ 回调（由资源文件设置） ============

    /** 门派称谓回调 — 传入角色，返回该角色在门派的称呼 */
    call?: (me: Record<string, any>, isbad?: boolean) => string;
    /** 自称回调 — 传入角色，返回该角色在门派的自称 */
    call_me?: (me: Record<string, any>) => string;

    // ============ ITEM方法借用(FAMILY不继承ITEM,但复用其temp方法) ============

    query_temp: (name: string, def?: unknown, _me?: unknown) => unknown = ITEM.prototype.query_temp as any;
    set_temp: (name: string, value: unknown, time?: number, _me?: unknown) => void = ITEM.prototype.set_temp as any;
    remove_temp: (name: string) => void = ITEM.prototype.remove_temp as any;
    add_temp: (name: string, value: number, time?: number, _me?: unknown) => number = ITEM.prototype.add_temp as any;

    constructor() {
        super();
    }

    // ============ 称谓管理 ============

    /**
     * 设置门派称谓
     * @param arguments - 称谓列表
     */
    set_titles(): void {
        for (let i = 0; i < arguments.length; i++) {
            this.titles.push(arguments[i]);
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
        import("../char/character.js").then((m: Record<string, unknown>) => {
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
    create_name(): string {
        return UTIL.random_name(this.gender ?? 0);
    }

    /**
     * 随机查询指定品级的技能
     * @param grade - 品级
     */
    query_skill(grade: number): SKILL | undefined {
        if (!(this as Record<string, any>).skill_levels) {
            (this as Record<string, any>).skill_levels = [];
            for (let i = 0; i < this.skills.length; i++) {
                if (!(this as Record<string, any>).skill_levels[this.skills[i].grade]) {
                    (this as Record<string, any>).skill_levels[this.skills[i].grade] = [];
                }
                (this as Record<string, any>).skill_levels[this.skills[i].grade].push(this.skills[i]);
            }
        }
        if (grade >= (this as Record<string, any>).skill_levels.length) grade = (this as Record<string, any>).skill_levels.length - 1;
        return (this as Record<string, any>).skill_levels[grade].random();
    }

    /**
     * 查询指定品级的所有技能
     * @param grade
     */
    query_skills(grade: number): SKILL[] {
        if (!(this as Record<string, any>).skill_levels) {
            (this as Record<string, any>).skill_levels = [];
            for (let i = 0; i < this.skills.length; i++) {
                if (!(this as Record<string, any>).skill_levels[this.skills[i].grade]) {
                    (this as Record<string, any>).skill_levels[this.skills[i].grade] = [];
                }
                (this as Record<string, any>).skill_levels[this.skills[i].grade].push(this.skills[i]);
            }
        }
        if (grade >= (this as Record<string, any>).skill_levels.length) grade = (this as Record<string, any>).skill_levels.length - 1;
        return (this as Record<string, any>).skill_levels[grade];
    }

    /**
     * 增加门派贡献
     * @param me
     * @param count
     */
    add_gongji(me: Record<string, any>, count: number): void {
        if (!count) return;
        me.add_temp("gongji", count);
        if (count < 0) return;
        if (!this.tops) this.tops = {};
        const old = this.tops[me.id];
        if (!old) this.tops[me.id] = { name: me.name, score: count };
        else {
            old.score += count;
        }
    }

    // ============ 门派方法(由extends合并) ============

    /** 初始化门派NPC */
    init(): void {
        if (!this.def_npcs) return;
        for (let item of this.def_npcs) {
            let rm = ROOM.Get(item[1]);
            if (!rm) throw new Error('房间' + item[1] + "不存在");
            let npc = _NPC!.CLONE(item[0]);
            if (!npc) throw new Error('npc ' + item[0] + "不存在");
            rm.items.push(npc);
            rm.max_item_count = 100;
            npc.environment = rm;
            if ((npc as any).is(this.boss_path) && !this.boss) {
                this.boss = npc;
            }
            npc.on_died = this.on_npc_die.bind(npc);
            npc.relive = this.on_famnpc_relive.bind(npc);
        }
    }

    /** @param path */
    update_npc(path: string): void {
        for (let item of this.def_npcs!) {
            let spath = item[0];
            if (spath.startsWith(path)) {
                let rm = ROOM.Get(item[1]);
                if (!rm) continue;
                let npc = rm.find_obj_bypath(spath);
                if (npc) npc.destroy();
                let new_npc = _NPC!.CREATE(spath, rm);
                if ((new_npc as any).is(this.boss_path)) {
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
    on_famnpc_relive(this: Record<string, any>): void {
        if (!this.die_room) return;
        this.die_room.item_changed(this, true);
        this.die_room = null;

        if (this.equipment && this.items[0] && !this.equipment[0]) {
            this.equip(this.items[0]);
        }
    }

    /**
     * 门派NPC死亡回调(这里的this通过bind绑定到NPC实例)
     */
    on_npc_die(this: Record<string, any>, me: Record<string, any>): void {
        var fam = FAMILIES[this.family.id];
        if (!me) return;
        var fam2 = FAMILIES[me.family.id];
        if (fam == fam2) {
            me.notify("<cyn>你残害同门，门派功绩减少。</cyn>");
            me.add_temp("gongji", -1);
            return;
        }
        if (!fam || !fam2 || fam == FAMILIES.NONE || fam2 == FAMILIES.NONE) return;

        me.add_temp("killer_" + fam.id, 1, 600000);
        me.notify("<red>你击杀了" + fam.name + "的弟子，对方门派在10分钟内可以对你发出追杀令。</red>");
        if (fam.battle_family || fam2.battle_family) {
            return;
        }
        fam.check_battle(this, me);
    }

    /** @param npc @param killer @param target */
    check_battle(npc: Record<string, any>, killer: Record<string, any>, target?: FAMILY): void {
        var to_fam = killer ? killer.family : target;
        if (!to_fam || !to_fam.can_battle || !this.can_battle) return;

        if (this.battle_family || to_fam.battle_family) return;
        if (this.query_temp("battle") ||
            to_fam.query_temp("battle")
            || !this.boss || !to_fam.boss) return;
        this.battle_family = to_fam.id;
        to_fam.battle_family = this.id;
        if (killer) {
            if (npc !== this.boss) {
                this.on_kill?.(npc, killer);
            } else if (this.first_npc) {
                this.first_npc
                    .do_command("chat",
                        killer.family.name + "欺人太甚，门下弟子" + killer.name + "击杀我派" +
                        npc.name + "，" + this.name + "众弟子听令，对" + killer.family.name + "弟子格杀勿论！");
            }
            to_fam.on_battle(this);
        }

        this.begin_attack(to_fam);
        to_fam.begin_attack(this);
        npc.send_fam("<hiy>\n你的门派和" + to_fam.name + "的战斗开始了，请回门派防守或者进攻对方门派。\n战斗时间30分钟，结束条件是对方或己方掌门被击杀。</hiy>");
        to_fam.send("<hiy>\n你的门派和" + this.name + "的战斗开始了，请回门派防守或者进攻对方门派。\n战斗时间30分钟，结束条件是对方或己方掌门被击杀。</hiy>");
    }

    /** @param fam */
    begin_attack(fam: FAMILY): void {
        this.battle_score = 0;
        this.set_temp("battle", 1, 3600000);
        this.call_out(this.battle_over, 30 * 60000, "timeout");

        this.area!.rooms[0].create_copy(this.id, 0);

        this.area!.notify_update();

        this.create_guards();
        this.create_npcs();

        EVENTS.add(this.create_event());
    }

    /** @returns Object */
    create_event(): any {
        let target_fam = FAMILIES[this.battle_family!];
        return {
            id: this.id + "_bat",
            name: "门派战争",
            desc: "你的门派正在和" + target_fam.name + "发生战争，击杀对方弟子会获得丰厚奖励。",
            time: Date.now() + 30 * 60000,
            grade: 2,
            command: "进入战场",
            check: (me: Record<string, any>) => me.family === this,
            on_command: function (me: Record<string, any>) {
                me.do_command('goto', 'fam3');
            }
        }
    }

    /** @param rm @returns ROOM */
    get_room(rm: Record<string, any>): ROOM | undefined {
        return rm.query_copy(this.id);
    }

    /** 创建门派守卫NPC */
    create_guards(): void {
        if (!this.boss_guard || !this.boss) return;

        var boss_room = this.get_room(ROOM.Get(this.boss_guard[0])!);
        var npc = _NPC!.CLONE("pub/menpai");
        npc.init_from(this, 5);
        npc.name = this.boss.name;
        npc.desc = this.boss.desc;
        npc.title = "<ora>" + this.boss.title + "</ora>";

        npc.age = this.boss.age;
        npc.gender = this.boss.gender;
        this.npcs.push(npc);
        if (boss_room) boss_room.item_changed(npc, true);

        this.battle_boss = npc;
        for (var i = 0; i < this.boss_guard.length; i++) {
            for (var j = 0; j < 2; j++) {
                npc = _NPC!.CLONE("pub/menpai");
                npc.init_from(this, i == 0 ? 4 : 3);
                var rm = this.get_room(ROOM.Get(this.boss_guard[i])!);
                if (rm) {
                    this.npcs.push(npc);
                    rm.item_changed(npc, true);
                }
            }
        }
    }

    /** @param npc */
    remove_npcs(npc: Record<string, any>): void {
        this.npcs.remove(npc as any);
        if (this.battle_boss) {
            this.battle_boss.remove_status("boss");
        }
    }

    /** @param level @returns NPC */
    create_npc(level: number): NPC | undefined {
        var npc = _NPC!.CLONE("pub/menpai");
        npc.init_from(this, level);
        return npc;
    }

    /** 持续创建门派NPC */
    create_npcs(): void {
        if (this.npcs.length < 27 && this.area) {
            let count = 27 - this.npcs.length;
            for (let i = 0; i < count; i++) {
                let lv = i > 15 ? 2 : (i < 8 ? 0 : 1);
                let rm = this.get_room(this.area.rooms.random());
                let npc = this.create_npc(lv);
                if (npc) this.npcs.push(npc);
                if (rm && npc) rm.item_changed(npc, true);
            }
            if (this.battle_boss) {
                this.battle_boss.add_status({
                    id: "boss",
                    name: "号令",
                    prop: {
                        hp_per: 30,
                        fy_per: 30,
                        ds_per: 30,
                        mz_per: 30
                    },
                    no_clear: true,
                    override: 1,
                    count: count,
                    max_count: 100,
                    duration: 0,
                    desc: "当你的门派还有NPC存活时，增加你的属性"
                });
            }
        }
        this.create_handler = this.call_out(this.create_npcs, 200000);
    }

    /** @param suc_type */
    battle_over(suc_type: string): void {
        if (!this.battle_family) return;
        var fam = FAMILIES[this.battle_family];
        if (!fam) return;
        this.battle_family = null as unknown as string;
        if (this.create_handler) clearTimeout(this.create_handler);
        for (var i = 0; i < this.npcs.length; i++) {
            if (this.npcs[i].hp > 0) {
                this.npcs[i].send_room("$N急匆匆的走掉了。");
                this.npcs[i].destroy();
            }
        }
        this.npcs.length = 0;
        if (suc_type == "suc") {
            COMMAND.DO("sys", "" + this.name + "和" + fam.name + "的战斗结束了，" + this.name + "获得了最终胜利，接下来的一小时" + this.name + "所有弟子练功效率提高50%。");

            this.add_battle_status(50);
            EVENTS.add(this.finish_event(50, fam));
        } else if (suc_type == "die") {
            this.send("<hir>由于你的门派掌门被击杀，和" + fam.name + "的战斗失败了。</hir>");
        } else if (suc_type == "fail") {
            this.send("<hir>由于你的门派掌门被击杀，和" + fam.name + "的战斗失败了。</hir>");
        } else {
            if (this.battle_score > fam.battle_score) {
                this.send("<hiy>和" + fam.name + "的战斗结束了，你的门派占得优势，接下来的一小时" + this.name + "所有弟子练功效率提高20%。</hiy>");
                this.add_battle_status(20);
                EVENTS.add(this.finish_event(20, fam));
            } else {
                this.send("<hiy>和" + fam.name + "的战斗结束了，你的门派没有取得优势。</hiy>");
                EVENTS.add(this.finish_event(0, fam));
            }
        }
        if (FAMILIES["SHASHOU"] && FAMILIES["SHASHOU"].query_temp('ss_target') === this.id) {
            let sc = 0;
            if (suc_type === 'suc') sc = 0;
            else if (suc_type === 'fail') sc = 50;
            else sc = this.battle_score > fam.battle_score ? 0 : 20;
            EVENTS.remove(FAMILIES["SHASHOU"].id + "_bat");
            EVENTS.add(FAMILIES["SHASHOU"].finish_event(sc, this));
            FAMILIES["SHASHOU"].remove_temp('ss_target');
            if (sc > 0) {
                FAMILIES["SHASHOU"].add_battle_status(sc);
                FAMILIES["SHASHOU"].send("<hiy>和"
                    + this.name + "的战斗结束了，你的门派占得优势，接下来的一小时所有弟子练功效率提高" + sc + "%。</hiy>");
            } else {
                FAMILIES["SHASHOU"].send("<hiy>和"
                    + this.name + "的战斗结束了，你的门派没有取得优势。</hiy>");
            }
        }
        if (this.battle_boss)
            this.battle_boss!.destroy();
        this.battle_boss = null as any;
        this.area!.notify_update();
        this.call_out(this.clear_room, 300000);
        EVENTS.remove(this.id + "_bat");
    }

    /** 清理门派战场副本房间 */
    clear_room(): void {
        const rm = this.area!.rooms[0];
        rm.clear_by_area((rm as any).parent, this.id);
    }

    /** @param suc @param target_fam @returns Object */
    finish_event(suc: number, target_fam: FAMILY): any {
        let msg = suc > 0 ? "你的门派占得优势，所有弟子获得鼓舞，练功效率+" +
            suc + "%。" : "你的门派没有取得优势。";
        return {
            id: this.id + "_settle",
            name: "门派战争",
            desc: "你的门派和" + target_fam.name + "战斗结束了，" + msg,
            time: (this.temp as any)["battle"].e,
            grade: 2,
            command: "领取战利品",
            check: (me: Record<string, any>) => me.family === this,
            on_command: (me: Record<string, any>) => {
                (this as any).battle_settle(me)
            }
        }
    }

    /** @param t */
    add_battle_status(t: number): void {
        this.battle_gift = t;
        this.add_temp("lianxi_per", t, 3600000);
        this.add_temp("study_per", t, 3600000);
        this.add_temp("dazuo_per", t, 3600000);
    }

    /** @param me */
    on_login(me: Record<string, any>): void {
        if (this.first_npc && me.id == (this.first_npc as any).userid) {
            if (!this.is_init_first)
                this.init_dadizi(this.first_npc, me);
            this.send('{type:"msg",ch:"fam",content:"' + this.first_npc.title + me.name + '上线了。",uid:0,name:"",fam:"' + this.name + '"}');
        }
    }

    /** @param id @param name */
    set_dadizi(id: string, name: string): void {
        this.tops = {};

        if (this.boss)
            this.boss.do_command("fam", '本门弟子' + name + '表现突出，提升为' + this.top_name + '。');

        this.is_init_first = false;
        WORLD.DATA.set_temp(this.id + "_top", id);
        WORLD.DATA.set_temp(this.id + "_top_name", name);
        if (this.first_npc) {
            if (this.first_npc.environment && (this.first_npc.environment as any).is_shadow) {
                var rm = ROOM.Get(this.first_npc.environment.path);
                if (rm) {
                    var npc = rm.find_obj_bypath('pub/dadizi#' + this.id) as any;
                    if (npc) {
                        this.first_npc = npc;
                    } else {
                        this.first_npc = undefined as any;
                        return;
                    }
                }
            }
            this.init_dadizi(this.first_npc as any, WORLD.getUser(id));
            this.area?.notify_update();
        }
    }

    /** @param npc @param me */
    init_dadizi(npc: Record<string, any>, me?: Record<string, any>): void {
        this.first_npc = npc as any;
        npc.name = WORLD.DATA.query_temp(this.id + "_top_name") || this.top_name;
        npc.title = this.top_name;
        npc.userid = WORLD.DATA.query_temp(this.id + "_top");
        if (!me) return;
        npc.level = me.level;
        var copy_prop = ["str", "con", "dex", "int", "gender", "max_mp", "exp", "pot", "kar", "per"
            , "name", "skills", "hp", "max_hp", "mp"];
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

    /** @param me @param msg */
    send_channel(me: Record<string, any>, msg: string): void {
        var msg = '{type:"msg",ch:"fam",content:"' + msg + '",fam:"' + this.name + '", name:"' + (me ? me.name : "门派管理") + '" }';
        this.send(msg);
    }

    /** @param me @returns string */
    query_task_title(me: Record<string, any>): string {
        let level = me.query_temp('sm_level', 0);
        return me.family.name + TITLES[level];
    }

    /** @param level @returns string */
    query_job_title(level: number): string {
        return TITLES[level];
    }

    // ============ 静态方法(由extends合并) ============

    /** @param path */
    static UPDATE_NPC(path: string): void {
        for (let key in FAMILIES) {
            let fam = FAMILIES[key];
            if (!fam.def_npcs) continue;
            fam.update_npc(path);
        }
    }

    /** @returns string */
    static SAVE(): string {
        var obj: Record<string, unknown> = {};
        for (var key in FAMILIES) {
            var fam = FAMILIES[key];
            if (fam.tops) {
                obj[key + "_tops"] = fam.tops;
            }
            obj.temp = fam.temp;
        }
        return JSON.stringify(obj);
    }

    /** @param str */
    static LOAD(str: string): void {
        var obj = (JSON as any).toObject(str);
        if (!obj) return;
        for (var key in FAMILIES) {
            var fam = FAMILIES[key];
            if (obj[key + "_tops"]) {
                fam.tops = obj[key + "_tops"];
            }
            fam.temp = obj.temp;
        }
    }
}

/** 所有门派注册表 — 必须在 FAMILY class 之后定义以避免循环依赖 TDZ */
export const FAMILIES: Record<string, FAMILY> = { NONE: new FAMILY() };

const TITLES: string[] = ['入门弟子', '弟子', '执事', '护法', '长老', '供奉'];

// 使FAMILIES全局可用
(globalThis as Record<string, unknown>).FAMILIES = FAMILIES;
