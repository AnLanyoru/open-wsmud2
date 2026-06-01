import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "北门";
    desc = "这是北城门，因为曾经失火，到现在城墙还是黑乎乎的，因此白纸黑字的官府告示(gaoshi)就显得特别现眼。北方是一片崇山峻岭，一条黄土小径在山里蜿蜒而上。 ";
    exits = {"south":"yz/beidajie2","north":"yz/hanshui"};
}
