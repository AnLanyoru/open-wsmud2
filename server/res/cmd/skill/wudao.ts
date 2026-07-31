import { COMMAND } from '../../../core/command.js';
import type { USER } from '../../../core/char/user.js';
import { WORLD } from '../../../core/world.js';
import { SKILL } from '../../../core/skill/skill.js';
import { PROPERTIES, SKILL_TYPES } from '../../../core/const.js';
import type { SkillData } from '../../../core/char/character.js';
import type { SkillSlotDef } from '../../../types/props.js';
import { COMBINED as BOOK_FRAGMENT_COUNTS } from '../../obj/book/bc.js';

const WUDAO_PATH = 'book/wudao';

type Need = { path: string; count: number };
type SlotChoice = { index: number; slot: SkillSlotDef; positions?: string[] };

function scaled(multiplier: number): (lv: number, grade: number) => number {
    return (lv, grade) => Math.floor(lv * grade * multiplier);
}

function normal_slot(
    name: string,
    prop: string,
    multiplier: number,
    cost: number,
    enables: string[],
    grade?: number,
): SkillSlotDef {
    return {
        name,
        prop,
        enables,
        grade,
        value: scaled(multiplier),
        format: val => `${PROPERTIES[prop] ?? prop}：+${val}`,
        query_needs: currentGrade => [{ path: WUDAO_PATH, count: cost * currentGrade }],
    };
}

/** docs/武道数据.txt 中定义的通用武道词条。 */
const WUDAO_SLOTS: SkillSlotDef[] = [
    // 武器（剑、刀、杖、棍、鞭、暗器）
    normal_slot('精准之道', 'mz', 0.46, 7, ['sword', 'blade', 'staff', 'club', 'whip', 'throwing']),
    normal_slot('进攻之道', 'gj', 0.4, 7, ['sword', 'blade', 'staff', 'club', 'whip', 'throwing']),
    normal_slot('招架之道', 'zj', 0.4, 7, ['sword', 'blade', 'staff', 'club', 'whip', 'throwing']),
    normal_slot('防守之道', 'fy', 0.47, 6, ['sword', 'blade', 'staff', 'club', 'whip', 'throwing']),
    normal_slot('躲闪之道', 'ds', 0.4, 7, ['sword', 'blade', 'staff', 'club', 'whip', 'throwing']),
    {
        name: '残暴之心',
        prop: 'bj_per',
        enables: ['sword', 'blade', 'staff', 'club', 'whip', 'throwing'],
        grade: 4,
        value: lv => 5 + Math.floor(lv / 1000),
        format: val => `暴击：+${val}%`,
        query_needs: grade => [{ path: WUDAO_PATH, count: 10 * grade }],
    },
    normal_slot('强体之术', 'str', 0.06, 8, ['sword', 'blade', 'staff', 'club', 'whip', 'throwing'], 2),

    // 招架
    normal_slot('防御之道', 'fy', 0.4, 5, ['parry']),
    normal_slot('招架之道', 'zj', 0.48, 5, ['parry']),
    normal_slot('气血之道', 'max_hp', 9.5, 5, ['parry']),
    normal_slot('御气之道', 'limit_mp', 22, 10, ['parry'], 3),
    normal_slot('明悟之术', 'int', 0.03, 7, ['parry'], 2),
    normal_slot('炼体之术', 'con', 0.06, 7, ['parry'], 2),

    // 拳脚
    normal_slot('命中之道', 'mz', 0.5, 7, ['unarmed']),
    normal_slot('进攻之道', 'gj', 0.43, 7, ['unarmed']),
    normal_slot('招架之道', 'zj', 0.4, 6, ['unarmed']),
    normal_slot('防守之道', 'fy', 0.4, 7, ['unarmed']),
    normal_slot('强体之术', 'str', 0.08, 9, ['unarmed'], 2),
    normal_slot('御气之道', 'limit_mp', 22, 10, ['unarmed'], 3),

    // 轻功
    normal_slot('命中之道', 'mz', 0.4, 8, ['dodge']),
    normal_slot('防御之道', 'fy', 0.4, 5, ['dodge']),
    normal_slot('躲闪之道', 'ds', 0.5, 5, ['dodge']),
    normal_slot('轻盈之术', 'dex', 0.08, 6, ['dodge'], 2),
    normal_slot('御气之道', 'limit_mp', 22, 10, ['dodge'], 3),

    // 内功
    normal_slot('御气之道', 'limit_mp', 25, 8, ['force']),
    normal_slot('防御之道', 'fy', 0.5, 5, ['force']),
    normal_slot('强体之术', 'str', 0.06, 8, ['force'], 2),
    normal_slot('炼体之术', 'con', 0.08, 6, ['force'], 2),
    normal_slot('气血之道', 'max_hp', 12, 5, ['force']),
    {
        name: '永生之道',
        prop: 'age',
        enables: ['force'],
        grade: 4,
        value: lv => Math.floor(lv / 100),
        format: val => `年龄：-${val}岁`,
        query_needs: grade => [{ path: WUDAO_PATH, count: 8 * grade }],
    },
    {
        name: '守护之心',
        prop: 'diff_sh_per',
        enables: ['force'],
        grade: 4,
        value: lv => 10 + Math.floor(lv / 1000),
        format: val => `减伤：+${val}%`,
        query_needs: grade => [{ path: WUDAO_PATH, count: 10 * grade }],
    },
    {
        name: '暴虐之心',
        prop: 'add_sh_per',
        enables: ['force'],
        grade: 4,
        value: lv => 10 + Math.floor(lv / 1000),
        format: val => `终伤：+${val}%`,
        query_needs: grade => [{ path: WUDAO_PATH, count: 10 * grade }],
    },
];

