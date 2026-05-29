import { MONEY } from "../../../os/item/money.js";

export default class extends MONEY {
    name = "铜板";
    desc = "虽然少但也是钱";
    unit = "枚";
    value = 1;

    unit_name() {
    return UTIL.moneyToStr(this.count);
}
}

const UTIL = globalThis.UTIL;
