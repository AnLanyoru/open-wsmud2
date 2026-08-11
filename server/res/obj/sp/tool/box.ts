import type { CHARACTER } from '../../../../core/char/character.js';
import { OBJ } from '../../../../core/item/obj.js';
import { SKILL } from '../../../../core/skill/skill.js';

const GOLD_RANGES: ReadonlyArray<readonly [number, number]> = [
    [0, 0],
    [10, 50],
    [20, 100],
    [40, 200],
    [60, 300],
    [100, 500],
];
const STONE_PATHS = ['st/st_red', 'st/st_gre', 'st/st_blu', 'st/st_yel'] as const;

export default class extends OBJ {
    unit = '只';
    name = '藏宝箱';
    desc = '一只江湖中难得一见的藏宝箱，打开后可获得一类珍贵物资。';
    grade = 1;
    value = 10000;
    transable = true;

    on_create(path: string, par: string): void {
        if (!par) {
            this.path = path + '#1';
            return;
        }
        const grade = Number.parseInt(par.slice(1));
        if (!Number.isInteger(grade) || grade < 1 || grade > 5) return;
        this.grade = grade;
        this.value = grade * 10000;
    }

    on_open(me: CHARACTER): OBJ[] {
        const [minGold, maxGold] = GOLD_RANGES[this.grade];
        const goldBase = minGold + me.random(maxGold - minGold + 1);
        switch (me.random(4)) {
            case 0:
                return [OBJ.CREATE('money/gold', goldBase)];
            case 1:
                return [OBJ.CREATE('st/xuanjing', goldBase * 5)];
            case 2:
                return this.createFragments(me);
            default:
                return this.createStones(me);
        }
    }

    private createFragments(me: CHARACTER): OBJ[] {
        const count = 1 + me.random(3);
        const candidates = SKILL.query_fragment_pool(this.grade);
        const items: OBJ[] = [];
        for (let i = 0; i < count && candidates.length; i++) {
            const index = me.random(candidates.length);
            const skill = candidates.splice(index, 1)[0];
            items.push(OBJ.CREATE(`book/bc#${skill.id}`));
        }
        return items;
    }

    private createStones(me: CHARACTER): OBJ[] {
        const count = 1 + me.random(3);
        const candidates = [...STONE_PATHS];
        const items: OBJ[] = [];
        for (let i = 0; i < count && candidates.length; i++) {
            const index = me.random(candidates.length);
            const path = candidates.splice(index, 1)[0];
            items.push(OBJ.CREATE(`${path}#${this.grade - 1}`));
        }
        return items;
    }
}
