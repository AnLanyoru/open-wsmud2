export interface ConvertedSkillProgress {
    level: number;
    exp: number;
}

/** 计算指定品级、等级已经投入的潜能（不含当前等级内尚未升级的经验）。 */
export function query_skill_potential(level: number, grade: number): number {
    if (level <= 100) return 0;
    return Math.floor((((100 + level) * (level - 100)) / 2) * (grade + 1) * 5);
}

/**
 * 按总投入潜能折算技能品级，并把不足一级的余数保存在技能经验中。
 * 融合、取消融合和武道进退阶共用此函数，保证往返折算不丢失投入。
 */
export function convert_skill_progress(
    level: number,
    exp: number,
    oldGrade: number,
    newGrade: number,
): ConvertedSkillProgress {
    const safeExp = Math.max(0, Math.trunc(exp ?? 0));
    if (level <= 100) return { level, exp: safeExp };

    const total = query_skill_potential(level, oldGrade) + safeExp;
    const converted = 10000 + (total * 2) / ((newGrade + 1) * 5);
    let newLevel = Math.max(100, Math.floor(Math.sqrt(converted)));

    // 浮点开方只用于给出近似值；最终用整数潜能公式校正，确保不丢点。
    while (query_skill_potential(newLevel + 1, newGrade) <= total) newLevel++;
    while (query_skill_potential(newLevel, newGrade) > total) newLevel--;

    return {
        level: newLevel,
        exp: total - query_skill_potential(newLevel, newGrade),
    };
}
