import { NPC } from '../../../core/char/npc.js';
import { FAMILIES } from '../../../core/skill/family.js';
import { USERTASK } from '../../../core/task/playertask.js';
import { TASK } from '../../../core/task/task.js';
import { UTIL } from '../../../core/util/util.js';
import type { OBJ } from '../../../core/item/obj.js';
import type ShiMenTask from '../../task/sm_task.js';
import GoodsTask, { FAMILY_REFRESH_KEY } from '../../task/goods_task.js';
import type { USER } from '../../../core/char/user.js';

export default class extends NPC {
    name = '门派后勤管理员';
    desc = '他是你们门派里面负责发放弟子福利的人';
    gender = 1;
    age = 25;
    per = this.random(20) + 10;
    mp = 400;
    max_mp = 400;
    hp = 400;
    max_hp = 400;
    constructor() {
        super();
        this.skill_map(
            ['force', 100],
            ['dodge', 100],
            ['parry', 100],
            ['sword', 100],
            ['blade', 100],
            ['club', 100],
            ['staff', 100],
            ['whip', 100],
            ['unarmed', 100],
        );
        this.add_action('job_fam', '门派职位', this.job_fam);
        this.add_action('job_up_ok', null, this.job_up_ok);
        this.add_action('sm_exchange', '师门兑换', this.open_family_shop);
        this.add_action('sm_refresh', '刷新物资', this.show_family_refresh);
        this.add_action('sm_refresh_ok', null, this.refresh_family_shop);
    }

    private check_family(me: USER): boolean {
        if (me.family !== this.family) {
            me.notify(`${this.name}对你说道：这位${me.call()}并非本派弟子，不能兑换本门物资。`);
            return false;
        }
        return true;
    }

    open_family_shop(me: USER) {
        if (!this.check_family(me)) return;
        const task = TASK.GET('goods') as GoodsTask | undefined;
        if (!task) return me.notify('师门物资暂未送达，请联系管理员。');
        task.query_family_goods(me);
        me.do_command('list', this.id);
    }

    show_family_refresh(me: USER) {
        if (!this.check_family(me)) return;
        const count = Number(me.query_temp(FAMILY_REFRESH_KEY, 0)) || 0;
        if (count >= REFRESH_COSTS.length) {
            return me.notify(`${this.name}对你说道：今日可以调拨的物资已经全部送来了。`);
        }
        const cost = REFRESH_COSTS[count];
        me.notify(`${this.name}对你说道：第${count + 1}次重新调拨物资需要${cost}点师门功绩。`);
        me.send_commands(`sm_refresh_ok ${this.id}`, `消耗${cost}功绩刷新`);
    }

    refresh_family_shop(me: USER) {
        if (!this.check_family(me)) return;
        const task = TASK.GET('goods') as GoodsTask | undefined;
        if (!task) return me.notify('师门物资暂未送达，请联系管理员。');

        const count = Number(me.query_temp(FAMILY_REFRESH_KEY, 0)) || 0;
        if (count >= REFRESH_COSTS.length) {
            return me.notify(`${this.name}对你说道：今日可以调拨的物资已经全部送来了。`);
        }
        const cost = REFRESH_COSTS[count];
        const gongji = Number(me.query_temp('gongji', 0)) || 0;
        if (gongji < cost) {
            return me.notify(`刷新需要${cost}点师门功绩，你目前只有${gongji}点。`);
        }

        me.add_temp('gongji', -cost);
        const newCount = me.add_temp(FAMILY_REFRESH_KEY, 1, UTIL.diff_time(5));
        task.refresh_family_goods(me, newCount);
        me.notify(`<hiy>你消耗${cost}点师门功绩，刷新了本门物资。</hiy>`);
        me.do_command('list', this.id);
    }

    on_sell(me: USER): OBJ[] {
        if (!this.check_family(me)) return [];
        const task = TASK.GET('goods') as GoodsTask | undefined;
        return task?.query_family_goods(me) ?? [];
    }

