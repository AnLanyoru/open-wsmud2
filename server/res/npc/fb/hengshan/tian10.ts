import TianBoguang from './tian30.js';

export default class extends TianBoguang {
    score = 10;

    on_died(killer) {
        killer?.notify('田伯光长刀脱手，再也无力逃走。');
    }
}
