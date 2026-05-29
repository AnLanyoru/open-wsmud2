import { NPC } from "../../../../os/char/npc.js";

export default function() {
this.inherits(NPC);
this.set({
    name: "韦春芳",
    desc: "韦春芳是当朝鹿鼎公兼天地会总舵主韦小宝他娘，虽是徐娘半老，但风韵尤存。",
    title: "丽春院老板娘",
    gender: 2,
    age: 42,
    per: 33,
    mp: 400,
    max_mp: 400,
    hp: 400,
    max_hp: 400

});
this.set_chat_msg([
    "韦春芳得意地说道：当年老娘我标致得很，每天有好几个客人。",
    "韦春芳怒骂道：辣块妈妈，要是罗刹鬼、红毛鬼子到丽春院来，老娘用大扫帚拍了出去！",
    "韦春芳对你说道：你一双眼睛贼忒嘻嘻的，真像那个喇嘛！"
]);
this.on_enter = function (me) {
    if (me.gender == 1) {
        me.notify("韦春芳招呼道：楼上楼下的姑娘们，客人来了！");
    } else {
        me.notify("韦春芳说道：哎呀，这年月大姑娘也逛窑子，成何体统。");
    }
}
this.set_drop({
    obj: ["eq/lv1/wei_neck"],
    odds: 500
}, {
    obj: "sp/npc#wei",
    odds: 50
});
this.add_action("shu", "赎回拳套", function (me) {
    var obj = me.find_obj_bypath("sp/yz/qiantiao");
    if (!obj) return me.notify("韦春芳对你说道：" + me.call() + "，你有抵押什么东西吗，欠条给我看看？");
    me.notify("你拿出欠条在韦春芳面前晃了晃。");
    me.notify("韦春芳说道：哟，赵爷终于有时间叫人过来了。");
    me.send_commands("give " + this.id + " 50000 money", "给她5两黄金");
});
this.on_accept = function (me, obj, count) {
    if (obj != "money" || count != 50000) return me.notify_fail("韦春芳对你笑道：赵爷欠的可是5两黄金。");
    var tiao = me.find_obj_bypath("sp/yz/qiantiao");
    if (!tiao) return false;
    if (me.remove_obj(tiao, 1)) {
        var quan = me.add_obj("eq/lv1/qianjinquan");
        if (quan) {
            me.notify("韦春芳说道：赵爷有空常来玩呀。");
            me.notify("韦春芳给你" + quan.unit_name() + "。");
            return true;
        }
    }
    return false;
}
}
