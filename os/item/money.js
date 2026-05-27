/**
 * MONEY 货币类 - 继承自OBJ
 */
require("../item/obj.js");

/** @type {function} */
MONEY = function () {
    /** @type {boolean} 是否元宝 */
    this.is_cash = false;
    /** @type {boolean} 可堆叠 */
    this.combined = true;
    this.count = 1;
}
MONEY.inherits(OBJ);
/** @type {boolean} */
MONEY.prototype.is_money = true;
/** @type {boolean} */
MONEY.prototype.transable = true;

/** 创建时根据类型设置颜色 */
MONEY.prototype.create = function () {
    this.create_id();
    if (this.is_cash) {
        this.color_name = "<hio>" + this.name + "</hio>";
    } else {
        if (this.value == 1)
            this.color_name = "<yel>" + this.name + "</yel>";
        else if (this.value == 100)
            this.color_name = "<hiw>" + this.name + "</hiw>";
        else
            this.color_name = "<hiy>" + this.name + "</hiy>";
    }

}

