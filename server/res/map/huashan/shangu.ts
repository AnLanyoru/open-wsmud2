import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "山谷";
    desc = "这里是中条山的一个隐秘山谷。四周是高可及天的山峰，云深林密，一径小溪潺潺流过，溅入坡下塘中。溪畔有一汉子舞剑正酣。不打扰的为妙。";
    exits = { "northdown": "huashan/qiaobi", "south": "huashan/pingdi" };
}
