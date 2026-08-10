import { TASK } from '../../core/task/task.js';
import { WORLD } from '../../core/world.js';
import { OBJ } from '../../core/item/obj.js';
import type { CHARACTER } from '../../core/char/character.js';
import { UTIL } from '../../core/util/util.js';
import { FAMILIES } from '../../core/skill/family.js';
import { FAMILY_EQUIPMENT } from '../data/family_equipment.js';

const FAMILY_REFRESH_KEY = 'sm_ref';

/** 追杀令使用的中等提升权重，索引为免费补货、第一至第六次付费刷新。 */
const NORMAL_QUALITY_WEIGHTS = [
    [50, 28, 14, 6, 2],
    [43, 29, 17, 8, 3],
    [35, 29, 21, 11, 4],
    [27, 28, 24, 15, 6],
    [19, 25, 27, 20, 9],
    [11, 20, 29, 26, 14],
    [5, 10, 25, 35, 25],
];

/** 宝石和门派装备使用的强提升权重；第六次最低黄色，橙色占 55%。 */
const STRONG_QUALITY_WEIGHTS = [
    [60, 27, 10, 2.5, 0.5],
    [48, 30, 15, 5, 2],
    [35, 30, 21, 10, 4],
    [22, 28, 25, 17, 8],
    [10, 20, 28, 27, 15],
    [3, 10, 25, 35, 27],
    [0, 0, 15, 30, 55],
];

/** 三类丹果使用的弱提升权重；第六次仍有 34% 绿色概率。 */
const WEAK_QUALITY_WEIGHTS = [
    [58, 27, 11, 3, 1],
    [54, 28, 12, 4.5, 1.5],
    [50, 29, 13, 6, 2],
    [46, 29, 15, 7, 3],
    [42, 28, 17, 9, 4],
    [38, 27, 19, 11, 5],
    [34, 26, 20, 13, 7],
];

const GEM_PATHS = ['st/st_red', 'st/st_gre', 'st/st_blu', 'st/st_yel'];
const DRUG_PATHS = ['drug/exp', 'drug/skill2', 'drug/pot'];
const DRUG_PRICES: Record<string, number[]> = {
    'drug/exp': [0, 10, 50, 100, 500, 1200],
    'drug/skill2': [0, 10, 50, 100, 200, 500],
    'drug/pot': [0, 10, 20, 100, 200, 500],
};
const EQUIPMENT_PRICES = [0, 200, 2000, 10000, 50000, 100000];

export default class extends TASK {
    id = 'goods';
    customer: Record<string, OBJ[] | null> = {};

    startup(oldtask?: TASK) {
        if (oldtask?.customer) this.customer = oldtask.customer;
        this.handler = this.call_out(this.refresh_goods, UTIL.diff_time(12)); // 12点刷新一次
    }

    refresh_goods() {
        this.handler = null;
        for (var i = 0; i < WORLD.USERS.length; i++) {
            WORLD.USERS[i].send(
                '{type:"msg",ch:"chat",content:"近日新到一批宝石，秘籍，丹药，不知哪位江湖朋友需要。",lv:0,name:"唐楠"}',
            );
        }

        this.customer = {};

        const fam = [
            FAMILIES.GAIBANG,
            FAMILIES.WUDANG,
            FAMILIES.HUASHAN,
            FAMILIES.XIAOYAO,
            FAMILIES.EMEI,
            FAMILIES.SHASHOU,
            FAMILIES.SHAOLIN,
            FAMILIES.NONE,
        ];
        for (let i = 0; i < fam.length; i++) {
            fam[i].customer = {};
            fam[i].send(
                '{type:"msg",ch:"fam",content:"本门新调拨一批物资，有需要的师弟师妹们请速来兑换。",uid:0,name:"后勤管理员",fam:"' +
                    fam[i].name +
                    '"}',
            );
        }

        this.startup(undefined);
    }

