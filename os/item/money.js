/**
 * MONEY 货币类 - 继承自OBJ
 */
import { OBJ } from "./obj.js";

export class MONEY extends OBJ {

    // ============ 核心属性 ============

    /** @type {boolean} 是否为现金(元宝) */
    is_cash = false;
    /** @type {boolean} 是否可堆叠合并 */
    combined = true;
    /** @type {number} 数量 */
    count = 1;
    /** @type {boolean} 是否为货币 */
    is_money = true;
    /** @type {boolean} 是否可交易 */
    transable = true;

    /** 构造MONEY实例 */
    constructor() {
        super();
    }

    /**
     * 创建时根据类型设置颜色
     * @returns {void}
     */
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
globalThis.MONEY = MONEY;
