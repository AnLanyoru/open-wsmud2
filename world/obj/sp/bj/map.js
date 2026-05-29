import { OBJ } from "../../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    unit: "份",
    name: "龙脉地图",
    desc: "这是一份从四十二章经里得到的地图，八分凑到一起才能大概看清楚四周地形，看样子像是关外某个地方",
    max_level: 100,
    combined: false,
    value: 10000,
    grade: 2
});
}
