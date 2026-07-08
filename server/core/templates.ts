/**
 * 模板字符串注册表 — 服务端/客户端共享的字符串驻留系统
 *
 * 模板 ID 单调递增，永不回收，保证热更新兼容。
 * 打包阶段扫描 send_room/send_combat 的字面量参数，
 * 调用 register() 分配 ID，生成映射表随前端资源一起下发。
 */

interface TemplateEntry {
    text: string;
    /** 是否包含 $ 占位符（$N $n $P $p $l $W $i $T） */
    has_placeholder: boolean;
}

const _templates: Map<string, number> = new Map();
const _entries: TemplateEntry[] = [];

/** 注册模板字符串，返回 ID（已存在则返回旧 ID） */
export function register(text: string): number {
    let id = _templates.get(text);
    if (id !== undefined) return id;
    id = _entries.length;
    _templates.set(text, id);
    _entries.push({
        text,
        has_placeholder: text.includes('$'),
    });
    return id;
}

/** 批量注册并返回 ID 数组 */
export function registerAll(strings: readonly string[]): number[] {
    return strings.map(register);
}

/** 通过 ID 获取模板文本 */
export function get(id: number): string | undefined {
    return _entries[id]?.text;
}

/** 模板是否包含 $ 占位符 */
export function hasPlaceholder(id: number): boolean {
    return _entries[id]?.has_placeholder ?? false;
}

/** 模板总数 */
export function count(): number {
    return _entries.length;
}

/** 导出映射表（用于发送给客户端） */
export function exportTable(): Record<number, string> {
    const out: Record<number, string> = {};
    for (let i = 0; i < _entries.length; i++) {
        out[i] = _entries[i].text;
    }
    return out;
}
