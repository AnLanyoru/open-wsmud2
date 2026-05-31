// ============================================================
// 数据持久化模块 - 数据库操作 / 文件备份
// ============================================================

import type { ServerConfig } from '../types/world.js';

import fs_sync from 'fs';
import { WORLD } from './world.js';

const fs = fs_sync.promises;

/** 数据库接口（由启动脚本注入到 __CONFIG.DB） */
interface DBInterface {
  close(): Promise<void>;
  getRoles(userid: number, server: number): Promise<RoleData[]>;
  addRole(role: RoleData): Promise<RoleData>;
  deleteRole(userid: number, roleid: string): Promise<void>;
  saveRole(role: RoleData): Promise<void>;
  getUserByID(id: string): any;
  getData(userid: number, id: string): any;
  updateRoleName(id: string, userid: number, name: string): any;
  updateUserid(id: string, fromuserid: number, touserid: number): any;
  getServers(): ServerConfig[];
}

/** 数据库实例（由启动脚本注入到 __CONFIG.DB） */
const DB: DBInterface = __CONFIG.DB;

/** 角色存档数据 */
interface RoleData {
  /** 角色唯一 ID */
  id: string;
  /** 角色名称 */
  name: string;
  /** 所属用户 ID */
  userid: number;
  /** 角色称号 */
  title: string;
  /** 角色等级 */
  level: number;
  /** 序列化后的角色完整数据 */
  data: string;
}

/** 请求日志条目 */
interface RequestLog {
  /** 请求时间戳 */
  time: number;
  /** 用户标识 */
  user: string;
  /** 执行的命令 */
  cmd: string;
}

/** 错误日志条目 */
interface ErrorLog {
  /** 错误发生时间戳 */
  time: number;
  /** 用户标识 */
  user: string;
  /** 执行的命令 */
  cmd: string;
  /** 错误消息 */
  msg: string;
}

