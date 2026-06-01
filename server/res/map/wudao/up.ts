import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "台阶";
    desc = "这里是武道塔的内部，塔身已经石迹斑驳，但是仍然耸立挺拔。四周都是坚固的石壁，不知道怎的留下一些横七竖八的刀刻剑痕，你想仔细看却觉得刺得眼睛发疼。";
    max_item_count = 1;
    is_shadow = true;
}
