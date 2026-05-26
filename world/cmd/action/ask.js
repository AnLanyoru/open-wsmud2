this.inherits(COMMAND);
this.command = "ask";
this.regex = /^(\w+)\s+about\s+(.+)$/;
this.enter = function (me, objid,par) {
    var obj = me.find_obj(objid, me.environment);
    if (!obj || !obj.on_ask) return me.notify("你要问谁什么？");
    if (!par || par.length>10) return me.notify("你要问什么？");
    par = UTIL.htmlEncode(UTIL.replace_word(par));
  
    me.send_room("$N向$n打听有关「" + par + "」的问题。", obj);
    if (obj.on_ask(me, par) != false) return;
    me.send_room(ask_dunno.random(), obj);
}
var ask_dunno = ["$n摇摇头，说道：没听说过。",
    "$n睁大眼睛望着$N，显然不知道$P在说什么。",
    "$n耸了耸肩，很抱歉地说：无可奉告。",
    "$n说道：嗯....这我可不清楚，你最好问问别人吧。",
    "很显然，$n根本不想回答$P的问题。",
    "$n想了一会儿，说道：对不起，你问的事我实在没有印象。",
    "$n睁大眼睛望着$N，这么简单的问题也要问吗？",];
NPC.prototype.set_ask = function (name, func) {
    if (!this.question) this.question = {};
    this.question[name] = func;
}
NPC.prototype.on_ask = function (me, par) {
    if (!this.question) return;
    var item = this.question[par];
    if (!item) return;
    return item.call(this,me);
}

//switch( topic ) {
//    case "name":
//        message_vision( YEL "$N向$n"+YEL"问道：敢问" + RANK_D->query_respect(ob)
//            + "尊姓大名？\n" NOR, me, ob);
//        return 1;
//    case "here":
//        message_vision(YEL "$N向$n"+YEL"问道：这位" + RANK_D->query_respect(ob)
//            + "，" + RANK_D->query_self(me) + "初来乍到，不知这里有些什麽风土人情？\n" NOR,
//            me, ob);
//        return 1;
//    case "rumors":
//        message_vision(RED "$N向$n"+RED"问道：这位" + RANK_D->query_respect(ob)
//            + "，不知最近有没有听说什么小道消息？\n" NOR, me, ob);
//        return 1;
//    case "marry":
//        message_vision(CYN "$N眯着一双贼眼，不怀好意的向$n"+CYN"问道：敢问这位"+RANK_D->query_respect(ob)
//                    +"是否婚配？\n" NOR,me,ob);
//        return 1;
//    case "food":
//        message_vision(CYN "$N可怜兮兮的向$n"+CYN"问道：“不知这位"+RANK_D->query_respect(ob)
//                    +"是否能给我点吃的, 在下已经三天没有进食了？”\n" NOR,me,ob);
//        return 1;
	
//    case "water":
//        message_vision(CYN "$N可怜兮兮的向$n"+CYN"问道：“不知这位"+RANK_D->query_respect(ob)
//                    +"是否能给我点喝的, 在下口渴得很？”\n" NOR,me,ob);
//        return 1;
	
//    case "money":
//        message_vision(CYN "$N双手抱拳向$n"+CYN"问道：“在下初来咋到，行走江湖缺了些盘缠,这位"+RANK_D->query_respect(ob)
//                    +"是否能施舍一二, 在下不甚感激？”\n" NOR,me,ob);
//        return 1;
//    case "friend":
//        message_vision(CYN "$N双手抱拳向$n"+CYN"说道：“四海之内皆兄弟也,这位"+RANK_D->query_respect(ob)
//                    +",不知愿否与在下交个朋友”\n" NOR,me,ob);
//        return 1;
//    default:
//        return 0;
//}