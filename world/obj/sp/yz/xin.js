import { OBJ } from "../../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    name: "崔员外的信",
    desc: "这是一封崔员外写给扬州城外流氓头的信，还没送出去。上面火漆封口也不知道是什么内容。",
    unit: "封",
    value: 0,
    combined:false
});
this.add_action("chai", "拆开", function (me) {

    var str = '史兄弟在上:/n，近日愚兄偶得一本武林秘籍《奋进》,听闻兄弟醉心武学，故奉上供兄弟研究，另献上本月供奉100两黄金。望史兄弟武运昌隆，庇佑愚兄。';

    me.notify(str);
    me.notify("这封信应该是崔员外府上的管家代写的，秀才硬要充草莽，又酸又假装豪放，不知道这个信上说的史兄弟是哪个山头的贼人。");

});
}
