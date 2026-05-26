this.inherits(NPC);
this.set({
    name: "程药发",
    desc: "他就是程药发，扬州现任知府。",
    title: "扬州知府",
    gender: 1,
    age: 45,
    per: 22,
    mp: 1500,
    max_mp: 1500,
    hp: 1500,
    max_hp: 1500,
});

this.set_objects(["eq/lv0/cloth",1,1]);
this.add_action("ask1", "追捕", function (me) {

    USERTASK.RUN("yamen2", me);
});

// this.add_action("ask2", "放弃任务", function (me) {
//     if (!me.query_temp("task/yamen")) {
//         return me.notify("程药发对你说道：你没有在追捕啊？ 如果你想干，就接任务吧。");
//     }
//     USERTASK.GET("yamen2").giveup(me);
//     me.notify("程药发对你说道：好吧，你可以接别的逃犯来继续做。");
// });

// this.add_action("ask3", "快速追捕", function (me) {
   
//     USERTASK.GET("yamen").quickly_start(me);
// });
