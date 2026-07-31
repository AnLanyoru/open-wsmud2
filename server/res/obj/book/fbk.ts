import type { CHARACTER, SkillData } from '../../../core/char/character.js';
import { OBJ } from '../../../core/item/obj.js';
import { SKILL } from '../../../core/skill/skill.js';
import { SKILL_TYPES } from '../../../core/const.js';
import { USER } from '../../../core/char/user.js';

export default class FastBook extends OBJ {
    unit = '枚';
    name = '传功玉简';
    desc = '一本传功玉简';
    combined = true;
    value = 0;
    otype = 1;

    constructor() {
        super();
        this.add_action('split', '提取残页', me => {
            split_fast_book(me, this);
        });
    }
    on_create(path: string, par: string): void {
        if (!par) return;
        const skill = SKILL.get(par.slice(1));
        if (!skill) return;
        this.skill = skill.id;
        this.grade = skill.grade;
        const cc = this.query_grade_color();
        this.name = skill.name + '传功玉简';
        this.color_name = '<' + cc + '>' + this.name + '</' + cc + '>';
        this.desc = '一枚传功玉简，里面记载了' + skill.color_name + '的修炼之法，可助人一步登天。';
        const cond = skill.condition_tostring();
        if (cond) {
            this.desc = this.desc + '\n修炼条件：\n' + cond;
        } else {
            this.desc = this.desc + '\n修炼条件：无';
        }
        if (!this.grade) this.value = 1000;
    }

    on_use(me: CHARACTER): void {
        if (!this.skill) {
            me.notify_fail('这枚传功玉简似乎什么也没有记载。');
            return;
        }
        const skill_base = SKILL.get(this.skill);
        if (!skill_base) {
            me.notify('你不能从里面学到东西。');
            return;
        }
        let skill: SkillData | undefined = me.skills.get(this.skill);
        if (!skill) {
            skill = {
                level: 0,
                exp: 0,
                enable_skill: null,
            };
            const str: string[] = ['{type:"dialog",dialog:"skills",item:'];
            skill_base.item_to_json(str, skill, me);
            str.push('}');
            me.notify(str.join(''));
            me.skills.set(this.skill, skill);
            if (skill_base.type === SKILL_TYPES.BASE) {
                me.init_skill();
            }
        }

        skill_base.release_prop(me, me.query_skill(skill_base.id));
        skill.level = 3000;
        skill_base.attach_prop(me, skill.level);
        me.notify(
            '{type:"dialog",dialog:"skills",id:"' +
            this.skill +
            '",level:' +
            skill.level +
            ',exp:0}',
        );
        me.notify(
            '大量知识涌入识海，你对' + skill_base.color_name + '的理解直达<hir>旷古绝伦</hir>！',
        );
        me.recount();
    }
}
function split_fast_book(player: USER, book: FastBook) {
    const count = 1000
    let skill = SKILL.get(book.skill!);
    if (!skill) return
    let obj = player.add_obj('book/bc#' + skill.id, count);
    if (obj) {
        player.send('你从' + book.color_name + '中领悟到了' + obj.unit_name(count) + '。');
    }
}