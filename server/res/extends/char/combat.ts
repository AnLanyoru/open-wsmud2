/**
 * 热补丁入口 — CHARACTER 战斗方法
 * ============================================================
 * 此文件由 BASE.PRELOAD 动态加载，可在此覆盖 CHARACTER 原型方法实现热修复。
 *
 * 用法示例:
 *
 *   // 1. 临时覆盖(服务重启后失效)
 *   CHARACTER.prototype.recount = function () {
 *       // 新的计算逻辑...
 *   };
 *
 *   // 2. 运行时热更(替换此文件内容后执行命令)
 *   //    BASE.PRELOAD 重新 import 此文件即生效
 *
 *   // 3. 无需重启的临时修复(超时自动恢复)
 *   //    在游戏命令中调用:
 *   //    someCharacter.add_event("recount", function () {
 *   //        // 临时逻辑...
 *   //    }, 600000);  // 10分钟后恢复原方法
 *
 * 可覆盖的方法: recount, crit, do_attack, from_attack, do_recover,
 *   damage, damage2, damage3, auto_attack, use_pfm, 等
 *
 * @see os/char/character.js
 */
