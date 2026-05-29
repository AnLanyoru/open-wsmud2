/**
 * 热补丁入口 — 通用热更新空白文件
 * ============================================================
 * 此文件由 BASE.PRELOAD 动态加载，可在此处编写任意临时补丁代码。
 *
 * 用法示例:
 *
 *   // 覆盖任意原型方法
 *   CHARACTER.prototype.send_message = function (msg) {
 *       // 新的消息发送逻辑...
 *   };
 *
 *   // 修改 WORLD 属性
 *   WORLD.max_user_count = 100;
 *
 *   // 覆盖任意模块方法
 *   const MESSAGE = WORLD.MESSAGE;
 *   MESSAGE.save = function () { /* ... * / };
 *
 * 适合放一些不方便归类的零散修补。
 */
export default function() {}
