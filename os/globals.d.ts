/**
 * 全局类型声明 — 为 world/ 目录下的内容文件提供类型提示和代码补全
 *
 * world/ 中的文件通过 this.inherits(ROOM/NPC/...) 继承自 os/ 中定义的类，
 * 这些类在运行时作为全局变量存在。此文件声明它们的类型。
 */

// ============================================================
// 基础工具类型
// ============================================================

/** 通过 this.set({}) 设置的通用属性 */
interface BaseProps {
    name?: string;
    desc?: string;
    title?: string;
    gender?: number;
    age?: number;
    per?: number;
    str?: number;
    con?: number;
    dex?: number;
    int?: number;
    kar?: number;
    max_hp?: number;
    max_mp?: number;
    limit_mp?: number;
    level?: number;
    exp?: number;
    pot?: number;
    money?: number;
    family?: FAMILY;
    family_level?: number;
    /** 属性加成 */
    prop?: { [key: string]: number | { [sk: string]: number } };
    /** 物品路径 */
    path?: string;
    /** 颜色名称缓存 */
    color_name?: string;
    /** 技能定义 */
    skills?: { [id: string]: SkillData };
    /** 临时数据 */
    temp?: { [key: string]: any };
    /** 状态列表 */
    status?: StatusItem[];
    /** 装备列表 */
    equipment?: (EQUIPMENT | null)[];
    /** 背包物品 */
    items?: OBJ[];
    /** 可否在战斗中执行 */
    allow_fight?: boolean;
    /** 绝招是否自动释放 */
    auto_pfm?: boolean;
    [key: string]: any;
}

interface SkillData {
    level: number;
    exp: number;
    enable_skill?: string;
    addin?: number[];
    ref?: string;
    [baseSkill: string]: any;
}

interface StatusItem {
    id: string;
    name: string;
    duration: number;
    override: number;
    count: number;
    max_count: number;
    start_time: number;
    on_interval?: (me: any, count: number) => boolean | void;
    is_busy?: boolean;
    is_faint?: boolean;
    is_miss?: boolean;
    is_rash?: boolean;
    is_shadow?: boolean;
    only_combat?: boolean;
    downside?: any;
    no_clear?: boolean;
    no_diff?: boolean;
    prop?: { [key: string]: number };
    start_msg?: string;
    finish_msg?: string;
    handler?: NodeJS.Timeout;
    ig_control?: number;
    on_attach?: (me: any) => void;
    on_expire?: (me: any) => void;
    duration_count?: number;
    over_count?: number;
}

// ============================================================
// 核心基础类
// ============================================================

declare class BASE {
    path: string;
    id: string;
    uid: string;
    _events: { [name: string]: Array<{ func: Function; time: number }> | null };

    /** 批量设置属性 */
    set(pars: { [key: string]: any }): void;
    /** 继承父类 */
    inherits(ctor: Function): void;
    /** 创建回调 */
    create(fname: string, ctor?: string): void;
    /** 更新回调 */
    update(fname: string, par?: string): void;
    /** 延时调用 */
    call_out(func: (...args: any[]) => any, time: number, arg1?: any, arg2?: any): NodeJS.Timeout;
    /** 间隔调用 */
    call_interval(func: (index: number) => boolean | void, time: number, count: number, end_func?: () => void): NodeJS.Timeout;
    /** 生成UID */
    create_uid(): string;
    /** 随机数(0 ~ num-1) */
    random(num: number): number;
    /** 添加事件覆盖 */
    add_event(fname: string, func: (...args: any[]) => any, time?: number): void;
    /** 移除事件 */
    remove_event(name: string, func: Function): void;
    /** 触发事件 */
    fire_event(name: string): boolean | undefined;
}

// ============================================================
// ITEM — 所有物件基类
// ============================================================

declare class ITEM extends BASE {
    name: string;
    desc: string;
    environment: ROOM | null;
    items: ITEM[];
    actions: { [cmd: string]: { name: string; action: (...args: any[]) => any } };
    max_item_count: number;
    json: string | null;
    is_player?: boolean;
    hp: number;
    mp: number;
    max_hp: number;
    max_mp: number;
    fight_type: number;
    no_fight?: boolean;
    on_checkskill?: (me: CHARACTER) => boolean;
    on_master?: (me: CHARACTER) => boolean;
    sell_list?: OBJ[];
    master?: string;
    item_types?: string;
    no_message?: boolean;

