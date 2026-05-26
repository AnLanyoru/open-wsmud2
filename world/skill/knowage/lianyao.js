
this.inherits(SKILL);
this.id = "lianyao";
this.name = "炼药术";
this.grade = 0;
this.desc = "使用药草制作各种丹药的技能，提高你的炼药成功率";
this.type = SKILL_TYPES.KNOWLEDGE;

this.query_prop = lv => ({ lianyao1: Math.floor(lv / 200) });






this.slots = [
    {
        prop: "ly_wd",
        name: "炼药武道",
        value: lv => 1,
        count: 1,
        query_needs: function (grade) {
            return [{
                path: "book/gj",
                count: 1
            }];
        },
        format: (val) => {
            return "采药或炼药期间也可以获得武道残页(仅玩家共享闭关)";
        }
    }, {
        prop: "ly_qn",
        name: "潜能增加",
        value: lv => 1 + Math.min(lv / 200),
        count: 3,
        query_needs: function (grade) {
            return [{
                path: "book/gj",
                count: 1
            }];
        },
        format: (val) => {
            return "采药或炼药时获得的潜能+" + val;
        }
    }, {
        prop: "ly_ks",
        name: "等级加速",
        value: lv => 1 + Math.min(lv / 100),
        count: 3,
        query_needs: function (grade) {
            return [{
                path: "book/gj",
                count: 1
            }];
        },
        format: (val) => {
            return "炼药术提升的速度+" + val;
        }
    }
];