this.inherits(OBJ);
this.unit = "颗";
this.name = "解毒丹";
this.value = 1000;
this.desc = "这是螣蛇血清制成的解药，可以解螣蛇毒";
this.distime = 30000;
this.grade = 5;
this.allow_fight = true;
this.transable = true;
this.on_use = function (me) {
    if (me.query_status('shedu')) {
        me.send_room('<hig>$N吞下一颗解毒丹，脸上的灰白死气终于褪去。</hig>');
        me.remove_status('shedu', true);
        return;
    }
    return me.notify_fail('你没中蛇毒，用不着吃解药。');
}