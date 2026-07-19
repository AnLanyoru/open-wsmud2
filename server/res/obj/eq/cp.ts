import { EQUIPMENT } from '../../../core/item/equipment.js';
import { OBJ } from '../../../core/item/obj.js';
import type { CHARACTER } from '../../../core/char/character.js';
import type { USER } from '../../../core/char/user.js';
import { WORLD } from '../../../core/world.js';
import { FORGE_TYPES, GRADE_COLORS } from '../../../core/const.js';
import { query_custom_score, rebuild_custom_prop } from '../../cmd/obj/reforge.js';
import { UTIL } from '../../../core/util.js';

export default class CustomEquipment extends EQUIPMENT {
    name = '未命名装备';
    grade = 5;
    value = 1000000;
    transable = false;
    no_fenjie = false;
    no_jinglian = false;
    hole_count = 4;

    constructor() {
        super();
        this.add_action('reforge', '重铸', function (this: EQUIPMENT, me: USER): void {
            WORLD.COMMANDS.get('reforge')?.enter(me, this.id);
        });
        this.add_action('cp_rename', '改名', function (this: CustomEquipment, me: USER): void {
            if (this.is_locked) return me.notify(this.color_name + '处于锁定状态，无法改名。');
            me.notify('请在房间频道说出新的名字，名字必须为2至5个汉字。');
            me.wait_input = (player: USER, input: string): void => this.rename(player, input);
            me.send_commands('cancle', '取消改名');
        });
    }

    on_create(_path: string, par?: string): void {
        const key = par?.substring(1) ?? '';
        const type = FORGE_TYPES[key];
        if (!type) return;
        this.name = type.name;
        this.eq_type = type.eqType;
        this.weapon_type = type.weaponType ?? '';
        this.unit = type.unit;
        rebuild_custom_prop(this);
    }

    on_clone(): void {
        this.original_prop = null;
        this.prop = {};
    }

    on_reload(_me?: CHARACTER): void {
        const savedName = this.query_temp<string>('cp_name', '');
        if (savedName) this.name = savedName;
        if (_me?.check_player() && !this.query_temp<string>('cp_owner_id', '')) this.set_temp('cp_owner_id', _me.id);
        const color = GRADE_COLORS[this.grade] ?? 'wht';
        this.color_name = '<' + color + '>' + this.name + '</' + color + '>';
        rebuild_custom_prop(this);
    }

    levelchange_prop(): void {
        rebuild_custom_prop(this);
    }

    query_score(): number {
        return query_custom_score(this);
    }

    get_desc(me: CHARACTER): string {
        rebuild_custom_prop(this);
        return super.get_desc(me);
    }

    clone(me?: CHARACTER): EQUIPMENT {
        const obj = OBJ.CREATE(this.path) as CustomEquipment;
        this.copy_temp_to(obj);
        obj.level = this.level;
        obj.st_prop = this.st_prop ? this.st_prop.map(stone => ({ ...stone, prop: { ...stone.prop } })) : null;
        obj.hole_count = this.hole_count;
        obj.on_reload(me);
        obj.level_up(this.level);
        return obj;
    }

    rename(me: USER, input: string): void {
        if (input === 'cancle') {
            me.wait_input = undefined;
            me.notify('你取消了改名。');
            return;
        }
        const name = input.includes(' ') ? input.slice(input.indexOf(' ') + 1).trim() : input.trim();
        if (!/^[\u4E00-\u9FA5]{2,5}$/.test(name)) return me.notify('装备名字必须是2至5个汉字。');
        if (!UTIL.check_word(name)) return me.notify('你不能使用这个名字。');
        this.name = name;
        this.set_temp('cp_name', name);
        const color = GRADE_COLORS[this.grade] ?? 'wht';
        this.color_name = '<' + color + '>' + name + '</' + color + '>';
        this.level_up(this.level);
        me.wait_input = undefined;
        me.items_changed(this);
        WORLD.STATS.updateWeapon(me, this);
        me.notify('改名成功。');
    }
}
