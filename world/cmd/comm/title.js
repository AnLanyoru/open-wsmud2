import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "title";
    allow_busy = true;
    allow_state = true;

    enter(me, index) {
    if (!me.titles) return me.notify("你还没有任何称号。");
    index = parseInt(index);
    if (!(index >= 0 && index < me.titles.length)) return me.notify("你没有这个称号。");
    var title = null;
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
        me.title = null;
        me.notify("你决定不使用任何称号。");

    }
    me.color_name = null;
    me.environment.item_changed(me, true);
    
}
}
