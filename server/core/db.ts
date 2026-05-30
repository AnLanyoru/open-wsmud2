// ============================================================
// 数据持久化模块 - 数据库操作 / 文件备份
// ============================================================

import fs_sync from 'fs';
import { WORLD } from './world.js';

const fs = fs_sync.promises;

const DB: any = (globalThis as any).__CONFIG.DB;

interface RoleData {
  id: string;
  name: string;
  userid: number;
  title: string;
  level: number;
  data: string;
}

interface RequestLog {
  time: number;
  user: string;
  cmd: string;
}

interface ErrorLog {
  time: number;
  user: string;
  cmd: string;
  msg: string;
}

export default {
  close(): Promise<void> {
    return DB.close();
  },

  getRoles(userid: number, server: number): Promise<any[]> {
    return DB.getRoles(userid, server);
  },

  async addRole(role: any): Promise<any> {
    return await DB.addRole(role);
  },

  deleteRole(userid: number, roleid: string): Promise<any> {
    return DB.deleteRole(userid, roleid);
  },

  saveRole(role: any): Promise<any> {
    return DB.saveRole(role);
  },

  async saveRoles(roles: RoleData[]): Promise<void> {
    const dt = new Date();
    const path = (globalThis as any).__PATH.DATA + "bak/data" + dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + "-" + dt.getHours() + ".js";
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

  saveRequest(recs: RequestLog[]): Promise<void> {
    const dt = new Date();
    const f = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    const path = (globalThis as any).__PATH.DATA + "req/request" + f + ".txt";
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

  saveLogs(logs: ErrorLog[]): Promise<void> {
    const dt = new Date();
    const f = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    const path = (globalThis as any).__PATH.DATA + "log/log" + f + ".txt";
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

  async saveData(content: string): Promise<void> {
    const path = (globalThis as any).__PATH.DATA + "data.js";
    const dt = new Date();
    const f = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    const tempDir = (globalThis as any).__PATH.DATA + "temp/";
    if (!await this.check_file(tempDir)) {
      await fs.mkdir(tempDir);
    }
    const _dst = tempDir + "temp" + f + ".js";
    if (await this.check_file(path)) {
      await fs.copyFile(path, _dst);
    }
    return fs.writeFile(path, content);
  },

  async readData(): Promise<any> {
    const path = (globalThis as any).__PATH.DATA + "data.js";
    try {
      const data = await fs.readFile(path);
      return (JSON as any).toObject(data);
    } catch (error) {
      console.error('数据读取失败', path, error);
    }
  },

  getUserByID(id: string): any {
    return DB.getUserByID(id);
  },

  getRoleData(userid: number, id: string): any {
    return DB.getData(userid, id);
  },

  change_name(id: string, userid: number, name: string): any {
    return DB.updateRoleName(id, userid, name);
  },

  change_userid(id: string, fromuserid: number, touserid: number): any {
    return DB.updateUserid(id, fromuserid, touserid);
  },

  async check_file(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch (error) {
      return false;
    }
  },

  async initDataDir(): Promise<void> {
    (globalThis as any).__PATH.BASE_DATA = (globalThis as any).__PATH.DATA;
    (globalThis as any).__PATH.DATA = (globalThis as any).__PATH.DATA + WORLD.SERVERID + "/";

    if (!await this.check_file((globalThis as any).__PATH.DATA)) {
      console.log('创建备份文件夹....');
      await fs.mkdir((globalThis as any).__PATH.DATA);
    }
    for (const sub of ['bak', 'log', 'req', 'temp']) {
      const dir = (globalThis as any).__PATH.DATA + sub;
      if (!await this.check_file(dir)) {
        await fs.mkdir(dir);
      }
    }
    const paths = await fs.readdir((globalThis as any).__PATH.DEF_DATA);
    for (let i = 0; i < paths.length; i++) {
      const _src = (globalThis as any).__PATH.DEF_DATA + paths[i];
      const _dst = (globalThis as any).__PATH.DATA + paths[i];
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

  getServers(): any {
    return DB.getServers();
  },
};