SKILL.PROPERTIES = WUDAO_SLOTS;

export default class extends COMMAND {
    command = 'wudao,lingwu';
    allow_fight = false;
    regex = /^(?:([\w-]+)(?:\s+(\d+|ok|down|reset))?(?:\s+(ok))?)?$/;

    enter(me: USER, skillid?: string, choice?: string, confirm?: string) {
        if (!me.skills) return me.notify('你还不会任何技能。');
        if (!skillid) return this.send_skill_choices(me);
        const skill = me.skills.get(skillid);
        if (!skill) return me.notify('你还不会这个技能。');
        const skill_base = SKILL.get(skillid);
        if (!skill_base) return me.notify('没有这个技能。');
        if (choice === 'down' || choice === 'reset') {
            return this.manage_addin(me, skill_base, skill, choice, confirm);
        }

        const target_skill = Array.from(WORLD.SKILLS.values()).find(
            target => target.source_skill === skillid,
        );
        if (!target_skill) return this.enter_addin(me, skillid, choice, confirm);

        const need_count = target_skill.grade === 4 ? 50 : 100;
        const button =
            '进阶为' +
            target_skill.query_color_name(me) +
            '消耗' +
            need_count +
            '<hiz>门派进阶残页</hiz>';
        if (choice !== 'ok' && confirm !== 'ok') {
            const commands = ['wudao ' + skillid + ' ok', button];
            this.append_manage_commands(commands, skill_base, skill);
            return me.send_commands(...commands);
        }
        if (skill.addin?.length) {
            me.send('你需要先重置武道进阶，才可以进阶为新的门派武功。');
            const commands: string[] = [];
            this.append_manage_commands(commands, skill_base, skill);
            return me.send_commands(...commands);
        }
        if (skill.level < 1000) return me.notify('技能达到1000级后才可以进阶。');

        const pages = me.find_obj_bypath('book/up');
        if (!pages || pages.count < need_count) {
            return me.notify('你的<hiz>门派进阶残页</hiz>不足' + need_count + '份。');
        }
        if (!skill_base.grade_up(me, target_skill)) return me.notify('技能进阶失败。');

        me.remove_obj(pages, need_count);
        this.send_skill_detail(me, target_skill);
        return me.notify(
            '<hiy>你的' +
                skill_base.query_color_name(me) +
                '成功进阶为' +
                target_skill.query_color_name(me) +
                '。</hiy>',
        );
    }

    private send_skill_choices(me: USER): void {
        const commands: string[] = [];
        for (const [id] of me.skills!) {
            const base = SKILL.get(id);
            if (!base || base.type !== SKILL_TYPES.SKILL) continue;
            const hasTarget = Array.from(WORLD.SKILLS.values()).some(item => item.source_skill === id);
            const skill = me.skills!.get(id)!;
            const grade = base.query_grade(me);
            if (
                !hasTarget &&
                !skill.addin?.length &&
                (grade >= 5 || !this.query_choices(base, skill, grade).length)
            ) {
                continue;
            }
            commands.push(`wudao ${id}`, base.query_color_name(me));
        }
        if (!commands.length) return me.notify('你目前没有可以进阶的武功。');
        me.send('请选择要参悟的武功：');
        me.send_commands(...commands);
    }

