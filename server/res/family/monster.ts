import { FAMILY } from '../../core/skill/family.js';
import { MONSTER } from '../../core/char/monster.js';
import type { USER } from '../../core/char/user.js';

export default class extends FAMILY {
    id = 'MONSTER';
    name = '怪物';

    call(player: USER, isbad: boolean) {
        return isbad ? '畜生' : '大仙';
    }

    call_me(player: USER, isbad: boolean) {
        return '';
    }
}
