import { COMMAND } from '../../../core/command.js';
import { CHARACTER } from '../../../core/char/character.js';
import type { USER } from '../../../core/char/user.js';

export default class extends COMMAND {
    command = 'user';
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_level = 3;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me: USER, arg: string) {}
}

const num_reg = /\d+/;
