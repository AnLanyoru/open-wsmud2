// ============================================================
// CHARACTER - 生物基类
// ============================================================

import { ITEM } from '../item.js';
import { OBJ } from '../item/obj.js';
import { PERFORM, SKILL, SkillItem } from '../skill/skill.js';
import { WORLD } from '../world.js';
import { UTIL } from '../util.js';
import {
    WEAPON_TYPE,
    WEAPON_SKILLS,
    BASE_SKILLS,
    EQUIP_TYPE,
    SKILL_TYPES,
    PfmFlag,
} from '../const.js';
import { FIELD_TO_MASK, FMASK, get, popcount } from '../templates.js';
import type { EQUIPMENT } from '../item/equipment.js';

import type { PfmFlagType, StatusDef } from '../../types/events.js';
import type { ActionMap } from '../../types/base.js';
import type { ROOM } from '../room/room.js';
import { FAMILIES, type FAMILY } from '../skill/family.js';
import type { NPC } from './npc.js';
import type { GameSocket } from '../world.js';
import type { COMMAND } from '../command.js';
import type { UserState } from './user.js';
import { BASE } from '../base.js';
import { encodeBinaryFrame } from '../net-ws.js';
import { markRoomDirty } from '../world.js';
import { SkillsMap } from './skills_map.js';
import type { PropMap } from '../../types/props.js';

// ============================================================
// 本地类型定义
// ============================================================

export interface SkillData {
    /** 技能等级 */
    level: number;
    /** 技能经验值 */
    exp: number;
    /** 启用的关联技能 ID（指向基本技能，非 null 表示已装备到某个基本技能上） */
    enable_skill: string | null;

    // === 启用标记：当前技能被装备到哪个基本技能（key=基本技能ID，value=true/false） ===
    /** 是否启用为内功（force） */
    force?: boolean;
    /** 是否启用为轻功（dodge） */
    dodge?: boolean;
    /** 是否启用为招架（parry） */
    parry?: boolean;
    /** 是否启用为撕咬（bite） */
    bite?: boolean;
    /** 是否启用为空手（unarmed） */
    unarmed?: boolean;
    /** 是否启用为剑法（sword） */
    sword?: boolean;
    /** 是否启用为刀法（blade） */
    blade?: boolean;
    /** 是否启用为杖法（staff） */
    staff?: boolean;
    /** 是否启用为棍法（club） */
    club?: boolean;
    /** 是否启用为鞭法（whip） */
    whip?: boolean;
    /** 是否启用为暗器（throwing） */
    throwing?: boolean;

    // === 运行时状态 ===
    /** 是否暂时禁用（管理员标记） */
    disable?: boolean;
    /** 融合技能引用路径（格式：skill_id/action_name） */
    ref?: string;
    /** 技能进阶槽位 ID 列表（影响技能 grade 和附加属性） */
    addin?: number[];
}

interface AttackPart {
    /** 部位名称 */
    name: string;
    /** 伤害倍率 */
    hert: number;
    /** 暴击率加成 */
    crit: number;
}

// ================================================================
// DoAttackPar 位标记 — 将 11 个布尔字段合并为 1 个 number
// ================================================================
export const PARF = {
    NO_WEAPON: 1 << 0, // 1
    IS_THROWING: 1 << 1, // 2
    NO_APPEND: 1 << 2, // 4
    NO_APPEND_TARGET: 1 << 3, // 8
    NO_APPEND_BEFORE: 1 << 4, // 16
    NO_DODGE: 1 << 5, // 32
    NO_PARRY: 1 << 6, // 64
    NO_POWER: 1 << 7, // 128
    IS_DODGED: 1 << 8, // 256
    IS_PARRIED: 1 << 9, // 512
    ISCIRT: 1 << 10, // 1024
} as const;

/** 检查 par.flags 中是否置位 */
export function hasParFlag(flags: number | undefined, flag: number): boolean {
    return ((flags ?? 0) & flag) !== 0;
}

/** do_attack() 的参数对象 — 双向通信：输入字段由调用方设置，输出字段由 do_attack 写入 */
export interface DoAttackPar {
    // === 输入：基础 ===
    /** 攻击目标（若缺省则取当前敌人） */
    target?: CHARACTER;
    /** 攻击力（默认 this.gj） */
    gj?: number;
    /** 命中值（默认 this.mz） */
    mz?: number;

    // === 输入：消息 ===
    /** 攻击消息；undefined=自动生成 ""=不显示 */
    attack_msg?: string;
    /** 闪避消息 */
    miss_msg?: string;
    /** 招架消息 */
    parry_msg?: string;
    /** 伤害消息（可被 on_parry 回调改写） */
    damage_msg?: string;
    /** 拼接到 attack_msg 之前的前置文本 */
    attack_before?: string;

    // === 输入：攻击类型标记 ===
    /** 强制空手攻击（不读取武器） */
    no_weapon?: boolean;
    /** 暗器攻击 */
    is_throwing?: boolean;

    // === 输入：技能回调控制 ===
    /** 跳过 on_attack_over / on_force_over */
    no_append?: boolean;
    /** 跳过目标的 on_dodge_over / on_parry_over */
    no_append_target?: boolean;
    /** 跳过 on_before_attack */
    no_append_before?: boolean;

    // === 输入：战斗判定控制 ===
    /** 目标不可闪避 */
    no_dodge?: boolean;
    /** 目标不可招架 */
    no_parry?: boolean;
    /** 跳过暴击和 add_sh_per 计算 */
    no_power?: boolean;
    /** 指定攻击部位（默认随机） */
    part?: AttackPart;

    // === 输入：伤害计算覆写 ===
    /** 暴击率覆写（默认 this.bj），输出时补默认值 */
    bj?: number;
    /** 额外暴击伤害百分比 */
    add_bjsh_per?: number;
    /** 自定义暴击判定函数 */
    cirt?: (target: CHARACTER, part: AttackPart | null, bj_per: number) => boolean;
    /** 内功附加伤害（输出回写供 on_force_parry 读取） */
    power_gj?: number;
    /** 忽视防御百分比（0-100） */
    diff_fy?: number;

    // === 输入：回调（this 绑定为 par 自身） ===
    /** 目标招架时回调 */
    on_parry?: (target: CHARACTER, is_parried: boolean) => void;
    /** 目标闪避时回调 */
    on_dodge?: (target: CHARACTER) => void;

    // === 输出字段（do_attack 内部写入，调用方读取） ===
    /** 本次攻击是否被闪避 */
    is_dodged?: boolean;
    /** 本次攻击是否被招架 */
    is_parried?: boolean;
    /** 本次攻击是否暴击 */
    iscirt?: boolean;
    // === 位标记（替代以上全部布尔字段，V8 隐藏类优化） ===
    /** 位标记：按位组合 PARF 常量，替代所有 boolean 字段 */
    flags?: number;
}

interface AutoSkillEntry {
    /** 绝招对象 */
    pfm: PERFORM;
    /** 技能等级 */
    level: number;
    /** 唯一标识（基础技能/绝招 ID） */
    id: string;
    /** 所属技能类型 */
    type: string;
    /** 是否为引用绝招 */
    is_ref: boolean;
    /** 是否禁用 */
    ban_use?: boolean;
}

/** 角色状态 — StatusDef 的运行时扩展 */
export interface CharacterStatus extends StatusDef {
    /** 序列化为 JSON 字符串 */
    to_json?(): string;
    /** 最大叠加层数 */
    max_count?: number;
    /** 是否不受减免影响 */
    no_diff?: boolean;
    /** 是否为负面状态 */
    downside?: boolean;
    /** 定时器句柄 */
    handler?: any;
    /** 是否仅战斗期间有效 */
    only_combat?: boolean;
    /** 是否不可被清除 */
    no_clear?: boolean;
    /** 状态施加时的消息（仅限第一人称占位符：$N/$P/$W/$w/$l/$T，禁用 $n/$p/$i） */
    start_msg?: string | number;
    /** 是否为闪避状态 */
    is_miss?: boolean;
    /** 是否为鲁莽状态 */
    is_rash?: boolean;
    /** 是否为分身状态 */
    is_shadow?: boolean;
    /** 是否免疫控制 */
    ig_control?: boolean;
    /** 间隔触发次数上限 */
    duration_count?: number;
    /** 已触发的间隔次数 */
    over_count?: number;
}

/** 将单个状态序列化为客户端 JSON 字符串 */
function statusToJson(this: CharacterStatus): string {
    const now = Date.now();
    const parts: string[] = [];
    parts.push('{sid:"');
    parts.push(this.id);
    parts.push('",name:"');
    parts.push(this.name);
    parts.push('",duration:');
    if (this.on_interval) {
        parts.push(String(this.duration * (this.duration_count || 1)));
    } else {
        parts.push(String(this.duration));
    }
    parts.push(',overtime:');
    if (this.duration) {
        parts.push(String(now - (this.start_time || now)));
    } else {
        parts.push('0');
    }
    if (this.override === 1) {
        parts.push(',"count":');
        parts.push(String(this.count || 1));
    }
    if (this.downside) {
        parts.push(',downside:true');
    }
    parts.push('}');
    return parts.join('');
}

// Declaration for global runtime constants
declare var __PATH: Record<string, string>;

// ============================================================
// CHARACTER 类
// ============================================================

/**
 * Team array type — CHARACTER array with extra properties set by team commands at runtime.
 */
export type TeamData = CHARACTER[] & {
    /** 是否允许自由拾取 */
    free_get?: boolean;
    /** 队伍唯一 ID */
    id?: string;
    /** 战利品分配函数 */
    alloc: (obj: any) => void;
    /** 战利品分配列表（dice 命令用） */
    objs?: OBJ[];
};

/** 角色类 */
export class CHARACTER extends ITEM {
    // ============ 核心标识属性 ============

    /** 角色名称 */
    name: string = '生物';
    /** 角色称呼（第三人称） */
    title?: string;
    /** 带颜色的名称缓存 */
    color_name: string = '';
    /** 性别 0=女 1=男 */
    gender: number = 1;
    /** 年龄 */
    age: number = 20;
    /** 等级 */
    level: number = 0;
    /** 角色描述 */
    desc: string = '';
    /** 门派地位 */
    family_level: number = 0;

    // ============ 战斗属性 ============

    /** 当前气血 */
    hp: number = 100;
    /** 最大气血 */
    max_hp: number = 100;
    /** 当前内力 */
    mp: number = 100;
    /** 最大内力 */
    max_mp: number = 100;
    /** 内力上限（独立于 max_mp，由内功技能加成） */
    limit_mp: number = 0;
    /** 臂力 */
    str: number = 20;
    /** 根骨 */
    con: number = 20;
    /** 身法 */
    dex: number = 20;
    /** 悟性 */
    int: number = 20;
    /** 容貌 */
    per: number = 20;
    /** 福缘 / 运气 */
    kar: number = 20;
    /** 经验值 */
    exp: number = 0;
    /** 潜能值 */
    pot: number = 0;
    /** 阅历积分 */
    score: number = 0;

    // ============ 身份标识 ============

    /** 用户权限等级 0=普通 6=管理员 */
    user_level: number = 0;
    /** 所属门派 */
    family: FAMILY = FAMILIES.NONE;
    /** 是否禁止战斗 */
    no_fight: boolean = false;
    /** 所属服务器 ID（USER 子类设置） */
    serverid: number = 0;

    /** 是否为角色 */
    is_character: boolean = true;

    // ============ 继承自 ITEM 的字段和方法类型声明（在此声明以便类型检查） ============

    /** 物件路径标识 */
    path!: string;
    /** 物件唯一 ID */
    id!: string;
    /** 金钱数量 */
    money: number = 0;
    /** 是否静默消息 */
    no_message: boolean = false;

    /** JSON 缓存（继承自 ITEM） */
    json: string | null = null;

    // ============ 环境与交互 ============

    /** 是否能说话 */
    can_speek: boolean = true;
    /** 当前所在房间 */
    environment?: ROOM;
    /** 当前活动状态 */
    state?: UserState | null = null;
    /** 等待用户输入的回调 */
    wait_input?: (me: CHARACTER, req: string) => void;

    // ============ 技能与装备 ============

    /** 技能映射 */
    skills: SkillsMap = new SkillsMap();
    /** buff/debuff 状态列表 */
    status: CharacterStatus[] | null = null;
    /** 装备列表（按 EQUIP_TYPE 索引） */
    equipment: (EQUIPMENT | null)[] = [];
    /** 战斗属性修饰 */
    combat_props: [keyof PropMap | string, number][] | null = null;
    /** 子物品列表,生物的通常为物品 */
    items: OBJ[] | null = null;

    /** 重算脏标记 — add_prop 置 true，recount 置 false */
    protected _recount_dirty: boolean = true;
    /** 重算抑制 — init 期间为 true，阻止重复 recount */
    protected _recount_suppressed: boolean = false;

    // ============ 战斗系统属性 ============

    /** 战斗类型 0=无 1=切磋 2=生死 */
    fight_type: number = 0;
    /** 敌人列表 */
    enemy: CHARACTER[] | null = null;
    /** 当前攻击技能 */
    attack_skill: SKILL;
    /** 空手技能 */
    noweapon_skill: SKILL;
    /** 闪避技能 */
    dodge_skill: SKILL;
    /** 招架技能 */
    parry_skill: SKILL;
    /** 内功技能 */
    force_skill: SKILL;
    /** 自动技能缓存 */
    auto_skills: AutoSkillEntry[] | null = null;
    /** 技能冷却到期时间戳, key = "baseSkill/pfmid" */
    pfm_cd: Map<string, number> = new Map();
    /** 当前攻击部位 */
    attack_part: AttackPart | null = null;
    /** 忙乱状态（不可行动，不可招架）倒计时 */
    is_busy: number = 0;
    /** 昏迷状态倒计时 */
    is_faint: number = 0;
    /** 免疫控制倒计时 */
    ig_control: number = 0;
    /** 闪避状态倒计时 */
    is_miss: number = 0;
    /** 无法闪避状态倒计时 */
    is_rash: number = 0;
    /** 分身状态倒计时 */
    is_shadow: number = 0;
    /** 攻击处理器（定时器句柄） */
    attack_handler: ReturnType<typeof setTimeout> | null = null;
    /** 自动释放绝招 */
    auto_pfm: boolean = false;
    /** 伤害记录（按玩家 ID） */
    damages: Record<string, number> | null = null;
    /** 是否记录伤害统计 */
    record_damage: boolean = false;
    /** 攻击速度（ms） */
    gjsd: number = 0;
    /** 闪避值 */
    ds: number = 0;
    /** 攻击力 */
    gj: number = 0;
    /** 防御力 */
    fy: number = 0;
    /** 命中值 */
    mz: number = 0;
    /** 招架值 */
    zj: number = 0;
    /** 暴击率（%） */
    bj: number = 0;

    /** 伤害减免百分比（recount 中计算） */
    diff_sh_per: number = 0;
    /** 忽视对方防御百分比（recount 中计算） */
    diff_fy_per: number = 0;

    // ============ 社交与移动属性 ============

    /** 跟随目标 */
    follow_target: CHARACTER | null = null;
    /** 跟随者列表 */
    follow_targets: CHARACTER[] | null = null;
    /** 队伍引用 */
    team: TeamData | null = null;
    /** 武器切换冷却时间戳 */
    release_time: number = 0;
    /** 玩家时为 师傅ID 随从时为 主人 ID */
    master?: string;
    /** 死亡复活房间 */
    die_room?: ROOM;
    /** 闲聊消息列表 */
    chat_msg?: string[];
    /** 网络连接（USER 子类实现） */
    socket?: GameSocket;

    // ============ 动态字段（由方法设置） ============

    /** 累计伤害值 */
    sum_damages?: number;
    /** 自动绝招计数器 */
    attack_count?: number;
    /** 是否拥有忙乱时可用的绝招 */
    busy_pfm?: boolean;
    /** 自动绝招触发频率 */
    pfm_rate?: number;

    // ============ 绝招缓冲模式 ============

    /** 绝招缓冲模式：开启期间发起者的消息写入缓冲区而非立刻发送 */
    _burst_buffering: boolean = false;
    /** 绝招缓冲区 */
    _burst_buffer: Buffer[] = [];

    // ============ 回调字段（可选，由资源文件在对象定义时设置） ============
    /**
     * 请求学习技能时的回调
     * @param me
     * @param sk
     */
    on_teach?(me: CHARACTER, sk: string): boolean;

    /** 接受物品回调 — 触发时机：玩家 give 物品/金钱给本角色时；返回 true 表示接受 */
    on_accept?(me: CHARACTER, obj: string | ITEM, count: number): boolean | void;

    /** 玩家卖物品给本角色回调 — 触发时机：玩家 sell 物品给本角色（商人）时 */
    on_user_sell?(me: CHARACTER, obj: OBJ, count: number): void;

    /** 检查技能/学习回调 — 触发时机：其他角色查看本角色技能时；返回 false 阻止查看 */
    on_checkskill?(me: CHARACTER): boolean | void;

    /** 对象创建后回调 — 触发时机：create() 方法末尾，资源文件加载/热更新实例化对象时 */
    on_create?(path: string, par?: string): void;

    /** 对象克隆后回调 — 触发时机：clone() 方法末尾，NPC/物品从模板复制到实际场景时 */
    on_clone?(): void;

    /** 死亡前回调 — 触发时机：die() 方法开头，hp 归零之前；返回 false 可阻止死亡；world/ 资源可能传入额外 corpse 参数 */
    on_die?(killer?: CHARACTER, corpse?: any): boolean | void;

    /** 死亡后回调 — 触发时机：die() 方法末尾，尸体已生成、状态已清除之后 */
    on_died?(killer: CHARACTER | undefined, corpse: any): void;

    /** 被攻击回调 — 触发时机：玩家对该角色发起 kill 命令时；返回 false 可阻止攻击 */
    on_kill?(killer: CHARACTER): void | boolean;

    /** 复活回调 — 触发时机：角色复活时（NPC relive 方法调用时） */
    on_relive?(): void;

    /** 心跳回调 — 触发时机：每帧 heart_beat(dt) 调用时 */
    on_heart_beat?(dt: number): void;

    /** 离开队伍时回调 — 触发时机：team_out() 中，随从因主人退队而退出时 */
    on_teamout?(me: CHARACTER): void;

    /** 加入队伍时回调 — 触发时机：加入队伍时 */
    on_teamin?(me: CHARACTER): void;

