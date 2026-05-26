this.inherits(SKILL);
this.name = "打狗棒";
this.id = "dagoubang";
this.grade = 3;
this.attack_actions = [
    "$N使出一招「棒打双犬」，手中$w化作两道青光砸向$n的$l",
    "$N手中$w左右晃动，一招「拨草寻蛇」向$n的$l攻去",
    "$N举起$w，居高临下使一招「打草惊蛇」敲向$n的$l",
    "$N施出「拨狗朝天」，$w由下往上向$n撩去"

];
this.desc = "丐帮的打狗棒法";
this.family = FAMILIES.GAIBANG;
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["club"];
this.learn_condition = {
    max_mp: 5000,
    skill: {
        club: 300
    }
};

this.query_enable_prop = function (lv) {
    return {
        club: {
            gj: parseInt(lv * 1.5) + 100,
            str: parseInt(lv / 8),
            mz: parseInt(lv * 1.6)
        }
    };
}
this.pfm = {
    chan:
    {
        name: "绊字决",
        distime: 20000,
        enable_skill: "club",
        mp: 20,
        release_time: 1800,
        use: function (me, target, lv) {

            var time = 3000 + lv * 5;
            var ds = 10 + parseInt(lv / 100);
            if (me.do_attack({
                target: target,
                gj: me.gj,
                mz: me.mz,
                attack_msg: "<hiw>$N使出打狗棒法「绊」字诀，棒头在地下连点，连绵不绝地挑向$n的小腿和脚踝。</hiw>"
            })) {

                var time = parseInt((6000 + lv * 2));
                if (time > 10000) time = 10000;
                target.add_status({
                    id: "busy",
                    duration: time,
                    name: "绊字诀",
                    is_busy: true,
                    downside: true
                }, me);
                me.end_attack(target);
            }
        },
        query_desc: function (me, lv) {
            var time = parseInt((6000 + lv * 2) / 1000);
            if (time > 10) time = 10;
            var ds = 10 + parseInt(lv / 100);
            return "攻击敌方下路，命中后使对方忙乱" + time + "秒。";
        }
    }, wu: {
        name: "天下无狗",
        distime: 20000,
        enable_skill: "club",
        mp: 20,
        attack_msgs: [
            "<hiw>$N使出一招「棒打双犬」，手中$w化作两道青光砸向$n的$l</hiw>",
            "<hiw>$N手中$w左右晃动，一招「拨草寻蛇」向$n的$l攻去</hiw>",
            "<hiw>$N举起$w，居高临下使一招「打草惊蛇」敲向$n的$l</hiw>",
            "<hiw>$N施出「拨狗朝天」，$w由下往上向$n撩去</hiw>"
        ],
        use: function (me, target, lv) {
            var count = 3 + parseInt(lv / 100);
            if (count > 10) count = 10;
            this.suc_count = 0;
            me.send_room("<hiw>$N手中青光一闪，响起阵阵风声，手中$W犹若千百根相似，层层叠叠将$n笼罩。</hiw>\n", target);
            for (var i = 0; i < count; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    attack_msg: this.attack_msgs.random()
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var count = 3 + parseInt(lv / 100);
            if (count > 10) count = 10;
            return "快速对敌人攻击" + count + "次";
        }
    }
};