    /** 心跳 */
    heart_beat(dt: number): void;
    /** 初始化 */
    init(): void;
    /** 添加可交互命令 */
    add_action(cmd: string, name: string, func: (...args: any[]) => any): { name: string; action: Function };
    /** 移除命令 */
    remove_action(name: string | string[]): void;
    /** 执行命令 */
    exec(cmdName: string, pars: any[]): boolean;
    /** 查询物品数量 */
    item_count(): number;
    /** 是否已满 */
    is_full(val?: number): boolean;
    /** 根据ID查找子物品 */
    find_obj(id: string): ITEM | null;
    /** 根据路径查找 */
    find_obj_bypath(path: string, parent?: ITEM): ITEM | undefined;
    /** 遍历子物品 */
    each_item(func: (item: ITEM) => boolean | void, parent?: ITEM): void;
    /** 判断是否同一物品 */
    is(obj: ITEM | string | null): boolean;
    /** 根据ID移除物品 */
    remove_item_byid(obj: string, count?: number): ITEM | null;
    /** 移除物品 */
    remove_item(obj: ITEM, count?: number): ITEM | null;
    /** 移动物品到目标 */
    move_item_to(obj: ITEM, count: number, target: ITEM): ITEM | undefined;
    /** 接收物品 */
    push_item(moved_obj: ITEM): ITEM | undefined;
    /** 创建ID */
    create_id(): void;
    /** 刷新缓存 */
    refresh(): void;
    /** 是否隐藏 */
    is_hidden(): boolean;
    /** 查询创建时间 */
    query_create_time(): Date | undefined;
    /** 根据ID在数组中查找 */
    find_obj_byid(items: ITEM[], oid: string): ITEM | undefined;
    /** 完整名称 */
    long_name(): string;
    /** 销毁 */
    destroy(msg?: string): void;
    /** 格式化临时数据 */
    format_temp(temp: { [key: string]: any }, timeout?: number): string;

    // 事件回调
    on_create?: (path: string, par?: string) => void;
    on_heart_beat?: (dt: number) => void;
    on_enter?: (obj: ITEM) => void;
    on_leave?: (obj: ITEM, dir?: string) => boolean | void;
    on_init?: (me: CHARACTER) => void;
    on_use?: (me: CHARACTER) => boolean | void;
    on_study?: (me: CHARACTER) => boolean | void;
    on_open?: (me: CHARACTER) => boolean | void;
    on_die?: (killer: CHARACTER) => boolean | void;
}

// ============================================================
// CHARACTER — 生物基类
// ============================================================

declare class CHARACTER extends ITEM {
    str: number;
    con: number;
    dex: number;
    int: number;
    per?: number;
    gender: number;
    money: number;
    exp: number;
    pot: number;
    score: number;
    level: number;
    user_level?: number;
    family: FAMILY;
    attack_skill: SKILL;
    dodge_skill: SKILL;
    parry_skill: SKILL;
    force_skill: SKILL;
    noweapon_skill: SKILL;
    enemy: CHARACTER[];
    attack_handler: NodeJS.Timeout | null;
    release_time: number;
    gjsd: number;
    mz: number;
    ds: number;
    auto_skills?: Array<{ type: string; pfm: PERFORM; release_time: number; ban_use?: boolean }>;
    is_faint?: boolean;
    is_busy?: boolean;
    is_miss?: boolean;
    is_rash?: boolean;
    is_shadow?: boolean;
    state?: { title: string; rate: number; allow_fight?: boolean; heat_count: number; start_time: number; desc?: string; no_stop?: boolean; commands?: string; on_enter?: (me: CHARACTER, dt: number) => boolean | void; on_stop?: (me: CHARACTER, isauto?: boolean) => boolean | void };
    follow_target?: CHARACTER | null;
    follow_targets?: CHARACTER[];
    team?: CHARACTER[];
    attack_part?: { name: string; hert: number; crit: number };
    damages?: { [playerId: string]: number };
    record_damage?: boolean;
    prop?: { [key: string]: number };
    combat_props?: Array<[string, number]>;
    ig_control?: number;
    eq_groups?: string[][];
    sk_groups?: Array<string[] | null>;
    books?: string[];
    stores?: OBJ[];

