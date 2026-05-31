/**
 * MONEY 货币类 — 继承自OBJ
 */
import { OBJ } from './obj.js';

export class MONEY extends OBJ {

    constructor() {
        super();
    }

    // ============ 核心属性 ============

    /** 是否为元宝（充值货币） */
    is_cash: boolean = false;
    /** 可堆叠 */
    combined: boolean = true;
    /** 数量 */
    count: number = 1;
    /** 是否为货币 */
    is_money: boolean = true;
    /** 可交易 */
    transable: boolean = true;

    /**
     * 创建回调 — 根据类型/面值设置颜色
     */
    create(): void {
        this.create_id();
        if (this.is_cash) {
            this.color_name = "<hio>" + this.name + "</hio>";
        } else {
            if (this.value === 1)
                this.color_name = "<yel>" + this.name + "</yel>";
            else if (this.value === 100)
                this.color_name = "<hiw>" + this.name + "</hiw>";
            else
                this.color_name = "<hiy>" + this.name + "</hiy>";
        }
    }
}
