/**
 * 热补丁入口 — USER / FOLLOWER 原型方法
 * ============================================================
 * 此文件由 BASE.PRELOAD 动态加载，可在此覆盖 USER 或 FOLLOWER 原型方法。
 *
 * 用法示例:
 *
 *   USER.prototype.recount = function () {
 *       // 新的玩家属性计算逻辑...
 *   };
 *
 *   FOLLOWER.prototype.recount = function () {
 *       // 随从也可单独覆盖
 *   };
 *
 *   或直接复制USER的方法给FOLLOWER:
 *   FOLLOWER.prototype.remove_obj = USER.prototype.remove_obj;
 *
 * 可覆盖的方法(USER): recount, level_up, is_team, query_teamid,
 *   can_trans, enable_area, isenable_area, query_bool, set_bool,
 *   clear_bool, expend_jingli, create_for, query_age
 *
 * @see os/char/user.js
 * @see os/char/follower.js
 */
export default function() {}
