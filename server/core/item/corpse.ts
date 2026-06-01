/**
 * CORPSE 尸体类 — 继承自CONTAINER
 */
import type { OBJ } from './obj.js';
import { CONTAINER } from './container.js';
import type { ItemDescJson } from './container.js';
import type { CHARACTER } from '../char/character.js';
import type { USER } from '../char/user.js';

export class CORPSE extends CONTAINER {

    constructor() {
        super();
    }

    // ============ 核心属性 ============

    /** 单位名称 */
    unit: string = "具";
    /** 物品数量 */
    count: number = 1;
    /** 是否不参与队伍分配（个人拾取） */
    no_alloc: boolean = false;
    /** 死者名称 */
    owner_name: string | null = null;
    /** 来源角色 ID（由 init 设置） */
    fromid?: string;

    /** BOSS任务：伤害查询回调（由资源文件动态设置） */
    query_damage?: () => string;

    /**
     * 禁止直接拾取尸体
     * @param player - 玩家对象
     */
    on_get(player: USER): boolean {
        return false;
    }

    /**
     * 从死亡角色初始化尸体
     * @param player - 死亡的角色
     * @param iskeep - 是否持久保留（副本掉落）
     */
    init(player: CHARACTER, iskeep?: boolean): void {
        this.create_id();
        this.fromid = player.id;
        this.name = player.name + "的尸体";
        this.color_name = "<wht>" + this.name + "</wht>";
        this.environment = player.environment;
        this.desc = "然而" + player.call3() + "已经死了，只剩下一具尸体静静地躺在这里。";
        this.items = player.query_drop() ?? null;
        if (!iskeep) this.call_out(this.disappear, 60000);
    }

    /**
     * 临时禁止拾取列表（队伍分配时动态设置）
     */
    no_drops: string[] | null = null;

    /**
     * 物品拾取权限检查回调（队伍分配时动态设置）
     */
    on_getitem: ((player: USER, item: OBJ) => boolean) | null = null;

    /**
     * 查询尸体内容物（考虑队伍分配限制）
     * @param player - 玩家对象
     */
    query_items(player: USER): OBJ[] | undefined {
        const env = this.environment;
        if (env && env.is_fb && env.is_fb() && player.team) {
            if (!this.no_drops) {
                this.no_drops = [];
                const team: any[] = player.team;
                for (let i = 0; i < team.length; i++) {
                    if (!env.query_temp(team[i].id, undefined, player)) {
                        this.no_drops!.push(team[i].id);
                    }
                }
                this.on_getitem = this.check_get.bind(this);
            }
        }
        return (this.items ?? undefined) as OBJ[] | undefined;
    }

    /**
     * 清空尸体物品
     * @param me - 角色对象
     * @param noget - 需保留的物品（未被拾取的）
     */
    clear_items(me: CHARACTER, noget?: OBJ[]): void {
        if (this.items) this.items.length = 0;
        if (noget && noget.length) this.items = noget;
    }

    /**
     * 检查玩家是否可以拾取某件物品
     * @param player - 玩家对象
     * @param item - 物品对象
     */
    check_get(player: USER, item: OBJ): boolean {
        if (!this.no_drops) return true;
        if (this.no_drops.indexOf(player.id) === -1) return true;
        player.notify('你不可以拾取' + item.color_name + "。");
        return false;
    }

    /**
     * 尸体消失处理
     */
    disappear(): void {
        if (this.items) this.items.length = 0;
        const env = this.environment;
        if (env) {
            env.notify("一阵风吹去，" + this.name + "已经不见了。");
            env.item_changed(this, false);
        }
    }

    /**
     * 查询描述 JSON（支持 no_alloc 控制全部拾取按钮）
     * @param me - 玩家对象
     */
    query_desc(me: USER): string {
        if (this.json) return this.json;
        const obj: ItemDescJson = {
            type: "item",
            desc: this.get_desc(me),
            id: this.id,
            commands: [],
        };
        obj.commands.push({
            cmd: "get all from " + this.id,
            name: "全部拾取"
        });
        if (this.no_alloc) {
            return JSON.stringify(obj);
        }
        this.json = JSON.stringify(obj);
        return this.json;
    }
}
