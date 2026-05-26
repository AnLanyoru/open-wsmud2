this.inherits(SKILL);
this.name = "蒙古心法";
this.id = "mengguxinfa";
this.grade = 2;
this.force_rad = 0.8;
this.desc = "蒙古士兵常用的一种心法";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["force"];
this.query_enable_prop = function (lv) {
    return {
        force: {
            gj: lv,
            fy: lv,
            limit_mp: lv * 50,
            desc: "唯一：将你内力的80%转化为气血"
        }
    };
}

this.learn_condition = {
    skill: {
        force: 350
    }
};
this.slots = [
    {
        prop: 'mgxf_cd',
        value: (lv) => 10,
        format: (val) => {
            return '硬气功绝招冷却时间减少10%';
        },
    },
    {
        prop: 'mgxf_zj',
        value: (lv) => 10 + lv / 100,
        format: (val) => {
            return '硬气功额外增加' + val + '%招架';
        },
    },
];

this.pfm = {
    power:
    {
        name: "硬气功",
        distime: 60000,
        enable_skill: "force",
        distime_per_key: 'mgxf_cd',
        mp: 20,
        release_time: 0,
        // use_type: 1,
        use: function (me, target, lv) {

            var time = (10000 + lv * 10);
            var gj = 10 + (lv / 100);
            me.send_room("<HIy>$N大喝一声，全身真气鼓动，看似坚不可摧。</HIy>");
            const prop = {
                fy_per: gj,
                gj_per: gj
            };

            const is_zj = me.query_prop('mgxf_zj');
            if (is_zj > 0) prop.zj_per = is_zj;


            me.add_status({
                id: "force",
                name: "硬气功",
                desc: "增加防御和攻击",
                prop: prop,
                duration: time
            });
        },
        query_desc: function (me, lv) {
            var time = (10000 + lv * 10) / 1000;
            var gj = parseInt(10 + (lv / 100));
            return "增加自身防御" + time + "秒内，提升自身，攻击防御" + gj + "%。";
        }
    }
};