    /** 切磋前回调 — 触发时机：fight 命令中，非玩家目标同意比试之前；返回 false 可阻止战斗 */
    on_before_fight?(me: CHARACTER): boolean | void;

    /** 开始被攻击回调 — 触发时机：玩家对该角色发起 kill 命令时 */
    begin_kill?(killer: CHARACTER): void;

    /** 战斗结束回调 — 触发时机：end_attack() 中，一方获胜（比试血量<30%或击杀后），对方 end_fight 之前 */
    on_fight_over?(target: CHARACTER, win: boolean): void;

    /** 技能变更回调 — 触发时机：init_skill() 末尾 / weapon_changed() 末尾，切换武器或装备技能后 */
    on_skillchanged?(): void;

    /** 逃跑回调 — 触发时机：do_escape() 中，敌人尝试逃跑时；返回 false 阻止逃跑 */
    on_escape?(me: CHARACTER): boolean | void;

    /** 受到伤害回调 — 触发时机：do_attack() 中对目标造成伤害后（hp 实际扣除之前） */
    on_damage?(attacker: CHARACTER, damage: number): void;

    /** 有角色进入房间回调 — 触发时机：其他有 HP 的角色进入本角色所在房间时 */
    on_enter?(obj: CHARACTER): void;

    /** 有角色离开房间回调 — 触发时机：其他有 HP 的角色从本角色所在房间离开时；返回 false 阻止离开 */
    on_leave?(obj: CHARACTER, dir: string): boolean | void;

    /** 检查是否可传送（USER 实现，biwu 等系统检查） */
    can_trans?(): boolean;

    /** 添加称号（USER 实现，biwu 等系统调用） */
    add_title?(title: string | null, type: string): void;

    /** 进入公共区域（USER 实现，map 文件调用） */
    enable_area?(): void;

    /** 查询精力（USER 实现，jh/shop 等系统调用） */
    query_jingli?(): number;

    /** 检查区域是否已解锁（USER 实现，jh 系统调用） */
    isenable_area?(fb: any): boolean;

    /** 元宝数量（USER 实现，shop 等系统使用） */
    cash_money?: number;

    /** 扣除元宝（USER 实现，shop 等系统调用） */
    add_cash?(count: number, desc?: string): void;

    /** 按位查询布尔值（USER 实现，shop 等系统使用） */
    query_bool?(key: string, index: number): boolean;

    /** 按位设置布尔值（USER 实现，shop 等系统使用） */
    set_bool?(key: string, index: number, value: unknown, time?: number): void;

    /** 回家（NPC/玩家专用，资源文件注入） */
    go_home?(): void;

    /** 清理房屋（NPC/玩家专用，资源文件注入） */
    clear_home?(flag: boolean): void;

    /** 添加跟随者 — 资源文件注入返回 boolean */
    add_follower?(npc: NPC): boolean;

    /** 查询帮派（由 party 系统注入） */
    query_party?(): any;

    /** 传授技能回调 — 触发时机：xue 命令中教师角色执行时会调用 */
    do_teach?(me: CHARACTER, skill: SKILL, lv: number): boolean | void;

    // ================================================================
    // 基础方法
    // ================================================================

    /**
     * 发送消息给自身（不考虑状态）
     */
    send(_msg: string): void { }

    /**
     * 发送命令列表（客户端交互菜单）
     */
    send_commands(...args: string[]): void { }

    /**
     * 操作失败通知
     */
    notify_fail(text: string): boolean {
        this.send(text);
        return false;
    }

    /**
     * 是否存活
     */
    is_living(): boolean {
        return this.hp > 0;
    }

    /**
     * 角色死亡处理
     */
    die(_killer?: CHARACTER): boolean | void { }

    /**
     * 是否在指定路径的房间
     */
    is_in(path: string): boolean {
        if (!this.environment) return false;
        return this.environment.path === path;
    }

    /**
     * 是否和目标在同一房间
     */
    is_here(obj: CHARACTER): boolean {
        if (!this.environment || !obj.environment) return false;
        return this.environment === obj.environment;
    }

    /**
     * 根据 ID 查找物品
     * @param oid 物品 ID
     * @param parent
     */
    find_obj(oid: string, parent?: ITEM | ROOM): ITEM | undefined {
        let items: ITEM[] | null = this.items;
        if (parent) items = parent.items;
        return items ? this.find_obj_byid(items, oid) : undefined;
    }

    /**
     * 向房间内所有人发送消息
     */
    send_message(msg: string, include_me?: boolean): void {
        if (!msg || !this.environment) return;
        const list = this.environment.items;
        for (let i = 0; i < list.length; i++) {
            if (list[i].is_player) {
                if (list[i] === this && !include_me) continue;
                if (!list[i].no_message) list[i].notify(msg);
            }
        }
    }

    /**
     * 发送战斗消息。
     *
     * 新格式：服务端只渲染一次（第三人称），附带 A/T 标识，
     * 客户端根据自身是否等于 A/T 来将名字替换为"你"。
     */
    // ============================================================
    // 消息广播（文本 + 二进制）
    // ============================================================
    //
    // send_combat / send_room 共享相同的消息格式：
    //   {"type":"combat","s":"<rendered>","A":"<name>","T":"<name>"}
    // 唯一区别在广播过滤：
    //   combat → no_mcmsg / no_combatmsg 设置
    //   room   → no_message 设置 + excludeself
    //
    // send_*_b 是 pack.js --binary 编译时替换的二进制版本，
    // 将消息构造下沉到客户端，服务端只发模板 ID + 实体字段。

    /** 构建战斗/房间消息 JSON */
    _build_msg(text: string, target?: ITEM): string {
        const rendered = format_msg(this, text, target);
        // 转义字符串中的特殊字符，防止 JSON 断裂
        const s = rendered
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r');
        return (
            '{"type":"combat","s":"' +
            s +
            '","A":"' +
            this.name +
            '","T":"' +
            (target?.name ?? '') +
            '"}'
        );
    }

    /** LEB128 无符号 varint 编码 */
    _encodeVarint(n: number): Buffer {
        const bytes: number[] = [];
        let v = n | 0;
        if (v < 0) v = 0;
        do {
            let b = v & 0x7f;
            v = Math.floor(v / 128);
            if (v) b |= 0x80;
            bytes.push(b);
        } while (v);
        return Buffer.from(bytes);
    }

    /** 构建二进制 payload — 按需编码实体字段 + ^args（数字 varint，浮点 float64，TplRef 嵌套） */
    _build_binary_buf(
        template_id: number,
        target: ITEM | undefined,
        a1?: string | TplRef,
        a2?: string | TplRef,
        a3?: string | TplRef,
        a4?: string | TplRef,
    ): Buffer {
        // 从模板 ID 提取 mask 和 pure_id（pack 预编译时编码为 (mask << 16) | pure_id）
        let mask = template_id >> 16;
        const pure_id = template_id & 0xFFFF;

        // 预扫描 args，提取 TplRef 的 mask 并 OR 进外层 mask
        // 确保外层帧携带嵌套模板所需的全部字段
        const argItems: (string | TplRef)[] = [];
        if (a1 !== undefined && a1 !== null) argItems.push(a1);
        if (a2 !== undefined && a2 !== null) argItems.push(a2);
        if (a3 !== undefined && a3 !== null) argItems.push(a3);
        if (a4 !== undefined && a4 !== null) argItems.push(a4);
        for (let i = 0; i < argItems.length; i++) {
            const v = argItems[i];
            if (Array.isArray(v)) {
                mask |= (v[0] as number) >> 16;
            }
        }

        // 只计算 mask 需要的字段（避免无谓的 weapon_name/call3 调用）
        const rawFields: string[] = [];
        rawFields[0] = mask & FMASK.A_NAME ? this.name : '';
        rawFields[1] = mask & FMASK.A_WEAPON ? this.weapon_name() || '' : '';
        rawFields[2] = mask & FMASK.A_CALL3 ? this.call3() : '';
        rawFields[3] = mask & FMASK.A_PART ? (this.attack_part ? this.attack_part.name : '') : '';
        rawFields[4] = mask & FMASK.A_THROW ? this.throwing_name() || '' : '';

        const hasT = target && (target as any).check_character?.();
        rawFields[5] = mask & FMASK.T_NAME && hasT ? target!.name : '';
        rawFields[6] = mask & FMASK.T_WEAPON && hasT ? (target as any).weapon_name?.() || '' : '';
        rawFields[7] = mask & FMASK.T_CALL3 && hasT ? (target as any).call3?.() || '' : '';

        const fieldBufs: Buffer[] = [];
        for (let i = 0; i < 8; i++) {
            if (mask & FIELD_TO_MASK[i]) {
                fieldBufs.push(Buffer.from(rawFields[i], 'utf8'));
            }
        }

        let argMask = 0, floatMask = 0, refMask = 0;
        const argEnc: Buffer[] = []; // encoded arg bodies
        for (let i = 0; i < argItems.length; i++) {
            const v = argItems[i];
            if (Array.isArray(v)) {
                refMask |= (1 << i);
                argMask |= (1 << i);
                // 编码嵌套模板: [refPureId uint16][refArgc 1B][refMask 1B][refFloatMask 1B][refArgs...]
                // 发送 pure_id（消费 mask 后的纯 uint16），客户端通过父级 mask/sparse 渲染
                const refPureId = (v[0] as number) & 0xFFFF;
                const rargc = v.length - 1;
                let rargMask = 0, rfloatMask = 0;
                const rargEnc: Buffer[] = [];
                for (let j = 0; j < rargc; j++) {
                    const rs: string = v[j + 1] as string;
                    if (/^\d+$/.test(rs)) {
                        rargMask |= (1 << j);
                        rargEnc.push(this._encodeVarint(parseInt(rs, 10)));
                    } else if (/^\d+\.\d+$/.test(rs)) {
                        rargMask |= (1 << j);
                        rfloatMask |= (1 << j);
                        const fb = Buffer.alloc(8);
                        fb.writeDoubleBE(parseFloat(rs));
                        rargEnc.push(fb);
                    } else {
                        rargEnc.push(Buffer.from(rs, 'utf8'));
                    }
                }
                let rtotal = 2 + 1 + 1 + 1; // refTid + refArgc + refMask + refFloatMask
                for (let j = 0; j < rargEnc.length; j++) {
                    const ab = rargEnc[j];
                    rtotal += (rargMask & (1 << j))
                        ? ((rfloatMask & (1 << j)) ? 8 : ab.length)
                        : (1 + ab.length);
                }
                const rbuf = Buffer.alloc(rtotal);
                let rpos = 0;
                rbuf.writeUInt16BE(refPureId, rpos); rpos += 2;
                rbuf[rpos++] = rargc;
                rbuf[rpos++] = rargMask;
                rbuf[rpos++] = rfloatMask;
                for (let j = 0; j < rargEnc.length; j++) {
                    const ab = rargEnc[j];
                    if (rargMask & (1 << j)) {
                        if (rfloatMask & (1 << j)) {
                            rbuf.writeDoubleBE(parseFloat(v[j + 1] as string), rpos); rpos += 8;
                        } else {
                            ab.copy(rbuf, rpos); rpos += ab.length;
                        }
                    } else {
                        rbuf[rpos++] = ab.length;
                        ab.copy(rbuf, rpos); rpos += ab.length;
                    }
                }
                argEnc.push(rbuf);
            } else {
                const s = v as string;
                if (/^\d+$/.test(s)) {
                    argMask |= (1 << i);
                    argEnc.push(this._encodeVarint(parseInt(s, 10)));
                } else if (/^\d+\.\d+$/.test(s)) {
                    argMask |= (1 << i);
                    floatMask |= (1 << i);
                    const fb = Buffer.alloc(8);
                    fb.writeDoubleBE(parseFloat(s));
                    argEnc.push(fb);
                } else {
                    argEnc.push(Buffer.from(s, 'utf8'));
                }
            }
        }

        let totalSize = 1 + 2 + 1; // op + tid + mask
        for (const fb of fieldBufs) totalSize += 1 + fb.length;
        totalSize += 1 + 1 + 1 + 1; // ^count + argMask + floatMask + refMask
        for (let i = 0; i < argEnc.length; i++) {
            const ab = argEnc[i];
            if (refMask & (1 << i)) {
                totalSize += ab.length;
            } else if (argMask & (1 << i)) {
                totalSize += (floatMask & (1 << i)) ? 8 : ab.length;
            } else {
                totalSize += 1 + ab.length;
            }
        }

        const buf = Buffer.alloc(totalSize);
        let pos = 0;
        buf[pos++] = 0x12;
        buf.writeUInt16BE(pure_id, pos);
        pos += 2;
        buf[pos++] = mask;
        for (const fb of fieldBufs) {
            buf[pos++] = fb.length;
            fb.copy(buf, pos);
            pos += fb.length;
        }
        buf[pos++] = argItems.length;
        buf[pos++] = argMask;
        buf[pos++] = floatMask;
        buf[pos++] = refMask;
        for (let i = 0; i < argEnc.length; i++) {
            const ab = argEnc[i];
            if (refMask & (1 << i)) {
                ab.copy(buf, pos); pos += ab.length;
            } else if (argMask & (1 << i)) {
                if (floatMask & (1 << i)) {
                    buf.writeDoubleBE(parseFloat(argItems[i] as string), pos); pos += 8;
                } else {
                    ab.copy(buf, pos); pos += ab.length;
                }
            } else {
                buf[pos++] = ab.length;
                ab.copy(buf, pos); pos += ab.length;
            }
        }
        return buf;
    }

    /**
     * 开启绝招缓冲模式 — 期间发起者的二进制消息写入缓冲区而非立刻发送。
     * 与房间批处理有机共存：发起者消息入 burst buffer，其他玩家仍走房间 batch。
     */
    begin_burst(): void {
        this._burst_buffering = true;
    }

    /**
     * 结束绝招缓冲模式 — 合并缓冲区所有帧并立刻发送给发起者。
     * 绝招释放是同步帧，缓冲无延迟代价。
     */
    end_burst(): void {
        this._burst_buffering = false;
        const buf = this._burst_buffer;
        if (buf.length === 0) return;
        this._burst_buffer = [];
        const self = this as any;
        if (self.socket) {
            self.socket.write(encodeBinaryFrame(Buffer.concat(buf)));
        }
    }

    /** 广播 — combat 过滤（no_mcmsg / no_combatmsg） */
    _broadcast_combat(payload: string | Buffer, target?: ITEM): void {
        const list = this.environment!.items;
        if (typeof payload !== 'string') {
            const room = this.environment as ROOM;
            // 小房间（<10人）：立刻发送给所有人，不批处理
            if (room._player_count < 10) {
                const frame = encodeBinaryFrame(payload);
                for (let i = 0; i < list.length; i++) {
                    const item: any = list[i];
                    if (!item.is_player || !item.socket) continue;
                    if (item === this || item === target) {
                        if (!item.query_setting('no_mcmsg')) item.socket.write(frame);
                    } else if (!item.no_message && !item.query_setting('no_combatmsg')) {
                        item.socket.write(frame);
                    }
                }
                return;
            }

            // 大房间：消息主体立刻发送，其他玩家走批处理
            const self = this as any;
            if (self.is_player && self.socket && !self.query_setting('no_mcmsg')) {
                if (this._burst_buffering) {
                    this._burst_buffer.push(payload as Buffer);
                } else {
                    self.socket.write(encodeBinaryFrame(payload));
                }
            }

            const now = Date.now();

            const wasEmpty = room._batch_all.length === 0;
            room._batch_all.push(payload);
            room._batch_has_combat = true;
            if (wasEmpty) {
                room._batch_timestamp = now;
                markRoomDirty(room);
            } else if (now - room._batch_timestamp >= 10) {
                room._flush_batch();
            }

            return;
        }
        for (let i = 0; i < list.length; i++) {
            const item: any = list[i];
            if (!item.is_player) continue;
            if (item === this || item === target) {
                if (!item.query_setting('no_mcmsg'))
                    item.notify(payload);
            } else if (!item.no_message && !item.query_setting('no_combatmsg')) {
                item.notify(payload);
            }
        }
    }

    /** 广播 — room 过滤（no_message / excludeself） */
    _broadcast_room(
        payload: string | Buffer,
        target: ITEM | undefined,
        excludeself?: boolean,
    ): void {
        const list = this.environment!.items;
        if (typeof payload !== 'string') {
            const room = this.environment as ROOM;
            // 小房间（<10人）：立刻发送给所有人，不批处理
            if (room._player_count < 10) {
                const frame = encodeBinaryFrame(payload);
                for (let i = 0; i < list.length; i++) {
                    const item: any = list[i];
                    if (!item.is_player || !item.socket) continue;
                    if (item === this) {
                        if (!excludeself) item.socket.write(frame);
                    } else if (!item.no_message) {
                        item.socket.write(frame);
                    }
                }
                return;
            }

            // 大房间：消息主体立刻发送，其他玩家走批处理
            if (!excludeself) {
                const self = this as any;
                if (self.is_player && self.socket) {
                    if (this._burst_buffering) {
                        this._burst_buffer.push(payload as Buffer);
                    } else {
                        self.socket.write(encodeBinaryFrame(payload));
                    }
                }
            }

            const now = Date.now();

            const wasEmpty = room._batch_all.length === 0;
            room._batch_all.push(payload as Buffer);
            room._batch_noncombat.push(payload as Buffer);
            if (wasEmpty) {
                room._batch_timestamp = now;
                markRoomDirty(room);
            } else if (now - room._batch_timestamp >= 10) {
                room._flush_batch();
            }

            return;
        }
        for (let i = 0; i < list.length; i++) {
            if (!list[i].is_player) continue;
            if (list[i] === this) {
                if (!excludeself)
                    list[i].notify(payload);
            } else if (!list[i].no_message) {
                list[i].notify(payload);
            }
        }
    }

    // ---- 公开 API ----
    //
    // send_msg  / send_msg_b  — 统一入口
    // send_room / send_combat — 向后兼容包装（供未替换的动态调用和 pack.js 转换）

    /** flags: bit0=combat过滤, bit1=排除自己 */
    static readonly MSG_COMBAT = 1;
    static readonly MSG_EXCLUDESELF = 2;

    /**
     * 发送房间/战斗消息。
     * 第一参数为 string → 文本路径，为 number → 二进制路径（模板 ID）。
     * typeof 分支零开销，允许调用点逐步从字面量迁移到模板 ID。
     */
    send_msg(text: string | number, target?: ITEM, flags?: number): void {
        if (!this.environment || text === undefined) return;
        if (typeof text === 'number') {
            this._send_binary(text, target, flags);
            return;
        }
        if (!text) return;
        const payload = this._build_msg(text, target);
        if (flags && flags & 1) this._broadcast_combat(payload, target);
        else this._broadcast_room(payload, target, !!(flags && flags & 2));
    }