    private enter_addin(me: USER, skillid: string, choice?: string, confirm?: string): void {
        const skill = me.skills!.get(skillid)!;
        const skillBase = SKILL.get(skillid)!;
        if (skillBase.type !== SKILL_TYPES.SKILL) return me.notify('基础技能无法使用武道进阶。');

        const currentGrade = skillBase.query_grade(me);
        if (currentGrade >= 5) {
            if (skill.addin?.length && choice === undefined) {
                me.send('这门武功已经无法继续进行武道进阶了。');
                const commands: string[] = [];
                this.append_manage_commands(commands, skillBase, skill);
                return me.send_commands(...commands);
            }
            return me.notify('这门武功无法进行武道进阶。');
        }

        const choices = this.query_choices(skillBase, skill, currentGrade);
        if (!choices.length) {
            if (skill.addin?.length && choice === undefined) {
                me.send('这门武功当前没有新的武道进阶方向。');
                const commands: string[] = [];
                this.append_manage_commands(commands, skillBase, skill);
                return me.send_commands(...commands);
            }
            return me.notify('这门武功当前没有可选择的武道进阶方向。');
        }

        if (choice === undefined) return this.send_preview(me, skillBase, skill, choices, currentGrade);

        const slotIndex = Number(choice);
        const selected = choices.find(item => item.index === slotIndex);
        if (!selected) return me.notify('这个武道进阶方向不存在或已经无法选择。');

        const needs = this.query_needs(selected, skillBase, currentGrade);
        const newLevel = this.convert_level(skill.level, currentGrade, currentGrade + 1);
        if (confirm !== 'ok') {
            me.send(
                `是否确认将【${skillBase.query_color_name(me)}】进阶为【${skillBase.query_color_name(undefined, currentGrade + 1)}】` +
                    `，等级将由${skillBase.query_color_text(String(skill.level), currentGrade)}级折算为` +
                    `${skillBase.query_color_text(String(newLevel), currentGrade + 1)}级？`,
            );
            return me.send_commands(
                `wudao ${skillid} ${slotIndex} ok`,
                `确认选择${skillBase.query_color_text(this.query_choice_name(skillBase, selected), currentGrade + 1)}`,
            );
        }

        if (!this.has_needs(me, needs, currentGrade)) return;

        const oldLevel = me.query_skill(skillid);
        const oldScore = skillBase.query_score(skill.level, me);
        skillBase.release_prop(me, oldLevel);
        if (!skill.addin) skill.addin = [];
        skill.addin.push(slotIndex);
        skill.level = newLevel;
        skill.exp = 0;
        const newScore = skillBase.query_score(skill.level, me);
        skillBase.attach_prop(me, me.query_skill(skillid));
        me.add_score(newScore - oldScore);
        for (const need of needs) {
            const material = me.find_obj_bypath(need.path)!;
            me.remove_obj(material, need.count);
        }
        me.init_skill();
        me.recount();
        me.notify(
            `{type:"dialog",dialog:"skills",id:"${skillid}",name:"${skillBase.query_color_name(me)}",` +
                `grade:${skillBase.query_grade(me)},level:${skill.level},exp:0}`,
        );
        this.send_skill_detail(me, skillBase);
        me.notify(
            `<hiy>你的${skillBase.query_color_name(me)}成功领悟了` +
                `${skillBase.query_color_text(this.query_choice_name(skillBase, selected), currentGrade + 1)}` +
                `，当前等级为${skill.level}级。</hiy>`,
        );
    }

    private query_choices(base: SKILL, skill: SkillData, grade: number): SlotChoice[] {
        const selectedProps = new Set(
            (skill.addin ?? []).map(index => base.query_slot(index)?.prop).filter(Boolean),
        );
        const choices: SlotChoice[] = [];

        // 未进阶时保留不同位置提供的同属性选项；选定后统一按属性排除。
        for (let i = 0; i < (base.slots?.length ?? 0); i++) {
            const slot = base.slots![i];
            if (!slot || selectedProps.has(slot.prop)) continue;
            choices.push({ index: 500 + i, slot });
        }

        for (let i = 0; i < WUDAO_SLOTS.length; i++) {
            const slot = WUDAO_SLOTS[i];
            if (slot.grade !== undefined && grade < slot.grade) continue;
            const positions = slot.enables?.filter(enable => base.can_enables.includes(enable));
            if (!positions?.length) continue;
            if (selectedProps.has(slot.prop)) continue;
            choices.push({ index: i, slot, positions });
        }
        return choices;
    }

