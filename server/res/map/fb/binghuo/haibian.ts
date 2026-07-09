import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "海边岩石";
  desc =
    "这里是一个极大的岛屿。岛屿西部都是尖石嶙峋的山峰，奇开怪样，莫可名状，岛东却是一片望不到尽头的平野，乃火山灰倾入大海而成。此处虽处北极，但火山万年不灭，岛上气侯便和长白山、黑龙江一带相似。岛的西部有一山顶有一山顶正在帽出黑烟。往北便是一片片大绿野";
  exits = {
    west: "fb/binghuo/yslu1",
    north: "fb/binghuo/conglin1",
  };
}