    before_sell_item(me: USER, sellitem: OBJ, buyCount: number): boolean {
        if (!this.check_family(me)) return false;
        const cost = sellitem.value * buyCount;
        const gongji = Number(me.query_temp('gongji', 0)) || 0;
        if (gongji < cost) {
            me.notify(`兑换这些物品需要${cost}点师门功绩，你目前只有${gongji}点。`);
            return false;
        }
        me.add_temp('gongji', -cost);
        return true;
    }

    job_fam(me: USER, par: string) {
        var fam = me.family;
        if (fam === FAMILIES.NONE) {
            if (!me.query_temp('wg_sr'))
                return me.notify(
                    this.name + '对你说道：这位' + me.call() + '和本馆素无瓜葛，升职从何说起？',
                );
        }
        if (fam != this.family)
            return me.notify(
                this.name + '对你说道：这位' + me.call() + '和本派素无瓜葛，升职从何说起？',
            );
        let gj = me.query_temp('gongji', 0) ?? 0;
        let level = me.query_temp('sm_level', 0) ?? 0;
        if (level >= 5)
            return me.send(this.name + '对你说道：这位' + me.call() + '已经是最高级别的职位了。');
        me.send(
            `${this.name}说：你现在是${fam!.query_job_title(level)}，消耗${gj}/${NEEDS_GJ[level]}可以晋升到${fam!.query_job_title(level + 1)}。`,
        );
        if (gj >= NEEDS_GJ[level]) {
            me.send_commands('job_up_ok ' + this.id, '确定晋升');
        }
    }

    job_up_ok(me: USER, par: string) {
        var fam = me.family;
        if (fam != this.family)
            return me.notify(
                this.name + '对你说道：这位' + me.call() + '和本派素无瓜葛，升职从何说起？',
            );
        if (fam === FAMILIES.NONE) {
            if (!me.query_temp('wg_sr'))
                return me.notify(
                    this.name + '对你说道：这位' + me.call() + '和本馆素无瓜葛，升职从何说起？',
                );
        }
        let level = me.query_temp('sm_level', Number());
        if (level >= 5)
            return me.send(this.name + '对你说道：这位' + me.call() + '已经是最高级别的职位了。');
        if (me.level < NEEDS_LEVEL[level])
            return me.send(
                `${this.name}说道：这位${me.call()}，${fam!.query_job_title(level + 1)}可不是谁都能当的，最少得是${NEEDS_LEVEL_DESC[level]}才行。`,
            );
        let gj = me.query_temp('gongji', Number());
        let need = NEEDS_GJ[level];
        if (gj >= need) {
            me.add_temp('gongji', -need);
            let sm_task = USERTASK.GET('sm') as ShiMenTask | undefined;
            if (!sm_task) {
                return me.send(
                    '<hir>发生了一个错误，请联系管理员。错误详情：全局师门任务系统 未加载</hir>',
                );
            }
            sm_task.on_finish(me);
            level = me.add_temp('sm_level', 1);
            me.send(
                `${this.name}说：恭喜你，现在是${me.family!.query_task_title(me)}了，你的师门物资获得大幅度提升。`,
            );
        } else {
            me.send(`${this.name}说：你的师门功绩还不够晋升，再努力一点吧。`);
        }
    }

    on_create(path: string, par?: string): void {
        if (!par) return;
        this.family = FAMILIES[par.slice(1)]!;
        if (!this.family.customer) this.family.customer = {};
        if (this.family == FAMILIES.NONE) {
            this.name = '武馆后勤';
        }
    }
}

const NEEDS_GJ = [500, 5000, 10000, 50000, 100000];
const NEEDS_LEVEL = [0, 3, 4, 5, 6];
const NEEDS_LEVEL_DESC: (string | null)[] = [null, '宗师', '武圣', '武帝', '武神'];
const REFRESH_COSTS = [200, 400, 600, 800, 1000, 1200];
