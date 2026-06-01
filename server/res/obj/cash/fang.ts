import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "份";
    name = "房契";
    desc = "使用获得扬州城豪华住宅";
    grade = 3;
    value = 0;

    on_use(me, par) {
    if (!me.is_player) return me.notify_fail("你不能使用" + this.name + "。");
    let home = me.query_temp('home', 0);
    if (home === 2) return me.notify_fail('你已经拥有自己的住宅了。');
    if (home === 1) {
        if (!par) {
            me.notify_fail('你已经购买了单间，使用契约将退款100<hiy>黄金</hiy>，是否确定？');
            me.send_commands('use ' + this.id + " ok", '确定使用');
            return false;
        }
        me.add_exp(0, 0, 1000000);
    }
    me.set_temp('home', 2);
    me.send('<hic>感谢购买，恭喜你拥有了自己的住宅。</hic>');
    me.send_commands('goto home', '现在就过去');
    return true;
}
}
