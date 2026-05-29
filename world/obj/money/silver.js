import { MONEY } from "../../../os/item/money.js";

export default function() {
this.inherits(MONEY);
this.set({
    name: "银子",
    desc: "银子,白花花的银子",
    unit: "两",
    value: 100
});
}
