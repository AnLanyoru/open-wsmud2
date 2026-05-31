/**
 * 登录/会话解密模块
 */

import crypto from 'crypto';
import type { WsSocket } from './net-ws.js';
import { WORLD } from './world.js';

// Global __CONFIG is set by the bootstrap script
declare var __CONFIG: {
  DESIV: Buffer;
  [key: string]: any;
};

/** 登录用户对象（由数据库查询返回） */
export interface LoginUser {
  [key: string]: any;
}

/** 最小化用户参数类型（用于各方法签名） */
interface LoginUserParam {
  userid?: number;
  send(msg: string): void;
  socket?: { end(): void; remoteAddress?: string } | null;
  user_level?: number;
  wait_input: ((...args: any[]) => void) | null;
  password?: string;
  loginTime?: number;
  ip_address?: string;
  serverid?: number;
}

/** 解密后的会话数据 */
export interface DecryptedSession {
  /** 用户 ID */
  id: number;
  /** 用户名 */
  name: string;
  /** 密码 */
  pwd: string;
  /** 登录时间戳 */
  loginTime: number;
  /** 用户权限等级 */
  level: number;
}

/** 用户登录模块接口 */
export interface UserLoginModule {
  /** 同 ID 最大同时连接数 */
  max_idcount: number;
  /** 同 IP 最大同时连接数 */
  max_ipcount: number;

  /** 登录错误处理，@param user 用户对象，@param msg 错误消息，@param close 是否关闭连接 */
  login_error(user: LoginUserParam, msg: string, close?: boolean): false;
  /** 解密用户会话信息，@param key 加密密钥，@param session Base64 加密数据 */
  encryptUser(key: string, session: string): DecryptedSession | null;
  /** 检查用户合法性，@param loginuser 登录用户对象，@param id 用户 ID */
  check_user(loginuser: LoginUser, id: number): boolean;
  /** 检查用户会话有效性，@param user 用户对象，@param str 会话字符串 */
  check_session(user: LoginUserParam, str: string): Promise<false | undefined>;
  /** 等待用户登录选择，@param user 用户对象，@param str 命令字符串 */
  wait_login(user: LoginUserParam, str: string): void;
  /** 加载用户角色列表，@param user 用户对象 */
  load_roles(user: LoginUserParam): Promise<void>;
}

