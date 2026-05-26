
this.inherits(COMMAND);
this.command = "cr2";
this.allow_fight = true;
this.allow_die = true;
this.allow_state = true;
this.regex = /(\d+)\s(\d+)/;
this.enter = function (me, index, diff) {
    index = parseInt(index);
    let area = AREA.FBS[index];
    if (!area || area.no_fb || !area.is_copy || !DIFFS[diff])
        return me.send('你要看哪个副本？');
    index = area.fb_index;
    let key = "fb_first_" + (index + 1) + "_" + diff;
    let name = WORLD.DATA.query_temp(key);
    let fbname = area.name + DIFFS[diff] + "模式";
    if (!name) return me.send(fbname + "尚未完成首杀。");
    let str = ['<hic>', fbname, '由' + name + "首次通过。</hic>\n"];
    if (diff < 2) {
        for (let fam of FAMS_TATAS) {
            key = "fb_first_" + fam + "_" + (index + 1) + "_" + diff; //每个门派的
            name = WORLD.DATA.query_temp(key);
            if (!name) str.push(FAMILIES[fam].name, '尚未完成门派首杀。\n');
            else str.push('<hic>', FAMILIES[fam].name, '弟子', name, '完成门派首杀。</hic>\n');
        }
    }
    me.send(str.join(""));

}
const DIFFS = ["普通", "困难", "组队"];
const FAMS_TATAS = ['WUDANG', 'HUASHAN', 'SHAOLIN',
    'EMEI', 'GAIBANG', 'XIAOYAO', 'SHASHOU', 'NONE'];

this.set_fb_first = function (me) {

    let data = [];
    for (let item of FB_DATAS) {
        let index = parseInt(item.fb);
        let fbs = data[index];
        if (!fbs) fbs = data[index] = {};
        fbs[item.family] = item;
    }
    let str = [];
    for (let i = 0; i < 18; i++) {
        let area = AREA.FBS[i];
        if (!area || !area.is_copy || area.not_fb) continue;
        let fbs = data[i] ?? {};
        for (let item of FAMS_TATAS) {
            if (!fbs[item]) {
                if (FB_MAX[item] <= i) continue;
                fbs[item] = {
                    name: UTIL.random_name(1)
                }
            }
            let fam = FAMILIES[item];
            let key = "fb_first_" + item + "_" + (i + 1) + "_0"; //每个门派的
            WORLD.DATA.set_temp(key, fbs[item].name);
            str.push(area.name, fam.name, '设置首通', fbs[item].name, '\n');
        }

    }

    me.send(str.join(""));
}
const FB_MAX = {
    HUASHAN: 15,
    XIAOYAO: 18,
    SHASHOU: 12,
    EMEI: 14,
    WUDANG: 14,
    GAIBANG: 15,
    SHAOLIN: 13,
    NONE: 12
};