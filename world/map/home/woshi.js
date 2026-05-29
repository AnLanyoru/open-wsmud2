import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "卧室"
this.desc = "这是你的卧室，房间不算大却陈设豪华，地上铺着猩红的羊毛手织地毯，摆着一张楠木花雕大床，一具红松大衣柜，柜顶搁着几只牛皮藤箱子，靠窗处是一张花梨木书桌，旁边一个书架，里面放了一些四书五经之类的儒家书籍。";
this.exits = { "south": "home/yuanzi" };

this.add_action("store", "打开仓库");

this.on_leave = function (me) {
    if (me.master) {
        me.actions = null;
        me.master_json = null;
    }
}
this.on_enter = function (me) {
    if (me.master) {
        me.actions = [
            { cmd: "makelove " + me.id, name: "和" + me.name + "双修" }
        ];
        me.master_json = null;
        if (me.random(10) == 1)
            me.do_command("makelove", me.master);
    }
}
this.add_action("sleep", "睡觉", function (me) {

    me.notify("你躺到床上被子一盖，不一会就呼呼的睡着了。");
});
this.allow_store = true;

this.add_action('drop', null, function (me) { return me.notify('自己家里就不要乱丢东西了。'); });
}
