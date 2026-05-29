/**
 * FAMILY_AREA 门派区域类 - 继承自AREA
 * @extends {AREA}
 */
import { AREA } from "./area.js";

export class FAMILY_AREA extends AREA {

    static __initInstance(obj) {
        // FAMILY_AREA has no additional instance properties
    }

    constructor() {
        super();
        FAMILY_AREA.__initInstance(this);
    }
}
globalThis.FAMILY_AREA = FAMILY_AREA;
