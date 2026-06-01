import { NPC } from "../../../core/char/npc.js";
import { FAMILIES } from "../../../core/skill/family.js";
import { USERTASK } from "../../../core/task/playertask.js";
import { CHARACTER } from "../../../core/char/character.js";

export default class extends NPC {
    name = "门派后勤管理员";
    desc = "他是你们门派里面负责发放弟子福利的人";
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
            ["force", 100],
            ["dodge", 100],
            ["parry", 100],
            ["sword", 100],
            ["blade", 100],
            ["club", 100],
            ["staff", 100],
            ["whip", 100],
            ["unarmed", 100]);
        this.add_action("job_fam", "门派职位", function (me: CHARACTER, par: string) {

            var fam = me.family;
            if (fam === FAMILIES.NONE) {
                if (!me.query_temp('wg_sr'))
                    return me.notify((this).name +
                        "对你说道：这位" + me.call() + "和本馆素无瓜葛，升职从何说起？");
            }
            if (fam != (this).family) return me.notify((this).name +
                "对你说道：这位" + me.call() + "和本派素无瓜葛，升职从何说起？");
            let gj = me.query_temp('gongji', 0) ?? 0;
            let level = me.query_temp('sm_level', 0) ?? 0;
            if (level >= 5) return me.send((this).name +
                "对你说道：这位" + me.call() + "已经是最高级别的职位了。");

            me.send(`${(this).name}说：你现在是${fam!.query_job_title(level)}，消耗${gj}/${NEEDS_GJ[level]}可以晋升到${fam!.query_job_title(level + 1)}。`);
            if (gj >= NEEDS_GJ[level]) {
                me.send_commands('job_up_ok ' + (this).id, '确定晋升');
            }
        });
        this.add_action("job_up_ok", null, function (me: CHARACTER, par: string) {

            var fam = me.family;
            if (fam != (this).family) return me.notify((this).name +
                "对你说道：这位" + me.call() + "和本派素无瓜葛，升职从何说起？");
            if (fam === FAMILIES.NONE) {
                if (!me.query_temp('wg_sr'))
                    return me.notify((this).name +
                        "对你说道：这位" + me.call() + "和本馆素无瓜葛，升职从何说起？");
            }
            let level = me.query_temp('sm_level', 0) ?? 0;
            if (level >= 5) return me.send((this).name +
                "对你说道：这位" + me.call() + "已经是最高级别的职位了。");

            if (me.level < NEEDS_LEVEL[level])
                return me.send(`${(this).name}说道：这位${me.call()}，${fam!.query_job_title(level + 1)}可不是谁都能当的，最少得是${NEEDS_LEVEL_DESC[level]}才行。`);
            let gj = me.query_temp('gongji', 0) ?? 0;
            let need = NEEDS_GJ[level];
            if (gj >= need) {
                me.add_temp('gongji', -need);
                USERTASK.GET('sm')?.on_finish(me);
                level = me.add_temp('sm_level', 1);
                me.send(`${(this).name}说：恭喜你，现在是${me.family!.query_task_title(me)}了，你的师门物资获得大幅度提升。`);

            } else {
                me.send(`${(this).name}说：你的师门功绩还不够晋升，再努力一点吧。`);
            }
        });
    }

    on_create(path: string, par?: string): void {
    if (!par) return;
    this.family = FAMILIES[par.substr(1)]!;
    if (!this.family.customer) this.family.customer = {};
    if (this.family == FAMILIES.NONE) {
        this.name = "武馆后勤";
    }
}
}

const NEEDS_GJ = [500, 5000, 10000, 50000, 100000];
const NEEDS_LEVEL = [0, 3, 4, 5, 6];
const NEEDS_LEVEL_DESC: (string | null)[] = [null, "宗师", "武圣", "武帝", "武神"];
