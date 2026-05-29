import { ROOM } from "../../../../os/room/room.js";

export default function() {
    const WORLD = globalThis.WORLD;
this.inherits(ROOM);
this.name = "小路"
this.desc = "你走在一条小路上。前面道路崎岖，行人很少。往南有条小路通往城内。";
this.exits = { "north": "bj/zhuang/xiaolu2"};
this.on_before_enter = function (me) {
    if (me.query_temp('fb', 0) > 10) {
        this.add_exit('south', "bj/zhuang/dalu" );
    }
}
this.on_leave = function (me, dir) {
    if (dir === 'south') {

        this.actions['lkfb'].action(me);
        return false;
    }
}
this.add_action('lkfb', null, function (me, par) {
  
    if (par) {
      
        WORLD.COMMANDS['cr'].enter(me, 'over');
      
        me.moveto(ROOM.Get('bj/hg/nanmen'));

        me.send('你顺着小路进入京城，来到奉天城门。');
    } else {
        me.send('你即将离开这个副本进入公共区域，是否确认？');
        me.send_commands('lkfb ok', '确认进入');
    }

});
}
