/**
 * 热补丁入口 — WORLD.USERLOGIN 登录模块方法
 * ============================================================
 * 此文件由 BASE.PRELOAD 动态加载，可在此覆盖 WORLD.USERLOGIN 上的方法。
 *
 * 用法示例:
 *
 *   const USERLOGIN = WORLD.USERLOGIN;
 *   USERLOGIN.check_user = function (loginuser, id) {
 *       // 新的用户校验逻辑...
 *       return true;
 *   };
 *
 *   USERLOGIN.check_session = async function (user, str) {
 *       // 新的会话校验逻辑...
 *   };
 *
 * 可覆盖的方法: check_user, check_session, wait_login, load_roles
 *
 * @see os/login.js
 */
