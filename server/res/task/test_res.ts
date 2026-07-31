import { USERTASK } from '../../core/task/playertask.js';
import type { CHARACTER } from '../../core/char/character.js';

export default class extends USERTASK {
    id = 'test_res';
    sort = 99;

    query_title(_me: CHARACTER): string | undefined {
        return `<hic>测试资源领取</hic>`;
    }

    query_desc(_me: CHARACTER): string {
        return `<hic>请使用指令 <hiy>test_res</hiy> 打开测试资源菜单。</hic><br><mem>点击领取按钮可获得 100 块<hio>元晶</hio>和10万块<hig>玄晶</hig>（可无限领取）。</mem>`;
    }

    query_state(me: CHARACTER): number | undefined {
        
        if (!me.query_temp("tester", 0)) return 0;
        return 2;
    }

    on_finish(me: CHARACTER, _par?: string): boolean {
        if (!me.query_temp("tester", 0)) return false;
        const obj = me.add_obj('st/yuanjing', 100);
        if (obj) {
            me.notify(`<hig>你领取了 100 块元晶。</hig>`);
        } else {
            me.notify(`<red>元晶创建失败，请联系管理员。</red>`);
            return false;
        }
        const obj_xj = me.add_obj('st/xuanjing', 100000);
        if (obj) {
            me.notify(`<hig>你领取了 10万块玄晶。</hig>`);
            me.send_commands('test_res', '打开测试资源菜单');
        } else {
            me.notify(`<red>玄晶创建失败，请联系管理员。</red>`);
            return false;
        }
        return true;
    }
}
