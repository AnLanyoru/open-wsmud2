import { COMMAND } from '../../../core/command.js';
import { CHARACTER } from '../../../core/char/character.js';
import { PROPERTIES } from '../../../core/const.js';
import type { USER } from '../../../core/char/user.js';
import { WORLD } from '../../../core/world.js';

interface PropDetail {
    key: string;
    name: string;
    value: number;
    percentage: boolean;
}

/** 属性面板展示顺序；未列出的已映射属性保持 PROPERTIES 中的分类顺序。 */
const PROP_DISPLAY_ORDER = [
    'str1', 'con1', 'dex1', 'int1',
    'str', 'con', 'dex', 'int', 'per', 'age',
    'max_hp', 'max_mp', 'limit_mp',
    'gj', 'fy', 'mz', 'ds', 'zj', 'bj_per', 'gjsd',
    'hp_per', 'mp_per', 'gj_per', 'fy_per', 'mz_per', 'ds_per', 'zj_per', 'gjsd_per',
    'add_sh', 'add_sh_per', 'add_bjsh_per', 'diff_sh', 'diff_sh_per', 'diff_sh_per2',
    'diff_fy_per', 'diff_fy_per2', 'diff_bj',
    'releasetime', 'releasetime_per', 'distime', 'distime_per', 'expend_mp', 'expend_mp_per',
    'busy', 'busy_per', 'diff_busy', 'diff_busy_per', 'diff_downside', 'diff_downside_per',
    'recover_per', 'study_per', 'lianxi_per', 'dazuo', 'dazuo_per',
] as const;

const PROP_ORDER = new Map<string, number>(PROP_DISPLAY_ORDER.map((key, index) => [key, index]));
const PROPERTY_SOURCE_ORDER = new Map<string, number>(
    Object.keys(PROPERTIES).map((key, index) => [key, index]),
);

function is_percentage_prop(key: string): boolean {
    return key.endsWith('_per') || key.endsWith('_per2') || key === 'diff_bj';
}

export default class extends COMMAND {
    command = 'score3';
    allow_busy = true;
    allow_state = true;
    allow_die = true;

    enter(me: USER, arg: string) {
        const target = this.find_target(me, arg);
        if (!target) return me.notify('你要查看谁的属性。');

        const mapped: PropDetail[] = [];
        const unmapped: PropDetail[] = [];
        const prop = target.prop;
        if (prop) {
            // prop 在克隆对象上可能以原型链保留模板属性，for...in 才能完整取得。
            for (const key in prop) {
                const value = prop[key];
                if (typeof value !== 'number') continue;
                const name = PROPERTIES[key as keyof typeof PROPERTIES];
                const detail = { key, name: name ?? key, value, percentage: is_percentage_prop(key) };
                (name ? mapped : unmapped).push(detail);
            }
        }

        mapped.sort((a, b) => {
            const aOrder = PROP_ORDER.get(a.key) ?? 1000 + (PROPERTY_SOURCE_ORDER.get(a.key) ?? 1000);
            const bOrder = PROP_ORDER.get(b.key) ?? 1000 + (PROPERTY_SOURCE_ORDER.get(b.key) ?? 1000);
            return aOrder - bOrder || a.key.localeCompare(b.key);
        });
        unmapped.sort((a, b) => a.key.localeCompare(b.key));
        me.send(
            JSON.stringify({
                type: 'dialog',
                dialog: 'score',
                view: 'props',
                id: target.id,
                name: target.long_name(),
                mapped,
                unmapped,
            }),
        );
    }

    private find_target(me: USER, arg: string): CHARACTER | undefined {
        if (!arg) return me;
        let target = me.find_obj(arg, me.environment);
        if (!target && me.user_level > 1) target = WORLD.getUser(arg);
        if (!target?.check_character()) return undefined;
        if (target.master !== me.id && me.user_level < 4) return undefined;
        return target;
    }
}
