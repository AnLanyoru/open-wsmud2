/**
 * WORLD 全局对象 - 游戏世界核心管理
 *
 * 全局依赖:
 *   __CONFIG     — 由启动脚本注入的全局配置
 *   __PATH       — 由启动脚本注入的路径配置
 *   Array.remove — 由 util.js 注入到 Array.prototype
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { pathToFileURL } from 'url';
import fs from 'fs';

// Original JS framework modules (loaded at compile time via allowJs or declaration files)
import './util.js';
import { UTIL } from './util.js';
import { BASE } from './base.js';
import db from './db.js';
import { FAMILIES } from './skill/family.js';
import WORLD_DATA from './data.js';

// New TS modules (this batch)
import USERLOGIN_MODULE from './login.js';
import LISTENER_MODULE from './ws.js';

// Type-only imports from our type definitions
// NOTE: IWorld and related types transitively import USER, CHARACTER, etc. from other agents' files.
// Once all core/ type files exist, this import resolves fully.
import type {
  IWorld,
  MessageSystem,
  StatsSystem,
  GameSocket,
  ReceivedLog,
  LogEntry,
  MessageEntry,
  MessageStoreEntry,
  ServerConfig,
} from '../types/world.js';
import type { UID } from '../types/base.js';

// ============================================================
// 全局类型声明
// ============================================================


// ============================================================
// 常量
// ============================================================

const COPY_PROPS = [
  'str', 'con', 'dex', 'int', 'gender', 'max_mp', 'exp', 'pot',
  'kar', 'per', 'hp', 'max_hp', 'mp', 'age', 'score',
] as const;

// ============================================================
// World 类
// ============================================================

class World implements IWorld {
  // ========== 核心状态 ==========
  USERS: any[] = [];
  COMMANDS: Record<string, any> = {};
  SKILLS: Record<string, any> = {};
  ROOMS: Record<string, any> = {};
  RUN_ROOMS: any[] = [];
  DEFAULT_SKILLS: Record<string, any> = {};
  AREAS: any[] = [];
  TASKS: any[] = [];
  SYSTEMTASKS: any[] = [];
  USER_EVENTS: any[] = [];
  OBJ_STROE: Map<string, any> = new Map();
  NPC_STROE: Map<string, any> = new Map();
  HEARTBEATCOUNT: number = 0;

  // ========== 服务器状态 ==========
  RECEIVED: ReceivedLog[] = [];
  LOGS: LogEntry[] = [];
  SERVERID: number = 0;
  SERVERS: any[] = [];
  CONNECT_COUNT: number = 0;
  SocketCount: number = 0;
  max_connect_count: number = 1100;
  max_user_count: number = 5100;

  // ========== 子系统 ==========
  DATA: any = WORLD_DATA;
  USERLOGIN: any = USERLOGIN_MODULE;
  DB: any = db;
  LISTENER: any = LISTENER_MODULE;

  MESSAGE: MessageSystem = {
    stores: new Map<UID, Map<UID, MessageStoreEntry>>(),
    NOTICES: [] as MessageEntry[],

    pushUserMessage(toid: UID, from: any, msg: any): void {
      let user = this.stores.get(toid);
      if (!user) {
        user = new Map<UID, MessageStoreEntry>();
        this.stores.set(toid, user);
      }
      let store = user.get(from.id);
      if (!store) {
        store = { name: from.name, items: [] as any[] };
        user.set(from.id, store);
      }
      msg.index = store.items.length;
      store.items.push(msg);
    },

    getUserMessages(me: any): any[] {
      const store = this.stores.get(me.id);
      const newMessages: any[] = [];
      if (this.NOTICES.length) {
        const nt = this.NOTICES[this.NOTICES.length - 1];
        newMessages.push({
          id: 'notice',
          content: nt.content.length > 50 ? nt.content.substring(0, 50) : nt.content,
          time: nt.time,
          name: '公告',
        });
      }
      if (store) {
        const diff_time = 24 * 3600000 * 30;
        const now = Date.now();
        store.forEach((x: any, y: string) => {
          const last = x.items[x.items.length - 1];
          if (last) {
            if (now - last.time < diff_time) {
              newMessages.push({
                id: y,
                name: x.name,
                content: last.content,
                time: last.time,
              });
            }
          }
        });
      }
      return newMessages;
    },

    getMessageFromID(me: any, from: string, count?: number): any[] {
      let items: any[] = [];
      if (from !== 'notice') {
        const store = this.stores.get(me.id);
        if (!store) return [];
        const list = store.get(from);
        if (!list) return items;
        items = list.items;
      } else {
        items = this.NOTICES;
      }
      count = count || 0;
      const ary: any[] = [];
      const diff_time = 24 * 3600000 * 30;
      const now = Date.now();
      for (let i = 0; i < 13; i++) {
        const index = items.length - count - i - 1;
        if (index < 0) break;
        if (now - items[index].time < diff_time) ary.push(items[index]);
      }
      return ary;
    },

    getMessageByIndex(me: any, from: string, index: number): any | undefined {
      const store = this.stores.get(me.id);
      if (!store) return undefined;
      const list = store.get(from);
      return list?.items[index];
    },

    save(): string {
      const str: string[] = ['['];
      const now = Date.now();
      const diff_time = 24 * 3600000 * 30;
      this.stores.forEach((x: any, uid: string) => {
        if (str.length > 1) str.push(',');
        str.push('{id:"');
        str.push(uid);
        str.push('",items:[');
        let isReceive = false;
        x.forEach((st: any, from: string) => {
          if (isReceive) str.push(',');
          str.push('{uid:"');
          str.push(from);
          str.push('",name:"');
          str.push(st.name);
          str.push('",items:[');
          let ishasmsg = false;
          for (let i = 0; i < st.items.length; i++) {
            const item = st.items[i];
            if (now - item.time < diff_time) {
              if (ishasmsg) str.push(',');
              str.push('{time:');
              str.push(item.time);
              str.push(',content:');
              str.push(JSON.stringify(item.content));
              if (item.attach) {
                str.push(',attach:[');
                for (let j = 0; j < item.attach.length; j++) {
                  str.push('{name:"');
                  str.push(item.attach[j].name);
                  str.push('",obj:"');
                  str.push(item.attach[j].obj);
                  str.push('",count:');
                  str.push(item.attach[j].count || 1);
                  str.push('}');
                  if (j !== item.attach.length - 1) str.push(',');
                }
                str.push(']');
                if (item.rec) {
                  str.push(',rec:true');
                }
              }
              str.push('}');
              ishasmsg = true;
            }
          }
          str.push(']}');
          isReceive = true;
        });
        str.push(']}');
      });
      str.push(']');
      return str.join('');
    },

    saveNotice(): string {
      if (this.NOTICES.length > 500) this.NOTICES.splice(0, this.NOTICES.length - 500);
      return JSON.stringify(this.NOTICES);
    },

    load(data: any): void {
      this.NOTICES = data.notices ?? [];
      const sts = data.messages ?? [];
      if (!sts) return;
      for (let i = 0; i < sts.length; i++) {
        const st = sts[i];
        const user = new Map<UID, MessageStoreEntry>();
        for (let j = 0; j < st.items.length; j++) {
          const ust = st.items[j];
          const obj: MessageStoreEntry = {
            name: ust.name,
            items: [],
          };
          for (let k = 0; k < ust.items.length; k++) {
            const msg = ust.items[k];
            (obj.items as any[]).push({
              content: msg.content,
              time: msg.time,
              rec: msg.rec,
              attach: msg.attach,
              index: obj.items.length,
            });
          }
          user.set(ust.uid, obj);
        }
        this.stores.set(st.id, user);
      }
      console.log('消息数据已加载');
    },
  };

  STATS: StatsSystem = {
    TOPS: [],
    EXP: [],
    SCORE: [],
    WEAPON: [],
    EQ_STATS: [],
    SC_STATS: {} as Record<string, any[]>,

    // load_tops / loadTopUser 实现在 world/extends/stats.js 中覆盖
    load_tops(tops: any[], defname: string, key: string): any[] {
      return [];
    },
    loadTopUser(data: any, npc: any): void {
      // stub — overridden by extends
    },

    checkStats(player: any): void {
      this.updateScore(player);
      WORLD.COMMANDS.biwu.checkStats(player);
    },

    saveTops(tops: any[]): string {
      const str: string[] = ['['];
      for (let i = 0; i < tops.length; i++) {
        const top = tops[i];
        if (top.userid) {
          str.push('{userid:"');
          str.push(top.userid);
          str.push('",name:"');
          str.push(top.name);
          str.push('",title:"');
          str.push(top.title);
          str.push('"');
          for (let j = 0; j < COPY_PROPS.length; j++) {
            str.push(',');
            str.push(COPY_PROPS[j]);
            str.push(':');
            str.push(top[COPY_PROPS[j]]);
          }
          if (top.skills) {
            str.push(',skills:');
            str.push(JSON.stringify(top.skills));
          }
          if (top.equipment) {
            str.push(',eq:[');
            for (let j = 0; j < top.equipment.length; j++) {
              if (j > 0) str.push(',');
              if (top.equipment[j]) top.equipment[j].save_db(str);
              else str.push('null');
            }
            str.push(']');
          }
          if (top.temp) {
            str.push(',temp:', JSON.stringify(top.temp));
          }
          str.push('}');
        } else {
          str.push('{ path: "pub/gaoshou1"}');
        }
        if (i !== tops.length - 1) str.push(',');
      }
      str.push(']');
      return str.join('');
    },

    saveWeapon(): string {
      return JSON.stringify(this.WEAPON);
    },

    saveScore(): string {
      return JSON.stringify(this.SCORE);
    },

    updateEqitem(me: any, wea: any, ary: any[]): any | undefined {
      const score = wea.query_score();
      if (!score) return undefined;
      let cur_index = -1;
      let new_index = -1;
      for (let i = ary.length - 1; i >= 0; i--) {
        const item = ary[i];
        if (item.user === me.id) {
          if (wea.id === item.id || score > item.score) {
            cur_index = i;
          } else {
            return undefined;
          }
        }
        if (score > item.score) {
          new_index = i;
        }
      }
      if (cur_index === -1 && new_index === -1) return undefined;

      if (cur_index === -1) {
        const item = {
          id: wea.id,
          user: me.id,
          score: score,
          name: me.name,
          desc: wea.get_desc(me),
          wname: wea.color_name,
        };
        ary.splice(new_index, 0, item);
        if (ary.length > 15) ary.length = 15;
        return item;
      }

      const item = ary[cur_index];
      item.wname = wea.color_name;
      item.desc = wea.get_desc(me);
      item.id = wea.id;
      item.user = me.id;
      item.name = me.name;
      item.score = score;
      if (cur_index === new_index || new_index - cur_index === 1) {
        return item;
      }
      if (new_index === -1) {
        ary.splice(cur_index, 1);
        ary.push(item);
      } else if (cur_index > new_index) {
        ary.splice(cur_index, 1);
        ary.splice(new_index, 0, item);
      } else {
        ary.splice(new_index, 0, item);
        ary.splice(cur_index, 1);
      }
      return undefined;
    },

    updateWeapon(me: any, wea: any): void {
      if (!WORLD.is_server(me)) return;
      const eqs = this.EQ_STATS[wea.eq_type];
      if (eqs) {
        this.updateEqitem(me, wea, eqs);
      }
    },

    updateScoreItem(me: any, ary: any[]): void {
      const score = me.score;
      let cur_index = -1;
      let new_index = -1;
      for (let i = ary.length - 1; i >= 0; i--) {
        const item = ary[i];
        if (item.id === me.id) {
          cur_index = i;
        }
        if (score > item.score) {
          new_index = i;
        }
      }
      if (cur_index === -1 && new_index === -1) return;

      if (cur_index === -1) {
        const item = { id: me.id, score: score, name: me.color_name || me.name };
        ary.splice(new_index, 0, item);
        if (ary.length > 30) ary.length = 30;
        return;
      }

      const item = ary[cur_index];
      item.score = score;
      item.name = me.color_name || me.name;
      if (cur_index === new_index || new_index - cur_index === 1) {
        return;
      }

      if (new_index === -1) {
        ary.splice(cur_index, 1);
        ary.push(item);
      } else if (cur_index > new_index) {
        ary.splice(cur_index, 1);
        ary.splice(new_index, 0, item);
      } else {
        ary.splice(new_index, 0, item);
        ary.splice(cur_index, 1);
      }
    },

    updateScore(me: any): void {
      if (!WORLD.is_server(me)) return;
      const ary = this.SCORE;
      this.updateScoreItem(me, ary);
      const fam = this.SC_STATS[me.family?.id];
      if (!fam) return;
      this.updateScoreItem(me, fam);
    },
  };

  // ========== 配置 ==========
  status: number = -1;
  heart_beat_service: ReturnType<typeof setInterval> | null = null;
  heartbeat_interval: number = 1000;
  SERVER: ServerConfig | null = null;
  DEFAULT_COMMAND: any = null;

  // ========== 扩展属性 (由 world/extends/world.js 注入) ==========
  [key: string]: any;

  // ================================================================
  // 方法
  // ================================================================

  /** 新 socket 接入计数 */
  SocketIn(): void {
    this.SocketCount++;
  }

  /**
   * 处理客户端连接
   * 实现在 world/extends/world.js 中覆盖 (避免 world.js ↔ user.js 循环依赖)
   */
  connect(socket: any): void {
    socket.end();
  }

  /**
   * 检查连接是否允许
   */
  check_connect(socket: any): boolean {
    return true;
  }

  /**
   * 登录前检查
   */
  before_login(user: any): boolean {
    if (this.status < 0) return false;
    if (this.status === 0) return true;
    return this.status <= user.user_level;
  }

  /**
   * 断开连接
   */
  disconnect(socket: any): void {
    if (socket.user) {
      socket.user.socket = null;
      socket.user.disconnect();
    }
    this.SocketCount--;
    if (socket.oserver) {
      socket.oserver.disconnect();
      socket.oserver = null;
    }
  }

  /**
   * 处理客户端请求
   */
  request(request: string, socket: any): void {
    if (!request) return;
    const user = socket.user;
    if (!user) return;
    if (user.request_count > 20) {
      return user.send('不要急，慢慢来。');
    }
    user.request_count = user.request_count + 1;
    const time = Date.now();
    try {
      user.command(request);
    } catch (e: any) {
      console.log(user.name, '命令错误：', request, e.message, e.stack);
      this.log(user, request, e.message + e.stack);
    }
    this.RECEIVED.push({
      time: time,
      cmd: request + ' ' + (Date.now() - time).toString(),
      user: user.id,
    });
    if (this.RECEIVED.length > 1000) {
      this.saveRequest();
    }
  }

  /** 保存请求日志 */
  saveRequest(): void {
    db.saveRequest(this.RECEIVED);
    this.RECEIVED.length = 0;
  }

  /**
   * 启动服务器
   * @param sid - 可选服务器 ID
   */
  async startup(sid?: number): Promise<void> {
    if (sid) {
      sid = parseInt(sid as any);
      this.SERVERS = await db.getServers();
      this.SERVER = this.getServer(sid);
    } else {
      this.SERVER = __CONFIG.def_server;
    }

    if (!this.SERVER) throw new Error('服务器设置错误，无法启动');
    this.SERVERID = this.SERVER.id;

    await db.initDataDir();
    await loadResource();
    await this.DATA.load();
    await this.LISTENER.start(this.SERVER.port);
    console.log('服务', this.SERVER.name, '(' + this.SERVERID + ')启动');
    console.log('ws://' + this.SERVER.ip + ':' + this.SERVER.port);
    this.heartbeat_interval = __CONFIG.HEARTBEAT;
    this.heart_beat_service = setInterval(this.heart_beat.bind(this), this.heartbeat_interval);

    this.status = __CONFIG.CONNECT_LEVEL ?? 0;
    this.on_startup();
    if (this.status > 0) {
      console.log('当前允许级别' + this.status + '账号登陆');
    }
  }

  /**
   * 向所有在线用户发送消息
   */
  sendAll(msg: string): void {
    for (let i = 0; i < this.USERS.length; i++) {
      this.USERS[i].send(msg);
    }
  }

  /**
   * 根据 ID 获取用户
   */
  getUser(id: string | number): any | undefined {
    if (!id) return undefined;
    for (let i = 0; i < this.USERS.length; i++) {
      if (this.USERS[i].id == id) return this.USERS[i];
    }
    return undefined;
  }

  /**
   * 根据名字查找用户
   */
  find_user(name: string): any | undefined {
    if (!name) return undefined;
    for (let i = 0; i < this.USERS.length; i++) {
      if (this.USERS[i].name == name) return this.USERS[i];
    }
    return undefined;
  }

  /**
   * 用户登录事件回调 (由 extends 覆盖)
   */
  on_user_login(user: any): void {
    // stub — overridden by extends
  }

  /**
   * 跨服登录事件回调 (由 extends 覆盖)
   */
  on_user_cross_login(user: any): void {
    // stub — overridden by extends
  }

  /**
   * 用户重连事件回调 (由 extends 覆盖)
   */
  on_user_relogin(user: any): void {
    // stub — overridden by extends
  }

  /** 服务器主心跳 */
  heart_beat(): void {
    let avtived_obj: any = null;
    try {
      const dt = Date.now();
      this.CONNECT_COUNT = 0;
      for (let i = 0; i < this.USERS.length; i++) {
        avtived_obj = this.USERS[i];
        if (avtived_obj.socket) this.CONNECT_COUNT++;
        avtived_obj.heart_beat(dt);
      }
      this.on_heart_beat(dt);
      for (let i = 0; i < this.RUN_ROOMS.length; i++) {
        avtived_obj = this.RUN_ROOMS[i];
        avtived_obj.heart_beat(dt);
      }
      this.HEARTBEATCOUNT++;
      if (this.HEARTBEATCOUNT > 720) {
        this.HEARTBEATCOUNT = 0;
        this.save();
        console.log('数据已备份%d', Date.now() - dt);
      }
    } catch (e: any) {
      console.log(
        avtived_obj ? avtived_obj.path ?? avtived_obj.name : '',
        '心跳错误:',
        e,
        e.stack
      );
      this.log(null, e.message, e.stack);
    }
  }

  /**
   * 用户登出处理
   */
  login_out(user: any): void {
    this.on_user_quit(user);
    if (user.serverid === this.SERVERID) {
      user.save();
    }
    this.USERS.remove(user);

    if (user.socket) {
      try {
        user.socket.end();
        user.socket.destroy();
      } catch (e: any) {
        console.log(e.message, e.stack);
      }
    }
  }

  /**
   * 向所有用户广播消息
   */
  send(text: string): void {
    for (let i = 0; i < this.USERS.length; i++) {
      this.USERS[i].send(text);
    }
  }

  /**
   * 记录日志
   * @param user - 用户对象或 null
   */
  log(user: any | null, cmd: string, msg: string): void {
    this.LOGS.push({
      time: Date.now(),
      cmd: cmd,
      user: user ? user.name : '',
      msg: msg,
    });
    if (this.LOGS.length > 500) {
      db.saveLogs(this.LOGS);
      this.LOGS.length = 0;
    }
  }

  /** 保存日志到文件 */
  saveLog(): void {
    db.saveLogs(this.LOGS);
    this.LOGS.length = 0;
  }

  /**
   * 判断用户是否在当前服务器
   */
  is_server(user: any): boolean {
    return user.serverid === this.SERVERID;
  }

  /**
   * 保存所有数据
   */
  async save(): Promise<boolean> {
    const roles: any[] = [];
    for (let i = 0; i < this.USERS.length; i++) {
      if (this.USERS[i].serverid !== this.SERVERID) continue;
      roles.push(this.USERS[i].getData());
    }
    try {
      console.time('saved');
      await db.saveRoles(roles);
      console.log('玩家数据已保存');
      await this.DATA.save();
      console.log('全局数据已经保存');
      await this.saveLog();
      await this.saveRequest();
      console.log('日志数据已经保存');
      console.timeEnd('saved');
      return true;
    } catch (error: any) {
      console.error('玩家数据保存失败', error.message);
      return false;
    }
  }

  /** 生成堆内存快照 */
  writeHeapSnapshot(): void {
    const v8 = UTIL.require('v8');
    const dt = new Date();
    const fname =
      __PATH.DATA +
      '/' +
      dt.getFullYear() +
      '_' +
      dt.getMonth() +
      '_' +
      dt.getDate() +
      '_' +
      dt.getHours() +
      '_' +
      dt.getMinutes() +
      '.heapsnapshot';
    v8.writeHeapSnapshot(fname);
    console.log('快照保存到', fname);
  }

  /** 加载本地未保存的用户数据 (由 extends 覆盖) */
  loadLocalData(): void {
    // stub — overridden by extends
  }

  /**
   * 跨服响应回调 (由 extends 覆盖)
   */
  on_cross_response(id: string, sid: string): void {
    // 允许跨服
  }

  /**
   * 是否允许跨服 (由 extends 覆盖)
   */
  can_cross(id: string): boolean {
    // 允许跨服
    return true;
  }

  /**
   * 用户死亡事件回调 (由 extends 覆盖)
   */
  on_user_die(me: any, killer: any, corpse: any): void {
    // stub — overridden by extends
  }

  /** 资源加载完成回调 (由 extends 覆盖) */
  on_resource_loaded(): void {
    // stub — overridden by extends
  }

  // ============ WORLD 方法 (由 extends 合并) ============

  /** 服务启动回调 */
  on_startup(): void {
    for (const fam in FAMILIES) {
      FAMILIES[fam].init();
    }
    this.COMMANDS.jh.init();
  }

  /** 玩家退出时调用 */
  on_user_quit(user: any): void {
    if (this.is_server(user)) {
      if (user.query_temp('pt')) {
        this.COMMANDS['party'].on_user_login(user, false);
      }
      this.on_user_save(user);
    } else {
      if (user.query_temp('cross_type') === 'duizhan') {
        this.PUB_USERS?.push(user);
        user.disconnect_time = 0;
      }
    }
  }

  /** 玩家退出或关闭时保存 */
  on_user_save(user: any): void {
    // stub — overridden by extends
  }

  /** 心跳回调 (由 extends 覆盖) */
  on_heart_beat(now: number): void {
    // stub — overridden by extends
  }

  /**
   * 根据服务器 ID 获取服务器配置
   */
  getServer(sid: number): any {
    for (let i = 0; i < this.SERVERS.length; i++) {
      if (this.SERVERS[i].id === sid) return this.SERVERS[i];
    }
    return null;
  }

  /**
   * 优雅关闭
   */
  async close(): Promise<boolean> {
    this.status = 5;
    console.log('正在尝试关闭数据连接');
    for (const user of this.USERS) {
      if (user.socket) user.socket.end();
    }
    console.log('关闭网络连接');
    if (this.heart_beat_service) {
      clearInterval(this.heart_beat_service);
    }
    if (await this.save()) {
      console.log('关闭数据连接');
      return true;
    }
    return false;
  }
}

