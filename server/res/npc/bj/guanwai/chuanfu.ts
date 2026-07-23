import { NPC } from '../../../../core/char/npc.js';
import { USER } from '../../../../core/char/user.js';

export default class extends NPC {
    name = '船夫';
    desc = '这是一个松花江上的船夫。饱经风霜的脸上透出东北人的豪爽。';
    gender = 1;
    age = 45;
    per = 26;
    mp = 400;
    max_mp = 400;
    hp = 500;
    max_hp = 500;

    constructor() {
        super();
        this.set_objects(['eq/lv0/cloth', 1, 1]);
        this.set_drop(
            {
                obj: 'sp/tool/diao#1',
                odds: 500,
            },
            {
                obj: 'sp/tool/diao#2',
                odds: 50,
            },
        );
        this.set_chat_msg([
            '船夫搓着手说道：江上风急，要过江就交一两黄金。',
            '船夫抬头望了望天色，说道：再晚些风雪更大，船就不好走了。',
            '船夫说道：往西过了江，就是船厂，再往南便是一片雪地。',
        ]);
        this.set_ask('过江', this.ask_about_guojiang);
        this.set_ask('船厂', function (me) {
            me.notify('船夫说道：江对岸有个旧船厂，过了船厂就是白茫茫的雪地，进山的人都要小心。');
        });
    }

    ask_about_guojiang(me: USER) {
        me.notify('船夫说道：坐船到江对面一两黄金，风雪再大也给你送过去。');
        me.send_commands('give ' + this.id + ' 10000 money', '交钱坐船');
    }

    on_leave(me: USER, dir: string): boolean | void {
        const env = this.environment;
        if (
            (env?.path == 'fb/guanwai/damen' && dir == 'west') ||
            (env?.path == 'fb/guanwai/chuanchang' && dir == 'east')
        ) {
            me.notify('船夫对你说道：江面化冻了，没船可不行。');
            me.send_commands(
                'ask ' + this.id + ' about 过江',
                '询问过江',
                'ask ' + this.id + ' about 船厂',
                '询问船厂',
            );
            return false;
        }
    }

    on_accept(me: USER, obj: string, count: number): boolean | void {
        if (obj != 'money' || count != 10000) return;
        const env = this.environment;
        if (!env?.owner || (env.path != 'fb/guanwai/damen' && env.path != 'fb/guanwai/chuanchang'))
            return false;
        const river = env.parent?.rooms
            ?.find(item => item.path == 'fb/guanwai/jiang')
            ?.query_copy(env.owner);
        if (!river || me.moveto(river, '$N跟着船夫登上小船。', '$N乘着小船驶入江心。') == false)
            return false;
        this.moveto(river, '$N解开缆绳，撑船离岸。', '$N掌着舵驶入江心。');
        me.send_room('船夫辨着水势掌舵，一声「起锚」，小船便张帆向对岸驶去......');
        const path = env.path == 'fb/guanwai/damen' ? 'fb/guanwai/chuanchang' : 'fb/guanwai/damen';
        this.call_out(this.arrive, 3000, me, { path, owner: env.owner });
        return true;
    }

    arrive(me?: USER, target?: { path: string; owner: string }) {
        if (!me || !target) return;
        const env = this.environment;
        if (!env || me.environment !== env || env.path != 'fb/guanwai/jiang') return;
        const room = env.parent?.rooms
            ?.find(item => item.path == target.path)
            ?.query_copy(target.owner);
        if (!room) return;
        me.send_room('小船穿过风雪靠上对岸，船夫收起风帆，将跳板搭上岸边。');
        me.moveto(room, '$N踏上跳板离开了小船。', '$N从松花江上的小船走了下来。');
        this.moveto(room, '$N撑着船靠上了岸。', '$N收起风帆，从船上走了下来。');
    }
}
