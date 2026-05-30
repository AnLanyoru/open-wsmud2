/**
 * CORPSE 尸体类 - 继承自CONTAINER
 */
import { OBJ } from "./obj.js";
import { CONTAINER } from "./container.js";

export class CORPSE extends CONTAINER {

    /** 构造CORPSE实例 */
    constructor() {
        super();
    }

    // ============ 核心属性 ============

    /** @type {string} 单位 */
    unit = "具";
    /** @type {number} 物品数量 */
    count = 1;
    /** @type {boolean} 是否不分配(副本内) */
    no_alloc = false;
    /** @type {string|null} 死者名称 */
    owner_name = null;

    /**
     * 禁止直接拾取尸体本身
     * @param {USER} player
     * @returns {boolean} false
     */
    on_get(player) {
        return false;
    }

    /**
     * 初始化尸体
     * @param {CHARACTER} player - 死亡的角色
     * @param {boolean} [iskeep] - 是否保留(副本内)
     */
    init(player, iskeep) {
        this.create_id();
        this.fromid = player.id;
        this.name = player.name + "的尸体";
        this.color_name = "<wht>" + this.name + "</wht>";
        this.environment = player.environment;
        this.desc = "然而" + player.call3() + "已经死了，只剩下一具尸体静静地躺在这里。";
        this.items = player.query_drop();
        if (!iskeep) this.call_out(this.disappear, 60000);

    }

    /**
     * 查询尸体内容物(考虑队伍拾取限制)
     * @param {USER} player
     * @returns {OBJ[]}
     */
    query_items(player) {
        if (this.environment.is_fb() && player.team) {
            if (!this.no_drops) {
                this.no_drops = [];
                for (let i = 0; i < player.team.length; i++) {
                    if (!this.environment.query_temp(player.team[i].id, undefined, player)) {
                        this.no_drops.push(player.team[i].id);
                    }
                }
                this.on_getitem = this.check_get;
            }
        }
        // @ts-ignore
        return this.items;
    }

    /**
     * 清空尸体物品
     * @param {CHARACTER} me
     * @param {OBJ[]} [noget] - 不能拾取的物品
     */
    clear_items(me, noget) {
        this.items.length = 0;
        if (noget && noget.length) this.items = noget;
    }

    /**
     * 检查拾取权限
     * @param {USER} player
     * @param {OBJ} item
     * @returns {boolean}
     */
    check_get(player, item) {
        if (!this.no_drops) return true;
        if (this.no_drops.indexOf(player.id) == -1) return true;
        player.notify('你不可以拾取' + item.color_name + "。");
        return false;
    }

    /**
     * 尸体消失
     * @returns {void}
     */
    disappear() {
        if (this.items) this.items.length = 0;
        if (this.environment) {
            this.environment.notify("一阵风吹去，" + this.name + "已经不见了。");
            this.environment.item_changed(this, false);
        }
    }

    /**
     * 查询描述JSON
     * @param {USER} me
     * @returns {string} JSON
     */
    query_desc(me) {
        if (this.json) return this.json;
        const obj = {};
        obj.type = "item";
        obj.desc = this.get_desc(me);
        obj.id = this.id;
        obj.commands = [];
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
