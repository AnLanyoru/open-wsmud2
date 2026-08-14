import { USERTASK } from '../../core/task/playertask.js';
import { OBJ } from '../../core/item/obj.js';
import type { OddsEntry } from '../../core/item/obj.js';
import { wudao_fragment, wudao_grade } from '../map/wudao/ta.js';

export interface WudaoDailyFragmentSlot {
    grade: number;
    odds: number;
    fall_grade?: number;
}

/**
 * 每日秘籍残页槽位。
 *
 * 100 层以下当前品质必掉一份并有 50% 概率额外掉落；低品质各有 50% 概率。
 * 100 层起固定两份橙色槽位，每份独立按层数概率替换为红色；替换率达到 100% 后
 * 另有 50% 概率额外掉落一份橙色残页。
 */
export function wudao_daily_fragment_slots(lv: number): WudaoDailyFragmentSlot[] {
    if (lv < 100) {
        const currentGrade = wudao_grade(lv);
        const slots: WudaoDailyFragmentSlot[] = [];
        for (let grade = 1; grade <= currentGrade; grade++) {
            slots.push({ grade, odds: grade === currentGrade ? 10000 : 5000 });
        }
        slots.push({ grade: currentGrade, odds: 5000 });
        return slots;
    }

    const slots: WudaoDailyFragmentSlot[] = [];
    for (let grade = 1; grade < 5; grade++) {
        slots.push({ grade, odds: 5000 });
    }

    const redOdds = Math.min(10000, (lv - 99) * 2000);
    slots.push(
        { grade: 6, odds: redOdds, fall_grade: 5 },
        { grade: 6, odds: redOdds, fall_grade: 5 },
    );
    if (redOdds === 10000) slots.push({ grade: 5, odds: 5000 });
    return slots;
}

export default class extends USERTASK {
    id = 'wudao';

    query_title(me) {
        let wd_lv = me.query_temp('wd_level', 0);

        let lv = Math.floor(wd_lv / 20);

        let tag = TAGS[lv];
        return `<${tag}>武道塔挑战：${wd_lv}层</${tag}>`;
    }

    query_desc(me) {
        let lv = me.query_temp('wd_level', 0);
        if (!(lv > 0)) return;
        let tm = me.query_temp('wd_tm', 0);
        let wd = 0;
        let mem = '';
        let max = 7;
        if (tm > 0) {
            wd = Math.floor((Date.now() - tm * 100000) / 3600000 / 24);
            if (wd <= 0) {
                wd = 0;
                let time = tm * 100000 + 3600000 * 24 - Date.now();
                if (time > 0) {
                    mem = '，下次领取' + this.format_time_span(time);
                }
            } else if (wd < max) {
                let time = tm * 100000 + 3600000 * 24 * (wd + 1) - Date.now();
                if (time > 0) {
                    mem = '，下次领取' + this.format_time_span(time);
                }
            } else {
                mem = '，已到上限';
                wd = Math.min(wd, 7);
            }
        }

        return `你的武道塔挑战记录是${lv}层，守门人将按照你的最高挑战记录发放奖励，当前可领取${wd}/7。<br><mem>每天获得一份奖励，挑战更高层获得更多奖励${mem}</mem>`;
    }

    format_time_span(time) {
        if (time > 3600000) return Math.floor(time / 3600000) + '小时后';
        if (time > 60000) return Math.floor(time / 60000) + '分钟后';
        return Math.floor(time / 1000) + '秒后';
    }

    query_count(me) {
        let tm = me.query_temp('wd_tm', 0);
        if (!tm) return 0;
        tm = Math.floor((Date.now() - tm * 100000) / 3600000 / 24);
        return Math.min(tm, 7);
    }

    query_state(me) {
        let lv = me.query_temp('wd_level', 0);
        if (!(lv > 0)) return 0;
        let sm = this.query_count(me);
        return sm > 0 ? 2 : 1;
    }

    on_finish(me) {
        let wd_count = this.query_count(me);
        if (!(wd_count > 0)) return false;
        let wd_lv = me.query_temp('wd_level', 0);
        if (!(wd_lv > 0)) return false;

        this.set_curtm(me, wd_count);
        for (let i = 0; i < wd_count; i++) {
            this.reward(me, wd_lv);
        }

        me.send('<hic>你领取了' + wd_count + '天的武道塔的奖励。</hic>');

        return true;
    }

    set_curtm(me, count) {
        let tm = me.query_temp('wd_tm', 0);

        tm = Math.max((Date.now() - 3600000 * 24 * 7) / 100000, tm);

        tm += Math.floor(count * 36 * 24);

        me.set_temp('wd_tm', tm);
    }

    reward(me, lv) {
        let items: OddsEntry[] = [];
        let exp = 10000;
        if (lv <= 29) {
            exp += lv * 10000;
        } else {
            exp += 29 * 10000;
            exp += (lv - 29) * 1000;
        }

        me.add_exp(exp, exp);

        if (lv >= 10) {
            let wd_count = Math.floor(lv / 10);
            items.push({
                obj: 'book/wd',
                count: wd_count,
            });
            me.add_temp('wds', wd_count);
        }

        for (const slot of wudao_daily_fragment_slots(lv)) {
            const fragment = wudao_fragment(slot.grade, slot.odds);
            if (slot.fall_grade === undefined) {
                items.push(fragment);
                continue;
            }
            const fallback = wudao_fragment(slot.fall_grade);
            items.push({ ...fragment, fall_obj: fallback.obj });
        }

        const created = OBJ.create_by_odds(items);
        for (var i = 0; i < created.length; i++) {
            const reward = created[i];
            var item = me.add_obj(reward);
            if (item) {
                me.send('你获得了' + item.unit_name(reward.count) + '。');
            }
        }
    }
}

const TAGS = ['wht', 'hic', 'hiy', 'hiz', 'hio', 'ord'];
const EXPS = [1000, 2000, 3000, 4000, 5000, 6000, 7000];
const REWARDS = [
    ['drug/max_mp#0', 'drug/skill2#1'],
    ['drug/max_mp#1', 'drug/skill2#2'],
    ['drug/max_mp#2', 'drug/skill2#3'],
    ['drug/max_mp#3', 'drug/skill2#4'],
    ['drug/max_mp#4', 'drug/skill2#5'],
];