    /** 二进制路径（内部实现，由 send_msg 的 typeof 分支调用） */
    _send_binary(template_id: number, target?: ITEM, flags?: number): void {
        this.send_msg_b(template_id, target, flags);
    }

    /** 发送房间/战斗消息（显式二进制路径，供 pack.js 直接调用） */
    /** 文本模式回退：展开 TplRef 数组，替换 template 中的 ^ */
    _expand_text(template: string, _a1?: string | TplRef, _a2?: string | TplRef, _a3?: string | TplRef, _a4?: string | TplRef): string {
        let text = template;
        const args = [_a1, _a2, _a3, _a4];
        for (let i = 0; i < args.length; i++) {
            const a = args[i];
            if (a === undefined || a === null) break;
            const val = Array.isArray(a)
                ? (a[0] as string).replace('^', String(a[1] ?? ''))
                : String(a);
            text = text.replace('^', val);
        }
        return text;
    }

    send_msg_b(
        template_id: number | string,
        target?: ITEM,
        flags?: number,
        _a1?: string | TplRef,
        _a2?: string | TplRef,
        _a3?: string | TplRef,
        _a4?: string | TplRef,
    ): void {
        if (!this.environment || template_id === undefined) return;
        if (typeof template_id === 'string') {
            this.send_msg(this._expand_text(template_id, _a1, _a2, _a3, _a4), target, flags);
            return;
        }
        const payload = this._build_binary_buf(template_id, target, _a1, _a2, _a3, _a4);
        if (flags && flags & 1) this._broadcast_combat(payload, target);
        else this._broadcast_room(payload, target, !!(flags && flags & 2));
    }

    // 向后兼容 — 供未替换的动态 send_room / send_combat 调用
    // 第一参数接受 string | number，自动交由 send_msg 的 typeof 分支路由
    send_combat(text: string | number, target?: CHARACTER): void {
        this.send_msg(text, target, 1);
    }
    send_combat_b(
        template_id: number | string,
        target?: CHARACTER,
        _a1?: string | TplRef,
        _a2?: string | TplRef,
        _a3?: string | TplRef,
        _a4?: string | TplRef,
    ): void {
        if (typeof template_id === 'string') {
            this.send_combat(this._expand_text(template_id, _a1, _a2, _a3, _a4), target);
            return;
        }
        this.send_msg_b(template_id, target, 1, _a1, _a2, _a3, _a4);
    }

    send_room(text: string | number, target?: ITEM, excludeself?: boolean): void {
        this.send_msg(text, target, excludeself ? 2 : 0);
    }
    send_room_b(
        template_id: number | string,
        target?: ITEM,
        excludeself?: boolean,
        _a1?: string | TplRef,
        _a2?: string | TplRef,
        _a3?: string | TplRef,
        _a4?: string | TplRef,
    ): void {
        if (typeof template_id === 'string') {
            this.send_room(template_id, target, excludeself);
            return;
        }
        this.send_msg_b(template_id, target, excludeself ? 2 : 0, _a1, _a2, _a3, _a4);
    }

    /**
     * 查询用户设置（基类返回 0）
     */
    query_setting(name: string): number | string {
        return 0;
    }

    // ================================================================
    // 命令系统
    // ================================================================

    /**
     * 执行命令字符串（解析并分发）
     */
    command(req: string): void {
        if (this.wait_input) {
            this.wait_input.apply(this, [this, req]);
            return;
        }
        let cmd = '';
        let pars = '';
        let start = 0;
        let i = 0;
        for (; i < req.length; i++) {
            if (req[i] === ' ') {
                if (start < i) {
                    cmd = req.substring(start, i);
                    pars = req.substring(i + 1);
                    break;
                }
                start = i;
            }
        }
        if (!cmd) cmd = req;
        this.do_command(cmd, pars);
    }

    /**
     * 执行解析后的命令
     */
    do_command(cmdName: string, str?: string): void {
        str = str || '';
        let cmd = WORLD.COMMANDS.get(cmdName);
        let pars: [CHARACTER, ...string[]];
        if (cmd && cmd.regex && str) {
            const match = cmd.regex.exec(str);
            pars = match ? [this, ...match.slice(1)] : [this, str];
        } else {
            pars = [this, str];
        }
        if (this.do_item_action(this.environment, cmdName, pars)) {
            return;
        }
        cmd = cmd || WORLD.DEFAULT_COMMAND!;
        if (cmd) {
            if (!this.check_command(cmd)) return;
            if (cmd.enter.apply(cmd, pars) !== false) {
                return;
            }
        }
        if (str) {
            if (this.do_item_action(this.find_obj(str, this.environment), cmdName, pars)) {
                return;
            }
        }
        this.send('什么？');
    }

    /**
     * 对某物件执行命令
     */
    do_item_action(item: any, cmd: string, pars: [CHARACTER, ...any[]]): boolean {
        if (!item || !item.actions) return false;
        const cmdItem = item.actions[cmd];
        if (!cmdItem || !cmdItem.action) return false;
        if (!this.check_command(cmdItem)) return true;
        if (cmdItem.action.apply(item, pars) !== false) return true;
        return false;
    }

    /**
     * 检查命令是否允许执行
     */
    check_command(cmd: Partial<COMMAND>): boolean {
        if ((cmd.allow_level ?? 0) > this.user_level) {
            this.send('什么？');
            return false;
        }
        if (this.hp <= 0 && !cmd.allow_die) {
            return this.notify_fail('你现在是灵魂状态，不能那么做。');
        }
        if (!cmd.allow_faint && this.is_faint) {
            this.send('你正在昏迷中！');
            return false;
        }
        if (!cmd.allow_state && this.state) {
            return this.notify_fail('你正在' + this.state.title + '，没时间这么做。');
        }
        if (!cmd.allow_fight && this.fight_type > 0) {
            return this.notify_fail('你正在战斗，待会再说。');
        }
        if (!cmd.allow_busy && this.is_busy) {
            return this.notify_fail('你现在正忙。');
        }
        return true;
    }

    // ================================================================
    // 创建 / 克隆 / 初始化
    // ================================================================

    /**
     * 对象创建回调（模板注册）
     */
    create(path: string, par?: string): void {
        if (par) this.path = path + par;
        if (this.on_create) this.on_create(path, par);
        WORLD.NPC_STORE.set(this.path, this);
    }

    /**
     * 对象更新回调
     */
    update(path: string, par?: string): void {
        this.create(path, par);
    }

    /**
     * 克隆实例到实际场景中。
     *
     * 所有可变引用属性始终写入（即使为 null/undefined），消除条件分支导致的
     * V8 隐藏类形状发散。同一原型的所有克隆体产生完全相同的 own property 集合。
     *
     * @remarks on_clone 回调只应修改已有属性，不应新增 own property。
     */
    clone(): void {
        this.copy_temp_to(this);
        // —— 始终写入可变引用属性以稳定 V8 隐藏类形状 ——
        if (this.prop) {
            this.prop = Object.create(this.prop);
        } else {
            this.prop = undefined;
        }
        if (this.skills) {
            this.skills = new SkillsMap(this.skills);
        } else {
            // skills 类型不含 null，写入空实例避免下游 this.skills.get() 抛 TypeError
            this.skills = new SkillsMap();
        }
        if (this.equipment) {
            const eqs: EQUIPMENT[] = [];
            for (let i = 0; i < this.equipment.length; i++) {
                const item = this.equipment[i];
                if (item) {
                    eqs[i] = OBJ.CREATE(item.path) as EQUIPMENT;
                }
            }
            this.equipment = eqs;
        } else {
            // equipment 类型不含 null，写入空数组避免下游 this.equipment[i] 抛 TypeError
            this.equipment = [];
        }
        if (this.items) {
            const items: OBJ[] = [];
            for (let i = 0; i < this.items.length; i++) {
                items[i] = OBJ.CREATE(this.items[i].path);
            }
            this.items = items;
        } else {
            this.items = null;
        }
        this._isolate_events();
        this.create_id();
        this._recount_suppressed = true;
        this.init();
        this._recount_suppressed = false;
        this.recount();
        this.hp = this.max_hp;
        this.mp = this.max_mp;
        if (this.on_clone) this.on_clone();
    }

    /**
     * 初始化技能和装备属性
     */
    init(): void {
        if (this.equipment) {
            const groups: Record<string, number> = {};
            for (let i = 0; i < this.equipment.length; i++) {
                const item = this.equipment[i];
                if (item) {
                    item.change_prop(this, true);
                    if (item.on_eq) item.on_eq(this);
                    if (item && item.group_name) {
                        groups[item.group_name] = (groups[item.group_name] || 0) + 1;
                        const prop = item.group_prop?.(groups[item.group_name]);
                        if (prop) {
                            this.change_prop(prop, true);
                        }
                    }
                }
            }
        }
        if (this.is_player) this.score = 0;
        if (this.skills) {
            for (const [item, skillData] of this.skills) {
                const base_skill = SKILL.get(item);
                if (!base_skill) {
                    this.skills.delete(item);
                    continue;
                }
                base_skill.attach_prop(this, this.query_skill(item));
                if (this.is_player) {
                    this.score += base_skill.query_score(skillData.level, this);
                }
            }
        }
        this.init_skill();
    }

    /** 经验值各等级上限 */
    static EXP_LIMIT: number[] = [300000, 3000000, 20000000];

    /**
     * 增加经验 / 潜能 / 金钱
     */
    add_exp(exp?: number, pot?: number, money?: number): void {
        if (exp) {
            exp += this.query_temp('exp_up', 0) ?? 0;
        }
        if (pot) {
            pot += this.query_temp('pot_up', 0) ?? 0;
        }
        const str: string[] = ['<hig>你获得了'];
        if (exp) {
            this.exp += exp;
            str.push(String(exp));
            str.push('点经验');
        }
        if (pot) {
            this.pot += pot;
            if (exp) str.push('，');
            str.push(String(pot));
            str.push('点潜能');
        }
        if (money) {
            this.money += money;
            if (exp || pot) str.push('，');
            str.push(UTIL.moneyToStr(money));
        }
        if (str.length === 1) return;
        str.push('。</hig>');
        this.send(str.join(''));
    }

    /**
     * 增加金钱
     */
    add_money(val: number): void {
        this.money += val;
    }

    /**
     * 检查并更新套装属性
     */
    check_groupeq(): void {
        if (!this.equipment) return;
        const eqs: Record<string, number> = {};
        for (let i = 0; i < this.equipment.length; i++) {
            const item = this.equipment[i];
            if (item && item.group_name) {
                eqs[item.group_name] = (eqs[item.group_name] || 0) + 1;
                const prop = item.group_prop!(eqs[item.group_name]);
                if (prop) {
                    this.change_prop(prop, true);
                }
            }
        }
    }

    // ================================================================
    // 属性 / 临时数据系统
    // ================================================================

    /**
     * 增加属性
     */
    add_prop(p: keyof PropMap | string, v: number): void {
        if (!p || p === 'desc') return;
        if (!this.prop) {
            this.prop = {};
        }
        const v1 = this.prop[p] || 0;
        this.prop[p] = v1 + v;
        this._recount_dirty = true;
    }

    /** 清除所有属性 */
    clear_prop(): void {
        this.prop = {};
        this._recount_dirty = true;
    }

    /**
     * 查询属性加值，不用担心，保底一定返回0
     */
    query_prop(name: keyof PropMap | string): number {
        if (!name || name === 'desc') return 0;
        if (this.prop) return this.prop[name] || 0;
        return 0;
    }

    /**
     * 查询所有 add_status 对某属性的贡献总量（含叠层），用于区分永久属性与状态增益
     */
    query_status_prop(name: string): number {
        if (!this.status) return 0;
        let sum = 0;
        for (const s of this.status) {
            if (s.prop) {
                sum += (s.prop[name] || 0) * (s.count || 1);
            }
        }
        return sum;
    }

    /**
     * 查询内功加成比例
     */
    query_force_rad(): number {
        if (this.force_skill?.force_rad) return this.force_skill.force_rad || 0.1;
        return 0.1;
    }

    /**
     * 增加内力上限
     */
    add_maxmp(count: number): void {
        this.max_mp += count;
        this.recount();
        this.notify('<hig>你增加了' + count + '点内力。</hig>');
    }

    /**
     * 批量变更属性
     */
    change_prop(prop: { desc?: string; skill?: PropMap } & PropMap, isadd: boolean): void {
        if (!prop) return;
        for (const item in prop) {
            switch (item) {
                case 'desc':
                    break;
                case 'skill': {
                    const sks = prop[item];
                    for (const sk in sks) {
                        let lv = this.query_skill(sk, 0);
                        if (!lv) {
                            this.add_prop(sk, isadd ? sks[sk] : -sks[sk]);
                            continue;
                        }
                        const sk_base = SKILL.get(sk);
                        if (!sk_base) continue;
                        sk_base.release_prop(this, lv);
                        this.add_prop(sk, isadd ? sks[sk] : -sks[sk]);
                        lv = this.query_skill(sk, 0);
                        sk_base.attach_prop(this, lv);
                        if (this.is_player) {
                            this.notify(
                                '{type:"dialog",dialog:"skills",id:"' + sk + '",level:' + lv + '}',
                            );
                        }
                    }
                    break;
                }
                default:
                    this.add_prop(item as keyof PropMap, isadd ? prop[item] : -prop[item]);
                    break;
            }
        }
    }

    // ================================================================
    // 副本系统
    // ================================================================

    /**
     * 增加副本分数
     */
    add_fbscore(v: number, max?: number): void {
        const fb = this.environment!.query_fb_first(this.query_teamid()!);
        if (!fb) return;
        fb.score = (fb.score || 0) + v;
        if (max && max > 0 && fb.score! > max) fb.score = max;
    }

    /**
     * 查询副本分数
     */
    query_fbscore(_v?: any): number {
        const first_room = this.environment!.query_fb_first(this.query_teamid()!);
        if (!first_room) return 0;
        return first_room.score || 0;
    }

    /**
     * 增加积分（仅 USER 覆写）
     */
    add_score(_val: number): void { }

    // ================================================================
    // 战斗临时属性
    // ================================================================

    /**
     * 添加战斗临时属性
     */
    add_combat_prop(name: keyof PropMap, val: number): void {
        this.add_prop(name, val);
        if (!this.combat_props) this.combat_props = [];
        this.combat_props.push([name, val]);
        if (name === 'max_hp') {
            this.max_hp += val;
        }
    }

    /**
     * 清除战斗临时属性
     */
    clear_combat_prop(name?: string, val?: number): void {
        if (this.combat_props) {
            for (let i = 0; i < this.combat_props.length; i++) {
                this.add_prop(this.combat_props[i][0], -this.combat_props[i][1]);
                if (this.combat_props[i][0] === 'max_hp') {
                    this.max_hp -= this.combat_props[i][1];
                    this.notify_hp();
                }
            }
            this.combat_props = null;
            this.recount();
        }
    }

    // ================================================================
    // 技能系统
    // ================================================================

    /**
     * 查询技能等级（含属性加成）
     */
    query_skill(name: string, def?: number): number {
        const skill = this.skills?.get(name);
        if (!skill) return def || 0;
        return skill.level + this.query_prop(name);
    }

    /**
     * 批量设置技能（NPC 初始化用）
     */
    skill_map(...args: SkillItem[]): void {
        if (!this.skills) this.skills = new SkillsMap();
        for (let i = 0; i < args.length; i++) {
            const item = args[i];
            if (!item) continue;
            const skill_base = SKILL.get(item[0]);
            if (!skill_base) {
                console.warn('技能 ID: ' + item[0] + ' 不存在');
                continue;
            }
            const skill: SkillData = {
                level: item[1] || 1,
                exp: 0,
                enable_skill: null,
            };
            this.skills.set(skill_base.id, skill);
            if (item[2]) {
                let enables = item[2];
                if (typeof enables === 'string') enables = [enables];
                for (let j = 0; j < enables.length; j++) {
                    skill[enables[j]] = true;
                    this.skills.get(enables[j])!.enable_skill = item[0];
                }
            }
        }
    }

    /**
     * 移除技能
     */
    remove_skill(skillid: string): boolean | undefined {
        const skill = this.skills.get(skillid);
        if (!skill) return;
        const baseskill = SKILL.get(skillid);
        if (!baseskill) return false;

        if (baseskill.type == SKILL_TYPES.BASE) {
            if (skill.enable_skill) {
                const old_skill = SKILL.get(skill.enable_skill);
                if (!old_skill || !this.skills.get(skill.enable_skill)) {
                    return false;
                }
                old_skill.disenable(this, skillid);
                this.skills.get(skill.enable_skill)![skillid] = false;
            }
        } else {
            for (const [, val] of this.skills) {
                if (val.enable_skill == skillid) {
                    val.enable_skill = null;
                }
            }
        }
        baseskill.release_prop(this, this.query_skill(skillid));
        this.skills.delete(skillid);
        this.init_skill();
        this.recount();
        this.add_score(-baseskill.query_score(skill.level, this));
        if (baseskill.on_remove) baseskill.on_remove(this, null);
        return true;
    }

    /**
     * 设置技能等级
     */
    set_skill(skid: string, level: number): void {
        if (!this.skills) this.skills = new SkillsMap();
        let item = this.skills.get(skid);
        const skill_base = SKILL.get(skid);
        if (!skill_base) return;
        if (!item) {
            item = {
                level: level,
                exp: 0,
                enable_skill: null,
            };
            this.skills.set(skid, item);
            skill_base.attach_prop(this, level);
        } else {
            skill_base.release_prop(this, this.query_skill(skid));
            item.level = level;
            skill_base.attach_prop(this, this.query_skill(skid));
        }
        this.init_skill();
        this.recount();
    }

    /**
     * 查询当前技能等级上限
     */
    skill_limit(): number {
        if (this.exp < 100) return 10;
        switch (this.level) {
            case 1:
                return Math.round(Math.pow(this.exp * 20, 1 / 3));
            case 2:
                return Math.round(Math.pow(this.exp * 30, 1 / 3));
            case 3:
                return Math.round(Math.pow(this.exp * 40, 1 / 3));
            case 4:
                return Math.round(Math.pow(this.exp * 50, 1 / 3));
            case 5:
                return Math.round(Math.pow(this.exp * 60, 1 / 3));
            case 6:
                return Math.round(Math.pow(this.exp * 60, 1 / 3));
            default:
                return Math.round(Math.pow(this.exp * 10, 1 / 3));
        }
    }