    private send_preview(
        me: USER,
        base: SKILL,
        skill: SkillData,
        choices: SlotChoice[],
        grade: number,
    ): void {
        const nextGrade = grade + 1;
        const newLevel = this.convert_level(skill.level, grade, nextGrade);
        me.send(`【${base.query_color_name(me)}】可选择的进阶方向：`);
        me.send(
            `进阶后提升为【${base.query_color_name(undefined, nextGrade)}】` +
                `${base.query_color_text(String(newLevel), nextGrade)}级`,
        );
        const commands: string[] = [];
        for (const choice of choices) {
            const value = Math.trunc(choice.slot.value(newLevel, nextGrade));
            const desc = choice.slot.format ? choice.slot.format(value) : `${choice.slot.prop}：+${value}`;
            const slotName = this.query_choice_name(base, choice);
            const slotDesc = `${slotName} ${desc}`;
            commands.push(
                `wudao ${base.id} ${choice.index}`,
                `${base.query_color_text(slotDesc, nextGrade)}` +
                    `消耗：${this.format_needs(me, this.query_needs(choice, base, grade), grade)}`,
            );
        }
        this.append_manage_commands(commands, base, skill);
        me.send_commands(...commands);
    }

    private append_manage_commands(commands: string[], base: SKILL, skill: SkillData): void {
        if (!skill.addin?.length) return;
        const grade = base.grade + skill.addin.length + (skill.ref ? 1 : 0);
        commands.push(
            `wudao ${base.id} down`,
            base.query_color_text('降低一级武道进阶', grade),
            `wudao ${base.id} reset`,
            '<hir>重置武道</hir>',
        );
    }

    private manage_addin(
        me: USER,
        base: SKILL,
        skill: SkillData,
        mode: 'down' | 'reset',
        confirm?: string,
    ): void {
        const addins = skill.addin ?? [];
        if (!addins.length) return me.notify('这门武功尚未领悟任何武道。');

        const removeCount = mode === 'down' ? 1 : addins.length;
        const removeFrom = addins.length - removeCount;
        const currentGrade = base.query_grade(me);
        const refund = this.query_addin_refund(base, skill, removeFrom, currentGrade);

        if (confirm !== 'ok') {
            const effectiveLevel = me.query_skill(base.id);
            const allLines = this.format_addin_lines(base, skill, 0, effectiveLevel);
            const removeLines = this.format_addin_lines(base, skill, removeFrom, effectiveLevel);
            me.send(
                `${base.query_color_name(me)}当前已领悟的武道：\n${allLines}\n` +
                    `<hir>将要移除的武道：</hir>\n${removeLines}\n` +
                    `返还：${this.format_needs(me, refund, currentGrade)}`,
            );
            const action = mode === 'down' ? '降低一级武道进阶' : '完全重置武道进阶';
            return me.send_commands(
                `wudao ${base.id} ${mode} ok`,
                `<hir>确认${action}</hir>`,
            );
        }

        const oldStoredLevel = skill.level;
        const oldEffectiveLevel = me.query_skill(base.id);
        const oldScore = base.query_score(oldStoredLevel, me);
        const targetGrade = currentGrade - removeCount;
        const newLevel = this.convert_level(oldStoredLevel, currentGrade, targetGrade);

        base.release_prop(me, oldEffectiveLevel);
        skill.addin!.splice(removeFrom, removeCount);
        skill.level = newLevel;
        skill.exp = 0;
        const newScore = base.query_score(newLevel, me);
        base.attach_prop(me, me.query_skill(base.id));
        me.add_score(newScore - oldScore);

        for (const need of refund) {
            if (!me.add_obj(need.path, need.count)) {
                me.notify(`<hir>退还材料失败：${need.path}。</hir>`);
            }
        }
        me.init_skill();
        me.recount();
        me.notify(
            `{type:"dialog",dialog:"skills",id:"${base.id}",name:"${base.query_color_name(me)}",` +
                `grade:${base.query_grade(me)},level:${skill.level},exp:0}`,
        );
        this.send_skill_detail(me, base);
        const action = mode === 'down' ? '降低一级武道进阶' : '重置武道进阶';
        me.notify(
            `<hiy>你的${base.query_color_name(me)}已${action}，等级由` +
                `${base.query_color_text(String(oldStoredLevel), currentGrade)}级折算为` +
                `${base.query_color_text(String(newLevel), targetGrade)}级，返还` +
                `${this.format_needs(me, refund, targetGrade)}。</hiy>`,
        );
    }

