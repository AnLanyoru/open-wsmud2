import {COMMAND} from "../../../core/command.js";
import { TitleEntry, USER } from "../../../core/char/user.js";

export default class extends COMMAND {
    command = "title";
    allow_busy = true;
    allow_state = true;

    enter(me: USER, index_input: string) {
        if (!me.titles) return me.notify("你还没有任何称号。");
        let index = parseInt(index_input);
        if (!(index >= 0 && index < me.titles.length)) return me.notify("你没有这个称号。");
        var title: TitleEntry | null = null;
        for (var i = 0; i < me.titles.length; i++) {
            if (i == index) {
                if (me.titles[i].use) {
                    me.titles[i].use = false;
                } else {
                    title = me.titles[i];
                    title.use = true;
                }

            } else {
                me.titles[i].use = false;
            }
        }
        if (title) {
            me.title = title.title;
            me.notify("你决定使用" + title.title + "做为你的称号。");

        } else {
            me.title = undefined;
            me.notify("你决定不使用任何称号。");

        }
        me.color_name = '';
        me.environment?.item_changed(me, true);

    }
}