export default {
  /** 关闭数据库连接 */
  close(): Promise<void> {
    return DB.close();
  },

  /**
   * 获取用户的所有角色
   * @param userid - 用户 ID
   * @param server - 服务器 ID
   */
  getRoles(userid: number, server: number): Promise<RoleData[]> {
    return DB.getRoles(userid, server);
  },

  /**
   * 创建新角色
   * @param role - 角色数据
   */
  async addRole(role: RoleData): Promise<RoleData> {
    return await DB.addRole(role);
  },

  /**
   * 删除角色
   * @param userid - 用户 ID
   * @param roleid - 角色 ID
   */
  deleteRole(userid: number, roleid: string): Promise<void> {
    return DB.deleteRole(userid, roleid);
  },

  /**
   * 保存角色数据
   * @param role - 角色数据
   */
  saveRole(role: RoleData): Promise<void> {
    return DB.saveRole(role);
  },

  /**
   * 批量保存角色并写入本地备份文件
   * @param roles - 角色数据列表
   */
  async saveRoles(roles: RoleData[]): Promise<void> {
    const dt = new Date();
    const path = __PATH.DATA + "bak/data" + dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + "-" + dt.getHours() + ".js";
    const stream = fs_sync.createWriteStream(path, { flags: 'a' });
    try {
      stream.write('[');
      for (let role of roles) {
        await DB.saveRole(role);
        this.localBak(stream, role);
      }
      stream.write('0]');
    } catch (error) {
      console.error('备份数据失败：', error);
    } finally {
      stream.end();
    }
  },

  /**
   * 将单个角色数据写入备份流
   * @param stream - 写入流
   * @param role - 角色数据
   */
  localBak(stream: fs_sync.WriteStream, role: RoleData): void {
    stream.write('{id:"');
    stream.write(role.id);
    stream.write('",name:"');
    stream.write(role.name);
    stream.write('",userid:');
    stream.write(role.userid.toString());
    stream.write(',title:"');
    stream.write(role.title);
    stream.write('",level:');
    stream.write(role.level.toString());
    stream.write(',data:');
    stream.write(role.data);
    stream.write('},');
  },

  /**
   * 保存请求日志到文件
   * @param recs - 请求日志列表
   */
  saveRequest(recs: RequestLog[]): Promise<void> {
    const dt = new Date();
    const f = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    const path = __PATH.DATA + "req/request" + f + ".txt";
    const ary: (string | number)[] = [];
    for (let i = 0; i < recs.length; i++) {
      const r = recs[i]!;
      ary.push(r.time);
      ary.push(" ");
      ary.push(r.user);
      ary.push(" ");
      ary.push(r.cmd);
      ary.push("\r\n");
    }
    return fs.appendFile(path, ary.join(""));
  },

  /**
   * 保存错误日志到文件
   * @param logs - 错误日志列表
   */
  saveLogs(logs: ErrorLog[]): Promise<void> {
    const dt = new Date();
    const f = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    const path = __PATH.DATA + "log/log" + f + ".txt";
    const ary: (string | number)[] = [];
    for (let i = 0; i < logs.length; i++) {
      const r = logs[i]!;
      ary.push(r.time);
      ary.push(" ");
      ary.push(r.user);
      ary.push(" ");
      ary.push(r.cmd);
      ary.push(" ");
      ary.push(r.msg);
      ary.push("\r\n");
    }
    return fs.appendFile(path, ary.join(""));
  },

  /**
   * 保存全局数据到文件（带本地备份）
   * @param content - 序列化后的 JSON 字符串
   */
  async saveData(content: string): Promise<void> {
    const path = __PATH.DATA + "data.js";
    const dt = new Date();
    const f = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    const tempDir = __PATH.DATA + "temp/";
    if (!await this.check_file(tempDir)) {
      await fs.mkdir(tempDir);
    }
    const _dst = tempDir + "temp" + f + ".js";
    if (await this.check_file(path)) {
      await fs.copyFile(path, _dst);
    }
    return fs.writeFile(path, content);
  },

  /**
   * 从文件读取全局数据
   */
  async readData(): Promise<any> {
    const path = __PATH.DATA + "data.js";
    try {
      const data = await fs.readFile(path);
      return JSON.toObject(data.toString());
    } catch (error) {
      console.error('数据读取失败', path, error);
    }
  },

  /**
   * 根据 ID 获取用户
   * @param id - 用户 ID
   */
  getUserByID(id: string): any {
    return DB.getUserByID(id);
  },

  /**
   * 获取角色存档数据
   * @param userid - 用户 ID
   * @param id - 角色 ID
   */
  getRoleData(userid: number, id: string): any {
    return DB.getData(userid, id);
  },

  /**
   * 修改角色名
   * @param id - 角色 ID
   * @param userid - 用户 ID
   * @param name - 新名称
   */
  change_name(id: string, userid: number, name: string): any {
    return DB.updateRoleName(id, userid, name);
  },

  /**
   * 迁移角色到另一个用户
   * @param id - 角色 ID
   * @param fromuserid - 原用户 ID
   * @param touserid - 目标用户 ID
   */
  change_userid(id: string, fromuserid: number, touserid: number): any {
    return DB.updateUserid(id, fromuserid, touserid);
  },

  /**
   * 检查文件或目录是否存在
   * @param path - 路径
   */
  async check_file(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * 初始化数据目录结构 — 创建服务器数据目录及 bak/log/req/temp 子目录，
   * 并从模板目录复制默认数据文件
   */
  async initDataDir(): Promise<void> {
    __PATH.BASE_DATA = __PATH.DATA;
    __PATH.DATA = __PATH.DATA + WORLD.SERVERID + "/";

    if (!await this.check_file(__PATH.DATA)) {
      console.log('创建备份文件夹....');
      await fs.mkdir(__PATH.DATA);
    }
    for (const sub of ['bak', 'log', 'req', 'temp']) {
      const dir = __PATH.DATA + sub;
      if (!await this.check_file(dir)) {
        await fs.mkdir(dir);
      }
    }
    const paths = await fs.readdir(__PATH.DEF_DATA);
    for (let i = 0; i < paths.length; i++) {
      const _src = __PATH.DEF_DATA + paths[i];
      const _dst = __PATH.DATA + paths[i];
      if (!await this.check_file(_dst)) {
        const stat = await fs.stat(_src);
        if (stat.isFile()) {
          await fs.copyFile(_src, _dst);
          console.log('创建备份文件 ', _dst, "....");
        } else {
          await fs.mkdir(_dst);
          console.log('创建备份文件夹 ', _dst, "....");
        }
      }
    }
  },

  /**
   * 获取服务器列表
   */
  getServers(): ServerConfig[] {
    return DB.getServers();
  },
};
