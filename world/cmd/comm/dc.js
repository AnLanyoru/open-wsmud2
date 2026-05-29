import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "dc";
    regex = /(\w+)\s+(\w+)\s*(.+)?/;

    /**
     * @param {CHARACTER} player - 执行命令的角色
     */
    enter(player, arg, cmd, par) {
    if (!arg || !cmd) return;
    var target = player.find_obj(arg, player.environment);
    if (!target) return player.send("没有这个人。");
    if (target.master != player.id) return player.send("你没办法这么做。");
    try {
        if (!ALLOW_DC[cmd]) return;
        target.set_listener(player, player);
        target.do_command(cmd, par);
    } catch (e) {
        throw e;
    }
    target.set_listener(player, null);
}
}

const ALLOW_DC = {
    study: true,
    store: true,
    dazuo: true,
    liaoshang: true,
    learn: true,
    xue: true,
    enable: true,
    equip: true,
    unequip: true,
    lianxi: true,
    fangqi: true,
    give: true,
    caiyao: true,
    diaoyu: true,
    cai: true,
    diao: true,
    wa: true,
    wk: true,
    stopstate: true,
    state: true,
    eq: true,
    uneq: true,
    checkobj: true,
    drop: true,
    lingwu: true,
    use: true,
    lianyao: true,
    sell: true,
    lingwu3: true,
    fenjie: true
};
