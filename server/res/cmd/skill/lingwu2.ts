import { COMMAND } from '../../../core/command.js';
import type { USER } from '../../../core/char/user.js';
import type { SkillData } from '../../../core/char/character.js';
import { SKILL, type PERFORM } from '../../../core/skill/skill.js';
import { SKILL_TYPES } from '../../../core/const.js';
import {
    convert_skill_progress,
    query_skill_potential,
} from '../../../core/skill/progress.js';

const FUSION_GRADE = 5;
const FUSED_GRADE = 6;
const MIN_LEVEL = 3000;

interface FusionChoice {
    source: SKILL;
    perform: PERFORM;
}

export default class extends COMMAND {
    command = 'lingwu2';
    allow_fight = false;
    regex = /^([\w-]+)(?:\s+([\w/-]+))?(?:\s+(ok))?$/;

    enter(me: USER, skillid: string, choice?: string, confirm?: string) {
        const skill = me.skills?.get(skillid);
        const base = SKILL.get(skillid);
        if (!skill || !base) return me.notify('你还不会这个技能。');
        if (base.type !== SKILL_TYPES.SKILL) return me.notify('基础技能无法进行融合。');

        if (choice === 'cancel') return this.cancel_fusion(me, base, skill, confirm);
        if (skill.ref) {
            const current = this.query_ref_name(skill.ref);
            me.send(`${base.query_color_name(me)}已经融合了${current}，只能融合一个绝招。`);
            return me.send_commands(`lingwu2 ${skillid} cancel`, '<hir>取消融合</hir>');
        }
        if (skill.level < MIN_LEVEL) return me.notify('武功等级达到3000级后才可以融合。');
        if (base.query_grade(me) !== FUSION_GRADE) {
            return me.notify('只有橙色武功才可以进行融合。');
        }

        const choices = this.query_choices(me, base);
        if (!choice) {
            if (!choices.length) return me.notify('你没有符合条件、可以融合的绝招。');
            me.send(`请选择要融合进${base.query_color_name(me)}的绝招：`);
            const commands: string[] = [];
            for (const item of choices) {
                const position =
                    SKILL.get(item.perform.enable_skill!)?.name ?? item.perform.enable_skill;
                commands.push(
                    `lingwu2 ${skillid} ${item.source.id}/${item.perform.pid}`,
                    `${item.source.query_color_name(me)}•${item.perform.name}（${position}）`,
                );
            }
            return me.send_commands(...commands);
        }

        const selected = choices.find(
            item => `${item.source.id}/${item.perform.pid}` === choice,
        );
        if (!selected) return me.notify('这个绝招不符合当前融合条件。');

        const converted = convert_skill_progress(
            skill.level,
            skill.exp,
            FUSION_GRADE,
            FUSED_GRADE,
        );
        if (confirm !== 'ok') {
            me.send(
                `是否确认将${selected.source.query_color_name(me)}的【${selected.perform.name}】` +
                    `融合进${base.query_color_name(me)}？融合后武功提升为红色，` +
                    `等级由${skill.level}级无损折算为${converted.level}级` +
                    (converted.exp > 0 ? `，保留${converted.exp}点技能进度` : '') +
                    '。',
            );
            return me.send_commands(
                `lingwu2 ${skillid} ${choice} ok`,
                '<hir>确认融合</hir>',
            );
        }

        const oldLevel = me.query_skill(base.id);
        const oldScore = base.query_score(skill.level, me);
        base.release_prop(me, oldLevel);
        skill.ref = choice;
        skill.level = converted.level;
        skill.exp = converted.exp;
        const newScore = base.query_score(skill.level, me);
        base.attach_prop(me, me.query_skill(base.id));
        me.add_score(newScore - oldScore);
        me.init_skill();
        me.recount();
        this.send_skill_update(me, base, skill);
        me.notify(
            `<hiy>你的${base.name}成功融合了${selected.source.name}的【${selected.perform.name}】，` +
                `提升为${base.query_color_name(me)}，当前等级为${skill.level}级。</hiy>`,
        );
    }

