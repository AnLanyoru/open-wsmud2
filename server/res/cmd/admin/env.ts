import { COMMAND } from '../../../core/command.js';
import type { USER } from '../../../core/char/user.js';
import {
    BATCH_MODE,
    WS_BATCH_MODE,
    setBatchMode,
    type BatchModeName,
} from '../../../core/world.js';

const MODE_NAMES = new Set<BatchModeName>(['BATCH_MODE', 'WS_BATCH_MODE']);

export default class extends COMMAND {
    command = 'env';
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;
    allow_level = 6;
    regex = /^(BATCH_MODE|WS_BATCH_MODE)(?:\s+([01]))?$/i;

    enter(me: USER, name?: string, value?: string) {
        if (!name) return this.sendStatus(me);

        const modeName = name.toUpperCase() as BatchModeName;
        if (!MODE_NAMES.has(modeName)) return this.sendUsage(me);
        if (value === undefined) return me.send(`${modeName}=${this.getMode(modeName)}`);
        if (value !== '0' && value !== '1') return this.sendUsage(me);

        const mode = setBatchMode(modeName, Number(value));
        me.send(`${modeName}=${mode}`);
    }

    private getMode(name: BatchModeName): number {
        return name === 'BATCH_MODE' ? BATCH_MODE : WS_BATCH_MODE;
    }

    private sendStatus(me: USER) {
        return me.send(`BATCH_MODE=${BATCH_MODE}\nWS_BATCH_MODE=${WS_BATCH_MODE}`);
    }

    private sendUsage(me: USER) {
        return me.send(
            `BATCH_MODE=${BATCH_MODE}\nWS_BATCH_MODE=${WS_BATCH_MODE}\n用法: env <BATCH_MODE|WS_BATCH_MODE> <0|1>`,
        );
    }
}
