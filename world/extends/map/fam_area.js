const stand_actions = [
    ['goto fam1', '练功', '回到你所在门派师父所在位置学习武功'],

    ['goto fam2', '后勤', '前往当前门派后勤管理的位置']
];
const pt_action = [
    'goto pt_fam', '进入战场', '你的帮派正在进攻'
];

FAMILY_AREA.prototype.query_actions = function (me) {
    let actions = [];
    for (let item of stand_actions) {
        actions.push([
            item[0] + " " + this.family, item[1], item[2]
        ]);
    }
    let fam = FAMILIES[this.family];
    if (fam.battle_family) {
        let target_fam = FAMILIES[fam.battle_family];
        actions.push([
            'goto fam3 ' + this.family, '进入战场', target_fam.name + "正在进攻" + fam.name
        ]);
    }
    if (fam.first_npc) {
        actions.push([
            'sx greet', '请安', fam.name + "首席弟子：" + fam.first_npc.name
        ]);
    }
    return actions;
}
// FAMILY_AREA.prototype.query_owner = function (me) {
//     return me.query_teamid();
// }
FAMILY_AREA.prototype.notify_update = function () {
    this.json = null;
    WORLD.send(`{type:"dialog",dialog:"jh",t:"fam",refresh:${this.index}}`);
}
