// ============================================================
// WORLD 单例类型定义
// ============================================================

import type { USER } from '../core/char/user.js';
import type { CHARACTER } from '../core/char/character.js';
import type { CORPSE } from '../core/item/corpse.js';
import type { ROOM } from '../core/room/room.js';
import type { AREA } from '../core/room/area.js';
import type { COMMAND } from '../core/command.js';
import type { SKILL } from '../core/skill/skill.js';
import type { FAMILY } from '../core/skill/family.js';
import type { TASK } from '../core/task/task.js';
import type { USERTASK } from '../core/task/playertask.js';
import type { OBJ } from '../core/item/obj.js';
import type { EQUIPMENT } from '../core/item/equipment.js';
import type { NPC } from '../core/char/npc.js';
import type { Timestamp, UID } from './base.js';

/** 运行时路径配置 */
export interface PathConfig {
  BASE: string;
  WORLD: string;
  COMMAND: string;
  SKILL: string;
  MAP: string;
  NPC: string;
  OBJ: string;
  TASK: string;
  AREA: string;
  FAMILY: string;
  EXTENDS: string;
  DATA: string;
  DEF_DATA: string;
  BASE_DATA: string;
  [key: string]: string;
}

/** 服务器配置 */
export interface ServerConfig {
  ip: string;
  port: number;
  id: number;
  name: string;
  istest: boolean;
  isdef: boolean;
}

/** 全局配置 */
export interface AppConfig {
  DB: any;
  init(): Promise<void>;
  WEB_PORT: number;
  CONNECT_LEVEL: number;
  MD5: string;
  SESSION_SECRET: string;
  HEARTBEAT: number;
  DESIV: Buffer | null;
  def_server: ServerConfig;
  [key: string]: any;
}

/** 消息条目 */
export interface MessageEntry {
  content: string;
  time: number;
  attach?: { name: string; obj: string; count: number }[];
  rec?: boolean;
  index?: number;
}

/** 消息存储条目 */
export interface MessageStoreEntry {
  name: string;
  items: MessageEntry[];
}

/** 统计排行条目 */
export interface StatsTopEntry {
  userid?: UID;
  name?: string;
  title?: string;
  path?: string;
  str?: number;
  con?: number;
  dex?: number;
  int?: number;
  gender?: number;
  max_mp?: number;
  exp?: number;
  pot?: number;
  kar?: number;
  per?: number;
  hp?: number;
  max_hp?: number;
  mp?: number;
  age?: number;
  score?: number;
  skills?: Record<string, number>;
  equipment?: EQUIPMENT[];
  temp?: Record<string, unknown>;
  /** 显示名称（由 extends 注入的 CHARACTER.long_name） */
  long_name?(): string;
  /** 外观描述（由 extends 注入的 CHARACTER.query_desc） */
  query_desc?(me: CHARACTER, cmd?: string): string;
}

/** 武器排行条目 */
export interface WeaponRankEntry {
  id: UID;
  user: UID;
  score: number;
  name: string;
  desc: string;
  wname: string;
}

/** 分数排行条目 */
export interface ScoreRankEntry {
  id: UID;
  score: number;
  name: string;
}

/** 接收请求日志 */
export interface ReceivedLog {
  time: Timestamp;
  cmd: string;
  user: UID;
}

/** 日志条目 */
export interface LogEntry {
  time: Timestamp;
  cmd: string;
  user: string;
  msg: string;
}

/** Socket 接口 (最小化) */
export interface GameSocket {
  user?: USER | null;
  oserver?: any;
  end(data?: string): void;
  send?(data: string): void;
  destroy(): void;
  destroyed?: boolean;
  setTimeout(ms: number): void;
  remoteAddress?: string;
  [key: string]: any;
}

/** WORLD 的 MESSAGE 子系统 */
export interface MessageSystem {
  stores: Map<UID, Map<UID, MessageStoreEntry>>;
  NOTICES: MessageEntry[];
  pushUserMessage(toid: UID, from: { id: UID; name: string }, msg: MessageEntry): void;
  getUserMessages(me: CHARACTER): { id: UID; name: string; content: string; time: number }[];
  getMessageFromID(me: CHARACTER, from: UID, count?: number): MessageEntry[];
  getMessageByIndex(me: CHARACTER, from: UID, index: number): MessageEntry | undefined;
  save(): string;
  saveNotice(): string;
  load(data: { notices?: MessageEntry[]; messages?: any[] }): void;
}