    /**
     * 查询技能引用绝招
     */
    query_ref_skill(skill: any): any {
        if (!skill || !skill.ref) return;
        const refs = skill.ref.split('/');
        const sp_skill = SKILL.get(refs[0]);
        if (sp_skill) {
            return sp_skill.get_pfm(refs[1]);
        }
    }

    /**
     * 判断某技能是否装备到指定基本技能
     */
    is_enable_skill(skid: string, type: string): boolean | undefined {
        if (!this.skills) return;
        const item = this.skills.get(skid);
        if (!item) return;
        return item[type];
    }

    /**
     * 装备技能到基本技能
     */
    enable_skill(base: string, skill: string | null): boolean | undefined {
        if (!this.skills) return;
        const baseskill = this.skills.get(base);
        if (!baseskill) return;
        if (baseskill.enable_skill) {
            const old_skill = this.skills.get(baseskill.enable_skill);
            if (!old_skill) return;
            old_skill[base] = false;
            const old_skill_base = SKILL.get(baseskill.enable_skill);
            if (old_skill_base) {
                old_skill_base.disenable(this, base);
            }
        }
        if (skill) {
            const sp_skill = this.skills.get(skill);
            if (baseskill && sp_skill) {
                const sp_skill_base = SKILL.get(skill);
                if (!sp_skill_base || sp_skill_base.enable(this, base) !== true) return false;
                baseskill.enable_skill = skill;
                sp_skill[base] = true;
            }
        } else {
            baseskill.enable_skill = null;
        }
        this.init_skill();
        this.recount();
        return true;
    }

    /**
     * 初始化当前使用的战斗技能
     */
    init_skill(): void {
        this.attack_skill = this.query_used_skill(this.query_weapon_type());
        this.noweapon_skill = this.query_used_skill(WEAPON_TYPE.NONE);
        this.dodge_skill = this.query_used_skill(BASE_SKILLS.DODGE);
        this.parry_skill = this.query_used_skill(BASE_SKILLS.PARRY);
        this.force_skill = this.query_used_skill(BASE_SKILLS.FORCE);
        if (this.on_skillchanged) this.on_skillchanged();
        this.auto_skills = null;
    }

    /**
     * 查询当前使用的技能（含装备选择）
     */
    query_used_skill(skname: string): SKILL {
        if (!this.skills) {
            return WORLD.DEFAULT_SKILLS[skname];
        }
        const skill = this.skills.get(skname);
        if (skill) {
            const skill_base = SKILL.get(skill.enable_skill || skname);
            if (!skill_base) skill.enable_skill = null;
            else return skill_base;
        }
        return WORLD.DEFAULT_SKILLS[skname];
    }

    // ================================================================
    // 状态系统（Buff / Debuff）
    // ================================================================

    /**
     * 查询状态叠加层数
     */
    query_status(sid: string): number {
        if (!this.status) return 0;
        for (let i = 0; i < this.status.length; i++) {
            if (this.status[i].id == sid) {
                return this.status[i].count || 0;
            }
        }
        return 0;
    }

    /**
     * 添加状态 / 效果
     *
     * override: 0=不可叠加（幂等） 1=叠加层数 2=刷新持续时间
     */
    add_status(buff: CharacterStatus, from?: CHARACTER): boolean | undefined {
        if (this.hp <= 0) return false;
        if (!this.status) this.status = [];
        buff.to_json = statusToJson;
        const sid = buff.id;
        buff.override = buff.override || 0;
        buff.count = buff.count || 1;
        buff.max_count = buff.max_count || 10;

        buff.start_time = Date.now();
        if (buff.on_interval) {
            buff.over_count = buff.over_count || 0;
        }
        if (this.ig_control && !buff.no_diff) {
            if (buff.is_busy || buff.is_faint || buff.is_miss || buff.is_rash) {
                return false;
            }
        }
        if (buff.downside && buff.duration && !buff.no_diff) {
            buff.duration = Math.round(
                (buff.duration * (100 - this.query_prop('diff_downside_per'))) / 100,
            );
            if (buff.duration <= 0) {
                return false;
            }
        }
        if (buff.is_busy && !buff.no_diff) {
            if (from) {
                buff.duration = buff.duration + from.query_prop('busy');
                buff.duration = (buff.duration * (100 + from.query_prop('busy_per'))) / 100;
            }
            buff.duration = buff.duration - this.query_prop('diff_busy');
            buff.duration = Math.round(
                (buff.duration * (100 - this.query_prop('diff_busy_per'))) / 100,
            );
            if (buff.duration <= 0) {
                return false;
            }
        }
        for (let i = 0; i < this.status.length; i++) {
            if (this.status[i].id == sid) {
                const item = this.status[i];
                if (item.override !== buff.override) return false;
                item.to_json = statusToJson;
                if (item.override === 1) {
                    if (item.max_count && item.max_count <= (item.count || 0)) {
                        return false;
                    }
                    item.count = (item.count || 0) + (buff.count || 1);
                    clearTimeout(item.handler);
                    if (item.duration)
                        item.handler = this.call_out(
                            this.remove_status.bind(this),
                            item.duration,
                            sid,
                        );
                    this.change_buff(item, true, buff.count || 1);
                    item.start_time = buff.start_time;
                    this.status_changed(item, 'refresh');
                } else if (item.override === 2) {
                    if (item.handler) clearTimeout(item.handler);
                    this.change_buff(item, false, item.count || 1);
                    this.status_changed(item, 'remove');
                    if (buff.duration)
                        buff.handler = this.call_out(
                            this.remove_status.bind(this),
                            buff.duration,
                            sid,
                        );
                    this.status[i] = buff;
                    buff.start_time = buff.start_time;
                    this.change_buff(buff, true, buff.count || 1);
                    this.status_changed(buff, 'add');
                } else {
                    // override === 0 或未知值：幂等，拒绝
                    return false;
                }
                return;
            }
        }
        if (buff.duration)
            buff.handler = this.call_out(this.remove_status.bind(this), buff.duration, sid);
        this.status.push(buff);
        this.change_buff(buff, true, buff.count || 1);
        this.status_changed(buff, 'add');
    }

    /**
     * 清除指定类型的负面状态
     * @returns 清除的状态数量
     */
    clear_downside(type: boolean): number {
        if (!this.status) return 0;
        let removed = '0';
        let count = 0;
        for (let i = 0; i < this.status.length; i++) {
            const item = this.status[i];
            if ((item.downside || false) == type && !item.no_clear) {
                this.change_buff(item, false, item.count || 1);
                if (item.handler) clearTimeout(item.handler);
                this.status.splice(i, 1);
                i--;
                removed += ',"' + item.id + '"';
                count++;
            }
        }
        if (removed.length == 1 || !this.environment) return 0;
        const items = this.environment.items;
        const msg = '{type:"status",id:"' + this.id + '",sid:[' + removed + '],action:"remove"}';
        for (let i = 0; i < items.length; i++) {
            const player = items[i];
            if (player.check_player()) {
                player.send(msg);
            }
        }
        return count;
    }

    /**
     * 清除战斗状态（战斗结束后）
     */
    clear_combat_status(): void {
        if (!this.status || !this.status.length) return;
        let removed = '0';
        for (let i = this.status.length - 1; i >= 0; i--) {
            const item = this.status[i];
            if (item.only_combat) {
                this.change_buff(item, false, item.count || 1);
                if (item.handler) clearTimeout(item.handler);
                this.status.splice(i, 1);
                removed += ',"' + item.id + '"';
            }
        }
        if (removed.length == 1 || !this.environment) return;
        const items = this.environment.items;
        const msg = '{type:"status",id:"' + this.id + '",sid:[' + removed + '],action:"remove"}';
        for (let i = 0; i < items.length; i++) {
            const player = items[i];
            if (player.check_player()) {
                player.send(msg);
            }
        }
    }

    /**
     * 按条件批量移除状态
     */
    remove_statuses(func: (item: CharacterStatus) => boolean): void {
        if (!this.status || !this.status.length) return;
        let removed = '0';
        for (let i = this.status.length - 1; i >= 0; i--) {
            const item = this.status[i];
            if (func(item)) {
                this.change_buff(item, false, item.count || 1);
                if (item.handler) clearTimeout(item.handler);
                this.status.splice(i, 1);
                removed += ',"' + item.id + '"';
            }
        }
        if (removed.length == 1 || !this.environment) return;
        const items = this.environment.items;
        const msg = '{type:"status",id:"' + this.id + '",sid:[' + removed + '],action:"remove"}';
        for (let i = 0; i < items.length; i++) {
            const player = items[i];
            if (player.check_player()) {
                player.send(msg);
            }
        }
    }

    /** 清除所有状态 */
    clear_status(): void {
        if (!this.status || !this.status.length) return;
        for (let i = 0; i < this.status.length; i++) {
            const item = this.status[i];
            this.change_buff(item, false, item.count || 1);
            if (item.handler) clearTimeout(item.handler);
        }
        this.status.length = 0;
        if (!this.environment) return;
        const msg = '{type:"status",id:"' + this.id + '",action:"clear"}';
        const items = this.environment.items;
        for (let i = 0; i < items.length; i++) {
            const player = items[i];
            if (player.check_player()) {
                player.send(msg);
            }
        }
    }

    /**
     * 变更状态效果
     */
    change_buff(buff: CharacterStatus, isadd: boolean, buff_count: number): void {
        if (isadd) {
            if (buff.prop) {
                for (let i = 0; i < buff_count; i++) {
                    this.change_prop(buff.prop, true);
                }
                this.recount();
            }
            if (buff.on_attach) buff.on_attach(this);
            if (buff.ig_control) this.ig_control = buff.duration;
            if (buff.start_msg) {
                this.send_room(buff.start_msg);
            }
            if (buff.is_busy) this.is_busy = buff.duration;
            if (buff.is_miss) this.is_miss = buff.duration;
            if (buff.is_rash) this.is_rash = buff.duration;
            if (buff.is_shadow) this.is_shadow = buff.duration;
            if (buff.is_faint) {
                this.is_faint = buff.duration;
            }
        } else {
            if (buff.prop) {
                for (let i = 0; i < buff_count; i++) {
                    this.change_prop(buff.prop, false);
                }
                this.recount();
            }
            if (buff.on_expire) buff.on_expire(this);
            if (buff.is_busy) this.is_busy = 0;
            if (buff.is_miss) this.is_miss = 0;
            if (buff.is_rash) this.is_rash = 0;
            if (buff.ig_control) this.ig_control = 0;
            if (buff.is_shadow) this.is_shadow = 0;
            if (buff.is_faint) {
                this.is_faint = 0;
            }
            if (this.hp > 0 && buff.finish_msg) {
                this.send_room(buff.finish_msg);
            }
            this.remove_temp(buff.id);
        }
    }

    /**
     * 拼接状态数据到 JSON
     */
    append_status(str: string[]): void {
        if (!this.status) return;
        const now = Date.now();
        str.push(',status:[');
        for (let i = 0; i < this.status.length; i++) {
            if (i > 0) str.push(',');
            const item = this.status[i];
            str.push('{sid:"');
            str.push(item.id);
            str.push('",name:"');
            str.push(item.name);
            str.push('",duration:');
            if (item.on_interval) {
                str.push(String(item.duration * (item.duration_count || 1)));
            } else {
                str.push(String(item.duration));
            }
            str.push(',overtime:');
            str.push(String(now - (item.start_time || now)));
            if (item.override === 1) {
                str.push(',"count":');
                str.push(String(item.count || 1));
            }
            if (item.downside) {
                str.push(',downside:');
                str.push('true');
            }
            str.push('}');
        }
        str.push(']');
    }

    /** 通知客户端当前状态 */
    notify_status(): void {
        if (!this.status) return;
        const str = ['{type:"status",id:"'];
        str.push(this.id);
        str.push("\",action:'load',items:[");
        const now = Date.now();
        for (let i = 0; i < this.status.length; i++) {
            if (i > 0) str.push(',');
            const item = this.status[i];
            str.push('{sid:"');
            str.push(item.id);
            str.push('",name:"');
            str.push(item.name);
            str.push('",duration:');
            if (item.on_interval) {
                str.push(String(item.duration * (item.duration_count || 1)));
            } else {
                str.push(String(item.duration));
            }
            str.push(',overtime:');
            str.push(String(now - (item.start_time || now)));
            if (item.override === 1) {
                str.push(',"count":');
                str.push(String(item.count || 1));
            }
            if (item.downside) {
                str.push(',downside:');
                str.push('true');
            }
            str.push('}');
        }
        str.push(']}');
        this.send(str.join(''));
    }

    /**
     * 状态变更通知
     */
    status_changed(item: CharacterStatus, type: string): void {
        const str: string[] = [];
        str.push('{type:"status","action":"');
        str.push(type);
        str.push('",id:"');
        str.push(this.id);
        str.push('",sid:"');
        str.push(item.id);
        str.push('"');
        if (type === 'add') {
            str.push(',"name":"');
            str.push(item.name);
            str.push('","duration":');
            if (item.on_interval) {
                str.push(String(item.duration * (item.duration_count || 1)));
            } else {
                str.push(String(item.duration));
            }
            if (item.override === 1) {
                str.push(',"count":');
                str.push(String(item.count || 1));
            }
            if (item.downside) {
                str.push(',downside:');
                str.push('true');
            }
        } else if (type === 'refresh') {
            str.push(',count:');
            str.push(String(item.count || 1));
        }
        str.push('}');
        if (!this.environment) return;
        const msg = str.join('');
        const items = this.environment.items;
        for (let i = 0; i < items.length; i++) {
            const player = items[i];
            if (player.check_player()) {
                player.send(msg);
            }
        }
    }

    /**
     * 移除状态
     */
    remove_status(sid: string, isall?: boolean): void {
        if (!this.status) return;
        for (let i = this.status.length - 1; i >= 0; i--) {
            if (this.status[i].id === sid) {
                const item = this.status[i];
                if (item.handler) clearTimeout(item.handler);
                item.handler = null;

                if (item.on_interval && !isall) {
                    item.over_count = (item.over_count || 0) + 1;
                    if (item.on_interval(this, item.over_count) === false) {
                        item.duration_count = item.duration_count || 2;
                        item.over_count = item.duration_count;
                    }
                    if (
                        item.duration_count === 0 ||
                        ((item.duration_count || 0) > 1 &&
                            (item.duration_count || 0) > (item.over_count || 0))
                    ) {
                        if (item.duration)
                            item.handler = this.call_out(
                                this.remove_status.bind(this),
                                item.duration,
                                sid,
                            );
                        return;
                    }
                }

                this.change_buff(item, false, 1);

                if (item.override === 1) {
                    item.count = (item.count || 1) - 1;

                    if (item.count === 0 || isall) {
                        this.change_buff(item, false, item.count || 0);
                        this.status_changed(item, 'remove');
                        this._splice_status(i, item);
                    } else {
                        if (item.duration)
                            item.handler = this.call_out(
                                this.remove_status.bind(this),
                                item.duration,
                                sid,
                            );
                        item.start_time = Date.now();
                        this.status_changed(item, 'refresh');
                    }
                } else {
                    this.status_changed(item, 'remove');
                    this._splice_status(i, item);
                }
                return;
            }
        }
    }

    /**
     * 从状态数组中安全移除
     */
    _splice_status(index: number, item: CharacterStatus): CharacterStatus[] | undefined {
        if (this.status![index] === item) {
            return this.status!.splice(index, 1);
        }
        for (let i = 0; i < this.status!.length; i++) {
            if (this.status![i] === item) {
                return this.status!.splice(i, 1);
            }
        }
    }

    // ================================================================
    // 装备系统
    // ================================================================

    /**
     * 设置初始携带物品["物品路径", 数量, 是否装备]
     */
    set_objects(...args: [string, number, (1 | 0)?][]): void {
        if (!args.length) return;
        if (!this.items) this.items = [];
        for (let i = 0; i < args.length; i++) {
            const item = args[i];
            const obj = OBJ.CREATE(item[0], item[1]);
            if (!obj) continue;
            if (item[2] && obj.check_equipment()) {
                if (!this.equipment) this.equipment = [];
                this.equipment[obj.eq_type] = obj;
            } else {
                this.items.push(obj);
            }
        }
    }

    /**
     * 卸下装备
     */
    unequip(obj: any, notsend?: boolean, recover_time: number = 0): boolean | undefined {
        if (!obj || !obj.is_equipment || !this.equipment) return;
        if (obj.uneq(this, notsend) == false) {
            return false;
        }
        if (obj != this.equipment[obj.eq_type]) return;
        if (!this.items) this.items = [];
        this.items.push(obj);
        this.equipment[obj.eq_type] = null;
        if (obj.eq_type == EQUIP_TYPE.WEAPON) {
            this.remove_status('weapon', true);
            if (obj.is_shortcut) {
                this.send("{type:'addAction',id:'" + obj.id + "',name:'" + obj.name + "'}");
            }
        }
        if (obj.eq_type === EQUIP_TYPE.WEAPON) this.weapon_changed(false);
        this.recount();
        if (recover_time > 0 && this.is_player) {
            this.set_temp('eq_wea', obj.id, 60000);
        }
    }

    /**
     * 装备物品
     */
    equip(obj: any): boolean | undefined {
        if (!obj || !obj.is_equipment) return;
        if (!this.equipment) this.equipment = [];
        const equiped = this.equipment[obj.eq_type];
        if (equiped == obj) {
            return;
        }
        if (equiped) {
            equiped.uneq(this);
            this.equipment[equiped.eq_type] = null;
            this.items!.push(equiped);
            if (equiped.eq_type == EQUIP_TYPE.WEAPON) {
                this.remove_status('weapon', true);
            }
            if (equiped.on_use) {
                equiped.notify_action(this, false);
            }
            if (equiped.is_shortcut) {
                this.send("{type:'addAction',id:'" + equiped.id + "',name:'" + equiped.name + "'}");
            }
        }
        if (obj.eq(this) == false) {
            if (equiped) {
                if (obj.eq_type === EQUIP_TYPE.WEAPON) this.weapon_changed(false);
                this.recount();
            }
            return false;
        }
        this.items!.remove(obj);
        this.equipment[obj.eq_type] = obj;
        if (obj.eq_type === EQUIP_TYPE.WEAPON) this.weapon_changed(true);
        this.recount();
        if (obj.is_shortcut) {
            this.send("{type:'removeAction',id:'" + obj.id + "'}");
        }
        if (obj.eq_type == EQUIP_TYPE.WEAPON) {
            if (this.fight_type) {
                this.release_time = 3000 + Date.now();
                this.send(`{type:"dispfm",rtime:3000}`);
            }
            if (this.query_temp('jxtm')) {
                this.remove_status('force');
            }
        }
    }