    /** 发送消息 */
    send(text?: string): void;
    /** 通知消息 */
    notify(text?: string): void;
    /** 失败通知 */
    notify_fail(text?: string): boolean;
    /** 是否存活 */
    is_living(): boolean;
    /** 是否在指定路径 */
    is_in(path: string): boolean;
    /** 是否在同一房间 */
    is_here(obj: CHARACTER): boolean;
    /** 发送房间消息（多视角） */
    send_room(text: string, target?: CHARACTER, excludeself?: boolean): void;
    /** 发送战斗消息 */
    send_combat(text: string, target?: CHARACTER): void;
    /** 向周围发送消息 */
    send_message(msg: string, include_me?: boolean): void;
    /** 查询设置 */
    query_setting(name: string): number;
    /** 第三人称 */
    call3(): string;
    /** 执行命令 */
    command(req: string): void;
    /** 开始比试 */
    do_fight(target: CHARACTER): void;
    /** 开始击杀 */
    do_kill(target: CHARACTER): void;
    /** 添加敌人 */
    add_enemy(target: CHARACTER): void;
    /** 通知气血变化 */
    notify_hp(type?: string, val?: number): void;
    /** 增/减气血 */
    add_hp(v: number): number;
    /** 增/减内力 */
    add_mp(v: number): number | undefined;
    /** 是否在战斗中 */
    is_fighting(p?: CHARACTER): boolean;
    /** 结束战斗 */
    end_fight(): boolean | undefined;
    /** 查询当前敌人 */
    query_enemy(): CHARACTER | undefined;
    /** 是否可攻击 */
    can_attack(): boolean;
    /** 结束一轮攻击 */
    end_attack(target: CHARACTER): boolean | undefined;
    /** 随机攻击部位 */
    query_part(): { name: string; hert: number; crit: number };
    /** 满血满蓝 */
    full(): void;
    /** 清除冷却 */
    clear_distime(pfmid?: string): void;
    /** 执行攻击 */
    do_attacks(par: any): void;
    /** 移动到房间 */
    moveto(rm: ROOM | string, leave_msg?: string, in_msg?: string, dir?: string): boolean | undefined;
    /** 跟随 */
    do_follow(target: CHARACTER | null): void;
    /** 清除跟随 */
    clear_follow(): void;
    /** 通知随从 */
    notify_follower(dir: string): void;
    /** 逃跑 */
    do_escape(): boolean;
    /** 退出队伍 */
    team_out(msg: string): void;
    /** 装备物品 */
    equip(obj: EQUIPMENT): boolean | undefined;
    /** 卸下装备 */
    unequip(obj: EQUIPMENT, notsend?: boolean, recover_time?: number): boolean | undefined;
    /** 武器变更 */
    weapon_changed(iseq: boolean): void;
    /** 添加物品 */
    add_obj(obj: OBJ | string, count?: number): OBJ | undefined;
    /** 移除物品 */
    remove_obj(obj: OBJ | string, count?: number): OBJ | undefined;
    /** 获取当前武器 */
    query_weapon(): EQUIPMENT | undefined;
    /** 获取武器类型 */
    query_weapon_type(): string;
    /** 武器名称 */
    weapon_name(): string;
    /** 暗器名称 */
    throwing_name(): string;
    /** 获取指定装备 */
    get_equipment(type: number): EQUIPMENT | undefined;
    /** 设置掉落列表 */
    set_drop(...args: any[]): void;
    /** 查询掉落 */
    query_drop(): OBJ[] | undefined;
    /** 设置初始佩戴物品 */
    set_objects(...args: Array<[string, number, boolean?]>): void;
    /** 创建角色(模板注册) */
    create(path: string, par?: string): void;
    /** 克隆到场景 */
    clone(): void;
    /** 初始化技能 */
    init_skill(): void;
    /** 技能-map */
    query_skill(name: string, def?: number): number;
    /** 设置技能 */
    set_skill(skid: string, level: number): void;
    /** 移除技能 */
    remove_skill(skillid: string): boolean | undefined;
    /** 技能上限 */
    skill_limit(): number;
    /** 批量设置技能 */
    skill_map(...args: Array<[string, number, (string | string[])?]>): void;
    /** 装备技能 */
    enable_skill(base: string, skill: string | null): boolean;
    /** 查询当前使用的技能 */
    query_used_skill(skname: string): SKILL;
    /** 查询引用绝招 */
    query_ref_skill(skill: any): PERFORM | undefined;
    /** 是否装备了某技能 */
    is_enable_skill(skid: string, type: string): boolean | undefined;
    /** 增加属性 */
    add_prop(p: string, v: number): void;
    /** 清除所有属性 */
    clear_prop(): void;
    /** 查询属性加成 */
    query_prop(name: string): number;
    /** 批量变更属性 */
    change_prop(prop: { [key: string]: number | any }, isadd: boolean): void;
    /** 增加内力上限 */
    add_maxmp(count: number): void;
    /** 查询临时数据 */
    query_temp(name: string, def?: any): any;
    /** 设置临时数据 */
    set_temp(name: string, value: any, time?: number): void;
    /** 移除临时数据 */
    remove_temp(name: string): void;
    /** 累加临时数据 */
    add_temp(name: string, value: number, time?: number): number;
    /** 添加副本分数 */
    add_fbscore(v: number, max?: number): void;
    /** 查询副本分数 */
    query_fbscore(v?: any): number;
    /** 增加积分 */
    add_score(val: number): void;
    /** 添加战斗属性 */
    add_combat_prop(name: string, val: number): void;
    /** 清除战斗属性 */
    clear_combat_prop(): void;
    /** 添加状态 */
    add_status(buff: StatusItem, from?: CHARACTER): boolean | undefined;
    /** 移除状态 */
    remove_status(sid: string, isall?: boolean): void;
    /** 清除指定类型负面状态 */
    clear_downside(type: any): number | undefined;
    /** 清除战斗状态 */
    clear_combat_status(): void;
    /** 清除所有状态 */
    clear_status(): void;
    /** 查询状态层数 */
    query_status(sid: string): number;
    /** 死亡处理 */
    die(killer?: CHARACTER): boolean | undefined;
    /** 等级描述 */
    get_level_desc(): string;
    /** 等级颜色 */
    get_level_color(): string;
    /** 称号查询 */
    query_title(type?: string): string | null;
    /** 年龄 */
    query_age(): number;
    /** 门派称谓 */
    call(isbad?: boolean): string;
    /** 自称 */
    callme(isbad?: boolean): string;
    /** 同门称谓 */
    fam_call(target: CHARACTER): string;
    /** 是否队友 */
    is_team(p: CHARACTER): boolean;
    /** 向队伍发送 */
    send_team(msg: string, nome?: boolean): void;
    /** 队伍ID */
    query_teamid(): string | null;
    /** 状态JSON */
    query_status(): string;
    /** 外观描述 */
    query_desc(me?: CHARACTER, eqcmd?: string): string;
    /** 装备格式化显示 */
    format_equipments(call3: string, str: string[], eqcmd?: string): void;
    /** 添加经验/潜能/金钱 */
    add_exp(exp?: number, pot?: number, money?: number): void;
    /** 增加金钱 */
    add_money(val: number): boolean | void;
    /** 门派频道 */
    send_fam(str: string): void;
    /** 重新计算属性 */
    recount(): void;
    /** 初始化技能后回调 */
    on_skillchanged?(): void;

