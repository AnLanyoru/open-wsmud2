/**
 * 热补丁入口 — WORLD.MESSAGE 消息系统方法
 * ============================================================
 * 此文件由 BASE.PRELOAD 动态加载，可在此覆盖 WORLD.MESSAGE 上的方法。
 *
 * 用法示例:
 *
 *   const MESSAGE = WORLD.MESSAGE;
 *   MESSAGE.pushUserMessage = function (toid, from, msg) {
 *       // 新的消息推送逻辑...
 *   };
 *
 *   MESSAGE.save = function () {
 *       // 新的消息序列化逻辑...
 *   };
 *
 * 可覆盖的方法: pushUserMessage, getUserMessages, getMessageFromID,
 *   getMessageByIndex, save, saveNotice, load
 *
 * @see os/world.js (MESSAGE object)
 */
export default function() {}
