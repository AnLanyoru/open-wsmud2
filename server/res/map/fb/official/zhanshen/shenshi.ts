import { ROOM } from '../../../../../core/room/room.js';
import type { USER } from '../../../../../core/char/user.js';

const DIRECTIONS = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
const DIRECTION_NAMES: Record<string, string> = {
    north: '北',
    northeast: '东北',
    east: '东',
    southeast: '东南',
    south: '南',
    southwest: '西南',
    west: '西',
    northwest: '西北',
};
const STARS: Record<string, string[]> = {
    north: ['女', '虚', '危'],
    northeast: ['室', '壁'],
    east: ['氐', '房', '心'],
    southeast: ['尾', '箕'],
    south: ['柳', '星', '张', '翼'],
    southwest: ['井', '鬼'],
    west: ['胃', '昴', '毕', '觜'],
    northwest: ['角', '亢', '奎', '娄', '斗', '牛'],
};

export default class extends ROOM {
    name = '神石广场';
    desc = "圆形广场穹顶如夜空般深邃，中央<cmd cmd='look star_stone'>神石</cmd>流转星辉，周围<cmd cmd='look tablet'>八卦石板</cmd>按八方铺开。";
    exits = {
        east: 'fb/official/zhanshen/yongdao',
        northeast: 'fb/official/zhanshen/shouwei1',
    };

    constructor() {
        super();
        this.set_item('star_stone', '神石', '神石刻录四象二十八宿，星光每次都会重新排列。', [
            ['observe', '观摩星象', this.observe],
        ]);
        this.set_item('tablet', '八卦石板', '八块石板对应上北下南、左西右东及四处斜方。', [
            ['press_north', '按北方石板', this.pressNorth],
            ['press_northeast', '按东北石板', this.pressNortheast],
            ['press_east', '按东方石板', this.pressEast],
            ['press_southeast', '按东南石板', this.pressSoutheast],
            ['press_south', '按南方石板', this.pressSouth],
            ['press_southwest', '按西南石板', this.pressSouthwest],
            ['press_west', '按西方石板', this.pressWest],
            ['press_northwest', '按西北石板', this.pressNorthwest],
        ]);
    }

    observe(me: USER) {
        if (this.fb_query_temp('zhanshen_stars_done', me, false)) {
            const clue = this.fb_query_temp('zhanshen_clue_star', me, '') as string;
            return me.notify('<hic>神石上只剩一颗孤零零的星宿：' + clue + '。</hic>');
        }
        this.ensurePuzzle(me);
        const stars = this.fb_query_temp('zhanshen_star_names', me, []) as string[];
        me.notify('神石依次亮起八颗星宿：' + stars.join('、') + '。请依序推演方位并按下八卦石板。');
    }

    ensurePuzzle(me: USER) {
        if (this.fb_query_temp('zhanshen_star_sequence', me)) return;
        const sequence = [...DIRECTIONS].sort(() => Math.random() - 0.5);
        const stars = sequence.map(direction => STARS[direction].random());
        const clueDirection = DIRECTIONS.random();
        this.fb_set_temp('zhanshen_star_sequence', sequence, me);
        this.fb_set_temp('zhanshen_star_names', stars, me);
        this.fb_set_temp('zhanshen_clue_direction', clueDirection, me);
        this.fb_set_temp('zhanshen_clue_star', STARS[clueDirection].random(), me);
    }

    pressNorth(me: USER) { this.press(me, 'north'); }
    pressNortheast(me: USER) { this.press(me, 'northeast'); }
    pressEast(me: USER) { this.press(me, 'east'); }
    pressSoutheast(me: USER) { this.press(me, 'southeast'); }
    pressSouth(me: USER) { this.press(me, 'south'); }
    pressSouthwest(me: USER) { this.press(me, 'southwest'); }
    pressWest(me: USER) { this.press(me, 'west'); }
    pressNorthwest(me: USER) { this.press(me, 'northwest'); }

    press(me: USER, direction: string) {
        if (this.fb_query_temp('zhanshen_stars_done', me, false)) return me.notify('八卦石板已被星光贯通。');
        this.ensurePuzzle(me);
        const sequence = this.fb_query_temp('zhanshen_star_sequence', me, []) as string[];
        const step = this.fb_query_temp('zhanshen_stars', me, 0) as number;
        if (direction !== sequence[step]) {
            this.fb_set_temp('zhanshen_stars', 0, me);
            return me.notify('星光骤然散乱，方位错误，八卦推演从头开始。');
        }
        const next = step + 1;
        this.fb_set_temp('zhanshen_stars', next, me);
        if (next < sequence.length) return me.notify('石板升起一道' + DIRECTION_NAMES[direction] + '方星光。');
        this.fb_set_temp('zhanshen_stars_done', true, me);
        this.fb_set_temp('zhanshen_guard_wave', 1, me);
        me.notify('<hic>八方星光贯通，守卫殿石门开启。再观神石，可见进入战神殿暗道的星宿提示。</hic>');
    }

    on_leave(me: USER, dir: string) {
        if (dir === 'northeast' && !this.fb_query_temp('zhanshen_stars_done', me, false)) {
            me.notify('东北石门被星宿阵封锁，必须先按顺序破解八方星宿。');
            return false;
        }
    }
}