    /**
     * 武器变更处理
     */
    weapon_changed(iseq: boolean): void {
        this.attack_skill = this.query_used_skill(this.query_weapon_type());
        if (this.on_skillchanged) this.on_skillchanged();
        if (!this.auto_skills) return;
        for (const item of this.auto_skills) {
            if (WEAPON_SKILLS.has(item.type)) {
                item.ban_use = !iseq;
            }
        }
    }

    /**
     * 添加物品
     */
    add_obj(obj: ITEM | string, count?: number): any {
        if (!obj) return;
        let after_obj: ITEM | undefined;
        if (typeof obj == 'string') {
            after_obj = OBJ.clone_to(obj, this, count);
            if (!after_obj) return;
        } else {
            after_obj = this.push_item(obj);
            if (!after_obj) return;
        }
        return after_obj;
    }

    /**
     * 移除物品
     */
    remove_obj(obj: string | ITEM, count?: number): ITEM | undefined {
        let item: ITEM | undefined;
        if (typeof obj == 'string') {
            item = this.find_obj(obj);
        } else {
            item = obj;
        }
        if (!item) return;
        count = count || item.count || 1;
        this.remove_item(item, count);
        return item;
    }

    /**
     * 获取当前武器
     */
    query_weapon(): EQUIPMENT | null {
        if (this.equipment) {
            return this.equipment[EQUIP_TYPE.WEAPON];
        }
        return null;
    }

    /**
     * 获取当前武器类型
     */
    query_weapon_type(): string {
        if (this.equipment) {
            const eq = this.equipment[EQUIP_TYPE.WEAPON];
            if (eq) return eq.weapon_type;
        }
        return WEAPON_TYPE.NONE;
    }

    /**
     * 获取武器名称
     */
    weapon_name(): string {
        if (this.equipment && this.equipment[EQUIP_TYPE.WEAPON]) {
            return this.equipment[EQUIP_TYPE.WEAPON]!.color_name;
        }
        return '';
    }

    /**
     * 获取暗器名称
     */
    throwing_name(): string {
        if (this.equipment && this.equipment[EQUIP_TYPE.THROWING]) {
            return this.equipment[EQUIP_TYPE.THROWING]!.color_name;
        }
        return '';
    }

    /**
     * 是否有暗器可用
     */
    can_throwing(): boolean {
        if (this.equipment) {
            const th = this.equipment[EQUIP_TYPE.THROWING];
            if (!th) return false;
            return true;
        }
        return false;
    }

    /**
     * 获取指定类型装备
     */
    get_equipment(type: number): any {
        return this.equipment && this.equipment[type];
    }

    /**
     * 设置掉落列表
     */
    set_drop(...args: any[]): void {
        this.drop_list = this.drop_list || [];
        for (let i = 0; i < args.length; i++) {
            this.drop_list.push(args[i]);
        }
    }

    /**
     * 查询掉落物品
     */
    query_drop(): OBJ[] | undefined {
        if (!this.drop_list) return;
        return OBJ.create_by_odds(this.drop_list);
    }

    // ================================================================
    // 移动与跟随系统
    // ================================================================

    /**
     * 移动到新房间
     */
    moveto(
        rm?: string | ROOM,
        leave_msg?: string,
        in_msg?: string,
        dir?: string,
    ): boolean | undefined {
        const cur_room = this.environment;
        let next_room: ROOM | undefined = typeof rm === 'string' ? undefined : rm;
        if (typeof rm === 'string') {
            next_room = WORLD.getRoom(rm);
            if (!next_room) return false;
            if (cur_room && next_room.parent === cur_room.parent) {
                if (cur_room.owner) {
                    next_room = next_room.query_copy(cur_room.owner);
                }
            } else {
                const my_room = next_room.query_copy2(this);
                if (my_room) {
                    next_room = my_room;
                }
            }
        }
        if (!next_room) return false;

        if (next_room.is_full()) {
            next_room = next_room.create_shadow();
            if (!next_room) {
                this.notify('那里人太多了，你过不去。');
                return false;
            }
        }
        if (cur_room) {
            if (cur_room.do_leave(this, dir!, leave_msg!) === false) {
                return false;
            }
        }
        next_room.do_enter(this, true, in_msg);
        this.notify_follower(dir);
        if (cur_room && next_room.parent !== cur_room.parent) {
            cur_room.parent!.on_leaved?.(this);
        }
    }

    /**
     * 跟随目标
     */
    do_follow(target: CHARACTER | null): void {
        if (target) {
            if (target.check_player() && target.query_setting('no_follow')) {
                this.notify(target.name + '不允许别人跟随。');
                return;
            }
            if (this.follow_target) {
                this.follow_target.follow_targets!.remove(this);
                this.send_room('$N不再跟随$n一起行动。', this.follow_target);
            }
            this.follow_target = target;
            if (!target.follow_targets) {
                target.follow_targets = [];
            }
            target.follow_targets.push(this);
            this.send_room('<hig>$N决定跟随$n一起行动。</hig>', target);
        } else {
            if (!this.follow_target) {
                this.notify('你目前没有跟随别人一起行动。');
                return;
            }
            this.follow_target.follow_targets!.remove(this);
            this.send_room('$N不再跟随$n一起行动。', this.follow_target);
            this.follow_target = null;
        }
    }

    /** 清除所有跟随关系 */
    clear_follow(): void {
        if (this.follow_target) {
            this.follow_target.follow_targets!.remove(this);
            this.follow_target = null;
        }
        if (this.follow_targets) {
            for (const item of this.follow_targets) {
                item.follow_target = null;
            }
            this.follow_targets = null;
        }
    }

    /**
     * 通知跟随者移动
     */
    notify_follower(dir?: string): void {
        if (this.follow_targets) {
            for (let i = 0; i < this.follow_targets.length; i++) {
                const item = this.follow_targets[i];
                if (!item.environment) continue;
                if (!item.is_player) {
                    if (item.on_master_leave) {
                        if (item.on_master_leave(this, this.environment) == false) {
                            continue;
                        }
                    } else {
                        if (item.environment.is_fb() != this.environment!.is_fb()) {
                            continue;
                        }
                    }
                    item.moveto(this.environment, sendOutMessage(item, dir), sendInMessage(item));
                } else {
                    item.moveto(this.environment, sendOutMessage(item, dir), sendInMessage(item));
                }
            }
        }
    }

    /**
     * 尝试逃跑
     */
    do_escape(): boolean {
        const eny = this.query_enemy();
        if (!eny) return true;
        this.ensure_recount();
        if (eny.on_escape) return eny.on_escape(this) ?? true;
        let is_esc = this.random(this.ds / 2) + this.ds > eny.mz;
        if (eny.is_faint) is_esc = true;
        if (!is_esc) {
            this.send_room('<cyn>$N转身想跑，$n一把拦住$P：想跑？没门！\n</cyn>', eny);
            this.add_status({
                id: 'busy',
                name: '忙乱',
                duration: this.gjsd,
                is_busy: true,
            } as CharacterStatus);
        }
        return is_esc;
    }

    /**
     * 退出队伍
     */
    team_out(msg: string): void {
        const tm = this.team;
        if (!tm) return;
        for (let i = 0; i < tm.length; i++) {
            if (!tm[i].is_player && tm[i].master == this.id) {
                if (tm[i].on_teamout) tm[i].on_teamout!(tm[i]);
                this.notify(tm[i].name + '退出了队伍。');
                tm[i].team = null;
                tm.splice(i, 1);
                i--;
            }
        }
        this.team = null;
        const iscap = this == tm[0];
        tm.remove(this);
        checkTeamfb(this);
        if (!tm.length) {
            this.send('你的队伍解散了。');
            this.send('{"type":"dialog","dialog":"team",dismiss:true}');
        } else {
            const first = tm[0];
            const dissmsg = '{"type":"dialog","dialog":"team",dismiss:true}';
            this.send('<hic>你退出了队伍。</hic>');
            if (tm.length > 1) {
                if (iscap) {
                    first.send_team(
                        '<hic>' + this.name + msg + '，' + first.name + '现在是队长。</hic>',
                    );
                } else {
                    first.send_team('<hic>' + this.name + msg + '。</hic>');
                }
                first.send_team('{"type":"dialog","dialog":"team",remove:"' + this.id + '"}');
                this.send(dissmsg);
            } else {
                if (first.team) {
                    checkTeamfb(first);
                    first.send('<hic>' + this.name + msg + '，你的队伍解散了。</hic>');
                    first.team.length = 0;
                    first.team = null;
                    first.send(dissmsg);
                    this.send(dissmsg);
                }
            }
        }
    }

    // ================================================================
    // 通用显示方法
    // ================================================================

    /**
     * 获取等级描述（含颜色）
     */
    get_level_desc(): string {
        if (!this.level) return level_descs[this.level];
        const cc = level_color[this.level];
        return '<' + cc + '>' + level_descs[this.level] + '</' + cc + '>';
    }

    /**
     * 获取等级颜色
     */
    get_level_color(): string {
        return level_color[this.level];
    }

    /**
     * 完整显示名称
     */
    long_name(): string {
        if (this.title) return this.title + ' ' + this.name;
        return this.name;
    }

    /**
     * 查询称号
     */
    query_title(type?: string): string | undefined {
        return this.title;
    }

    /**
     * 查询年龄
     */
    query_age(): number {
        return this.age;
    }

    /**
     * 门派称谓
     */
    call(isbad?: boolean): string {
        return this.family.call(this, isbad);
    }

    /**
     * 自称
     */
    callme(isbad?: boolean): string {
        return this.family.call_me(this);
    }

    /**
     * 同门师兄弟姐妹称谓
     */
    fam_call(target: CHARACTER): string {
        const age1 = target.query_age();
        const age2 = this.query_age();
        if (age1 < age2) {
            return this.gender === 1 ? '师兄' : '师姐';
        }
        return this.gender === 1 ? '师弟' : '师妹';
    }

    /**
     * 第三人称代称
     */
    call3(): string {
        return this.gender == 1 ? '他' : '她';
    }

    /**
     * 是否隐藏
     */
    is_hidden(): boolean {
        return this.hp <= 0 || !!this.query_temp('hidden');
    }

    /**
     * 是否是队友
     */
    is_team(p: CHARACTER): boolean | undefined {
        if (!p) return false;
        if (p.team) return this.team == p.team;
        return this.family == p.family;
    }

    /**
     * 向队伍发送消息
     */
    send_team(msg: string, nome?: boolean): void {
        if (!this.team) {
            this.send(msg);
            return;
        }
        for (let i = 0; i < this.team.length; i++) {
            if (nome && this.team[i] == this) continue;
            this.team[i].send(msg);
        }
    }

    /**
     * 向门派发送消息
     */
    send_fam(str: string): void {
        if (this.family === FAMILIES.NONE) return;
        this.family.send(str);
    }

    /**
     * 查询队伍 ID
     */
    query_teamid(): string | null {
        if (this.follow_target) return this.follow_target.query_teamid();
        return null;
    }

    /**
     * 查询外观描述
     */
    query_desc(me: CHARACTER, eqcmd?: string): string {
        const str: string[] = [];
        str.push(this.long_name());
        str.push('\n');
        const call3 = this == me ? '你' : this.call3();
        str.push(call3, '看起来约', get_agestr(this.query_age()), '岁。\n');
        str.push(call3, '长得', get_perdesc(this), '。\n');
        str.push(
            call3,
            get_skill_desc(this.query_skill(this.attack_skill ? this.attack_skill.id : '')),
            '。\n',
        );
        str.push(call3, get_status(this), '\n');
        this.format_equipments(call3, str, eqcmd);
        return str.join('');
    }

    /**
     * 格式化装备显示
     */
    format_equipments(call3: string, str: string[], eqcmd?: string): void {
        if (this.check_player() && this.query_setting('hide_equip')) {
            str.push('看样子', call3, '不想让别人看自己的装备。');
        } else if (this.equipment && this.equipment.length) {
            const eqstr: string[] = [];
            for (let i = 0; i < this.equipment.length; i++) {
                const item = this.equipment[i];
                if (!item) continue;
                eqstr.push(
                    "<span cmd='",
                    eqcmd || 'look',
                    ' ',
                    String(i),
                    ' of ',
                    this.id,
                    "'>◆",
                    item.color_name,
                    '</span>\n',
                );
            }
            if (eqstr.length) {
                str.push(call3, '装备着：\n', eqstr.join(''));
                return;
            }
        }
        str.push(call3, '光着身子，什么都没穿。\n');
    }

    // ================================================================
    // 战斗系统
    // ================================================================

    /**
     * 开始攻击目标
     */
    begin_attack(target: CHARACTER, type: number): void {
        if (!target || target === this) return;
        if (!this.attack_skill) {
            this.send('error  skill');
            return;
        }
        this.add_enemy(target);
        this.fight_type = this.fight_type || 0;
        if (type > this.fight_type) {
            if (this.force_skill && this.force_skill.on_beginfight) {
                this.force_skill.on_beginfight(this, target);
            }
            if (this.attack_skill && this.attack_skill.on_beginfight) {
                this.attack_skill.on_beginfight(this, target);
            }
            if (!this.fight_type) {
                if (this.attack_handler) clearTimeout(this.attack_handler);
                this.attack_handler = this.call_out(
                    this.auto_attack.bind(this),
                    Math.random() * this.gjsd,
                );
                this.send('{type:"combat",start:1}');
            }
            this.fight_type = type;
        }
    }

    /**
     * 开始比试（fight）
     */
    do_fight(target: CHARACTER): void {
        this.begin_attack(target, 1);
    }

    /**
     * 开始击杀（kill）
     */
    do_kill(target: CHARACTER): void {
        if (this.fight_type == 2 && this.query_enemy() == target) return;
        this.begin_attack(target, 2);
        target.begin_attack(this, 2);
        target.notify('<hir>看起来' + this.name + '想杀死你！</hir>\n');
        this.notify('<hir>看起来' + target.name + '想杀死你！</hir>\n');
    }

    /**
     * 添加敌人
     */
    add_enemy(target: CHARACTER): void {
        if (!this.enemy) {
            this.enemy = [];
        }
        this.enemy.push(target);
    }

