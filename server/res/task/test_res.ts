import { USERTASK } from "../../core/task/playertask.js";
import type { CHARACTER } from "../../core/char/character.js";

/**
 * TestResNode — 测试资源菜单的递归节点类型
 *
 * - 叶子节点: [物品路径, 数量]
 *   示例: ["cash/menpaiduihuan#2", 8] 表示"门派装备兑换券(蓝色)" x8
 *
 * - 分支节点: { [显示名称: string]: TestResNode }
 *   示例: { "高级门派兑换券": { ... } } 表示可展开的子菜单
 *
 * 判别方式:
 *   Array.isArray(value) === true  → 叶子节点，可领取
 *   typeof value === 'object'      → 分支节点，可继续展开
 */
type TestResNode = [string, number] | { [key: string]: TestResNode };

/**
 * 根节点固定为分支类型（顶层必然是菜单对象）
 */
type TestResRoot = { [key: string]: TestResNode };

const need_test_objs: TestResRoot = {
    门派装备道具测试: {
        "门派装备兑换券(蓝色)": ["cash/menpaiduihuan#2", 8],
        "门派装备兑换券(黄色)": ["cash/menpaiduihuan#3", 7],
        "高级门派兑换券": {
            "门派装备兑换券(紫色)": ["cash/menpaiduihuan#4", 6],
            "门派装备兑换券(橙色)": ["cash/menpaiduihuan#5", 8],
        },
    },
    随从礼包: ["sp/npc#follower/shuang", 10],
};

export default class extends USERTASK {
    id = "test_res";
    sort = 99;

