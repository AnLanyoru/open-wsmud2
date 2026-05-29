/**
 * 热补丁入口 — FAMILY 门派方法
 * ============================================================
 * 此文件由 BASE.PRELOAD 动态加载，可在此覆盖 FAMILY 原型方法或静态方法。
 *
 * 用法示例:
 *
 *   // 实例方法
 *   FAMILY.prototype.init = function () {
 *       // 新的门派初始化逻辑...
 *   };
 *
 *   // 静态方法
 *   FAMILY.UPDATE_NPC = function (path) {
 *       // 新的NPC更新逻辑...
 *   };
 *
 * 可覆盖的实例方法: init, update_npc, on_famnpc_relive, on_npc_die,
 *   check_battle, begin_attack, create_event, get_room, create_guards,
 *   remove_npcs, create_npc, create_npcs, battle_over, clear_room,
 *   finish_event, add_battle_status, on_login, set_dadizi,
 *   init_dadizi, send_channel, query_task_title, query_job_title
 *
 * 可覆盖的静态方法: UPDATE_NPC, SAVE, LOAD
 *
 * @see os/skill/family.js
 */
export default function() {}
