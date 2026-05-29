import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "reward";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;
    regex = /^(\w+)(?:\s+(\d+))?$/;
    rules = {
    score: "根据你所有学会的武学计算的分数，按照门派榜单发放奖励，",
    top: "每日消耗精力获得挑战次数，只可挑战积分比自己高的玩家，挑战成功自己增加积分，失败双方积分不变，按照门派榜单发放奖励，",
    weapon: "当武器获得精炼或者自制装备时会计算分数，玩家同一部件多件装备取最高分上榜，所有榜单奖励总计上限200，",
    mp: "定时更新，无奖励",
    exp: "定时更新，无奖励",
    money: "定时更新，无奖励",
};
    top = [
];
    weapon = [
];
    score = [
];

    constructor() {
        super();
        for (let i = 0; i < 10; i++) {
            this.top[i] = "每天获得黄金*" + (50 + (10 - i) * 5);
        }
        for (let i = 0; i < 10; i++) {
            this.weapon[i] = "每天获得玄晶*" + (50 + (10 - i) * 5);
        }
        for (let i = 0; i < 20; i++) {
            this.score[i] = "每天获得潜能：" + (20 - i) * 1000;
        }
    }

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, par, index) {
    if (!par) {
        return;
    }
    let rule = this.rules[par];
    if (!rule) return me.notify("你要看什么？");
    let ary = this[par] ?? [];
    let reward = ary[index - 1] ?? "";

    me.notify("<hic>" + rule + reward + "</hic>");
}
    score_reward(i) {
    return {
        obj: "money/exp",
        count: (20 - i) * 1000
    };
}
    top_reward(i) {
    return {
        obj: "money/gold",
        count: (50 + (10 - i) * 5)
    };
}
    weapon_reward(i) {
    return {
        obj: "st/xuanjing",
        count: (50 + (10 - i) * 5)
    };
}
}
