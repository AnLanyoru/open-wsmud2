this.inherits(OBJ);
this.set({
    unit: "本",
    name: "四十二章经",
    desc: "一本镶黄旗的经书,封皮很精致。",
    max_level: 100,
    value: 5800,
    grade: 1,
    jing_index: 0
});
this.transable = true;
this.on_create = function (path, par) {
    if (!par) return;
    var lv = parseInt(par.substr(1));
    this.jing_index = lv;
    switch (lv) {
        case 1:
            this.name = "四十二章经一";
            this.desc = "一本镶黄旗的经书,封皮很精致。";
            break;
        case 2:
            this.name = "四十二章经二";
            this.desc = "一本正黄旗的经书,封皮很精致。";
            break;
        case 3:
            this.name = "四十二章经三";
            this.desc = "一本正蓝旗的经书,封皮很精致。";
            break;
        case 4:
            this.name = "四十二章经四";
            this.desc = "一本镶蓝旗的经书,封皮很精致。";
            break;
        case 5:
            this.name = "四十二章经五";
            this.desc = "一本镶红旗的经书,封皮很精致。";
            break;
        case 6:
            this.name = "四十二章经六";
            this.desc = "一本正红旗的经书,封皮很精致。";
            break;
        case 7:
            this.name = "四十二章经七";
            this.desc = "一本镶白旗的经书,封皮很精致。";
            break;
        case 8:
            this.name = "四十二章经八";
            this.desc = "一本正白旗的经书,封皮很精致。";
            break;

    }

}
this.add_action("si", "撕封皮", function (me) {
    var items = [];

    for (var i = 0; i < me.items.length; i++) {
        if (me.items[i].jing_index) {

            items[me.items[i].jing_index - 1] = me.items[i];
        }
    }
    for (var i = 0; i < items.length; i++) {
        if (!items[i]) return me.notify("你还是等凑齐八本经书再撕吧。");
    }
    if (items.length != 8) {
        return me.notify("你还是等凑齐八本经书再撕吧。");
    }
    me.send_room("$N将八本四十二章经的封皮撕开，每本书都掉了一块羊皮出来。");
    me.notify("你把地图上画的内容牢牢记在脑中，然后点火把地图烧掉了。");
    for (var i = 0; i < items.length; i++) {
        me.remove_obj(items[i], 1);
    }
    me.set_temp("map42", 1);
});

this.add_action("he", "兑换", function (me, par) {
    me.send('如果你有多余的其他经书，可以每五本兑换一本其他经书。');
    if (this.count > 4) {
        if (!par) {
            var str = ["{type:\"cmds\",items:["];
            var names = "一二三四五六七八";
            for (let i = 1; i <= 8; i++) {
                if (i === this.jing_index) continue;
                if (str.length > 1) str.push(',');
                str.push("{cmd:\"packitem he ", this.id, " ", i, '",name:"四十二章经', names[i - 1], '"}');
            }
            str.push("]}");
            me.send(str.join(""));
        } else {
            let index = parseInt(par);
            if (!(index > 0 && index < 9))
                return me.send('参数错误。');
            if (index === this.jing_index)
                return me.send('你不能兑换自己。');

            me.remove_obj(this, 5);
            let obj = me.add_obj('sp/bj/jing#' + index);
            me.send('你使用' + this.unit_name(5) + "兑换了" + obj.unit_name(1) + "。");
        }
    }
});