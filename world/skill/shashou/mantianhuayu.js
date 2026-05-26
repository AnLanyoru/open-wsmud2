this.inherits(SKILL);
this.name = "漫天花雨";
this.id = "mantianhuayu";
this.grade = 4;

this.family = FAMILIES.SHASHOU;
this.attack_actions = [
    "$N双手一晃，一招「千变万化」，手中的$w幻出万道金光，如一条金龙般飞向$n的$l",
    "$N右手一抖，一道金光冒出，正是一招「奇诡莫测」，抢先飞向$n的$l",
    "$N突然旋身，$w在旋转中化作「银轮割风」，边缘泛着锐光，既封退路又取$l",
    "$N掌心一翻，$w悄然滑出，一招「无声夺命」，不见破空之声却已抵近$n$l",
    "$N手腕轻抖，$w骤然化作「飞星追影」，一道冷光划破虚空，直取$n$l要害",
    "$N指尖一弹，$w化作「流光穿云」，破风之声忽强忽弱，轨迹飘忽难测地缠向$n$l"
];
this.desc = "杀手楼的暗器武功，使用的时候如漫天星光而得名";
//<$1>$2</$1>
//<$1>$2</$1>
this.can_enables = ["throwing", "sword"];
this.learn_condition = {
    max_mp: 200,
    skill: {
        throwing: 300
    }
};

this.query_prop = function (lv) {
    return {
        bj_per: 5 + parseInt(lv / 300)
    };
}
this.query_enable_prop = function (lv) {
    return {
        throwing: {
            gj: parseInt(lv * 1.4) + 4,
            mz: parseInt(lv * 1.4) + 4,
            mz_per: parseInt(lv / 500) + 1
        },
        sword: {
            gj: parseInt(lv * 1.4) + 4,
            mz: parseInt(lv * 1.4) + 4,
            bj_per: 8,
        }
    };
}
this.pfm = {
    luo:
    {
        name: "落花",
        distime: 18000,
        // enable_skill: "throwing",
        mp: 20,
        use: function (me, target, lv, type) {
            let is_throwing = type !== 'sword';
            if (is_throwing)
                me.send_room("<hiy>$N手中$T一抖，幻出万点星光，如朵朵落花般撒向$n</hiy>", target);
            else
                me.send_room("<hiy>$N手中$W一抖，幻出万点星光，如朵朵落花般撒向$n</hiy>", target);
            var count = 1 + parseInt(me.bj / 5);
            if (count > 10) count = 10;
            for (var i = 0; i < count; i++) {
                me.do_attack({
                    target: target,
                    attack_msg: "",
                    gj: me.gj,
                    mz: me.mz,
                    no_append: true,

                    is_throwing: is_throwing
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {

            return "漫天暗器攻击敌人，每5%暴击增加一次攻击，最多10次";
        }
    },
    wu:
    {
        name: "定影",
        distime: 30000,
        enable_skill: "throwing",
        mp: 20,
        release_time: 0,
        use: function (me, target, lv) {
            var time = 5000 + parseInt(lv * 10 / 3);
            if (time > 15000) time = 15000;

            me.do_attack({
                target: target,
                gj: me.gj,
                mz: me.mz,
                attack_msg: "<hiy>$N手中青光冒出，一瞬间$T已飞向$n化作点点星光笼罩$p周身大穴！</hiy>"
            })
            var ds = 10 + parseInt(lv / 100);
            target.add_status({
                id: "rash",
                name: "定影",
                duration: time,
                is_rash: true,
                downside: true
            }, me);
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var time = 5 + parseInt(lv / 300);
            if (time > 15) time = 15;
            return "使用暗器攻击敌人，如果命中则使敌人定身" + time + "秒";
        }
    }
};