    // 回调钩子
    wait_input?: (me: CHARACTER, req: string) => void;
    on_clone?: () => void;
    on_died?: (killer?: CHARACTER, corpse?: CORPSE) => void;
    on_escape?: (me: CHARACTER) => boolean;
    on_fight_over?: (target: CHARACTER, won: boolean) => void;
    on_master_learn?: (me: CHARACTER, skillId: string) => boolean | void;
    on_master_enter?: (me: CHARACTER) => void;
    on_makelove?: (me: CHARACTER) => void;
    on_teamin?: (me: CHARACTER) => void;
    on_teamout?: (me: CHARACTER) => void;
    on_master_leave?: (me: CHARACTER, nextrm: ROOM) => boolean;
    on_before_enter?: (obj: ITEM) => void;
    on_reload?: (me: CHARACTER) => void;
}

// ============================================================
// USER — 玩家类
// ============================================================

declare class USER extends CHARACTER {
    socket: any;
    is_player: true;
    password: string;
    loginTime: number;
    settings: { [key: string]: number };
    request_count: number;
    disconnect_time?: number;
    cash_money: number;
    follower?: Array<{ id: string; path: string }> | null;
    quit_room?: string;
    login_message: string | null;
    commands_json: string | null;
    titles?: Array<{ title: string; type: string; use: boolean }>;
    eq_group: number;
    max_store_count: number;
    id_address?: any;

    /** 发送登录消息 */
    send_loginmessage(): void;
    /** 重连 */
    relogin(newUser: USER): void;
    /** 获取IP */
    ip(): string;
    /** 退出游戏 */
    quit(): void;
    /** 断线处理 */
    disconnect(isreplace?: boolean): void;
    /** 加载数据 */
    loadData(role: any): void;
    /** 读取物品 */
    read_items(items: Array<Array<any>>): OBJ[];
    /** 执行登录初始化 */
    do_login(): void;
    /** 获取存档数据 */
    getData(): any;
    /** 保存 */
    save(): void;
    /** 检查并发送状态 */
    check_state(): void;
    /** 查询命令JSON */
    query_commands(player?: USER): string;
    /** 发送警告 */
    send_warn(content: string, cmds: string[], time?: number): void;
    /** 发送命令按钮 */
    send_commands(...args: string[]): void;
    /** 设置配置 */
    set_setting(name: string, value: string | number): void;
    /** 心跳 */
    heart_beat(dt: number): void;
    /** 设置状态 */
    set_state(state: any, isauto?: boolean): void;
    /** 获取状态文本 */
    get_state(): string;
    /** 通知物品变更 */
    items_changed(item: OBJ, drop_count?: number): void;
    /** 添加物品 */
    add_obj(obj: OBJ | string, count?: number): OBJ | undefined;
    /** 移除物品 */
    remove_obj(obj: OBJ | string, count?: number): OBJ | undefined;
    /** 查询家园 */
    query_home(rm_name?: string): ROOM | null;
    /** 回到家园 */
    go_home(): void;
    /** 增加元宝 */
    add_cash(count: number, desc: string): void;
    /** 查询元宝 */
    query_cash(is_cash?: boolean): number;
    /** 是否可以跟随NPC */
    can_follow(npc: NPC): boolean;
    /** 添加随从 */
    add_follower(npc: NPC): boolean;
    /** 清除家园 */
    clear_home(clear_follower?: boolean): void;
    /** 增加积分 */
    add_score(val: number): void;
    /** 是否在线 */
    is_connect(): boolean;
    /** 是否在游戏中 */
    in_world(): boolean;
    /** 读取称号 */
    read_titles(titles: Array<[string, string, number]>): void;
    /** 添加称号 */
    add_title(title: string, type: string): void;
    /** 初始化任务 */
    init_tasks(): void;
    /** 查询精力 */
    query_jingli(): number;
    /** 查询精力上限 */
    query_jclimit(): number;
}