    /**
     * 根据玩家 temp 中存储的路径逐层取出当前节点（始终返回分支节点）
     */
    private getNode(me: CHARACTER): TestResRoot {
        const path: string[] = me.query_temp("tr_path", []);
        let node: TestResNode = need_test_objs;
        for (const key of path) {
            if (this.isBranch(node)) {
                const next = node[key];
                if (next && this.isBranch(next)) {
                    node = next;
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        // 经过路径遍历后 node 必然是分支节点（非叶子），因为只沿分支键深入
        return node as TestResRoot;
    }

    /**
     * 获取当前光标索引，自动钳位到有效范围
     */
    private getCursor(me: CHARACTER): number {
        const node = this.getNode(me);
        const max = Object.keys(node).length;
        if (max === 0) return 0;
        const cur = me.query_temp("tr_cur", 0);
        return Math.min(cur, max - 1);
    }

    /** 类型守卫：叶子节点 */
    private isLeaf(value: TestResNode): value is [string, number] {
        return Array.isArray(value) && value.length >= 2;
    }

    /** 类型守卫：分支节点 */
    private isBranch(value: TestResNode): value is TestResRoot {
        return typeof value === "object" && !Array.isArray(value) && value !== null;
    }

    query_title(me: CHARACTER): string | undefined {
        const depth = (me.query_temp("tr_path", []) as string[]).length;
        if (depth > 0) {
            return `<hic>测试资源领取</hic> <mem>(第${depth + 1}层)</mem>`;
        }
        return `<hic>测试资源领取</hic>`;
    }

    query_desc(me: CHARACTER): string | undefined {
        const path: string[] = me.query_temp("tr_path", []);
        const node = this.getNode(me);
        const keys = Object.keys(node);

        if (keys.length === 0) {
            return "<red>当前菜单无可用项目。</red>";
        }

        const cur = this.getCursor(me);
        const lines: string[] = [];

        // 面包屑导航
        if (path.length > 0) {
            const breadcrumb = ["<mem>测试资源领取</mem>", ...path.map((k) => `<mem>${k}</mem>`)];
            lines.push(breadcrumb.join(" <mem>→</mem> "));
            lines.push("");
        }

        lines.push("<hic>请选择要领取的物品：</hic>");
        lines.push("");

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value: TestResNode = node[key];
            const marker = i === cur ? "<hiy>►</hiy>" : "  ";

            if (this.isLeaf(value)) {
                const [, count] = value;
                lines.push(`${marker} <wht>${key}</wht>  <hiy>x${count}</hiy>  <mem>(点击 fin2 直接领取)</mem>`);
            } else if (this.isBranch(value)) {
                const subCount = Object.keys(value).length;
                lines.push(`${marker} <hic>${key}</hic>  <mem>(包含${subCount}项，点击 fin2 展开)</mem>`);
            }
        }

        lines.push("");
        lines.push("<mem>────────────────────────────</mem>");
        lines.push(`<mem>光标位置：${cur + 1}/${keys.length}</mem>`);
        lines.push("<mem>点击【领取】切换光标 | 输入 task test_res fin2 确认选择</mem>");
        if (path.length > 0) {
            lines.push("<mem>输入 task test_res start 返回上一层</mem>");
        }
        lines.push("<mem>输入 task test_res giveup 回到主菜单</mem>");

        return lines.join("<br>");
    }

    query_state(_me: CHARACTER): number | undefined {
        return 2;
    }

    /**
     * 领取按钮行为：
     * - 无 par：切换光标到下一项（循环），每次点击移动光标
     * - par = 'ok'（fin2 命令）：确认选择当前光标所在项
     *   - 叶子节点 → 发放物品，重置到根菜单
     *   - 分支节点 → 进入子菜单，光标归零
     * - par 为其他字符串：按 key 名直接选择
     */
    on_finish(me: CHARACTER, par?: string): boolean {
        if (!par) {
            // 无参数：切换光标
            const node = this.getNode(me);
            const keys = Object.keys(node);
            if (keys.length === 0) {
                me.notify("<red>当前没有可领取的测试资源。</red>");
                return false;
            }
            const cur = this.getCursor(me);
            const next = (cur + 1) % keys.length;
            me.set_temp("tr_cur", next);
            return true;
        }

        if (par !== "ok") {
            return this.selectByKey(me, par);
        }

        return this.confirmCursor(me);
    }

    /**
     * 按 key 名直接选择（供命令或脚本调用）
     */
    private selectByKey(me: CHARACTER, key: string): boolean {
        const node = this.getNode(me);
        const value: TestResNode | undefined = node[key];

        if (value === undefined) {
            me.notify(`<red>没有找到【${key}】，请检查选项名称。</red>`);
            return false;
        }

        return this.applySelection(me, key, value);
    }

    /**
     * 确认当前光标所在项
     */
    private confirmCursor(me: CHARACTER): boolean {
        const node = this.getNode(me);
        const keys = Object.keys(node);
        if (keys.length === 0) {
            me.notify("<red>当前没有可领取的测试资源。</red>");
            return false;
        }
        const cur = this.getCursor(me);
        const key = keys[cur];
        const value: TestResNode = node[key];

        return this.applySelection(me, key, value);
    }

    /**
     * 执行选择逻辑
     * - 叶子节点：发放物品，重置到根菜单
     * - 分支节点：进入子菜单，光标归零
     */
    private applySelection(me: CHARACTER, key: string, value: TestResNode): boolean {
        if (this.isLeaf(value)) {
            const [objPath, count] = value;
            const path: string[] = me.query_temp("tr_path", []);

            const obj = me.add_obj(objPath, count);
            if (obj) {
                const fullPath = [...path, key].join(" → ");
                me.notify(`<hig>你领取了【${key}】：${obj.unit_name(count)}。</hig>`);
                me.notify(`<mem>路径：测试资源领取 → ${fullPath}</mem>`);
            } else {
                me.notify(`<red>物品【${objPath}】创建失败，请联系管理员。</red>`);
                return false;
            }

            me.set_temp("tr_path", []);
            me.set_temp("tr_cur", 0);
            return true;
        }

        if (this.isBranch(value)) {
            const path: string[] = me.query_temp("tr_path", []);
            path.push(key);
            me.set_temp("tr_path", path);
            me.set_temp("tr_cur", 0);
            me.notify(`<hic>进入【${key}】子菜单，共 ${Object.keys(value).length} 项可选。</hic>`);
            return true;
        }

        me.notify(`<red>未知的节点类型。</red>`);
        return false;
    }

    /**
     * 返回上一层菜单，已在根菜单时重置光标
     */
    start(me: CHARACTER): boolean | void {
        const path: string[] = me.query_temp("tr_path", []);
        if (path.length > 0) {
            path.pop();
            me.set_temp("tr_path", path);
            me.set_temp("tr_cur", 0);
            if (path.length === 0) {
                me.notify("<hic>已返回测试资源主菜单。</hic>");
            } else {
                me.notify("<hic>已返回上一层。</hic>");
            }
        } else {
            me.set_temp("tr_cur", 0);
            me.notify("<hic>测试资源领取菜单已刷新。</hic>");
        }
    }

    /**
     * 重置到根菜单
     */
    giveup(me: CHARACTER): void {
        me.set_temp("tr_path", []);
        me.set_temp("tr_cur", 0);
        me.notify("<hic>已返回测试资源主菜单。</hic>");
    }
}
