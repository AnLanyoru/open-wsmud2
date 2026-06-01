/**
 * 热补丁入口 — WORLD.DATA 全局数据方法
 * ============================================================
 * 此文件由 BASE.PRELOAD 动态加载，可在此覆盖 WORLD.DATA 上的方法。
 *
 * 用法示例:
 *
 *   const DATA = WORLD.DATA;
 *   DATA.on_load = function (data) {
 *       // 新的数据加载逻辑...
 *   };
 *
 *   DATA.on_save = function (str) {
 *       // 新的数据保存逻辑...
 *   };
 *
 * 可覆盖的属性/方法: exps, stone_values, book_values, get_exp,
 *   on_load, on_save, create_def_tops, create_def_eqs,
 *   create_def_scs, PROPS, reset_famtops
 *
 * @see os/data.js
 */