    /**
     * 获取附近有效敌人列表
     */
    get_nearby_enemies(): CHARACTER[] {
        const result: CHARACTER[] = [];
        const enemies = this.enemy;
        if (!enemies) return result;
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].check_character()) {
                result.push(enemies[i]);
            }
        }
        return result;
    }

    /**
     * 通知房间内玩家 HP / MP 变化
     */
    notify_hp(type?: string, val?: number): void {
        if (!this.environment) return;
        const items = this.environment.items;
        let str: string | null = null;
        if (type) {
            str = '{type:"sc",id:"' + this.id + '",' + type + ':' + val;
        } else {
            const ary: string[] = ['{type:"sc",id:"'];
            ary.push(this.id);
            ary.push('",hp:');
            ary.push(String(this.hp));
            ary.push(',max_hp:');
            ary.push(String(this.max_hp));
            ary.push(',mp:');
            ary.push(String(this.mp));
            ary.push(',max_mp:');
            ary.push(String(this.max_mp));
            str = ary.join('');
        }
        const showdamage = type ? type === 'hp' : false;
        for (let i = 0; i < items.length; i++) {
            const player = items[i];
            if (player.check_player()) {
                if (showdamage && this.damages && player.query_setting('show_damage')) {
                    player.send(str + ',damage:' + (this.damages?.[player.id] || 0) + '}');
                } else {
                    player.send(str + '}');
                }
            }
        }
    }

    /**
     * create_id() = 4 随机字符(idstr 索引, 各6bit) + hex 时间戳
     * → 编码为 [前4字符_24bit_BE][时间戳_int32_BE] = 固定 7 字节
     */
    static readonly STAT_ID_BYTES = 7;
    /** create_id() 使用的字符集，与 UTIL.idstr 一致 */
    static readonly ID_CHARS = '0123456789abcdefghijklmnopqrstuvwxwz';

    /** 将 create_id() 字符串编码为固定 7 字节 Buffer */
    private static _pack_id(id: string): Buffer {
        const buf = Buffer.alloc(7);
        // 前 4 字符 → 6-bit 索引打包为 24-bit BE
        let packed = 0;
        for (let i = 0; i < 4; i++) {
            packed = (packed << 6) | CHARACTER.ID_CHARS.indexOf(id[i]);
        }
        buf[0] = (packed >> 16) & 0xFF;
        buf[1] = (packed >> 8) & 0xFF;
        buf[2] = packed & 0xFF;
        // 剩余字符 → hex 时间戳 int32 BE
        buf.writeInt32BE(parseInt(id.slice(4), 16) || 0, 3);
        return buf;
    }

    /**
     * 通知房间内玩家 HP / MP 变化 (二进制最小带宽版本)
     *
     * 二进制格式 (大端序):
     *   [0]      0x53      消息类型 ('S' = Status)
     *   [1]      flags     位掩码: 0x01=hp, 0x02=max_hp, 0x04=mp, 0x08=max_mp, 0x10=damage
     *   [2..8]   id        数值编码的玩家 ID (固定 7 字节):
     *                        [0..2] 前4字符 24-bit BE (每字符 6-bit idstr 索引)
     *                        [3..6] hex 时间戳 int32 BE
     *   [9..]    values    按 flags 顺序排列的 float64 BE 值 (一个 flag 位 = 8 字节)
     *
     * 全量更新: 9 + 4×8 = 41 字节 (文本版 ~72 字节，节省 ~43%)
     * 部分 hp:  9 + 8   = 17 字节
     *
     * 客户端解码:
     *   const dv = new DataView(buf);
     *   const flags = dv.getUint8(1);
     *   const ID_CHARS = '0123456789abcdefghijklmnopqrstuvwxwz';
     *   const first4 = (buf[2]<<16)|(buf[3]<<8)|buf[4];
     *   const id = ID_CHARS[first4>>18&63]+ID_CHARS[first4>>12&63]
     *            +ID_CHARS[first4>>6&63]+ID_CHARS[first4&63]
     *            +dv.getInt32(5).toString(16);
     *   let off = 9;
     *   if (flags & 0x01) { hp    = dv.getFloat64(off); off += 8; }
     *   if (flags & 0x02) { maxHp = dv.getFloat64(off); off += 8; }
     *   if (flags & 0x04) { mp    = dv.getFloat64(off); off += 8; }
     *   if (flags & 0x08) { maxMp = dv.getFloat64(off); off += 8; }
     *   if (flags & 0x10) { dmg   = dv.getFloat64(off); off += 8; }
     */
    notify_hp_b(type?: string, val?: number): void {
        if (!this.environment) return;

        // 构建 flags 和基础 values
        let baseFlags = 0;
        let baseValues: number[] = [];
        if (type) {
            if (type === 'hp') {
                baseFlags = 0x01;
            } else {
                baseFlags = 0x04; // mp
            }
            baseValues.push(val!);
        } else {
            baseFlags = 0x0F; // hp | max_hp | mp | max_mp
            baseValues.push(this.hp, this.max_hp, this.mp, this.max_mp);
        }
        const idBuf = CHARACTER._pack_id(this.id);

        // 构建公共 msg（不带 damage）并预编码 WebSocket 帧
        const commonLen = 9 + baseValues.length * 8;
        const commonMsg = Buffer.alloc(commonLen);
        commonMsg[0] = 0x53;
        commonMsg[1] = baseFlags;
        idBuf.copy(commonMsg, 2);
        let cpos = 9;
        for (let v = 0; v < baseValues.length; v++, cpos += 8)
            commonMsg.writeDoubleBE(baseValues[v], cpos);
        // 写入批处理缓冲区（原始 payload，flush 时统一编码）
        const room = this.environment as ROOM;

        // 小房间（<10人）：立刻发送，不批处理
        if (room._player_count < 10) {
            const items = room.items;
            const frame = encodeBinaryFrame(commonMsg);
            for (let i = 0; i < items.length; i++) {
                const player: any = items[i];
                if (player.check_player() && player.socket) {
                    player.socket.write(frame);
                }
            }
            return;
        }

        const now = Date.now();

        const wasEmpty = room._batch_all.length === 0;
        room._batch_all.push(commonMsg);
        room._batch_noncombat.push(commonMsg);
        if (wasEmpty) {
            room._batch_timestamp = now;
            markRoomDirty(room);
        } else if (now - room._batch_timestamp >= 10) {
            room._flush_batch();
        }
    }

    /**
     * 增加 / 减少气血
     */
    add_hp(v: number): number {
        if (v > this.max_hp - this.hp) v = this.max_hp - this.hp;
        else if (v < -this.hp) v = -this.hp;
        if (!v) return 0;
        this.hp += v;
        this.notify_hp('hp', this.hp);
        return v;
    }

    /**
     * 增加 / 减少内力
     */
    add_mp(v: number): number {
        let mp = this.mp + v;
        if (mp > this.max_mp) mp = this.max_mp;
        if (mp < 0) mp = 0;
        if (mp === this.mp) return 0;
        this.mp = mp;
        this.notify_hp('mp', this.mp);
        return v;
    }

    /**
     * 是否在战斗中
     */
    is_fighting(p?: CHARACTER): this is this & { enemy: CHARACTER[] } {
        if (!this.fight_type) return false;
        if (!this.enemy || !this.enemy.length) {
            this.fight_type = 0;
            this.clear_combat_status();
            return false;
        }
        if (p) {
            if (p.environment !== this.environment) return false;
            return this.enemy.indexOf(p) >= 0;
        }
        return true;
    }

    /**
     * 结束战斗
     */
    end_fight(): false {
        if (this.enemy) this.enemy.length = 0;
        this.release_time = 0;
        if (!this.fight_type) return false;
        this.send('{type:"combat",end:1}');
        if (this.record_damage && this.hp > 0) this.damages = null;
        this.fight_type = 0;
        if (this.attack_handler) clearTimeout(this.attack_handler);
        this.attack_handler = null;
        this.clear_combat_status();
        this.clear_combat_prop();
        return false;
    }

    /**
     * 查询当前有效敌人
     */
    query_enemy(): CHARACTER | undefined {
        if (!this.enemy) return;
        for (let i = 0; i < this.enemy.length; i++) {
            if (
                this.enemy[i].hp <= 0 ||
                !this.is_here(this.enemy[i]) ||
                !this.enemy[i].fight_type
            ) {
                this.enemy.splice(i, 1);
                i--;
            }
        }
        return this.enemy[0];
    }

    /**
     * 是否可以攻击
     */
    can_attack(): boolean {
        return this.hp > 0 && this.fight_type > 0 && !this.is_faint && !this.is_busy;
    }

    /**
     * 结束对某目标的一轮攻击
     */
    end_attack(target: CHARACTER): boolean | undefined {
        if (!target) return;
        if (!this.fight_type) return;
        this.attack_skill.on_end_attack?.(this, target);
        if (this.fight_type === 1 && target.hp / target.max_hp < 0.3) {
            if (target.hp <= 0) target.hp = 1;
            if (target.is_faint) {
                this.send_room(WINNER_MSG[this._random(4)], target);
            } else {
                this.send_room(WINNER_MSG[Math.floor(Math.random() * WINNER_MSG.length)], target);
            }
            if (target.on_fight_over) target.on_fight_over(this, false);
            this.on_fight_over?.(target, true);
            target.end_fight();
            return this.end_fight();
        } else if (target.hp <= 0 && target.die(this) !== false) {
            target.end_fight();
            this.enemy?.remove(target);
            if (!this.enemy?.length) {
                if (this.hp <= 0) {
                    this.hp = 1;
                }
                return this.end_fight();
            }
        }
        return true;
    }

    /**
     * 查询攻击部位
     */
    query_part(): AttackPart {
        return CHARACTER_PARTS[Math.floor(Math.random() * CHARACTER_PARTS.length)];
    }

    /**
     * 恢复满血满蓝，清除冷却
     */
    full(): void {
        this.hp = this.max_hp;
        this.mp = this.max_mp;
        this.clear_distime();
        this.release_time = 0;
        this.notify_hp();
    }

    /**
     * 检查技能冷却（过期自动清理）
     * @param key - 技能标识 "baseSkill/pfmid"
     * @param now - 当前时间戳（外层缓存复用）
     * @returns true 表示还在冷却中
     */
    check_pfm_cd(key: string, now: number): boolean {
        const expiry = this.pfm_cd.get(key);
        if (expiry === undefined) return false;
        if (expiry > now) return true;
        this.pfm_cd.delete(key);
        return false;
    }

    /**
     * 清除技能冷却
     */
    clear_distime(pfmid?: string): void {
        if (pfmid) {
            this.pfm_cd.delete(pfmid);
        } else {
            this.pfm_cd.clear();
        }
    }

    /**
     * 对多个目标执行同一攻击
     * @param par - 攻击参数（target 字段会被逐个覆盖，无需设置）
     * @param targets - 目标列表，缺省取当前所有敌人
     */
    do_attacks(par: DoAttackPar, targets?: CHARACTER[]): void {
        if (!targets) {
            targets = this.enemy?.filter(Boolean) ?? [];
        }
        if (!targets.length) return;
        let attack_msg = par.attack_msg;
        if (attack_msg === undefined) {
            attack_msg = (
                par.no_weapon ? this.noweapon_skill : this.attack_skill
            )!.query_attack_action(this, targets[0]);
        }
        if (attack_msg !== '') this.send_combat(attack_msg, targets[0]);
        par.attack_msg = '';
        const _power_gj = par.power_gj;
        for (const target of targets) {
            this.do_attack({ ...par, target, power_gj: _power_gj });
            this.end_attack(target);
        }
    }

    // ================================================================
    // 战斗属性计算
    // ================================================================

    /**
     * 确保重算新鲜 — 消费端入口，dirty 时重算，clean 时零开销
     */
    ensure_recount(): void {
        this.recount();
    }

    /**
     * 重新计算战斗属性
     */
    recount(): void {
        if (this._recount_suppressed || !this._recount_dirty) return;
        this._recount_dirty = false;
        this.gjsd = 4000 - this.query_prop('gjsd');
        if (this.gjsd > 500) {
            this.gjsd = int(this.gjsd - (this.gjsd * this.query_prop('gjsd_per')) / 100);
            if (this.gjsd < 500) this.gjsd = 500;
        } else {
            this.gjsd = 500;
        }

        this.gj = int(
            this.str +
            ((this.query_prop('gj') + (this.query_prop('str') * this.str) / 10) *
                (100 + this.query_prop('gj_per'))) /
            100,
        );
        this.fy = int(
            (((this.str + this.con) / 10 +
                this.query_prop('fy') +
                (this.query_prop('con') * this.con) / 10) *
                (100 + this.query_prop('fy_per'))) /
            100,
        );
        this.mz = int(
            ((this.dex / 2 + this.query_prop('mz')) * (100 + this.query_prop('mz_per'))) / 100,
        );
        this.ds = int(
            ((this.dex / 2 + this.query_prop('ds') + (this.query_prop('dex') * this.dex) / 10) *
                (100 + this.query_prop('ds_per'))) /
            100,
        );
        if (this.dodge_skill?.on_recount_dodge) {
            this.ds += this.dodge_skill.on_recount_dodge(this);
        }
        this.zj = int(
            ((this.str / 2 + this.query_prop('zj') + (this.query_prop('str') * this.str) / 10) *
                (100 + this.query_prop('zj_per'))) /
            100,
        );
        if (this.parry_skill?.on_recount_parry) {
            this.zj += this.parry_skill.on_recount_parry(this);
        }
        this.bj = int(this.dex / 10 + this.query_prop('bj_per'));

        this.diff_sh_per = this.query_prop('diff_sh_per');
        this.diff_fy_per = this.query_prop('diff_fy_per');

        // 伤害减免收敛
        if (this.diff_sh_per > 80) {
            const delta = this.diff_sh_per - 80;
            this.diff_sh_per = 20 * Math.tanh(delta * 0.04) + 80;
        }
        this.diff_sh_per += this.query_prop('diff_sh_per2');
        if (this.diff_fy_per > 80) {
            const delta = this.diff_fy_per - 80;
            this.diff_fy_per = 20 * Math.tanh(delta * 0.04) + 80;
        }
        this.diff_fy_per += this.query_prop('diff_fy_per2');
    }

    /**
     * 重新计算最大气血（独立可选方法，不会在 recount 中自动调用）
     */
    recount_max_hp(): void {
        this.max_hp = int(
            this.con * 5 +
            ((this.max_mp * this.query_force_rad() +
                this.query_prop('max_hp') +
                this.query_prop('con') * this.con) *
                (100 + this.query_prop('hp_per'))) /
            100,
        );
        if (this.max_hp < 1) this.max_hp = 1;
        if (this.hp > this.max_hp) this.hp = this.max_hp;
    }

    /**
     * 暴击判定
     */
    crit(target: CHARACTER, part: AttackPart | null, bj_per: number): boolean {
        if (this.random(100) < bj_per + (part ? part.crit : 0) - target.query_prop('diff_bj')) {
            return true;
        }
        return false;
    }

    /**
     * 执行一次攻击
     */
    do_attack(par: DoAttackPar): number {
        if (this.is_faint || this.hp <= 0 || !this.fight_type) return 0;
        this.ensure_recount();
        let target = par.target;
        if (!target) {
            target = this.query_enemy();
            if (!target) return 0;
        }
        target.ensure_recount();
        const weapon = this.query_weapon();
        const attackskill = par.no_weapon ? this.noweapon_skill : this.attack_skill;

        if (attackskill.on_before_attack && !par.is_throwing && !par.no_append_before)
            attackskill.on_before_attack(this, target, par);
        if (this.force_skill.on_before_attack && !par.no_append_before) {
            this.force_skill.on_before_attack(this, target, par);
        }

        this.attack_part = par.part ?? target.query_part();

        let attack_msg = par.attack_msg;
        if (attack_msg === undefined) {
            attack_msg = attackskill.query_attack_action(this, target);
        }
        if (par.attack_before && attack_msg) {
            if (typeof (par.attack_before as any) === 'number') {
                this.send_combat_b(_TMPL_CONCAT2, target, [par.attack_before], [attack_msg]);
            } else if (typeof (attack_msg as any) === 'number') {
                // attack_before 是动态字符串，attack_msg 是模板 ID
                // 文本路径：展开模板为文本后拼接，format_msg 正确替换 $ 占位符
                const tmplText = get(attack_msg as any);
                if (tmplText) {
                    this.send_combat(
                        (par.attack_before as string) + format_msg(this, tmplText, target),
                        target,
                    );
                } else {
                    this.send_combat(par.attack_before as string, target);
                }
            } else {
                this.send_combat(par.attack_before + attack_msg, target);
            }
        } else if (par.attack_before) {
            this.send_combat(par.attack_before, target);
        } else if (attack_msg) {
            this.send_combat(attack_msg, target);
        }
        const weapon_type = par.no_weapon
            ? WEAPON_TYPE.NONE
            : weapon
                ? weapon.weapon_type
                : WEAPON_TYPE.NONE;

        // 入口归一化：确保输出属性在此初始化，后续只做覆盖（V8 隐藏类稳定）
        par.flags = par.flags ?? 0;
        par.bj = par.bj ?? this.bj;
        par.power_gj = 0;

        let sh = par.gj ?? this.gj;
        const mz = par.mz ?? this.mz;
        par.is_dodged = false;
        par.is_parried = false;
        if (target.is_faint || this.is_shadow) {
            par.is_dodged = false;
            par.is_parried = false;
        } else if (target.is_rash) {
            par.is_dodged = false;
            par.is_parried =
                target.is_busy || par.no_parry
                    ? false
                    : Math.random() * (target.zj / 2) + target.zj / 2 > mz;
        } else if (this.is_miss && !par.no_dodge) {
            par.is_dodged = true;
            par.is_parried =
                target.is_busy || par.no_parry
                    ? false
                    : Math.random() * (target.zj / 2) + target.zj / 2 > mz;
        } else if (target.is_miss || par.no_dodge) {
            par.is_dodged = false;
            par.is_parried =
                target.is_busy || par.no_parry
                    ? false
                    : Math.random() * (target.zj / 2) + target.zj / 2 > mz;
        } else if (target.is_busy || par.no_parry) {
            par.is_dodged = Math.random() * (target.ds / 2) + target.ds / 2 > mz;
            par.is_parried = false;
        } else {
            par.is_dodged = Math.random() * (target.ds / 2) + target.ds / 2 > mz;
            par.is_parried = Math.random() * (target.zj / 2) + target.zj / 2 > mz;
        }
        if (par.is_dodged) {
            if (par.on_dodge) par.on_dodge(target);
        } else if (target.dodge_skill.on_dodge) {
            target.dodge_skill.on_dodge(target, this, par);
        }
        if (par.is_dodged) {
            sh = 0;
            this.send_combat(par.miss_msg || target.dodge_skill.query_dodge_action(), target);
        } else {
            if (
                target.parry_skill.on_parry &&
                !par.no_parry &&
                !target.is_busy &&
                !target.is_faint
            ) {
                target.parry_skill.on_parry(target, this, par);
            }
            if (par.on_parry) {
                par.on_parry(target, par.is_parried);
            }
            if (par.is_parried) {
                sh = 0;
            } else {
                if (
                    weapon &&
                    weapon.do_attack &&
                    ((par.no_weapon && weapon_type === WEAPON_TYPE.NONE) ||
                        (!par.no_weapon && weapon_type !== WEAPON_TYPE.NONE)) &&
                    !par.is_throwing
                ) {
                    sh += weapon.do_attack(this, target, par);
                }
                if (attackskill.on_attack && !par.is_throwing) {
                    sh += attackskill.on_attack(this, target, par);
                }
                sh = sh * (this.attack_part ? this.attack_part.hert : 1);
                if (!par.no_power) {
                    sh += (sh * this.query_prop('add_sh_per')) / 100;
                    sh += this.query_prop('add_sh');
                    par.iscirt = par.cirt
                        ? par.cirt(target, this.attack_part, par.bj)
                        : this.crit(target, this.attack_part, par.bj);

                    if (par.iscirt)
                        sh *= (150 + (par.add_bjsh_per ?? this.query_prop('add_bjsh_per'))) / 100;
                }
            }
            let power_gj = par.power_gj ?? 0;
            if (this.force_skill.do_force_attack) {
                power_gj += this.force_skill.do_force_attack(this, target, par);
            }
            if (power_gj > 0 && (!weapon || weapon.weapon_type === WEAPON_TYPE.NONE)) {
                power_gj = power_gj + (power_gj * this.query_prop('add_sh_per')) / 100;
                if (par.iscirt)
                    power_gj =
                        (power_gj * (150 + (par.add_bjsh_per ?? this.query_prop('add_bjsh_per')))) /
                        100;
            }
            if (power_gj > 0) sh += power_gj;
            if (target.force_skill.on_force_parry) {
                par.power_gj = power_gj;
                sh -= target.force_skill.on_force_parry(target, this, sh, par);
                if (this.hp <= 0 || !target.fight_type) {
                    return 0;
                }
            }
            if (sh > 0) sh = target.damage(sh, this, par.diff_fy);

            if (par.is_parried) {
                this.send_combat(
                    par.parry_msg ||
                    target.parry_skill.query_parry_action(target, this, weapon_type),
                    target,
                );
                if (sh > 0) {
                    target.send_combat(query_status_msg(target.hp, target.max_hp));
                    if (target.on_damage) target.on_damage(this, sh);
                }
            } else {
                if (sh > 0) {
                    damage_msg(
                        this,
                        sh,
                        par.is_throwing ? WEAPON_TYPE.THROWING : weapon_type,
                        target,
                        par.iscirt ?? false,
                        par.damage_msg,
                    );
                    target.send_combat(query_status_msg(target.hp, target.max_hp));
                    if (target.on_damage) target.on_damage(this, sh);
                } else {
                    this.send_combat('结果没有造成任何伤害。\n', target);
                }
            }
        }
        if (this.fight_type) {
            if (!par.no_append_target && target.fight_type) {
                if (target.dodge_skill.on_dodge_over)
                    target.dodge_skill.on_dodge_over(target, this, par);
                if (!par.is_dodged && target.parry_skill.on_parry_over)
                    target.parry_skill.on_parry_over(target, this, par);
            }
            if (!par.no_append) {
                if (attackskill.on_attack_over) attackskill.on_attack_over(this, target, par, sh);
                if (this.force_skill.on_force_over)
                    this.force_skill.on_force_over(this, target, par, sh);
            }
        }
        return sh;
    }

    /**
     * 接收攻击伤害（简化版）
     */
    from_attack(
        sh: number,
        mz: number,
        gjmsg: string,
        shmsg: string,
        dsmsg?: string,
        parrymsg?: string,
    ): boolean {
        if (gjmsg) this.send_room(gjmsg);
        this.ensure_recount();
        const is_dodged = mz > 0 ? Math.random() * (this.ds / 2) + this.ds / 2 > mz : false;
        if (is_dodged) {
            this.send_room(dsmsg || this.dodge_skill.query_dodge_action(), this);
        } else {
            this.send_room(shmsg);
            this.damage(sh);
            this.send_combat(query_status_msg(this.hp, this.max_hp), this);
            if (this.fight_type === 1 && this.hp < 0) {
                this.hp = 1;
            } else if (this.hp <= 0) {
                this.die();
                this.end_fight();
            }
        }
        return is_dodged;
    }

    /**
     * 恢复气血
     */
    do_recover(hp: number): number {
        hp = hp + (hp * this.query_prop('recover_per')) / 100;
        if (!(hp > 0)) return 0;
        return this.add_hp(int(hp));
    }

    /**
     * 计算最终伤害（含免伤 / 防御 / 内功减免）
     */
    damage(sh: number, from?: CHARACTER, diff_fy?: number): number {
        if (!(sh > 0)) return 0;
        this.ensure_recount();
        let diff_sh_per = this.diff_sh_per;
        let fy = this.fy;
        if (diff_fy && diff_fy > 0) {
            diff_sh_per -= (diff_sh_per * diff_fy) / 100;
            fy -= (fy * diff_fy) / 100;
        }
        const diff_fy_per = from ? from.diff_fy_per : 0;
        if (diff_sh_per > 0 && diff_fy_per > 0) {
            diff_sh_per -= diff_fy_per;
            if (diff_sh_per < 0) {
                // diff_fy_per = -diff_sh_per; // intentionally unused in original
            }
        }
        if (fy > 0 && diff_fy_per > 0) {
            fy -= (fy * diff_fy_per) / 100;
            if (fy < 0) fy = 0;
        }
        if (diff_sh_per > 0) sh = sh - (sh * diff_sh_per) / 100;
        if (fy > 0 && sh > 0) sh = (sh / (sh + fy)) * sh;
        sh = sh - this.query_prop('diff_sh');

        if (sh > 0 && this.equipment?.[1]?.on_defense) {
            sh = this.equipment[1].on_defense(this, sh, from);
        }
        if (sh > 0 && this.force_skill.on_damage) {
            sh = this.force_skill.on_damage(this, sh, from);
        }
        if (sh > 0) {
            sh = int(sh);
            if (this.record_damage && from) {
                if (!this.damages) this.damages = {};
                const damag = (this.damages[from.id] || 0) + sh;
                this.damages[from.id] = damag;
                this.sum_damages = (this.sum_damages ?? 0) + sh;
            }
            this.add_hp(-sh);
            return sh;
        }
        return 0;
    }

    /**
     * 计算伤害（无防御减免，无记录）
     */
    damage2(sh: number, from?: CHARACTER): number | undefined {
        if (!sh) return;
        if (this.record_damage && from) {
            if (!this.damages) this.damages = {};
            const damag = (this.damages[from.id] || 0) + sh;
            this.damages[from.id] = damag;
        }
        if (this.force_skill?.on_damage) {
            sh = this.force_skill.on_damage(this, sh, from);
            if (!sh) return 0;
        }
        this.add_hp(-sh);
        return sh;
    }

    /**
     * 纯扣血（无减免，触发内功回调）
     */
    damage3(sh: number, from?: CHARACTER): number | undefined {
        if (!(sh > 0)) return;
        this.add_hp(-sh);
        this.force_skill?.on_damage?.(this, 0, from);
        return sh;
    }

    /**
     * 重新自动攻击（PFM 切换后触发）
     */
    reauto_attack(): void {
        if (!this.auto_pfm && this.fight_type) {
            if (this.attack_handler) clearTimeout(this.attack_handler);
            this.auto_attack();
        }
    }

    /**
     * 自动攻击循环
     */
    auto_attack(): void {
        this.ensure_recount();
        const target = this.query_enemy();
        if (this.hp <= 0) {
            if (this.fight_type && target) {
                target.end_attack(this);
                return;
            }
            this.end_fight();
            return;
        }
        if (!target) {
            this.end_fight();
            return;
        }
        if (this.is_faint) {
            this.attack_handler = this.call_out(this.auto_attack.bind(this), this.is_faint);
            return;
        }
        if (this.release_time) {
            const diff_time = this.release_time - Date.now();
            if (diff_time > 0) {
                this.attack_handler = this.call_out(this.auto_attack.bind(this), diff_time);
                return;
            }
            this.release_time = 0;
        }
        let sh = 0;

        if (this.is_busy) {
            if (this.auto_pfm && this.busy_pfm) {
                if (!this.check_pfms(target)) {
                    // intentional no-op
                }
            } else {
                this.attack_handler = this.call_out(this.auto_attack.bind(this), this.is_busy);
                return;
            }
        } else {
            if (!this.auto_pfm || !this.check_pfms(target)) {
                if (target.fight_type) {
                    sh =
                        this.do_attack({
                            target: target,
                            gj: this.gj,
                            mz: this.mz,
                        }) ?? 0;
                }
            }
        }
        if (!sh || this.end_attack(target)) {
            this.attack_handler = this.call_out(this.auto_attack.bind(this), this.gjsd);
        }
    }

    /**
     * 释放绝招
     */
    use_pfm(target: CHARACTER, pfm: PERFORM, level: number, sktype: string): boolean {
        if (!pfm) return false;
        let isrelease = this.check_pfm_use(target, pfm, level, sktype);
        if (isrelease !== false) {
            this.add_mp(-(pfm.query_mp(this, level) || 0));
            this.set_temp('used_pfm', pfm.id, 20000);
            return true;
        }
        return false;
    }

    check_pfm_use(target: CHARACTER, pfm: PERFORM, lv: number, sk: string): boolean {
        if (this.status) {
            const len = this.status.length;
            for (let i = 0; i < len; i++) {
                const statu: CharacterStatus = this.status[i];
                const res = statu?.on_pfm?.(this, target, pfm, lv, sk);
                if (!res) continue;
                if (res & PfmFlag.EXPEND_STATU) this.remove_status(statu.id);
                if (res & PfmFlag.BLOCK) return false;
                if (res & PfmFlag.NO_USE) return true;
            }
        }
        if (target && target.parry_skill && target.parry_skill.on_parry_pfm) {
            return target.parry_skill.on_parry_pfm(target, this, pfm, lv, sk);
        }
        if (pfm.is_weapon && pfm.origin_skill != this.attack_skill.id) {
            this.remove_status('weapon', true);
        }
        this.begin_burst();
        try {
            return pfm.use?.(this, target, lv, sk) != false;
        } finally {
            this.end_burst();
        }
    }

    /**
     * 检查并释放自动绝招
     */
    check_pfms(target: CHARACTER): boolean | undefined {
        if (!this.auto_skills) this.init_pfms();
        if (!this.auto_skills) return false;
        this.attack_count = this.attack_count || this.pfm_rate || 3;

        if (this.random(this.attack_count) !== 0) {
            this.attack_count--;
            return false;
        }
        const now = Date.now();
        const canuser: AutoSkillEntry[] = [];
        for (let i = 0; i < this.auto_skills.length; i++) {
            const item = this.auto_skills[i];
            if (item.ban_use) continue;
            if (this.is_busy && !item.pfm.allow_busy) continue;
            if (this.check_pfm_cd(item.id, now)) continue;
            if (item.pfm.query_mp(this, item.level) <= this.mp) canuser.push(item);
        }
        if (!canuser.length) return false;

        const skill = canuser[Math.floor(Math.random() * canuser.length)];
        if (!skill) return false;
        if (this.use_pfm(target, skill.pfm, skill.level, skill.type)) {
            const rtime = skill.pfm.query_releasetime(this, skill.level);

            if (rtime > 0) this.release_time = rtime + now;
            else {
                this.release_time = 0;
                // rtime = 0; // intentionally unused
            }
            skill.pfm.change_distime(
                this,
                skill.type,
                skill.pfm.query_distime(this, skill.level, skill.is_ref) + (rtime || 0),
                true,
            );

            return this.release_time > 0 || target.hp <= 0;
        }
        return false;
    }

    /**
     * 初始化自动绝招列表
     */
    init_pfms(): void {
        this.auto_skills = [];
        if (!this.skills) return;
        const bases = ['', 'force', 'unarmed', 'dodge', 'parry', 'bite', 'throwing'];
        const weapon = this.query_weapon_type();
        if (weapon !== WEAPON_TYPE.NONE) bases[0] = weapon;
        if (this.is_player && !this.throwing_name()) {
            bases[6] = '';
        }
        for (const base of bases) {
            if (!base) continue;
            const base_skill = this.skills.get(base);
            if (!base_skill) continue;

            const sp_skill = SKILL.get(base_skill.enable_skill || base);

            const level = base_skill.enable_skill
                ? this.query_skill(base_skill.enable_skill)
                : this.query_skill(base);
            if (sp_skill && sp_skill.pfm) {
                for (const p in sp_skill.pfm) {
                    this.add_auto_pfm(sp_skill.pfm[p], base, level, false);
                }
            }
            if (base_skill.enable_skill) {
                const ref_pfm = this.query_ref_skill(this.skills.get(base_skill.enable_skill));
                if (ref_pfm) {
                    this.add_auto_pfm(ref_pfm, base, level / 2, true);
                }
            }
        }
    }

    /**
     * 添加自动绝招
     */
    add_auto_pfm(pfmitem: any, baseSkill: string, level: number, is_ref: boolean): void {
        if (pfmitem.no_auto) return;
        if (pfmitem.enable_skill && pfmitem.enable_skill !== baseSkill) return;
        if (pfmitem.check && pfmitem.check(this, level, baseSkill) === false) return;

        if (!pfmitem.pass_weapon_check) {
            if (baseSkill === 'throwing' && !this.can_throwing()) return;
            if (pfmitem.weapon_type) {
                if (pfmitem.weapon_type != this.query_weapon_type()) return;
            } else {
                const need_weapon = WEAPON_SKILLS.has(baseSkill) ? baseSkill : undefined;
                if (need_weapon && need_weapon !== this.query_weapon_type()) return;
            }
        }

        if (pfmitem.allow_busy) this.busy_pfm = true;
        this.auto_skills!.push({
            pfm: pfmitem,
            level: level,
            id: baseSkill + '.' + pfmitem.pid,
            type: baseSkill,
            is_ref: is_ref,
        });
    }

    /**
     * 设置出招时间全局冷却
     */
    set_releasetime(rtime: number): void {
        const release_time = Date.now() + rtime;
        if (this.is_player) {
            this.send(`{type:"dispfm",rtime:${rtime}}`);
        } else {
            if (!this.auto_skills) this.init_pfms();
        }
        this.release_time = release_time;
        if (!this.auto_skills) return;
        for (const askill of this.auto_skills) {
            const cur = this.pfm_cd.get(askill.id);
            if (cur === undefined || cur < release_time) {
                this.pfm_cd.set(askill.id, release_time);
            }
        }
    }

    /**
     * 随机数（继承自 BASE，此处声明避免类型错误）
     * 使用 this.random(n) 调用继承的原型方法
     */
    private _random(n: number): number {
        return Math.floor(Math.random() * n);
    }
    /**
     * 获取 NPC 模板（带缓存）
     */
    static GET_BASE(path: string): CHARACTER {
        let base = WORLD.NPC_STORE.get(path);
        if (!base) {
            base = BASE.CREATE(__PATH.NPC, path) as NPC;
            if (!base) throw new Error('没有人物' + path + '的定义。');
        }
        return base;
    }
}

