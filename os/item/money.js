/**
 * MONEY 货币类 - 继承自OBJ
 */
require("../item/obj.js");

MONEY = class MONEY extends OBJ {

    static __initInstance(obj) {
        obj.is_cash = false;
        obj.combined = true;
        obj.count = 1;
    }

    constructor() {
        super();
        MONEY.__initInstance(this);
    }

    is_money = true;
    transable = true;

    /** 创建时根据类型设置颜色 */
    create() {
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
}
