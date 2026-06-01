import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { WORLD } from "../../../core/world.js";

export default class extends COMMAND {
    command = "score2";
    allow_busy = true;
    allow_state = true;
    allow_die = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, arg) {
    var target = me;
    if (arg) {
        target = me.find_obj(arg, me.environment);
        if (!target && me.user_level > 1) {
            target = WORLD.getUser(arg);
        }
        if (!target) {
            return me.notify("你要查看谁的属性。");
        }
        if (target.master != me.id && me.user_level < 4) {
            return me.notify("你要查看谁的属性。");
        }
    }
    var str = ['{"type":"dialog","dialog":"score",'];
    str.push('id:"');
    str.push(target.id);
    str.push("\",add_sh:\"");
    str.push(target.query_prop("add_sh_per"));
    str.push("%\",diff_fy:\"");
    str.push(parseInt(target.diff_fy_per * 100) / 100);
    str.push("%\",add_bj:\"");
    str.push(target.query_prop("add_bjsh_per") + 150);
    str.push("%\",diff_sh:\"");
    str.push(target.query_prop("diff_sh"));
    str.push("+");
    str.push(parseInt(target.diff_sh_per * 100) / 100);
    str.push("%\",diff_bj:\"");
    str.push(target.query_prop("diff_bj"));
    str.push("%\",releasetime:\"");
    str.push(target.query_prop("releasetime") / 1000);
    str.push("秒+");
    str.push(target.query_prop("releasetime_per"));
    str.push("%\",busy:\"");
    str.push(target.query_prop("busy") / 1000);
    str.push("秒+");
    str.push(target.query_prop("busy_per"));
    str.push("%\",diff_busy:\"");
    str.push(target.query_prop("diff_busy") / 1000);
    str.push("秒+");
    str.push(target.query_prop("diff_busy_per"));
    str.push("%\",distime:\"");
    str.push(target.query_prop("distime") / 1000);
    str.push("秒+");
    str.push(target.query_prop("distime_per"));
    str.push("%\",expend_mp:\"");
    str.push(target.query_prop("expend_mp"));
    str.push("+");
    str.push(target.query_prop("expend_mp_per"));
    str.push("%\",dazuo_per:\"");
    str.push(target.query_prop("dazuo_per"), '%');
    let per = WORLD.DATA.query_temp('dazuo_per', 0) + target.family.query_temp('dazuo_per', 0);
    if (per > 0) {
        str.push('+', per, '%');
    }
    str.push('",study_per:"');
    str.push(target.query_prop("study_per") + me.int, '%');
    per = WORLD.DATA.query_temp('study_per', 0) + target.family.query_temp('study_per', 0);
    if (per > 0) {
        str.push('+', per, '%');
    }
    str.push('",lianxi_per:"');
    str.push(target.query_prop("lianxi_per") + me.int * 2, '%');
    per = WORLD.DATA.query_temp('lianxi_per', 0) + target.family.query_temp('lianxi_per', 0);
    if (per > 0) {
        str.push('+', per, '%');
    }
    str.push('",downside_per:"');
    str.push(target.query_prop("diff_downside_per"));
    str.push('%"}');
    me.send(str.join(""));
}
}