const USERLOGIN: UserLoginModule = {
  /** 同 ID 最大同时连接数 */
  max_idcount: 10,
  /** 同 IP 最大同时连接数 */
  max_ipcount: 12,

  /**
   * 登录错误处理
   * @param user - 用户对象
   * @param msg - 错误消息
   * @param close - 是否关闭连接 (默认 true)
   * @returns false
   */
  login_error(user: LoginUserParam, msg: string, close: boolean = true): false {
    user.send(`{type:'loginerror',msg:'${msg}'}`);
    if (close) {
      user.socket?.end();
    }
    return false;
  },

  /**
   * 解密用户会话信息
   * @param key - 加密密钥 (截取前 16 位)
   * @param session - Base64 编码的加密会话数据
   * @returns 解密后的会话数据，失败返回 null
   */
  encryptUser(key: string, session: string): DecryptedSession | null {
    if (!key || !session) return null;
    if (key.length >= 16) key = key.substr(0, 16);
    try {
      const keyBuf = Buffer.from(key, 'utf8');
      const decipher = crypto.createDecipheriv('aes-128-cbc', keyBuf, __CONFIG.DESIV);
      let txt = decipher.update(session, 'base64', 'utf8');
      txt += decipher.final('utf8');
      const str = txt.split('%');
      if (str.length !== 5) return null;
      const id = parseInt(str[0]);
      if (id > 0) {
        return {
          id: id,
          name: str[1],
          pwd: str[2],
          loginTime: parseInt(str[3]),
          level: parseInt(str[4]),
        };
      }
    } catch (e) {
      return null;
    }
    return null;
  },

  // ============ 登录扩展 (由 extends 合并) ============

  /** @param loginuser @param id @returns boolean */
  check_user(loginuser: LoginUser, id: number): boolean {
    return true;
  },

  /**
   * 检查用户会话
   * @param user - 用户对象
   * @param str - 会话字符串
   */
  async check_session(user: LoginUserParam, str: string): Promise<false | undefined> {
    if (user.userid) {
      return this.login_error(user, '参数错误');
    }
    const parts = str.split(' ');

    if (parts.length < 2) {
      return this.login_error(user, '参数错误');
    }

    const cookieUser = this.encryptUser(parts[0], parts[1]);
    if (!cookieUser || cookieUser.id === 0) {
      return this.login_error(
        user,
        `登录参数错误，请使用账号密码<CMD onclick=\\'hide2show("#login_panel")\\'>重新登录</CMD>`
      );
    }

    try {
      const dbUser = await WORLD.DB.getUserByID(cookieUser.id);
      if (!dbUser || dbUser.pwd !== cookieUser.pwd) {
        return this.login_error(
          user,
          `密码已修改，请<CMD onclick=\\'hide2show("#login_panel")\\'>重新登录</CMD>`,
          true
        );
      }
    } catch (e) {
      return this.login_error(user, '登录验证失败，请稍后再试。');
    }

    user.user_level = cookieUser.level ?? 0;

    user.wait_input = null;
    user.userid = cookieUser.id;
    user.password = cookieUser.pwd;
    user.loginTime = cookieUser.loginTime;
    user.ip_address = user.socket?.remoteAddress ?? '';

    if (cookieUser.id !== WORLD.admin_user) {
      if (WORLD.CONNECT_COUNT > WORLD.max_connect_count) {
        return this.login_error(user, '服务器人数过多，请稍后再试。');
      }
      if (parts.length === 2 && WORLD.USERS.length > WORLD.max_user_count) {
        return this.login_error(user, '服务器人数过多，请稍后再试。');
      }
      if (!WORLD.before_login(user)) {
        return this.login_error(user, '服务器正在关闭或开启，请稍后再试。');
      }
    }

    if (str.length === 4) {
      if (parseInt(parts[3]) !== WORLD.SERVERID) {
        return this.login_error(user, '参数错误。');
      }
      const data = (WORLD as { can_cross(id: string): boolean }).can_cross(parts[2]);
      if (!data) {
        return this.login_error(user, '不允许登录');
      }
      WORLD.on_user_cross_login(user, data);
      return;
    } else {
      user.serverid = WORLD.SERVERID;
    }

    if (parts[2]) {
      this.wait_login(user, 'login ' + parts[2]);
      return;
    }
    await this.load_roles(user);
    user.wait_input = this.wait_login;
  },

  /**
   * 等待用户登录选择
   * @param user - 用户对象
   * @param str - 命令字符串
   */
  wait_login(user: LoginUserParam, str: string): void {
    if (!str) return;
    const i = str.indexOf(' ');
    let cmd = str;
    let pars = '';
    if (i > 0) {
      cmd = str.substr(0, i);
      pars = str.substr(i + 1);
    }
    const command = WORLD.COMMANDS[cmd];
    if (command && (command as { allow_login?: boolean }).allow_login) {
      (WORLD.COMMANDS[cmd] as { enter(u: LoginUserParam, p: string): void }).enter(user, pars);
    }
  },

  /**
   * 加载用户角色列表
   * @param user - 用户对象
   */
  async load_roles(user: LoginUserParam): Promise<void> {
    try {
      const roles = await WORLD.DB.getRoles(user.userid, user.serverid);

      if (!roles || !roles.length) {
        user.send("{type:'roles',roles:[]}");
      } else {
        const str: string[] = ["{type:'roles',roles:["];
        for (let i = 0; i < roles.length; i++) {
          str.push("{name:'");
          str.push(roles[i].name);
          str.push("',title:'");
          str.push(roles[i].title);
          str.push("',id:'");
          str.push(roles[i].id);
          str.push("'}");
          if (i !== roles.length - 1) str.push(',');
        }
        str.push(']}');
        user.send(str.join(''));
      }
    } catch (error: unknown) {
      console.error(user.userid, '角色读取 ', error);
      WORLD.log(null, '登陆失败：' + user.userid, (error as Error).message);
      this.login_error(user, '数据读取失败');
    }
  },
};

export default USERLOGIN;