// ================================================================
// 模块级辅助函数
// ================================================================

/**
 * 将消息模板中的 $ 占位符替换为实际值（始终第三人称）。
 *
 * 新消息格式仅为一种渲染结果，客户端根据消息中的 A/T 字段判断视角：
 * - 自身为 A → 将 A 名字替换为"你"
 * - 自身为 T → 将 T 名字替换为"你"
 * - 否则 → 直接显示
 */
function format_msg(me: CHARACTER, text: string, target?: ITEM): string {
    if (text.length < 3) return text;
    const str: string[] = [];
    let start = 0;
    let i: number;
    for (i = 0; i < text.length; i++) {
        if (text[i] === '$') {
            if (start < i) str.push(text.substring(start, i));
            const ch = text[++i];
            start = i + 1;
            switch (ch) {
                case 'N':
                    str.push(me.name);
                    break;
                case 'n':
                    if (target) {
                        str.push(target.name);
                    } else {
                        str.push('<hir>未知存在</hir>');
                        console.warn('[format_msg] $n 占位符缺少 target，消息文本:', text);
                    }
                    break;
                case 'P':
                    str.push(me.call3());
                    break;
                case 'p':
                    if (target) {
                        // 角色用第三人称代词，物品直接用名字
                        str.push(target.check_character() ? target.call3() : target.name);
                    } else {
                        str.push('<hir>未知存在</hir>');
                        console.warn('[format_msg] $p 占位符缺少 target，消息文本:', text);
                    }
                    break;
                case 'l':
                    str.push(me.attack_part ? me.attack_part.name : '');
                    break;
                case 'W':
                case 'w':
                    str.push(me.weapon_name() || '手');
                    break;
                case 'i':
                    if (target) {
                        // 角色取武器名，物品直接用名字
                        str.push(
                            target.check_character() ? target.weapon_name() || '手' : target.name,
                        );
                    } else {
                        str.push('<hir>未知兵刃</hir>');
                        console.warn('[format_msg] $i 占位符缺少 target，消息文本:', text);
                    }
                    break;
                case 'T':
                    str.push(me.throwing_name());
                    break;
            }
        }
    }
    if (start < i) str.push(text.substring(start, i));
    return str.join('');
}

/**
 * 查询血量状态消息
 */
function query_status_msg(hp: number, maxhp: number): string {
    const ratio = int((hp * 10) / maxhp);
    const idx = Math.max(0, Math.min(9, ratio));
    return status_msg[9 - idx];
}

/**
 * 伤害消息模板表 — { type → [{max, tmpl}] }
 * tmpl 中的 ^ 会被替换为伤害数值字符串（如 "<wht>1234</wht>点伤害"）
 * 不含 $ 占位符的模板不会被 pack.mjs 自动扫描，由 _DMG_ZERO 和 _DMG_FALLBACK 单独注册
 * pack.mjs --binary 会将其中含 $ 的 tmpl 字符串替换为模板 ID
 */
/** 数组 [tmpl, ...args] 作为嵌套模板引用 */
type TplRef = (string | number)[];
/** 双槽拼接模板 */
const _TMPL_CONCAT2 = _tmpl('^^');

// 伤害占比模板（原版，^ 传 TplRef 嵌套 damage 显示模板）
const _DMG_TMPL: Record<string, Array<{ max: number; tmpl: string | number }>> = {
    blade: [
        { max: 5, tmpl: _tmpl('结果只是轻轻地划破$p的皮肉，造成^。') },
        { max: 10, tmpl: _tmpl('结果在$p$l划出一道细长的血痕，造成^！') },
        { max: 20, tmpl: _tmpl('结果「嗤」地一声划出一道伤口，造成^！') },
        { max: 40, tmpl: _tmpl('结果「嗤」地一声划出一道血淋淋的伤口，造成^！') },
        { max: 80, tmpl: _tmpl('结果「嗤」地一声划出一道又长又深的伤口，溅得$N满脸鲜血，造成^！') },
        { max: Infinity, tmpl: _tmpl('结果只听见$n一声惨嚎，$w已在$p$l划出一道深及见骨的可怕伤口，造成^！！') },
    ],
    sword: [
        { max: 10, tmpl: _tmpl('结果只是轻轻地刺破$p的皮肉，造成^！') },
        { max: 20, tmpl: _tmpl('结果在$p$l刺出一个创口，造成^！') },
        { max: 40, tmpl: _tmpl('结果「噗」地一声刺入了$n$l寸许，造成^！') },
        { max: 60, tmpl: _tmpl('结果「噗」地一声刺进$n的$l，使$p不由自主地退了几步，造成^！') },
        { max: 80, tmpl: _tmpl('结果「噗嗤」地一声，$w已在$p$l刺出一个血肉模糊的血窟窿，造成^！') },
        { max: Infinity, tmpl: _tmpl('结果只听见$n一声惨嚎，$w已在$p的$l对穿而出，鲜血溅得满地，造成^！！') },
    ],
    none: [
        { max: 5, tmpl: _tmpl('结果只是轻轻地碰到，比拍苍蝇稍微重了点，造成^！') },
        { max: 10, tmpl: _tmpl('结果在$p的$l造成一处瘀青，造成^！') },
        { max: 25, tmpl: _tmpl('结果一击命中，$n的$l登时肿了一块老高，造成^！') },
        { max: 40, tmpl: _tmpl('结果一击命中，$n闷哼了一声显然吃了不小的亏，造成^！') },
        { max: 50, tmpl: _tmpl('结果「砰」地一声，$n退了两步，造成^！') },
        { max: 60, tmpl: _tmpl('结果这一下「砰」地一声打得$n连退了好几步，差一点摔倒，造成^！') },
        { max: 80, tmpl: _tmpl('结果重重地击中，$n「哇」地一声吐出一口鲜血，造成^！') },
        { max: Infinity, tmpl: _tmpl('结果只听见「砰」地一声巨响，$n像一捆稻草般飞了出去，造成^！！') },
    ],
    force: [
        { max: 10, tmpl: _tmpl('结果只是把$n打得退了半步，毫发无损，造成^！') },
        { max: 20, tmpl: _tmpl('结果$n痛哼一声，在$p的$l造成一处瘀伤，造成^！') },
        { max: 30, tmpl: _tmpl('结果一击命中，把$n打得痛得弯下腰去，造成^！') },
        { max: 40, tmpl: _tmpl('结果$n闷哼了一声，脸上一阵青一阵白，显然受了点内伤，造成^！') },
        { max: 60, tmpl: _tmpl('结果$n脸色一下变得惨白，昏昏沉沉接连退了好几步，造成^！') },
        { max: 75, tmpl: _tmpl('结果重重地击中，$n「哇」地一声吐出一口鲜血，造成^！') },
        { max: 90, tmpl: _tmpl('结果「轰」地一声，$n全身气血倒流，口中鲜血狂喷而出，造成^！') },
        { max: Infinity, tmpl: _tmpl('结果只听见几声喀喀轻响，$n一声惨叫，像滩软泥般塌了下去，造成^！！') },
    ],
    throwing: [
        { max: 5, tmpl: _tmpl('结果只是轻轻地划破$p的皮肉，造成^。') },
        { max: 10, tmpl: _tmpl('结果在$p$l划出一道细长的血痕，造成^！') },
        { max: 20, tmpl: _tmpl('结果「嗤」地一声划出一道伤口，造成^！') },
        { max: 40, tmpl: _tmpl('结果「嗤」地一声划出一道血淋淋的伤口，造成^！') },
        { max: 80, tmpl: _tmpl('结果「嗤」地一声划出一道又长又深的伤口，溅得$N满脸鲜血，造成^！') },
        { max: Infinity, tmpl: _tmpl('结果只听见$n一声惨嚎，$T已在$p$l划出一道深及见骨的可怕伤口，造成^！！') },
    ],
};
// 伤害显示模板（被 _DMG_TMPL 的 ^ 嵌套引用，颜色在模板内）
const _DMG_DISP_NORMAL = _tmpl('<wht>^</wht>点伤害');
const _DMG_DISP_CRIT = _tmpl('<hir>^</hir>点暴击伤害');
const _DMG_DISP_MSG = _tmpl('^\n$N对$n造成了<wht>^</wht>点伤害');
const _DMG_DISP_MSG_CRIT = _tmpl('^\n$N对$n造成了<hir>^</hir>点暴击伤害');
// fallback
const _DMG_FALLBACK = _tmpl('结果造成<wht>^</wht>点伤害。');

