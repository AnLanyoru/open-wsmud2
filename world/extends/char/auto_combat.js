/**
 * 热补丁入口 — CHARACTER 自动战斗/绝招方法
 * ============================================================
 * 此文件由 BASE.PRELOAD 动态加载，可在此覆盖 CHARACTER 原型方法。
 *
 * 用法示例:
 *
 *   CHARACTER.prototype.check_pfms = function (target) {
 *       // 新的绝招释放逻辑...
 *   };
 *
 *   CHARACTER.prototype.init_pfms = function () {
 *       // 新的绝招初始化逻辑...
 *   };
 *
 * 可覆盖的方法: reauto_attack, auto_attack, use_pfm, check_pfms,
 *   init_pfms, add_auto_pfm, set_releasetime
 *
 * @see os/char/character.js
 */
export default function() {}
