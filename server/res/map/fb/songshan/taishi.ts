import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "太室阙";
    desc = "嵩山古称方外，又称崇山，为五岳中的中岳，由太室少室二山沿绵而成。汉武帝时称“嵩高”，取自诗经“嵩岳维高，峻极于天”，道教以之为第六小洞天。阕高丈余，南面刻“中岳太室阳城”六字，篆文古朴，苍劲有力。向西就是去少室山少林寺的路。向北一里许便是中岳庙了。";
    exits = {
        "north": "fb/songshan/tianzhongge",
    };
}
