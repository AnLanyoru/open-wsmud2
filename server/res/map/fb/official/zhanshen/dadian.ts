import { ROOM } from '../../../../../core/room/room.js';
import { NPC } from '../../../../../core/char/npc.js';
import type { USER } from '../../../../../core/char/user.js';

const DIRECTION_NAMES: Record<string, string> = {
    north: '北',
    northeast: '东北',
    east: '东',
    southeast: '东南',
    south: '南',
    southwest: '西南',
    west: '西',
    northwest: '西北',
};

export default class extends ROOM {
    name = '战神大殿';
    desc = "大殿高阔得不似人间建筑，中央<cmd cmd='look statue'>战神像</cmd>俯瞰众生，<cmd cmd='look vine'>蔓藤</cmd>攀上石阶，瀑布下有<cmd cmd='look pool'>深潭</cmd>，西侧可见<cmd cmd='look mine'>矿坑</cmd>，南侧<cmd cmd='look fire_cave'>融火窟</cmd>赤光翻涌，地面嵌着<cmd cmd='look disk'>五行圆盘</cmd>和<cmd cmd='look bagua'>八卦暗道</cmd>。";
    exits = {
        west: 'fb/official/zhanshen/shouwei2',
        east: 'fb/official/zhanshen/daohuang',
        north: 'fb/official/zhanshen/shijie',
    };

    constructor() {
        super();
        this.set_item('statue', '战神像', '神像掌中刻着“天地不仁，以万物为刍狗”十字。', [
            ['worship', '祭拜战神', this.worship],
        ]);
        this.set_item('vine', '蔓藤', '粗壮蔓藤直通石阶上方，一只巨大鸟窝藏在云雾间。', [
            ['climb', '攀藤掏鸟窝', this.climb],
        ]);
        this.set_item('pool', '深潭', '瀑布下深潭幽暗无底，水下偶尔掠过庞大黑影。', [
            ['dive', '潜入深潭', this.dive],
            ['jump_river', '穿上鸟窝跳入地下河', this.jumpRiver],
        ]);
        this.set_item('mine', '矿坑', '矿壁中金气流转，深处传来沉重的刨石声。', [
            ['dig', '下坑挖矿', this.dig],
        ]);
        this.set_item('fire_cave', '融火窟', '窟内烈焰凝而不散，有异兽伏在岩浆之间。', [
            ['enter_fire', '进入融火窟', this.enterFire],
        ]);
        this.set_item('disk', '五行圆盘', '圆盘有金、木、水、火四处凹槽，中央土位与整座战神殿相连。', [
            ['inlay', '镶嵌五行石', this.inlay],
        ]);
        this.set_item('bagua', '八卦暗道', '第三波守卫身后浮现八方卦象，须按神石孤星所指方位踏入，再从暗道跳下。', [
            ['enter_north', '踏入北方', this.enterNorth],
            ['enter_northeast', '踏入东北', this.enterNortheast],
            ['enter_east', '踏入东方', this.enterEast],
            ['enter_southeast', '踏入东南', this.enterSoutheast],
            ['enter_south', '踏入南方', this.enterSouth],
            ['enter_southwest', '踏入西南', this.enterSouthwest],
            ['enter_west', '踏入西方', this.enterWest],
            ['enter_northwest', '踏入西北', this.enterNorthwest],
            ['jump', '跳下暗道', this.jump],
        ]);
    }

    on_enter(me: USER) {
        if (!me.is_player) return;
        if (this.fb_query_temp('zhanshen_guard_wave', me, 0) !== 3 || this.is_here('fb/zhanshen/shouwei')) return;
        for (let i = 0; i < 8; i++) {
            const guard = NPC.CLONE('fb/zhanshen/shouwei');
            guard.set_temp('zhanshen_wave', 3);
            this.item_changed(guard, true);
            guard.do_kill(me);
        }
        me.notify('<hir>第三波八名神殿守卫自最右侧宫殿同时涌出！</hir>');
    }

