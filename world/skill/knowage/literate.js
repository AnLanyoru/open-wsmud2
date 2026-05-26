
this.inherits(SKILL);
this.id = "literate";
this.name = "读书写字";
this.grade = 0;
this.desc = "书中自有黄金屋，书中自有颜如玉，多读书会提高自己的悟性，减少技能的学习时间";
this.type = SKILL_TYPES.KNOWLEDGE;
this.query_prop = function (lv, me) {
    let grade = 0;
    if (me && me.is_player) {
        grade = this.query_grade(me);
    }

    return { int: parseInt(lv / (10 - grade)) }
}




this.slots = [
    {
        prop: "fenjie",
        name: "机关术",
        value: lv => Math.pow(lv, 1 / 3),
        count: 1,
        query_needs: function (grade) {
            return [{
                path: "book/lt#GAIBANG",
                count: 1
            }];
        },
        format: (val) => {
            return "机关术：基础悟性提升，分解装备获得额外" + val + "玄晶";
        }
    },
    {
        prop: "obs",
        name: "观气术",
        value: lv => lv,
        count: 1,
        query_needs: function () {
            return [{
                path: "book/lt#WUDANG",
                count: 1
            }];
        },
        format: (val) => {
            return "观气术：基础悟性提升，查看他人可获得额外信息";
        }
    },
    {
        prop: "haoranqi",
        value: lv => 10,
        count: 3,
        name: "浩然气",
        query_needs: function () {
            return [{
                path: "book/lt#HUASHAN",
                count: 1
            }];
        },
        format: (val) => {
            return "浩然气：基础悟性提升，学习知识类技能的消耗降低10%";
        }
    },
    {
        prop: "recover_per",
        value: lv => 10,
        count: 3,
        name: "普渡",
        query_needs: function () {

            return [{
                path: "book/lt#EMEI",
                count: 1
            }];
        },
        format: (val) => {
            return "普渡：基础悟性提升，疗伤效率增加10%";
        }
    },
    {
        prop: "shashou",
        value: lv => Math.min(1 + lv / 20, 200),
        count: 3,
        name: "赏罚论",
        query_needs: function () {
            return [{
                path: "book/lt#SHASHOU",
                count: 1
            }];
        },
        format: (val) => {
            return "赏罚论：基础悟性提升，门派战中获得额外" + val + "功绩";
        }
    },
    {
        prop: "shaolin",
        value: (lv, grade) => 1 + lv / 10 / (10 - grade),
        name: "见禅心",
        query_needs: function () {
            return [{
                path: "book/lt#SHAOLIN",
                count: 1
            }];
        },
        format: (val) => {
            return "见禅心：基础悟性提升，打坐中会持续增加效率，最高额外+" + val;
        }
    },

    {
        prop: "shuangxiu",
        value: (lv, grade) => 1 + lv / 10 / (10 - grade),
        count: 1,
        name: "齐逍遥",
        query_needs: function () {
            return [{
                path: "book/lt#XIAOYAO",
                count: 1
            }];
        },
        format: (val) => {
            return "齐逍遥：基础悟性提升，双修的基础效率增加" + val + "点";
        }
    }
];