// ============================================================
// 资源加载
// ============================================================

/**
 * 递归加载资源文件
 * 两阶段: PRELOAD (async 动态导入) → CREATE (同步从缓存实例化)
 */
async function loadResource(): Promise<void> {
  async function preloadDir(basePath: string, dirPath?: string): Promise<number> {
    dirPath = dirPath || basePath;
    const files = fs.readdirSync(dirPath);
    let count = 0;
    for (let i = 0; i < files.length; i++) {
      const sub_path = dirPath + files[i];
      const stat = fs.statSync(sub_path);
      if (stat.isDirectory()) {
        count += await preloadDir(basePath, sub_path + '/');
      } else if (files[i].endsWith('.js')) {
        const fname = sub_path.replace(basePath, '').replace('.js', '');
        const fkey = basePath + fname;
        await BASE.PRELOAD(fkey, sub_path);
        count++;
      }
    }
    return count;
  }

  function readdir(basePath: string, path?: string): number {
    path = path || basePath;
    const files = fs.readdirSync(path);
    let count = 0;
    for (let i = 0; i < files.length; i++) {
      const sub_path = path + files[i];
      const stat = fs.statSync(sub_path);
      if (stat.isDirectory()) {
        count += readdir(basePath, sub_path + '/');
      } else {
        const fname = sub_path.replace(basePath, '').replace('.js', '');
        BASE.CREATE(basePath, fname);
        count++;
      }
    }
    return count;
  }

  const dirs = [
    __PATH.EXTENDS, __PATH.COMMAND, __PATH.FAMILY,
    __PATH.OBJ, __PATH.AREA, __PATH.SKILL,
    __PATH.MAP, __PATH.TASK, __PATH.NPC,
  ];

  try {
    // Phase 1: preload all modules
    let preloadSum = 0;
    for (const dir of dirs) {
      const count = await preloadDir(dir);
      console.log('preload %s %d', dir, count);
      preloadSum += count;
    }
    console.log('模块预加载%d', preloadSum);

    // Phase 2: create instances (sync from cache)
    let sum = 0;
    for (const dir of dirs) {
      const count = readdir(dir);
      console.log('%s %d', dir, count);
      sum += count;
    }
    console.log('资源脚本加载%d', sum);
    WORLD.on_resource_loaded();
  } catch (e: any) {
    console.log('error: ', e, e.stack);
  }
}

// ============================================================
// 导出单例
// ============================================================

const WORLD = new World();
export { WORLD };