    private format_addin_lines(
        base: SKILL,
        skill: SkillData,
        from: number,
        level: number,
    ): string {
        const addins = skill.addin ?? [];
        const initialGrade = base.query_grade() + (skill.ref ? 1 : 0);
        const valueGrade = base.grade + addins.length;
        const lines: string[] = [];
        for (let i = from; i < addins.length; i++) {
            const index = addins[i];
            const slot = base.query_slot(index);
            if (!slot) continue;
            const value = Math.trunc(slot.value(level, valueGrade));
            const desc = slot.format ? slot.format(value) : `${slot.prop}：+${value}`;
            const name = this.query_choice_name(base, { index, slot });
            lines.push(base.query_color_text(`◆${name} ${desc}`, initialGrade + i + 1));
        }
        return lines.join('\n');
    }

    private query_addin_refund(
        base: SKILL,
        skill: SkillData,
        from: number,
        currentGrade: number,
    ): Need[] {
        const addins = skill.addin ?? [];
        const initialGrade = currentGrade - addins.length;
        const needs: Need[] = [];
        for (let i = from; i < addins.length; i++) {
            const index = addins[i];
            const slot = base.query_slot(index);
            if (!slot) continue;
            needs.push(...this.query_needs({ index, slot }, base, initialGrade + i));
        }
        return this.aggregate_needs(needs);
    }

    private aggregate_needs(needs: Need[]): Need[] {
        const totals = new Map<string, number>();
        for (const need of needs) totals.set(need.path, (totals.get(need.path) ?? 0) + need.count);
        return Array.from(totals, ([path, count]) => ({ path, count }));
    }

    private query_choice_name(base: SKILL, choice: SlotChoice): string {
        const name = choice.slot.name ?? (choice.index >= 500 ? base.name : '武道进阶');
        if (!choice.positions?.length) return name;
        const positions = choice.positions.map(position =>
            (SKILL.get(position)?.name ?? position).replace(/^基本/, ''),
        );
        return `${name}（${positions.join('、')}）`;
    }

    /** 同步当前技能详情；详情页未打开时客户端会安全忽略。 */
    private send_skill_detail(me: USER, skill: SKILL): void {
        me.send(
            JSON.stringify({
                type: 'dialog',
                dialog: 'skills',
                id: skill.id,
                desc: skill.query_desc(me, me.query_skill(skill.id, 1000)),
                is_custom: skill.is_custom,
            }),
        );
    }

    private query_needs(choice: SlotChoice, base: SKILL, grade: number): Need[] {
        let raw: Need[];
        if (choice.index >= 500 && /2$/.test(base.id)) {
            raw = [{ path: 'book/up', count: 50 }];
        } else if (choice.slot.query_needs) {
            raw = choice.slot.query_needs(grade);
        } else if (choice.index >= 500) {
            raw = [
                { path: WUDAO_PATH, count: grade },
                { path: `book/bc#${base.id}`, count: BOOK_FRAGMENT_COUNTS[grade] },
            ];
        } else {
            raw = [{ path: WUDAO_PATH, count: 10 * grade }];
        }
        const totals = new Map<string, number>();
        for (const need of raw) totals.set(need.path, (totals.get(need.path) ?? 0) + need.count);
        return Array.from(totals, ([path, count]) => ({ path, count }));
    }

    private format_needs(me: USER, needs: Need[], grade: number): string {
        return needs
            .map(need => {
                const item = me.find_obj_bypath(need.path);
                const fragmentSkill = need.path.startsWith('book/bc#')
                    ? SKILL.get(need.path.slice('book/bc#'.length))
                    : undefined;
                const name = fragmentSkill
                    ? fragmentSkill.query_color_text(`${fragmentSkill.name}残页`, grade)
                    : item?.color_name ??
                      (need.path === WUDAO_PATH
                          ? '<hio>武道</hio>'
                          : need.path === 'book/up'
                            ? '<hiz>门派进阶残页</hiz>'
                            : need.path);
                const unit = item?.unit ?? (need.path === WUDAO_PATH ? '本' : '份');
                return `${name}${need.count}${unit}`;
            })
            .join('、');
    }

    private has_needs(me: USER, needs: Need[], grade: number): boolean {
        for (const need of needs) {
            const item = me.find_obj_bypath(need.path);
            if (!item || item.count < need.count) {
                me.notify(`你的${this.format_needs(me, [need], grade)}不足。`);
                return false;
            }
        }
        return true;
    }

    private convert_level(level: number, oldGrade: number, newGrade: number): number {
        if (level <= 100) return level;
        const converted = 10000 + ((level * level - 10000) * (oldGrade + 1)) / (newGrade + 1);
        return Math.floor(Math.sqrt(converted));
    }
}
