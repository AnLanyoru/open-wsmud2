/**
 * 热补丁入口 — WORLD 顶层方法
 * ============================================================
 * 此文件由 BASE.PRELOAD 动态加载，可在此覆盖 WORLD 对象上的顶层方法。
 *
 * 用法示例:
 *
 *   WORLD.on_startup = function () {
 *       // 新的启动逻辑...
 *   };
 *
 *   WORLD.check_connect = function (socket) {
 *       // 新的连接校验逻辑...
 *       return true;
 *   };
 *
 *   WORLD.close = async function () {
 *       // 新的关闭逻辑...
 *   };
 *
 * 可覆盖的方法: on_startup, on_user_quit, on_user_save,
 *   on_heart_beat, check_connect, close
 *
 * @see os/world.js
 */
export default function() {}
