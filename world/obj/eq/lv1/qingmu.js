import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default function() {
    const EQUIP_TYPE = globalThis.EQUIP_TYPE;
this.inherits(EQUIPMENT);
this.set({
    name: "青木令",
    desc: "天地会青木堂的堂主令牌",
    unit: "块",
    grade: 1,
    eq_type: EQUIP_TYPE.JEWELS,
    prop: {
        limit_mp: 100
    }
});
}
