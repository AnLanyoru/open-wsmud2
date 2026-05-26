this.inherits(OBJ);
this.set({
    unit: "本",
    name: "武道",
    desc: "一本神秘的武功秘籍，据说里面记载了很多已经失传的武功秘辛。",
    grade: 5,
    combined: true
});
this.otype = 1;
this.lingwu = function (me, p) {
    me.do_command("lingwu");
}


// this.add_action("wu", "领悟", this.lingwu);

// this.add_action("wu2", "融合", function (me) {
//     me.do_command('lingwu2');
// });