// ============================================================
// NPC — 非玩家角色
// ============================================================

declare class NPC extends CHARACTER {
    chat_msg?: string[];
    on_master?: (me: CHARACTER) => boolean;
    no_refresh?: boolean;
    question?: { [topic: string]: any };
    die_room?: ROOM;

    /** 设置闲聊消息 */
    set_chat_msg(items: string[], chance?: number): void;
    /** 随机聊天 */
    do_chat_msg(): void;
    /** 设置出售物品 */
    set_goods(...args: string[]): void;
    /** 查询操作命令 */
    query_commands(player?: USER): string;
    /** 更新交互命令 */
    update_action(acts: { [cmd: string]: { name: string; action: Function } }): void;
    /** 复活 */
    relive(): void;

    static CREATE(path: string, env: ROOM | CHARACTER, oncreate?: (npc: NPC) => void, count?: number): NPC;
    static CLONE(path: string): NPC;
    static GET(path: string): NPC;
}

// ============================================================
// MONSTER — 怪物类
// ============================================================

declare class MONSTER extends CHARACTER {
    can_speek: boolean;
}

// ============================================================
// FOLLOWER — 随从类
// ============================================================

declare class FOLLOWER extends CHARACTER {
    master: string | null;
    master_name: string | null;
    listener?: USER | null;
    master_json: string | null;

    set_listener(me: CHARACTER, target: USER): void;
    query_mastercommands(): string;
}

// ============================================================
// ROOM — 房间类
// ============================================================

declare class ROOM extends ITEM {
    parent: AREA | null;
    exits?: { [dir: string]: string };
    long_name: string;
    no_fight?: boolean;
    no_save?: boolean;
    no_shadow?: boolean;
    is_copy_room?: boolean;
    is_shadow?: boolean;
    owner?: string;
    copy_rooms?: { [id: string]: ROOM };
    shadow_rooms?: ROOM[];
    hidden_items?: any[];
    room_exits_json: string | null;
    commands_json: string | null;
    create_time?: number;

    /** 离开房间 */
    do_leave(obj: ITEM, dir: string, leave_msg?: string): boolean | undefined;
    /** 进入房间 */
    do_enter(obj: ITEM, isshow?: boolean, in_msg?: string): void;
    /** 内容物变更 */
    item_changed(obj: ITEM, isin: boolean, changed_msg?: string, dir?: string): boolean | undefined;
    /** 物件JSON */
    item_json(item: ITEM, isin: boolean): string;
    /** 所有物件JSON */
    items_to_json(): string;
    /** 设置NPC */
    set_npc(...args: Array<string | [string, number]>): void;
    /** 设置物品 */
    set_obj(...args: Array<string | [string, number]>): void;
    /** 设置隐藏物品 */
    set_item(id: string, name: string, desc: string, commands: Array<[string, string, Function]>): any;
    /** 查找物件 */
    find_obj(oid: string): ITEM | any;
    /** 根据路径查找 */
    find_by_path(path: string): ITEM | undefined;
    /** 是否包含 */
    is_here(path: string): boolean;
    /** 广播消息 */
    notify(msg: string): void;
    /** 查询出口 */
    query_exits(dir: string): boolean;
    /** 添加出口 */
    add_exit(dir: string, rm: string): void;
    /** 移除出口 */
    remove_exit(dir: string): void;
    /** 发送出口 */
    send_exits(player: USER): void;
    /** 房间JSON */
    to_json(): string;
    /** 查询命令JSON */
    query_commands(): string;
    /** 获取路径 */
    get_path(): string;
    /** 查询复活房间 */
    query_recover_room(): string;
    /** 是否副本 */
    is_copy(): boolean;
    /** 是否副本区域 */
    is_fb(): boolean;
    /** 是否入口 */
    is_enter(): boolean;
    /** 查询副本入口 */
    query_fb_first(id: string): ROOM | undefined;
    /** 查询副本 */
    query_copy(id: string): ROOM | undefined;
    /** 查询用户的副本 */
    query_copy2(user: USER): ROOM;
    /** 清除副本 */
    clear_copy(me: USER): void;
    /** 为用户创建副本 */
    create_copy2(me: USER, diff_type?: number): ROOM | undefined;
    /** 创建副本 */
    create_copy(id: string, diff_type: number): ROOM | undefined;
    /** 创建投影 */
    create_shadow(): ROOM | undefined;
    /** 设置难度 */
    set_difficulty(type: number): void;
    /** 发送给所有玩家 */
    send(msg: string): void;
    /** 查找第一个玩家 */
    find_me(): USER | undefined;
    /** 查询房间(考虑副本) */
    query(id: string): ROOM | null;
    /** 房间内临时数据 */
    query_temp(me: USER, name: string, def?: any): any;
    set_temp(me: USER, name: string, value: any, time?: number): void;
    add_temp(me: USER, name: string, value: number, time?: number): number;

