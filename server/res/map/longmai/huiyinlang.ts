import type { USER } from '../../../core/char/user.js';
import { ROOM } from '../../../core/room/room.js';

const ORDER = ['石磬', '铁链', '井壁'];
const SOUNDS: Record<string, string> = {
    shiqing: '石磬',
    tielian: '铁链',
    jingbi: '井壁',
};

export default class extends ROOM {
    name = '回音廊';
    desc =
        "弧形长廊将细微声响层层折回，廊中悬着一面<cmd cmd='look shiqing'>石磬</cmd>与一条<cmd cmd='look tielian'>锈蚀铁链</cmd>，尽头露出的<cmd cmd='look jingbi'>幽深井壁</cmd>仿佛也能传回声响。地面刻着「刀痕有深浅，余音亦有来处」，一旁的<cmd cmd='look huibi'>回音壁</cmd>上遍布深浅不一的旧痕。";
    exits = { south: 'longmai/wuxingdian', north: 'longmai/zhensuotai' };

    constructor() {
        super();
        for (const id of Object.keys(SOUNDS)) {
            const sound = SOUNDS[id];
            this.set_item(id, sound, '可以敲击发声的' + sound + '。', [
                ['strike', '敲击', this.strike],
            ]);
        }
        this.set_item('huibi', '回音壁', '壁上刀痕深浅相续：浅处散着白色石屑，中段嵌有暗红铁锈，幽深裂纹则一直没入井壁。你隐约感觉刀痕深浅与声纹流转有着关联。', [
            ['check', '查看', this.check],
        ]);
    }

    strike(me: USER, id: string) {
        const sound = SOUNDS[id];
        if (!sound) return;
        if (this.fb_query_temp('lm_echo_done', me, 0)) return me.notify('你隐约感觉廊中诸般余音早已归入一声龙吟。');
        const step = this.fb_query_temp('lm_echo_step', me, 0);
        if (ORDER[step] !== sound) {
            const errors = this.fb_add_temp('lm_echo_errors', 1, me);
            this.fb_set_temp('lm_echo_step', 0, me);
            if (errors === 1) return me.notify('杂音彼此冲撞，声纹尽数散去。你隐约感觉刀痕深浅并非偶然，近旁残迹亦在暗示声音的来处。');
            if (errors === 2) return me.notify('余音再度消散。最浅的刀痕与细白石屑似乎有着关联，清越之声隐隐萦绕其间。');
            return me.notify('声纹倏然归寂。你隐约感觉浅处石屑、中段铁锈与幽深井隙各藏一声，刀痕愈深，余音也愈沉。');
        }
        const next = step + 1;
        this.fb_set_temp('lm_echo_step', next, me);
        if (next < ORDER.length) return me.notify(sound + '的回音嵌入石壁，声纹仍向廊深处缓缓游走。');
        this.fb_set_temp('lm_echo_done', 1, me);
        me.send_room('$N敲响井壁，三重回音合成一声低沉龙吟，北面的石门随之开启。');
    }

    check(me: USER) {
        if (this.fb_query_temp('lm_echo_done', me, 0)) return me.notify('你隐约感觉廊中余音已汇作低沉龙吟，北面的禁制随之沉寂。');
        const step = this.fb_query_temp('lm_echo_step', me, 0);
        me.notify(
            step
                ? '你隐约感觉已有余音栖入石壁，却尚未与廊中回响相合。'
                : '你隐约感觉声纹空寂，廊中诸声尚未彼此呼应。',
        );
    }

    on_leave(me: USER, dir: string) {
        if (dir === 'north' && !this.fb_query_temp('lm_echo_done', me, 0)) {
            return me.notify_fail('回音石门紧闭。你隐约感觉它与廊中尚未相合的余音有着关联。');
        }
    }
}
