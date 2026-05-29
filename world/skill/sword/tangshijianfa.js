import { SKILL } from "../../../os/skill/skill.js";

export default class extends SKILL {
    name = "唐诗剑法";
    id = "tangshijianfa";
    grade = 1;
    attack_actions = [
    "$N手中$w自左上方斜劈向下，跟着向后挺剑刺出，一招<HIC>「孤鸿海上来，池潢不敢顾」</HIC>，手中$w更不回头，一剑剑点向$n的$l。",
    "$N退了两步，$w大开大阖，一声吆喝，横削三剑，一招<HIB>「哥翁喊上来，是横不敢过」</HIB>直刺$n的$l",
    "突然间嗤嗤嗤三声，$N向$n连刺三剑，一式<HIG>「俯听闻惊风，连山若波涛」</HIG>，剑刃在$n的$l边堪堪掠过，$n只觉$l凉飕飕地，大吃一惊，急忙倒退。",
    "$N手中$w递出，一个虚招指向$n的左肩，反手却使出一式<HIY>「落日照大旗，马鸣风萧萧」</HIY>，由下而上$w疾刺$n的$l",
    "$N一招<HIW>「举头望明月，低头思故乡」</HIW>，身子前倾，忽地回剑斜削，手中$w平平地向$n的$l挥去",
    "$N上身往左侧一拧，一招<BLU>「长安一片月，万户捣衣声」</BLU>，右手$w反手向$n的$l挥去",
    "$N左一招<MAG>「万国仰宗周」</MAG>，右一招<HIM>「衣冠拜冕旒」</HIM>，剑锋平指，一气呵成横扫$n的$l"
];
    desc = "一招一诗句，据传共三十六首唐诗三十六路剑法套路，目前只留残缺版本";
    can_enables = ["sword"];
    learn_condition = {
    max_mp: 100,
    skill: {
        sword: 100
    }
};
    slots = [

    {
        prop: 'tsjf_cz',
        value: (lv) => 2000,
        format: (val) => {
            return '躺尸出招时间减少2秒';
        }
    },
    {
        prop: 'tsjf_cd',
        value: (lv) => 2000,
        format: (val) => {
            return '躺尸躺地时间减少2秒';
        }
    }
];
    pfm = {
    wu:
    {
        name: "躺尸",
        distime: 20000,
        enable_skill: "sword",
        mp: 20,
        release_time: 8000,
        releasetime_key: 'tsjf_cz',
        no_auto: true,
        use: function (me, target, lv) {
            me.send_room("\n$N大叫一声倒在地上，挣扎了几下，<HIR>死了</HIR>！\n");
            var exp = (me.exp || 0);
            exp = exp * lv / 1000;
            if (target.level > 5 || exp < (target.exp || 0)) {
                return me.notify("<cyn>可惜" + target.name + "看破了你的企图。</cyn>\n");
            }
            if (me.environment && me.environment.path) {
                me.end_fight();
            }
            let time = 8000 - me.query_prop('tsjf_cd');
            if (time < 2000) time = 2000;
            me.clear_status();
            me.add_status({
                id: "busy",
                is_busy: true,
                name: "装死",
                desc: "你处于忙乱状态，无法攻击，招架",
                duration: time
            }, me);
        },
        query_desc: function (me, lv) {

            return "躺下装死，敌人将放弃对你的进攻";
        }
    }
};

    on_learn(me) {
    if (me.max_mp < 100)
        return me.notify_fail("你的内力不够。");
    if (me.query_skill("sword", 1) < 30)
        return me.notify_fail("你的基础不够，无法领会更高深的技巧。");
    return true;
}
    query_enable_prop(lv) {
    return {
        sword: {
            ds: lv * 1 + 5
        }
    };
}
}
