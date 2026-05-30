/**
 * MONEY 货币类 — 继承自OBJ
 */
import { OBJ } from './obj.js';

export class MONEY extends OBJ {

    constructor() {
        super();
    }

    // ============ Core properties ============

    /** Whether this is cash (gold ingot) */
    is_cash: boolean = false;
    /** Stackable */
    combined: boolean = true;
    /** Count */
    count: number = 1;
    /** Is money */
    is_money: boolean = true;
    /** Tradable */
    transable: boolean = true;

    /**
     * Create callback — set color by type / value
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
