/**
 * 热补丁入口 — PERFORM 绝招方法
 * ============================================================
 * 此文件由 BASE.PRELOAD 动态加载，可在此覆盖 PERFORM 原型方法。
 *
 * 用法示例:
 *
 *   PERFORM.prototype.query_releasetime = function (me, lv) {
 *       // 新的出招时间计算逻辑...
 *   };
 *
 * 可覆盖的方法: query_releasetime, query_distime, query_mp
 *
 * @see os/skill/skill.js (PERFORM class)
 */