/**
 * 发送伤害消息
 * 通过 typeof tmpl 自动检测编译模式：
 *   text 模式：tmpl 为字符串，渲染 ^ 后 send_combat
 *   binary 模式：tmpl 为模板 ID (number)，send_combat_b
 * msg 为动态字符串时走文本路径（无法预编译为模板 ID）
 */
function damage_msg(
    me: CHARACTER,
    damage: number,
    type: string,
    ob: CHARACTER,
    iscrit: boolean,
    msg?: string,
): void {
    const sh: string = String(damage);
    const disp = iscrit ? _DMG_DISP_CRIT : _DMG_DISP_NORMAL;
    if (msg) {
        if (typeof (msg as any) !== 'number') {
            // 动态 msg — 文本路径，单次 send_combat 完成 $ 替换
            const dmgSuffix = iscrit
                ? '$N对$n造成了<hir>' + sh + '</hir>点暴击伤害'
                : '$N对$n造成了<wht>' + sh + '</wht>点伤害';
            me.send_combat(msg + '\n' + dmgSuffix, ob);
            return;
        }
        // msg 为模板 ID — 二进制路径
        const dmgTmpl = iscrit ? _DMG_DISP_MSG_CRIT : _DMG_DISP_MSG;
        me.send_combat_b(dmgTmpl, ob, [msg as any], [disp, sh]);
        return;
    }
    // 零伤害
    if (damage === 0) {
        me.send_combat('结果没有造成任何伤害。', ob);
        return;
    }
    const ratio: number = ob.hp > 0 ? (damage * 100) / ob.hp : 120;
    // 查找伤害占比模板（^ 嵌套 damage 显示模板）
    let buckets: Array<{ max: number; tmpl: string | number }> | undefined;
    if (type === WEAPON_TYPE.BLADE || type === WEAPON_TYPE.WHIP) {
        buckets = _DMG_TMPL.blade;
    } else if (type === WEAPON_TYPE.SWORD) {
        buckets = _DMG_TMPL.sword;
    } else if (
        type === WEAPON_TYPE.NONE ||
        type === WEAPON_TYPE.STAFF ||
        type === WEAPON_TYPE.CLUB
    ) {
        buckets = _DMG_TMPL.none;
    } else if (type === 'force') {
        buckets = _DMG_TMPL.force;
    } else if (type === WEAPON_TYPE.THROWING) {
        buckets = _DMG_TMPL.throwing;
    }
    if (buckets) {
        for (let i: number = 0; i < buckets.length; i++) {
            if (ratio < buckets[i].max) {
                me.send_combat_b(buckets[i].tmpl, ob, [disp, sh]);
                return;
            }
        }
    }
    // fallback
    me.send_combat_b(_DMG_FALLBACK, ob, [disp, sh]);
}

// ================================================================
// 移动相关辅助
// ================================================================

const dirs: Record<string, string> = {
    north: '北方',
    south: '南方',
    east: '东方',
    west: '西方',
    northup: '北边',
    southup: '南边',
    eastup: '东边',
    westup: '西边',
    northdown: '北边',
    southdown: '南边',
    eastdown: '东边',
    westdown: '西边',
    northeast: '东北',
    northwest: '西北',
    southeast: '东南',
    southwest: '西南',
    up: '上',
    down: '下',
    enter: '里',
    out: '外',
};

function sendOutMessage(player: CHARACTER, dir?: string): string {
    const d = dir ? dirs[dir] || '' : '';
    if (player.is_fighting()) {
        return player.name + '往' + d + '落荒而逃了。';
    }
    const eq = (player.hp * 100) / player.max_hp;
    if (eq < 5) {
        return player.name + '撑起满是<HIR>鲜血</HIR>的躯体，一瘸一拐地朝' + d + '挪去。';
    } else if (eq < 10) {
        return player.name + '一边擦着嘴角的<HIR>鲜血</HIR>，一边朝' + d + '走去。';
    } else if (eq < 30) {
        return player.name + '灰头土脸、狼狈不堪地向' + d + '离去。';
    } else if (eq < 50) {
        return player.name + '一声不吭的转身朝' + d + '走去，脸色好像有些难看。';
    }
    return player.name + '往' + d + '离开。';
}

function sendInMessage(player: CHARACTER, dir?: string): string {
    if (player.fight_type) {
        return player.name + '跌跌撞撞地跑了过来，模样有些狼狈。';
    }
    const eq = (player.hp * 100) / player.max_hp;
    if (eq < 5) {
        return player.name + '撑着满是<HIR>鲜血</HIR>的躯体，一瘸一拐地挪了过来。';
    } else if (eq < 10) {
        return player.name + '一边擦着嘴角的<HIR>鲜血</HIR>，一边走了过来，龇牙咧嘴的。';
    } else if (eq < 30) {
        return player.name + '灰头土脸、狼狈不堪地走了过来。';
    } else if (eq < 50) {
        return player.name + '像斗败了的公鸡，垂头丧气地走了过来。';
    }
    return player.name + '走了过来。';
}

// ================================================================
// 队伍辅助
// ================================================================

function checkTeamfb(me: CHARACTER): void {
    // Module-level function referenced by team_out
    // Implemented elsewhere in the codebase
}

// ================================================================
// 显示相关数据
// ================================================================

const level_descs: string[] = ['普通百姓', '武士', '武师', '宗师', '武圣', '武帝', '武神'];
const level_color: string[] = ['', 'wht', 'hig', 'hiy', 'hiz', 'hio', 'ord'];

function get_perdesc(obj: CHARACTER): string {
    const ary = obj.gender === 1 ? boy_pers : girl_pers;
    let per = obj.per + obj.query_prop('per');
    let index = int(per / 2);
    if (index < 0) index = 0;
    if (index >= ary.length) index = ary.length - 1;
    return ary[index];
}

function get_agestr(age: number): string {
    let index = int((age || 10) / 10);
    if (index >= age_strs.length) index = age_strs.length - 1;
    return age_strs[index];
}

function get_skill_desc(level: number): string {
    if (!level) return '看上去似乎不会任何武功。';
    if (level < 1000) return '的武功看上去似乎' + skill_levels[int(level / 50)];
    let v = int((level - 1000) / 500);
    if (v > 6) v = 6;
    return '的武功看上去似乎' + skill_levels[v + 20];
}

function get_status(obj: CHARACTER): string {
    let p = int((obj.hp * 10) / obj.max_hp);
    if (p < 0) p = 0;
    if (p >= Look_status.length) p = Look_status.length - 1;
    return Look_status[p];
}

/** 男性容貌描述 */
const boy_pers: string[] = [
    '<BLU>眉歪眼斜，瘌头癣脚，不象人样</BLU>',
    '<BLU>呲牙咧嘴，黑如锅底，奇丑无比</BLU>',
    '<BLU>面如桔皮，头肿如猪，让人不想再看第二眼</BLU>',
    '<HIB>贼眉鼠眼，身高三尺，宛若猴状</HIB>',
    '<HIB>肥头大耳，腹圆如鼓，手脚短粗，令人发笑</HIB>',
    '<NOR>面颊凹陷，瘦骨伶仃，可怜可叹</NOR>',
    '<NOR>傻头傻脑，痴痴憨憨，看来倒也老实</NOR>',
    '<NOR>相貌平平，不会给人留下什么印象</NOR>',
    '<YEL>膀大腰圆，满脸横肉，恶形恶相</YEL>',
    '<YEL>腰圆背厚，面阔口方，骨格不凡</YEL>',
    '<RED>眉目清秀，端正大方，一表人才</RED>',
    '<RED>双眼光华莹润，透出摄人心魄的光芒</RED>',
    '<HIY>举动如行云游水，独蕴风情，吸引所有异性目光</HIY>',
    '<HIY>双目如星，眉梢传情，所见者无不为之心动</HIY>',
    '<HIR>粉面朱唇，身姿俊俏，举止风流无限</HIR>',
    '<HIR>丰神如玉，目似朗星，令人过目难忘</HIR>',
    '<MAG>面如美玉，粉妆玉琢，俊美不凡</MAG>',
    '<MAG>飘逸出尘，潇洒绝伦</MAG>',
    '<MAG>丰神俊朗，长身玉立，宛如玉树临风</MAG>',
    '<HIM>神清气爽，骨格清奇，宛若仙人</HIM>',
    '<HIM>一派神人气度，仙风道骨，举止出尘</HIM>',
];

/** 女性容貌描述 */
const girl_pers: string[] = [
    '<BLU>丑如无盐，状如夜叉</BLU>',
    '<BLU>歪鼻斜眼，脸色灰败，直如鬼怪一般</BLU>',
    '<BLU>八字眉，三角眼，鸡皮黄发，让人一见就想吐</BLU>',
    '<HIB>眼小如豆，眉毛稀疏，手如猴爪，不成人样</HIB>',
    '<HIB>一嘴大暴牙，让人一看就没好感</HIB>',
    '<NOR>满脸疙瘩，皮色粗黑，丑陋不堪</NOR>',
    '<NOR>干黄枯瘦，脸色腊黄，毫无女人味</NOR>',
    '<YEL>身材瘦小，肌肤无光，两眼无神</YEL>',
    '<YEL>虽不标致，倒也白净，有些动人之处</YEL>',
    '<RED>肌肤微丰，雅淡温宛，清新可人</RED>',
    '<RED>鲜艳妍媚，肌肤莹透，引人遐思</RED>',
    '<HIR>娇小玲珑，宛如飞燕再世，楚楚动人</HIR>',
    '<HIR>腮凝新荔，肌肤胜雪，目若秋水</HIR>',
    '<HIW>粉嫩白至，如芍药笼烟，雾里看花</HIW>',
    '<HIW>丰胸细腰，妖娆多姿，让人一看就心跳不已</HIW>',
    '<MAG>娇若春花，媚如秋月，真的能沉鱼落雁</MAG>',
    '<MAG>眉目如画，肌肤胜雪，真可谓闭月羞花</MAG>',
    '<MAG>气质美如兰，才华馥比山，令人见之忘俗</MAG>',
    '<HIM>灿若明霞，宝润如玉，恍如神妃仙子</HIM>',
    '<HIM>美若天仙，不沾一丝烟尘</HIM>',
    '<HIM>宛如<HIW>玉雕冰塑</HIW>，似梦似幻，已不再是凡间人物</HIM>',
];

/** 气血状态描述 */
const Look_status: string[] = [
    '<HIR>受伤过重，已经有如风中残烛，随时都可能断气。</HIR>',
    '<HIR>受伤过重，已经奄奄一息，命在旦夕了。</HIR>',
    '<HIR>伤重之下已经难以支撑，眼看就要倒在地上。</HIR>',
    '<RED>受了相当重的伤，只怕会有生命危险。</RED>',
    '<RED>已经伤痕累累，正在勉力支撑著不倒下去。</RED>',
    '<RED>气息粗重，动作开始散乱，看来所受的伤著实不轻。</RED>',
    '<HIY>受伤不轻，看起来状况并不太好。</HIY>',
    '<HIY>受了几处伤，不过似乎并不碍事。</HIY>',
    '<HIY>看起来可能受了点轻伤。</HIY>',
    '<HIG>似乎受了点轻伤，不过光从外表看不大出来。</HIG>',
    '<HIG>看起来气血充盈，并没有受伤。</HIG>',
];

/** 年龄段描述 */
const age_strs: string[] = [
    '几',
    '十多',
    '二十多',
    '三十多',
    '四十多',
    '五十多',
    '六十多',
    '七十多',
    '八十多',
    '九十多',
    '一百多',
];

/** 武功等级描述 */
const skill_levels: string[] = [
    '<BLU>初学乍练</BLU>',
    '<BLU>不知所以</BLU>',
    '<HIB>粗通皮毛</HIB>',
    '<HIB>渐有所悟</HIB>',
    '<YEL>半生不熟</YEL>',
    '<YEL>马马虎虎</YEL>',
    '<HIY>平淡无奇</HIY>',
    '<HIY>触类旁通</HIY>',
    '<HIG>心领神会</HIG>',
    '<HIG>挥洒自如</HIG>',
    '<HIC>驾轻就熟</HIC>',
    '<HIC>出类拔萃</HIC>',
    '<CYN>初入佳境</CYN>',
    '<CYN>神乎其技</CYN>',
    '<MAG>威不可当</MAG>',
    '<HIW>豁然贯通</HIW>',
    '<HIW>超群绝伦</HIW>',
    '<RED>登峰造极</RED>',
    '<WHT>登堂入室</WHT>',
    '<HIM>一代宗师</HIM>',
    '<WHT>超凡入圣</WHT>',
    '<HIO>出神入化</HIO>',
    '<HIO>独步天下</HIO>',
    '<HIR>空前绝后</HIR>',
    '<HIR>旷古绝伦</HIR>',
    '<HIW>深不可测</HIW>',
    '<HIW>返璞归真</HIW>',
];

// ================================================================
// 战斗相关数据
// ================================================================

/** 战斗追击消息 */
const catch_hunt_msg: string[] = [
    '<HIW>$N和$n仇人相见分外眼红，立刻打了起来！</HIW>',
    '<HIW>$N对著$n大喝：「可恶，又是你！」</HIW>',
    '<HIW>$N和$n一碰面，二话不说就打了起来！</HIW>',
    '<HIW>$N一眼瞥见$n，「哼」的一声冲了过来！</HIW>',
    '<HIW>$N一见到$n，愣了一愣，大叫：「我宰了你！」</HIW>',
    '<HIW>$N喝道：「$n，我们的账还没算完，看招！」</HIW>',
    '<HIW>$N喝道：「$n，看招！」</HIW>',
];

/** 警戒消息 */
const guard_msg: string[] = [
    '<CYN>$N注视著$n的行动，企图寻找机会出手。\n</CYN>',
    '<CYN>$N正盯著$n的一举一动，随时准备发动攻势。\n</CYN>',
    '<CYN>$N缓缓地移动脚步，想要找出$n的破绽。\n</CYN>',
    '<CYN>$N目不转睛地盯著$n的动作，寻找进攻的最佳时机。\n</CYN>',
    '<CYN>$N慢慢地移动著脚步，伺机出手。\n</CYN>',
];

/** 战斗状态消息 */
const status_msg: string[] = [
    '($N<HIG>看起来充满活力，一点也不累。</HIG>)\n',
    '($N<HIG>似乎有些疲惫，但是仍然十分有活力。</HIG>)\n',
    '($N<HIY>看起来可能有些累了。</HIY>)\n',
    '($N<HIY>动作似乎开始有点不太灵光，但是仍然有条不紊。</HIY>)\n',
    '($N<HIY>气喘嘘嘘，看起来状况并不太好。</HIY>)\n',
    '($N<RED>似乎十分疲惫，看来需要好好休息了。</RED>)\n',
    '($N<RED>已经一副头重脚轻的模样，正在勉力支撑著不倒下去。</RED>)\n',
    '($N<RED>看起来已经力不从心了。</RED>)\n',
    '($N<HIR>摇头晃脑、歪歪斜斜地站都站不稳，眼看就要倒在地上。</HIR>)\n',
    '($N<HIR>已经陷入半昏迷状态，随时都可能摔倒晕去。</HIR>)\n',
];

/** 人物攻击部位定义 */
const CHARACTER_PARTS: AttackPart[] = [
    { name: '左脚', hert: 0.8, crit: 0 },
    { name: '右脚', hert: 0.8, crit: 0 },
    { name: '左腿', hert: 0.85, crit: 0 },
    { name: '右腿', hert: 0.85, crit: 0 },
    { name: '小腹', hert: 0.91, crit: 3 },
    { name: '胸前', hert: 0.95, crit: 4 },
    { name: '后背', hert: 0.97, crit: 4 },
    { name: '头部', hert: 1.2, crit: 10 },
    { name: '颈部', hert: 1.1, crit: 5 },
    { name: '后心', hert: 1, crit: 4 },
    { name: '左肩', hert: 0.85, crit: 1 },
    { name: '右肩', hert: 0.89, crit: 1 },
    { name: '左手', hert: 0.85, crit: 0 },
    { name: '左手', hert: 0.85, crit: 0 },
    { name: '腰间', hert: 0.99, crit: 5 },
];

/** 胜利消息 */
const WINNER_MSG: string[] = [
    '<CYN>$N哈哈大笑，愉快地说道：承让了！</CYN>',
    '<CYN>$N双手一拱，笑著说道：知道我的厉害了吧！</CYN>',
    '<CYN>$N哈哈大笑，双手一拱，笑著说道：承让！</CYN>',
    '<CYN>$N胜了这招，向后跃开三尺，笑道：承让！</CYN>',
    '<CYN>$n脸色微变，说道：佩服，佩服！</CYN>',
    '<CYN>$n向后退了几步，说道：这场比试算我输了，佩服，佩服！</CYN>',
    '<CYN>$n向后一纵，躬身做揖说道：阁下武艺不凡，果然高明！</CYN>',
];