    worship(me: USER) {
        if (!this.canEnter(me)) return;
        if (this.fb_query_temp('diff', me, 0) !== 1) return me.notify('普通流程无需祭拜战神。');
        if (this.fb_query_temp('zhanshen_worshipped', me, false)) return me.notify('你已经完成祭拜。');
        this.fb_set_temp('zhanshen_worshipped', true, me);
        me.notify('<hio>你诵念“天地不仁，以万物为刍狗”，选择直面自身心魔，战神像随之睁开双眼。</hio>');
    }

    climb(me: USER) {
        if (!this.canEnter(me)) return;
        if (this.fb_query_temp('zhanshen_wood', me, false) || this.is_here('fb/zhanshen/mufeng')) return me.notify('云雾中的鸟窝已经空了。');
        const mufeng = NPC.CLONE('fb/zhanshen/mufeng');
        this.item_changed(mufeng, true);
        me.notify('你攀上蔓藤探手掏向鸟窝，一声凤鸣震散云雾，木凤振翅扑来！');
        mufeng.do_kill(me);
    }

    dive(me: USER) {
        if (!this.canEnter(me)) return;
        if (this.fb_query_temp('zhanshen_water', me, false) || this.is_here('fb/zhanshen/molong')) return me.notify('深潭中已不见魔龙踪影。');
        const count = this.fb_add_temp('zhanshen_dive', 1, me);
        if (count < 3) return me.notify('你潜入冰冷潭水，黑影从更深处一闪而过。');
        const molong = NPC.CLONE('fb/zhanshen/molong');
        this.item_changed(molong, true);
        me.notify('你再次潜入水底，魔龙破水而出，张口便向你噬来！');
        molong.do_kill(me);
    }

    dig(me: USER) {
        if (!this.canEnter(me)) return;
        if (this.fb_query_temp('diff', me, 0) !== 1) return me.notify('普通难度下矿坑被巨石封死。');
        if (!this.fb_query_temp('zhanshen_worshipped', me, false)) return me.notify('祭拜战神后方能感知矿脉中的金行灵气。');
        if (this.fb_query_temp('zhanshen_metal', me, false) || this.is_here('fb/zhanshen/wuxingshou')) return me.notify('矿坑中的金行灵气已经散尽。');
        const beast = NPC.CLONE('fb/zhanshen/wuxingshou');
        beast.name = '金行兽';
        beast.title = '<hiy>西方金煞</hiy>';
        beast.set_temp('zhanshen_element', 'metal');
        this.item_changed(beast, true);
        me.notify('你挖开矿层，一头金行兽撞碎矿壁冲了出来！');
        beast.do_kill(me);
    }

    enterFire(me: USER) {
        if (!this.canEnter(me)) return;
        if (this.fb_query_temp('diff', me, 0) !== 1) return me.notify('普通难度下融火窟烈焰封路。');
        if (!this.fb_query_temp('zhanshen_worshipped', me, false)) return me.notify('祭拜战神后方能踏入融火窟。');
        if (this.fb_query_temp('zhanshen_fire', me, false) || this.is_here('fb/zhanshen/wuxingshou')) return me.notify('融火窟中的火行灵气已经散尽。');
        const beast = NPC.CLONE('fb/zhanshen/wuxingshou');
        beast.name = '火行兽';
        beast.title = '<hir>南方火煞</hir>';
        beast.set_temp('zhanshen_element', 'fire');
        this.item_changed(beast, true);
        me.notify('你踏入融火窟，一头火行兽裹挟烈焰扑来！');
        beast.do_kill(me);
    }

    inlay(me: USER) {
        if (!this.canEnter(me)) return;
        if (this.fb_query_temp('diff', me, 0) !== 1) return me.notify('普通难度的五行圆盘没有回应。');
        if (!this.fb_query_temp('zhanshen_worshipped', me, false)) return me.notify('你尚未祭拜战神，圆盘中央土位黯淡无光。');
        if (!this.fb_query_temp('zhanshen_metal', me, false) || !this.fb_query_temp('zhanshen_wood', me, false) || !this.fb_query_temp('zhanshen_water', me, false) || !this.fb_query_temp('zhanshen_fire', me, false)) {
            return me.notify('圆盘仍缺金、木、水、火四枚五行石。');
        }
        if (this.fb_query_temp('zhanshen_inlaid', me, false)) return me.notify('五行石已经全部归位。');
        this.fb_set_temp('zhanshen_inlaid', true, me);
        me.notify('<hio>金木水火四石归位，中央土位借战神殿地脉亮起，五行圆满，刀皇殿封印尽解。</hio>');
    }

