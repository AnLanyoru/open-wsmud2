/**
 * CORPSE 尸体类 — 继承自CONTAINER
 */
import { OBJ } from './obj.js';
import { CONTAINER } from './container.js';
import type { CHARACTER } from '../char/character.js';
import type { USER } from '../char/user.js';

export class CORPSE extends CONTAINER {

    constructor() {
        super();
    }

    // ============ Core properties ============

    /** Unit name */
    unit: string = "具";
    /** Item count */
    count: number = 1;
    /** Whether NOT to allocate to team (instance loot) */
    no_alloc: boolean = false;
    /** Deceased character name */
    owner_name: string | null = null;
    /** Source character id (set by init) */
    fromid?: string;

    /**
     * Prevent direct pickup of corpse
     */
    on_get(player: USER): boolean {
        return false;
    }

    /**
     * Initialize corpse from a dead character
     * @param player - deceased character
     * @param iskeep - whether to persist (instance loot)
     */
    init(player: CHARACTER, iskeep?: boolean): void {
        this.create_id();
        this.fromid = player.id;
        this.name = player.name + "的尸体";
        this.color_name = "<wht>" + this.name + "</wht>";
        (this as Record<string, any>).environment = (player as Record<string, any>).environment;
        this.desc = "然而" + player.call3() + "已经死了，只剩下一具尸体静静地躺在这里。";
        this.items = player.query_drop();
        if (!iskeep) this.call_out(this.disappear, 60000);
    }

    /**
     * Temporary no-drop list for team loot allocation.
     * Set dynamically in query_items.
     */
    no_drops: string[] | null = null;

    /**
     * Permission check callback for item pickup.
     * Set dynamically in query_items.
     */
    on_getitem: ((player: USER, item: OBJ) => boolean) | null = null;

    /**
     * Query corpse contents (consider team loot restrictions)
     */
    query_items(player: USER): OBJ[] | undefined {
        const env: any = (this as Record<string, any>).environment;
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
        return this.items ?? undefined;
    }

    /**
     * Clear corpse items
     * @param noget - items to keep (non-lootable)
     */
    clear_items(me: CHARACTER, noget?: OBJ[]): void {
        if (this.items) this.items.length = 0;
        if (noget && noget.length) this.items = noget;
    }

    /**
     * Check if player can loot an item
     */
    check_get(player: USER, item: OBJ): boolean {
        if (!this.no_drops) return true;
        if (this.no_drops.indexOf(player.id) === -1) return true;
        player.notify('你不可以拾取' + item.color_name + "。");
        return false;
    }

    /**
     * Corpse disappearance
     */
    disappear(): void {
        if (this.items) this.items.length = 0;
        const env: any = (this as Record<string, any>).environment;
        if (env) {
            env.notify("一阵风吹去，" + this.name + "已经不见了。");
            env.item_changed(this, false);
        }
    }

    /**
     * Query description JSON (with no_alloc support)
     */
    query_desc(me: USER): string {
        if (this.json) return this.json;
        const obj: Record<string, any> = {};
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
