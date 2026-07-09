import { COMMAND } from "../../../core/command.js";
import { WORLD } from "../../../core/world.js";

/** 邮件过期时间：30 天（与 MESSAGE.save / getUserMessages 保持一致） */
const MAIL_EXPIRE = 24 * 3600000 * 30;

/**
 * checkorg — 系统定时清理命令
 *
 * 每天凌晨 5 点由 msg 任务调用：
 * - cmd_clearmail: 清理超过 30 天的过期邮件
 * - cmd_clearstore: 清理超过 30 天的物品回购/找回记录
 */
export default class extends COMMAND {
  command = "checkorg";

  /**
   * 清理过期邮件
   *
   * 与 WORLD.MESSAGE 的 save / getUserMessages / getMessageFromID
   * 保持同一过期策略：超过 30 天的消息视为过期，予以删除。
   * 对于仍有未领取附件的过期消息同样清理（save 时也会丢弃它们）。
   */
  cmd_clearmail() {
    const now = Date.now();
    const stores = WORLD.MESSAGE.stores;

    for (const [uid, userStore] of stores) {
      for (const [fromId, msgStore] of userStore) {
        // 过滤掉过期消息（超过 30 天）
        msgStore.items = msgStore.items.filter(
          (item) => now - item.time < MAIL_EXPIRE,
        );

        // 该发送者的消息全部过期则删除这个发送者条目
        if (msgStore.items.length === 0) {
          userStore.delete(fromId);
        }
      }

      // 该用户的所有消息都已清空则删除用户条目
      if (userStore.size === 0) {
        stores.delete(uid);
      }
    }
  }

  /**
   * 清理过期物品回购记录
   *
   * WORLD.RECOVER_OBJS 存储玩家丢弃/出售/分解/购买的可恢复记录，
   * 目前只有 50 条/人的数量上限，没有时间过期。此处按与邮件一致的
   * 30 天阈值清理过期记录，防止长期运行后内存膨胀。
   */
  cmd_clearstore() {
    const now = Date.now();
    const recovers = WORLD.RECOVER_OBJS;

    for (const [playerId, entries] of recovers) {
      // 过滤掉超过 30 天的记录
      const remaining = entries.filter(
        (entry) => now - entry.time < MAIL_EXPIRE,
      );

      if (remaining.length === 0) {
        recovers.delete(playerId);
      } else if (remaining.length !== entries.length) {
        recovers.set(playerId, remaining);
      }
    }
  }
}