    /** 查询/生成当铺玩家货物列表（带缓存）。 */
    query_goods(me: CHARACTER): OBJ[] {
        const cached = this.customer[me.id];
        if (cached) return cached;
        const ref_count = me.query_temp('ref_count', 0) ?? 0;
        const list: OBJ[] = [];
        list.push(OBJ.CREATE('st/xuanjing', this.random(100) + 2));

        let st = ['st/st_red', 'st/st_gre', 'st/st_blu', 'st/st_yel'];
        let max_count = 8;
        const counts = [3, 3, 2, 1, 1, 1, 1];

        for (let i = 0; i < 2; i++) {
            let g = this.random(me.level + 1);
            if (g > 4) g = 4;
            list.push(OBJ.CREATE(st.random() + '#' + g, this.random(counts[g] ?? 1) + 1));
        }
        max_count -= 2;
        if (me.random(3) === 1) {
            st = ['drug/exp', 'drug/pot'];
            for (let i = 0; i < 2; i++) {
                let g = this.random(1 + me.random(me.level));
                if (g > 4) g = 4;
                list.push(OBJ.CREATE(st.random() + '#' + g, this.random(ref_count) + 1));
            }
            max_count -= 2;
        }
        if (me.random(3) === 1) {
            st = ['res/cao', 'res/yu'];
            for (let i = 0; i < 2; i++) {
                const g = this.random((me.level + 1) * 3);
                list.push(OBJ.CREATE(st.random() + '#' + g, this.random(counts[g] ?? 1) + 1));
            }
            max_count -= 2;
        }
        if (max_count > 0) {
            max_count = Math.min(3, max_count);
            for (let i = 0; i < max_count; i++) {
                let level = this.random(me.level) + 1;
                if (level > 6) level = 6;
                else if (level < 1) level = 1;
                const sk = FAMILIES.NONE.query_skill(level);
                list.push(OBJ.CREATE('book/bc#' + sk!.id, 1 + (level < 5 ? me.random(3) : 0)));
            }
        }
        this.customer[me.id] = list;
        return list;
    }

    set_goods(me: CHARACTER, list: OBJ[] | null) {
        this.customer[me.id] = list;
    }

    /** 查询师门商店运行时库存；无库存时免费补货。 */
    query_family_goods(me: CHARACTER): OBJ[] {
        if (!me.family.customer) me.family.customer = {};
        const cached = me.family.customer[me.id] as OBJ[] | undefined;
        if (cached) return cached;
        return this.refresh_family_goods(me, Number(me.query_temp(FAMILY_REFRESH_KEY, 0)) || 0);
    }

    /** 生成一整批新师门物资，并覆盖旧库存。 */
    refresh_family_goods(me: CHARACTER, refreshCount: number): OBJ[] {
        const level = Math.max(0, Math.min(6, Math.floor(refreshCount)));
        const list: OBJ[] = [];

        // 一类：玄晶，库存同当铺。
        list.push(this.createShopItem('st/xuanjing', this.random(100) + 2, 10));

        // 二类：门派追杀令。
        const orderGrade = this.rollGrade(NORMAL_QUALITY_WEIGHTS[level]);
        list.push(this.createShopItem(`sp/tool/zhuisha#${orderGrade}`, 1, orderGrade * 100));

        // 三类：1-3条不重复宝石。
        const gemTypes = this.shuffle([...GEM_PATHS]).slice(0, this.random(3) + 1);
        for (const path of gemTypes) {
            const grade = this.rollGrade(STRONG_QUALITY_WEIGHTS[level]);
            const count = this.rollQuantity(5, grade);
            const obj = OBJ.CREATE(`${path}#${grade - 1}`);
            list.push(this.createShopItem(obj.path, count, Math.max(1, Math.round(obj.value / 1000))));
        }

        // 四类：朱果、突破丹、潜灵果独立抽取两次，允许重复。
        const zhuGuoRatio = this.queryZhuGuoRatio(me);
        for (let i = 0; i < 2; i++) {
            const path = this.rollDrugPath(zhuGuoRatio);
            let weights = [...WEAK_QUALITY_WEIGHTS[level]];
            if (path === 'drug/exp') weights = this.adjustZhuGuoQuality(weights, zhuGuoRatio);
            const grade = this.rollGrade(weights);
            const quantityBias =
                path === 'drug/exp' && zhuGuoRatio >= 0 ? 1 - zhuGuoRatio * 2 : 0;
            const count = this.rollQuantity(10, grade, quantityBias);
            const suffix = path === 'drug/skill2' ? grade : grade - 1;
            list.push(this.createShopItem(`${path}#${suffix}`, count, DRUG_PRICES[path][grade]));
        }

        // 五类：本门装备；杀手楼目前固定一件千羽。
        const equipment = FAMILY_EQUIPMENT[me.family?.id ?? ''] ?? [];
        const selected =
            equipment.length === 1
                ? equipment
                : this.shuffle([...equipment]).slice(0, Math.min(equipment.length, this.random(3) + 3));
        for (const def of selected) {
            const grade = this.rollGrade(STRONG_QUALITY_WEIGHTS[level]);
            const price = Math.round(EQUIPMENT_PRICES[grade] * (def.weapon ? 1.5 : 1));
            list.push(this.createShopItem(`${def.path}#${grade}`, 1, price));
        }

        // 六类：武帝及以上固定出现一块元晶。
        if (me.level >= 5) list.push(this.createShopItem('st/yuanjing', 1, 20000));

        if (!me.family.customer) me.family.customer = {};
        me.family.customer[me.id] = list;
        return list;
    }

