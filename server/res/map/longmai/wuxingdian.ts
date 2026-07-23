import type { USER } from '../../../core/char/user.js';
import { ROOM } from '../../../core/room/room.js';

const ORDER = ['水', '木', '火', '土', '金'];
const ELEMENTS: Record<string, string> = {
    jin: '金',
    mu: '木',
    shui: '水',
    huo: '火',
    tu: '土',
};

export default class extends ROOM {
    name = '五行殿';
    desc =
        "殿内依次分列<cmd cmd='look jin'>金印</cmd>、<cmd cmd='look mu'>木印</cmd>、<cmd cmd='look shui'>水印</cmd>、<cmd cmd='look huo'>火印</cmd>与<cmd cmd='look tu'>土印</cmd>，北面的<cmd cmd='look shimen'>石门</cmd>上刻着「循残碑生息，方见地脉流转」。";
    exits = { south: 'longmai/yongdao', north: 'longmai/huiyinlang' };

    constructor() {
        super();
        for (const id of Object.keys(ELEMENTS)) {
            const element = ELEMENTS[id];
            this.set_item(id, element + '印', '一枚刻着「' + element + '」字的石印。', [
                ['press', '按下', this.press],
            ]);
        }
        this.set_item('shimen', '石门', '石门上的纹路明灭不定，似乎会随石印间的生息牵引而流转。', [
            ['check', '查看', this.check],
        ]);
    }

    press(me: USER, id: string) {
        const element = ELEMENTS[id];
        if (!element) return;
        if (this.fb_query_temp('lm_wuxing_done', me, 0)) return me.notify('五行纹路已经全部亮起。');
        const step = this.fb_query_temp('lm_wuxing_step', me, 0);
        if (ORDER[step] !== element) {
            const errors = this.fb_add_temp('lm_wuxing_errors', 1, me);
            this.fb_set_temp('lm_wuxing_step', 0, me);
            if (errors === 1) return me.notify('五行纹路骤然熄灭。你隐约感觉残图所绘并非并列诸物，而是生息相承之意。');
            if (errors === 2) return me.notify('纹路再度沉寂。泉眼旁的深刻似乎与整幅残图的起势有着关联。');
            return me.notify('气机倏然散尽。你隐约感觉寒泉与新芽、枝叶与灯焰、余烬与厚土、土隙与冷芒之间，皆有前后相生之意。');
        }
        const next = step + 1;
        this.fb_set_temp('lm_wuxing_step', next, me);
        if (next < ORDER.length) return me.notify(element + '印微微亮起，地脉气息仍在向别处延伸。');
        this.fb_set_temp('lm_wuxing_done', 1, me);
        me.send_room('$N按下金印，五行纹路首尾贯通，北面的石门沉声开启。');
    }

    check(me: USER) {
        if (this.fb_query_temp('lm_wuxing_done', me, 0)) return me.notify('你隐约感觉殿中诸印气息首尾相衔，石门已不再受其拘束。');
        const step = this.fb_query_temp('lm_wuxing_step', me, 0);
        me.notify(
            step
                ? '你隐约感觉地脉气息已被引动，却仍在石印之间徘徊。'
                : '你隐约感觉诸印气息各自沉寂，尚未循势相接。',
        );
    }

    on_leave(me: USER, dir: string) {
        if (dir === 'north' && !this.fb_query_temp('lm_wuxing_done', me, 0)) {
            return me.notify_fail('五行石门纹丝不动。你隐约感觉它与殿中尚未相续的生息有着关联。');
        }
    }
}