    /** 离开前回调 */
    on_leave?: (obj: ITEM, dir: string) => boolean | void;
    /** 进入前回调 */
    on_before_enter?: (obj: ITEM) => void;
    /** 进入后回调 */
    on_enter?: (obj: ITEM) => void;
    /** 创建后回调 */
    on_create?: () => void;
    /** 心跳回调 */
    on_heart_beat?: (dt: number) => void;
    /** 重连回调 */
    on_relogin?: (user: USER) => void;
    /** 难度设置回调 */
    on_set_difficulty?: (type: number) => void;

    static Get(path: string): ROOM | undefined;
    static RANDOM(): ROOM;
}

// ============================================================
// AREA — 区域类
// ============================================================

declare class AREA extends BASE {
    rooms: ROOM[];
    name: string;
    is_area: boolean;
    first: string | null;
    is_show: boolean;
    is_copy: boolean;
    not_fb?: boolean;
    expend: number;
    exp: number;
    pot: number;
    fb_index?: number;
    id?: string;
    room_path?: string;
    family?: string;
    recover_room?: string;
    desc?: string;
    drop_list?: any[];
    diff_drop_list?: any[];
    drop_npcs0?: string[];
    drop_npcs1?: string[];
    drop_items?: any;
    actions?: any;
    areas?: AREA[];

    on_leaved(me: USER): void;
    on_leave(me: USER): boolean;
    on_enterd(me: USER): void;
    on_enter(me: USER): boolean;
    query_exp(): number;
    query_desc(): string;
    clear(): void;
    query_drops(isdiff?: boolean): any[];
    query_owner?(user: USER): string | undefined;

    static Get(id: string): AREA | undefined;
}

// ============================================================
// SKILL — 技能类
// ============================================================

declare class SKILL extends BASE {
    id: string;
    name: string;
    type: number;
    grade: number;
    score: number;
    color_name: string;
    desc?: string;
    family?: FAMILY;
    can_enables?: string[];
    learn_condition?: { [key: string]: any };
    learn_condition_string?: string;
    pfm?: { [name: string]: PERFORM };
    slots?: any;
    source_skill?: boolean;
    is_ultimate?: boolean;
    is_hidden?: boolean;
    attack_actions?: string[];
    dodge_actions?: string[];
    parry_actions?: SKILL;
    weapon_vs_weapon_actions?: string[];
    weapon_vs_unarmed_actions?: string[];
    unarmed_vs_weapon_actions?: string[];
    force_rad?: number;

    query_attack_action(me: CHARACTER, target: CHARACTER): string;
    query_dodge_action(): string;
    query_parry_action(me: CHARACTER, target: CHARACTER, w2?: EQUIPMENT): string;
    level_exp(lv: number, me: CHARACTER): number;
    query_needexp(level: number, me: CHARACTER): number;
    set_default(type: string): void;
    release_prop(me: CHARACTER, lv: number): void;
    attach_prop(me: CHARACTER, lv: number): void;
    query_grade(me: CHARACTER): number;
    query_color_name(me: CHARACTER): string;
    enable(me: CHARACTER, type: string): boolean;
    disenable(me: CHARACTER, type: string): void;
    do_learn(me: CHARACTER): boolean | undefined;
    add_exp(me: CHARACTER, exp: number): boolean | undefined;
    query_score(lv: number, me: CHARACTER): number;
    grade_up(me: CHARACTER, target_skill: SKILL): boolean;
    get_pfm(name: string): PERFORM | undefined;
    set_pfm(name: string, obj: PERFORM): void;
    query_desc(me: CHARACTER, lv: number): string;