    private query_choices(me: USER, target: SKILL): FusionChoice[] {
        const choices: FusionChoice[] = [];
        for (const [sourceId, sourceData] of me.skills!) {
            if (sourceId === target.id || sourceData.level < MIN_LEVEL) continue;
            const source = SKILL.get(sourceId);
            if (!source || source.type !== SKILL_TYPES.SKILL) continue;
            const shared = new Set(
                source.can_enables.filter(position => target.can_enables.includes(position)),
            );
            if (!shared.size) continue;
            for (const perform of Object.values(source.pfm)) {
                if (!perform.pid || !perform.enable_skill || !shared.has(perform.enable_skill)) {
                    continue;
                }
                choices.push({ source, perform });
            }
        }
        return choices;
    }

    private cancel_fusion(me: USER, base: SKILL, skill: SkillData, confirm?: string) {
        if (!skill.ref) return me.notify('这门武功尚未融合任何绝招。');
        const refName = this.query_ref_name(skill.ref);
        const converted = convert_skill_progress(
            skill.level,
            skill.exp,
            FUSED_GRADE,
            FUSION_GRADE,
        );
        const skillLimit = Math.max(0, Math.floor(me.skill_limit()));
        const newLevel = Math.min(converted.level, skillLimit);
        const reachedLimit = converted.level >= skillLimit;
        const newExp = reachedLimit ? 0 : converted.exp;
        const totalPotential =
            query_skill_potential(skill.level, FUSED_GRADE) + (skill.exp ?? 0);
        const overflowPot = reachedLimit
            ? totalPotential - query_skill_potential(skillLimit, FUSION_GRADE)
            : 0;

        if (confirm !== 'ok') {
            me.send(
                `是否确认取消${base.query_color_name(me)}融合的${refName}？` +
                    `取消后恢复为橙色，等级由${skill.level}级无损折算为${newLevel}级` +
                    (newExp > 0 ? `，保留${newExp}点技能进度` : '') +
                    (overflowPot > 0 ? `，超出当前技能上限的部分返还${overflowPot}点潜能` : '') +
                    '。',
            );
            return me.send_commands(
                `lingwu2 ${base.id} cancel ok`,
                '<hir>确认取消融合</hir>',
            );
        }

        const oldLevel = me.query_skill(base.id);
        const oldScore = base.query_score(skill.level, me);
        base.release_prop(me, oldLevel);
        delete skill.ref;
        skill.level = newLevel;
        skill.exp = newExp;
        const newScore = base.query_score(skill.level, me);
        base.attach_prop(me, me.query_skill(base.id));
        me.add_score(newScore - oldScore);
        if (overflowPot > 0) me.pot += overflowPot;
        me.init_skill();
        me.recount();
        this.send_skill_update(me, base, skill);
        me.notify(
            `<hiy>你的${base.name}已取消融合${refName}，恢复为${base.query_color_name(me)}，` +
                `当前等级为${skill.level}级` +
                (overflowPot > 0 ? `，并返还${overflowPot}点潜能` : '') +
                '。</hiy>',
        );
    }

    private query_ref_name(ref: string): string {
        const [sourceId, performId] = ref.split('/');
        const source = SKILL.get(sourceId);
        const perform = source?.get_pfm(performId);
        return source && perform ? `${source.query_color_name()}的【${perform.name}】` : '已失效绝招';
    }

    private send_skill_update(me: USER, base: SKILL, skill: SkillData): void {
        me.notify(
            JSON.stringify({
                type: 'dialog',
                dialog: 'skills',
                id: base.id,
                name: base.query_color_name(me),
                grade: base.query_grade(me),
                level: skill.level,
                exp: Math.trunc(((skill.exp ?? 0) * 100) / base.level_exp(skill.level, me)),
                desc: base.query_desc(me, me.query_skill(base.id, 1000)),
                can_fuse:
                    !skill.ref &&
                    skill.level >= MIN_LEVEL &&
                    base.query_grade(me) === FUSION_GRADE,
                is_fused: !!skill.ref,
                fusion_entry: true,
            }),
        );
    }
}