/** WORLD 的 STATS 子系统 */
export interface StatsSystem {
  TOPS: StatsTopEntry[];
  EXP: StatsTopEntry[];
  SCORE: ScoreRankEntry[];
  WEAPON: WeaponRankEntry[];
  EQ_STATS: WeaponRankEntry[][];
  SC_STATS: Record<string, ScoreRankEntry[]>;
  [key: string]: StatsTopEntry[] | ScoreRankEntry[] | WeaponRankEntry[] | WeaponRankEntry[][] | Record<string, ScoreRankEntry[]> | ((...args: unknown[]) => unknown) | undefined;
  load_tops(tops?: StatsTopEntry[], defname?: string, key?: string): StatsTopEntry[];
  loadTopUser(data: any, npc: NPC): void;
  checkStats(player: USER): void;
  saveTops(tops: StatsTopEntry[]): string;
  saveWeapon(): string;
  saveScore(): string;

  updateEqitem(me: USER, wea: EQUIPMENT, ary: WeaponRankEntry[]): WeaponRankEntry | undefined;
  updateWeapon(me: USER, wea: EQUIPMENT): void;
  updateScoreItem(me: USER, ary: ScoreRankEntry[]): void;
  updateScore(me: USER): void;
}

/** WORLD 主接口 */
export interface IWorld {
  // 核心状态
  USERS: USER[];
  COMMANDS: Record<string, COMMAND>;
  SKILLS: Record<string, SKILL>;
  ROOMS: Record<string, ROOM>;
  RUN_ROOMS: ROOM[];
  DEFAULT_SKILLS: Record<string, SKILL>;
  AREAS: AREA[];
  TASKS: USERTASK[];
  SYSTEMTASKS: TASK[];
  USER_EVENTS: any[];
  OBJ_STROE: Map<string, OBJ>;
  NPC_STROE: Map<string, NPC>;
  HEARTBEATCOUNT: number;

  // 服务器状态
  RECEIVED: ReceivedLog[];
  LOGS: LogEntry[];
  SERVERID: number;
  SERVERS: ServerConfig[];
  CONNECT_COUNT: number;
  max_connect_count: number;
  max_user_count: number;
  SocketCount: number;

  // 子系统
  DATA: any;
  USERLOGIN: any;
  DB: any;
  LISTENER: any;
  MESSAGE: MessageSystem;
  STATS: StatsSystem;

  // 配置
  status: number;
  heart_beat_service: ReturnType<typeof setInterval> | null;
  heartbeat_interval: number;
  SERVER: ServerConfig | null;
  DEFAULT_COMMAND: COMMAND | null;

  // 方法
  SocketIn(): void;
  connect(socket: GameSocket): void;
  check_connect(socket: GameSocket): boolean;
  before_login(user: USER): boolean;
  disconnect(socket: GameSocket): void;
  request(request: string, socket: GameSocket): void;
  saveRequest(): void;
  startup(sid?: number): Promise<void>;
  sendAll(msg: string): void;
  getUser(id: UID | number): USER | undefined;
  find_user(name: string): USER | undefined;
  on_user_login(user: USER): void;
  on_user_cross_login(user: any, data?: any): void;
  on_user_relogin(user: USER): void;
  heart_beat(): void;
  login_out(user: USER): void;
  send(text: string): void;
  log(user: USER | null, cmd: string, msg: string): void;
  saveLog(): void;
  is_server(user: USER): boolean;
  save(): Promise<boolean>;
  writeHeapSnapshot(): void;
  loadLocalData(): void;
  on_cross_response(id: UID, sid: string): void;
  can_cross(id: UID): boolean;
  on_user_die(me: CHARACTER, killer: CHARACTER, corpse: CORPSE): void;
  on_resource_loaded(): void;
  on_startup(): void;
  on_user_quit(user: USER): void;
  on_user_save(user: USER): void;
  on_heart_beat(now: number): void;
  on_cross_chat?(msg: any): void;
  close(): Promise<boolean>;
}