    /** 技能效果回调 */
    on_beginfight?(me: CHARACTER, target: CHARACTER): void;
    on_end_attack?(me: CHARACTER, target: CHARACTER): void;
    on_enemy_die?(killer: CHARACTER, victim: CHARACTER): void;
    on_learn?(me: CHARACTER): boolean | void;
    on_enable?(me: CHARACTER, type: string): boolean | void;
    on_disenable?(me: CHARACTER, type: string): void;
    on_remove?(me: CHARACTER): void;

    static get(id: string): SKILL | undefined;
}

// ============================================================
// PERFORM — 绝招类
// ============================================================

declare class PERFORM extends BASE {
    name: string;
    id?: string;
    pid?: string;
    enable_skill?: string;
    is_weapon?: boolean;
    distime?: number;
    check?: (me: CHARACTER, lv: number, baseType?: string) => boolean;
    use_condition?: string;

    query_name(me: CHARACTER, baseType?: string): string;
    query_mp?(me: CHARACTER, lv: number): number;
    query_releasetime?(me: CHARACTER, lv: number): number;
    query_distime?(me: CHARACTER, lv?: number, pname?: string): number;
    query_desc?(me: CHARACTER, lv: number): string;
    change_distime(me: CHARACTER, id: string, add_time?: number): void;
}

// ============================================================
// FAMILY — 门派类
// ============================================================

declare class FAMILY extends BASE {
    id: string;
    name: string;
    titles: string[];
    npcs: string[];
    battle_family: string | null;
    battle_score: number;
    battle_gift: number;
    can_battle: boolean;
    area?: AREA;
    gender?: number;
    skills?: SKILL[];
    skills0?: SKILL[];
    skills2?: SKILL[];
    skills3?: SKILL[];
    skills4?: SKILL[];
    skill_levels?: SKILL[][];

    set_titles(...args: string[]): void;
    query_title(level: number): string;
    query_temp(name: string, def?: any): any;
    set_temp(name: string, value: any, time?: number): void;
    remove_temp(name: string): void;
    add_temp(name: string, value: number, time?: number): number;
    send(str: string): void;
    is_battle(fam: FAMILY): boolean;
    add_score(me: CHARACTER, sc: number): void;
    create_name(): string;
    query_skill(grade: number): SKILL;
    query_skills(grade: number): SKILL[];
    add_gongji(me: CHARACTER, count: number): void;
    call?(me: CHARACTER, isbad?: boolean): string;
    call_me?(me: CHARACTER): string;
    on_login?(me: USER): void;
}

declare var FAMILIES: { [id: string]: FAMILY; NONE: FAMILY; MONSTER: FAMILY; [id: string]: FAMILY };

// ============================================================
// COMMAND — 命令类
// ============================================================

declare class COMMAND extends BASE {
    command?: string;
    allow_fight: boolean;
    allow_level: number;
    allow_die?: boolean;
    allow_faint?: boolean;
    allow_state?: boolean;
    allow_busy?: boolean;
    regex?: RegExp;
    exec?: (...args: any[]) => any;

    for_item(item: Function, name?: string): void;
    enter?(...args: any[]): boolean | void;

    static DO(cmd: string, par1?: any, par2?: any, par3?: any): void;
}

// ============================================================
// OBJ — 物品类
// ============================================================

declare class OBJ extends ITEM {
    unit: string;
    count: number;
    combined: boolean;
    grade: number;
    otype: number;
    value: number;
    transable: boolean;
    is_equipment?: boolean;
    is_money?: boolean;
    distime?: number;
    showAction?: boolean;
    on_use?: (me: CHARACTER) => boolean | void;
    on_study?: (me: CHARACTER) => boolean | void;
    on_open?: (me: CHARACTER) => boolean | void;
    combine_count?: number;
    is_locked?: boolean;

    long_name(): string;
    unit_name(count?: number): string;
    query_commands(me?: USER): string;
    query_desc(me?: USER): string;
    get_desc(me?: CHARACTER): string;
    uncombine(spcount: number): OBJ;
    clone(): OBJ;
    combine(obj: OBJ): void;
    save_db(str: string[]): void;
    load_db(data: any[]): void;
    notify_action(me: USER, isadd: boolean): void;
    query_grade_color(): string;

    static CREATE(otype: string, count?: number): OBJ;
    static clone_to(otype: string, to: ITEM, count?: number): OBJ | undefined;
    static create_by_odds(args: any[]): OBJ[];
}

// ============================================================
// EQUIPMENT — 装备类
// ============================================================

declare class EQUIPMENT extends OBJ {
    eq_type: number;
    level: number;
    exp: number;
    is_equipment: true;
    prop?: { [key: string]: number };
    original_prop?: { [key: string]: number };
    st_prop?: Array<{ id: string; path: string; name: string; prop: { [key: string]: number }; grade: number }>;
    hole_count?: number;
    condition?: { [key: string]: any };
    group_name?: string;
    group_prop?: (count: number) => { [key: string]: number } | undefined;
    weapon_type?: string;
    eq_msg?: string;
    uneq_msg?: string;
    is_shortcut?: boolean;

