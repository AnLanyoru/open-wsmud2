import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

export default class extends EQUIPMENT {
    unit = '把';
    name = '轩辕剑';
    desc =
        '传说中的神器，由众神采首山之铜为黄帝所铸，以此击杀蚩尤，剑身一面刻日月星辰，一面刻山川草木。';
    value = 5000000;
    grade = 6;
    hole_count = 5;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;
    prop: PropMap = {
        gj: 780,
        str: 150,
        mz_per: 20,
        add_sh_per: 12,
        diff_fy_per: 12,
        desc: '命中后增加你的全部战斗属性10%，可叠加10层',
    };

    // 分型配置（on_create 时按 #N 直接挂载，攻击时直接读取，不另行判断）
    /** 每层加成百分比 */
    eff_per = 10;
    /** 最大叠加层数 */
    max_count = 10;
    /** 状态是否不可清除 */
    no_clear = false;

    on_create(path?: string, par?: string): void {
        // 分型：无# / #1 = 10%/10层；#2 = 20%/5层；#3 = 20%/5层且不可清除
        let n = 0;
        if (par) {
            const t = parseInt(par.slice(1), 10);
            if (t >= 1 && t <= 3) n = t;
        }
        if (n === 2) {
            this.eff_per = 20;
            this.max_count = 5;
            this.no_clear = false;
            this.prop.desc = '命中后增加你的全部战斗属性20%，可叠加5层';
        } else if (n === 3) {
            this.eff_per = 20;
            this.max_count = 5;
            this.no_clear = true;
            this.prop.desc = '命中后增加你的全部战斗属性20%，可叠加5层，且该状态不可被清除';
        } else {
            // 无# / #1：默认 10%/10层
            this.eff_per = 10;
            this.max_count = 10;
            this.no_clear = false;
            this.prop.desc = '命中后增加你的全部战斗属性10%，可叠加10层';
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }

    // 命中后增加你的全部战斗属性，层数与数值由分型决定
    do_attack(me: CHARACTER, _target: CHARACTER, par: DoAttackPar): number {
        if (par.no_weapon) return 0;

        // 内置CD 5秒，防止高攻速瞬间叠满
        const cdKey = 'eq/xyj_cd';
        if (me.query_temp<number>(cdKey)) return 0;

        me.send_room(random_msg[Math.floor(Math.random() * random_msg.length)]);
        me.add_status({
            id: 'eq/xyj',
            name: '圣道',
            desc: '你的全部战斗属性提升了',
            max_count: this.max_count,
            prop: {
                gj_per: this.eff_per,
                fy_per: this.eff_per,
                mz_per: this.eff_per,
                ds_per: this.eff_per,
                zj_per: this.eff_per,
            },
            duration: 6000,
            count: 1,
            override: 1,
            only_combat: true,
            no_clear: this.no_clear,
        });
        me.set_temp(cdKey, 1, 5000);

        return 0;
    }
}

const random_msg = [
    _tmpl('<hir>$N的$W映出山川草木，百川映照之下如圣如佛</hir>'),
    _tmpl('<hir>$N的$W映出煌煌大日，烈阳高悬之下似梦似幻</hir>'),
    _tmpl('<hir>$N的$W映出皎皎明月，清辉遍洒之下如水如镜</hir>'),
    _tmpl('<hir>$N的$W映出满天繁星，银汉横空之下似珠似玉</hir>'),
];