    private createShopItem(path: string, count: number, value: number): OBJ {
        const item = OBJ.CREATE(path, count);
        item.count = count;
        item.value = value;
        item.currency = 'gongji';
        return item;
    }

    private rollGrade(weights: number[]): number {
        return this.weightedIndex(weights) + 1;
    }

    private weightedIndex(weights: number[]): number {
        const total = weights.reduce((sum, value) => sum + Math.max(0, value), 0);
        let roll = Math.random() * total;
        for (let i = 0; i < weights.length; i++) {
            roll -= Math.max(0, weights[i]);
            if (roll < 0) return i;
        }
        return weights.length - 1;
    }

    /** 品质越高越偏向小库存；quantityBias 正数追赶、负数抑制朱果数量。 */
    private rollQuantity(max: number, grade: number, quantityBias = 0): number {
        const exponent = 0.15 + grade * 0.42;
        const weights: number[] = [];
        for (let count = 1; count <= max; count++) {
            const scarcity = Math.pow(max - count + 1, exponent);
            const boost = Math.exp(Math.max(-1, Math.min(1, quantityBias)) * (count - 1) * 0.2);
            weights.push(scarcity * boost);
        }
        return this.weightedIndex(weights) + 1;
    }

    private rollDrugPath(ratio: number): string {
        // 落后者每次约有 56% 朱果率，追平者约 11%，其余两种均分剩余概率。
        const zhuGuoWeight = ratio < 0 ? 1 : 0.25 + 2.25 * Math.pow(1 - ratio, 1.25);
        return DRUG_PATHS[this.weightedIndex([zhuGuoWeight, 1, 1])];
    }

    private adjustZhuGuoQuality(weights: number[], ratio: number): number[] {
        if (ratio < 0) return weights;
        if (ratio >= 1) return weights.map((weight, index) => weight * [1.8, 1.3, 0.8, 0.4, 0.2][index]);
        const catchup = 1 - ratio;
        return weights.map(
            (weight, index) => weight * Math.pow([0.65, 0.9, 1.35, 2.1, 3.2][index], catchup),
        );
    }

    private queryZhuGuoRatio(me: CHARACTER): number {
        const own = Math.max(0, Number(me.query_temp('zg_exp', 0)) || 0);
        const max = Math.max(0, Number(WORLD.DATA.query_temp('zg_max', 0)) || 0);
        if (!max) return -1; // 尚无全服记录时使用普通档。
        return Math.max(0, Math.min(1, own / max));
    }

    private shuffle<T>(items: T[]): T[] {
        for (let i = items.length - 1; i > 0; i--) {
            const j = this.random(i + 1);
            [items[i], items[j]] = [items[j], items[i]];
        }
        return items;
    }

    stop() {
        if (this.handler) clearTimeout(this.handler);
    }
}

export { FAMILY_REFRESH_KEY };