    change_prop(me: CHARACTER, is_attach: boolean): void;
    check(me: CHARACTER): boolean;
    eq(me: CHARACTER, notsend?: boolean): boolean | undefined;
    uneq(me: CHARACTER, notsend?: boolean): void;
    get_desc(me: CHARACTER): string;
    query_quality(): string;
    level_up(lev: number): void;
    clear_stone(): void;
    push_stone(stone: OBJ): boolean | undefined;
    clone(me?: CHARACTER): EQUIPMENT;
    save_db(str: string[]): void;
    load_db(data: any[]): void;
    on_load(me: CHARACTER): void;
    on_create(path: string, par?: string): void;
    check_group(me: CHARACTER, isadd: boolean): void;
}

// ============================================================
// CONTAINER — 容器类
// ============================================================

declare class CONTAINER extends OBJ {
    is_container: true;
    on_getitem?: (player: USER, item: OBJ) => boolean;

    set_items(...args: Array<string | [string, number]>): void;
    query_items(me?: USER): OBJ[];
    clear_items(me: USER, noget?: OBJ[]): void;

    static CREATE(name: string, desc: string, lv: number, odds: any[]): CONTAINER;
}

// ============================================================
// CORPSE — 尸体类
// ============================================================

declare class CORPSE extends CONTAINER {
    fromid?: string;
    no_alloc: boolean;
    no_drops?: string[];

    init(player: CHARACTER, iskeep?: boolean): void;
    disappear(): void;
    check_get(player: USER, item: OBJ): boolean;
}

// ============================================================
// MONEY — 货币类
// ============================================================

declare class MONEY extends OBJ {
    is_cash: boolean;
    is_money: true;
    transable: true;
}

// ============================================================
// TASK / USERTASK — 任务类
// ============================================================

declare class TASK extends BASE {
    id?: string;

    create(): void;
    update(path: string): void;
    startup(oldtask?: TASK): void;
    stop(): void;

    static GET(id: string): TASK | undefined;
}

declare class USERTASK extends BASE {
    id?: string;

    create(path: string): void;
    update(path: string): void;
    query_title(): string | undefined;
    start(player?: USER): any;
    query_desc(): string | undefined;
    query_state(): number;

    on_create?(): void;
    on_start?(player: USER): void;

    static RUN(id: string, player: USER): any;
    static GET(id: string): USERTASK | undefined;
}

// ============================================================
// 全局对象 WORLD
// ============================================================

declare var WORLD: {
    USERS: USER[];
    COMMANDS: { [name: string]: COMMAND };
    SKILLS: { [id: string]: SKILL };
    ROOMS: { [path: string]: ROOM };
    RUN_ROOMS: ROOM[];
    DEFAULT_SKILLS: { [type: string]: SKILL };
    DEFAULT_COMMAND?: COMMAND;
    AREAS: AREA[];
    TASKS: USERTASK[];
    SYSTEMTASKS: TASK[];
    USER_EVENTS: any[];
    OBJ_STROE: Map<string, OBJ>;
    NPC_STROE: Map<string, NPC>;
    HEARTBEATCOUNT: number;
    SERVERID: number;
    DATA: any;
    DB: any;
    LOGS: any[];
    RECEIVED: any[];
    STATUS: any;

    sendAll(msg: string): void;
    getUser(id: string | number): USER | undefined;
    find_user(name: string): USER | undefined;
    log(user: USER | null, cmd: string, msg: string): void;
    save(): Promise<boolean>;
    auto_get?(killer: CHARACTER, corpse: CORPSE, victim: CHARACTER): void;
    on_user_die(me: CHARACTER, killer: CHARACTER, corpse?: CORPSE): void;

    [key: string]: any;
};

// ============================================================
// 常量
// ============================================================

declare var SKILL_TYPES: { BASE: number; SKILL: number; KNOWLEDGE: number };
declare var BASE_SKILLS: { FORCE: string; DODGE: string; PARRY: string; BITE: string };
declare var EQUIP_TYPE: { WEAPON: number; CLOTH: number; SHOES: number; HEAD: number; CAPE: number; RING: number; NECKLACE: number; JEWELS: number; WRIST: number; WAIST: number; THROWING: number };
declare var WEAPON_TYPE: { NONE: string; SWORD: string; BLADE: string; STAFF: string; CLUB: string; WHIP: string; THROWING: string };
declare var PROPERTIES: { [key: string]: string };
declare var UTIL: any;
declare var __CONFIG: any;
declare var __PATH: any;
