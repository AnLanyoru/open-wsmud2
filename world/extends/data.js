
const STATS = WORLD.STATS;
const DATA = WORLD.DATA;
DATA.exps = [15, 20, 30, 40, 50, 100, 200, 80, 90, 100, 110, 120, 130];

DATA.stone_values = [1000, 5000, 30000, 150000, 1000000, 10000000];
DATA.book_values = [1, 1000, 5000, 10000, 100000, 500000, 2000000];

DATA.get_exp = function (me) {
    return me.random(5) + this.exps[me.level];
}



const FAMS_TATAS = ['WUDANG', 'HUASHAN', 'SHAOLIN',
    'EMEI', 'GAIBANG', 'XIAOYAO', 'SHASHOU', 'NONE'];
DATA.on_save = function (str) {
    str.push(',tops:', STATS.saveTops(STATS.TOPS));

    str.push(',score:', STATS.saveScore());

    // str.push(',weapons:', STATS.saveWeapon());
    str.push(',messages:', WORLD.MESSAGE.save());
    str.push(',notices:', WORLD.MESSAGE.saveNotice());

    for (let key of FAMS_TATAS) {
        let tops = STATS['tops_' + key];
        if (tops) {
            str.push(',tops_', key, ':', STATS.saveTops(tops));
        }
    }
    str.push(',eq_stats:', JSON.stringify(STATS.EQ_STATS ?? []));

    str.push(',score_stats:', JSON.stringify(STATS.SC_STATS ?? {}));
}

DATA.on_load = function (data) {
    WORLD.MESSAGE.load(data);
    this.remove_temp('xy_status');
    this.remove_temp('xy_users');
    this.remove_temp('xy_party');
    STATS.TOPS = STATS.load_tops(data.tops);
    // STATS.WEAPON = data.weapons ?? new Array(20).fill({ "score": 0 });
    STATS.SCORE = data.score ?? new Array(20).fill({ "name": "无", "score": 0 });
    STATS.EQ_STATS = new Array(11);
    data.eq_stats = data.eq_stats ?? [];
    for (let i = 0; i < 11; i++) {
        STATS.EQ_STATS[i] = data.eq_stats[i] ?? new Array(10).fill({ "score": 0 });
    }
    for (let key of FAMS_TATAS) {
        let tops = data['tops_' + key];
        STATS['tops_' + key] =
            STATS.load_tops(tops, FAMILIES[key].name + "弟子", key);
    }
    const sc_stats = data.score_stats ?? {};
    STATS.SC_STATS = {};
    for (let key of FAMS_TATAS) {
        STATS.SC_STATS[key] = sc_stats[key] ??
            new Array(20).fill({ "name": "无", "score": 0 });
    }

    console.log("全局数据已加载");
}
DATA.create_def_tops = function () {
    for (let key of FAMS_TATAS) {
        STATS['tops_' + key] = STATS.load_tops(null, FAMILIES[key].name + "弟子");
    }

}
DATA.create_def_eqs = function () {
    STATS.EQ_STATS = new Array(11);
    for (let i = 0; i < 11; i++) {
        STATS.EQ_STATS[i] = new Array(10).fill({ "score": 0 });
    }
    STATS.EQ_STATS[0] = STATS.WEAPON;
}
DATA.create_def_scs = function () {
    STATS.SC_STATS = {};
    for (let key of FAMS_TATAS) {
        STATS.SC_STATS[key] = new Array(20).fill({ "score": 0 });
    }
}


DATA.PROPS = {


};

DATA.reset_famtops = function (me, fam) {
    me.remove_temp('top_fam_sc');
    me.remove_temp('top_fam');
    let tops = STATS['tops_' + fam.id];
    if (tops) {
        for (let i = 0; i < tops.length; i++) {
            let user = tops[i];
            if (user.userid === me.id) {
                user.userid = null;
                user.name = fam.name + "弟子";
                user.title = null;
                break;
            }
        }
    }
    tops = STATS.SC_STATS?.[fam.id];
    if (tops) {
        for (let i = 0; i < tops.length; i++) {
            if (tops[i].id === me.id) {
                tops.splice(i, 1);
                break;
            }
        }
    }

}