    jumpRiver(me: USER) {
        if (!this.canEnter(me)) return;
        if (this.fb_query_temp('diff', me, 0) !== 0) return me.notify('困难难度的地下河被五行封印阻断。');
        if (!this.fb_query_temp('zhanshen_wood', me, false)) return me.notify('没有木凤所化鸟窝护身，无法承受地下河乱流。');
        if (!this.fb_query_temp('zhanshen_water', me, false)) return me.notify('魔龙仍盘踞水底，无法渡河。');
        const room = this.query('fb/official/zhanshen/jiuchongtian');
        if (room) me.moveto(room, undefined, '$N穿着木凤所化鸟窝跃入地下河，被水流送往九重天。');
    }

    on_leave(me: USER, dir: string) {
        const diff = this.fb_query_temp('diff', me, 0);
        if (dir === 'east') {
            if (!this.fb_query_temp('zhanshen_entered', me, false)) return me.notify_fail('你尚未依孤星方位跳入暗道，无法进入真正的战神大殿。');
            if (diff === 0) return me.notify_fail('普通流程无需挑战刀皇，请先取得木凤鸟窝并击败魔龙，再跳入地下河。');
            if (!this.fb_query_temp('zhanshen_inlaid', me, false)) return me.notify_fail('五行圆盘尚未完成，刀皇殿被封印隔绝。');
        }
        if (dir === 'north') {
            if (!this.fb_query_temp('zhanshen_entered', me, false)) return me.notify_fail('你尚未依孤星方位跳入暗道，无法进入真正的战神大殿。');
            if (diff === 0) return me.notify_fail('普通流程的天外石阶并未显现。');
            if (!this.fb_query_temp('zhanshen_daohuang', me, false)) return me.notify_fail('刀皇的无形刀意笼罩大殿，须先击败刀皇。');
        }
    }

    enterNorth(me: USER) { this.enterFromStars(me, 'north'); }
    enterNortheast(me: USER) { this.enterFromStars(me, 'northeast'); }
    enterEast(me: USER) { this.enterFromStars(me, 'east'); }
    enterSoutheast(me: USER) { this.enterFromStars(me, 'southeast'); }
    enterSouth(me: USER) { this.enterFromStars(me, 'south'); }
    enterSouthwest(me: USER) { this.enterFromStars(me, 'southwest'); }
    enterWest(me: USER) { this.enterFromStars(me, 'west'); }
    enterNorthwest(me: USER) { this.enterFromStars(me, 'northwest'); }

    enterFromStars(me: USER, direction: string) {
        const clue = this.fb_query_temp('zhanshen_clue_direction', me, '') as string;
        if (!this.fb_query_temp('zhanshen_guards_done', me, false)) return me.notify('三波守卫尚未击败。');
        if (direction !== clue) return me.notify('你踏向' + DIRECTION_NAMES[direction] + '方，八卦暗道随即闭合。');
        this.fb_set_temp('zhanshen_bagua_found', true, me);
        me.notify('你依孤星提示踏入' + DIRECTION_NAMES[direction] + '方，卦象中央露出一条向下的暗道。');
    }

    jump(me: USER) {
        if (!this.fb_query_temp('zhanshen_bagua_found', me, false)) return me.notify('你尚未找出孤星对应的八卦方位。');
        if (this.fb_query_temp('zhanshen_entered', me, false)) return me.notify('你已经由暗道进入真正的战神大殿。');
        this.fb_set_temp('zhanshen_entered', true, me);
        me.notify('<hic>你纵身跳下暗道，沿石阶向上，终于进入真正的战神大殿。</hic>');
    }

    canEnter(me: USER) {
        if (this.fb_query_temp('zhanshen_entered', me, false)) return true;
        me.notify('须先击败三波守卫，依孤星方位踏入八卦并跳下暗道。');
        return false;
    }
}
