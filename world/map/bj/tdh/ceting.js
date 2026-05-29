import { ROOM } from "../../../../os/room/room.js";
import { OBJ } from "../../../../os/item/obj.js";

export default class extends ROOM {
    name = "侧厅";
    desc = "这里是侧厅，靠墙是一排书架，摆满了各种拳谱、书籍。墙角有一张木床。天地会总舵主陈近南常常在这里读书、休息。";
    exits = { "west": "bj/tdh/dating" };
    items = OBJ.create_by_odds([
   {
       obj: ["book/book#dodge", "book/book#force", "book/book#unarmed", "book/book#sword", "book/book#blade", "book/book#parry"],
        odds: 8000
   }, {
      obj: ["book/bc#yunlongxinfa", "book/bc#yunlongjian", "book/bc#yunlongbian", "book/bc#yunlongshenfa", "book/bc#wuhuduanmendao",
          "book/bc#houquan"],
       odds: 4000
    }
]);
}

