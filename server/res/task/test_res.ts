import { USERTASK } from "../../core/task/playertask.js";
import type { CHARACTER } from "../../core/char/character.js";

export default class extends USERTASK {
    id = "test_res";
    sort = 99;

    query_title(_me: CHARACTER): string | undefined {
        return `<hic>测试资源领取</hic>`;
    }

    query_desc(_me: CHARACTER): string {
        return `<hic>请使用指令 <hiy>test_res</hiy> 打开测试资源菜单。</hic><br><mem>点击下方领取按钮可获得 10 块<hio>元晶</hio>（可无限领取）。</mem>`;
    }

    query_state(_me: CHARACTER): number | undefined {
        return 2;
    }

    on_finish(me: CHARACTER, _par?: string): boolean {
        const obj = me.add_obj("st/yuanjing", 10);
        if (obj) {
            me.notify(`<hig>你领取了 10 块元晶。</hig>`);
            me.send_commands("test_res", "打开测试资源菜单");
        } else {
            me.notify(`<red>元晶创建失败，请联系管理员。</red>`);
            return false;
        }
        return true;
    }
}
