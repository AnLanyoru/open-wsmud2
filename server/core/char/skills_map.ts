// ============================================================
// SkillsMap - 技能数据字典（基于 Map）
// ============================================================

import type { SkillData } from './character.js';

/**
 * 技能映射表，继承自 Map<string, SkillData>。
 *
 * - 提供 `toJSON()` 使 JSON.stringify 自动序列化为普通对象
 * - 提供 `SkillsMap.from()` 工厂方法从普通对象构造
 */
export class SkillsMap extends Map<string, SkillData> {
    /**
     * JSON.stringify 会自动调用此方法，将 Map 序列化为普通对象。
     */
    toJSON(): Record<string, SkillData> {
        return Object.fromEntries(this);
    }

    /**
     * 从 JSON 解析产生的普通对象（或已有 Map）构造 SkillsMap。
     */
    static from(obj: Record<string, SkillData> | SkillsMap | null | undefined): SkillsMap {
        if (obj instanceof SkillsMap) return new SkillsMap(obj);
        if (!obj) return new SkillsMap();
        return new SkillsMap(Object.entries(obj));
    }
}
