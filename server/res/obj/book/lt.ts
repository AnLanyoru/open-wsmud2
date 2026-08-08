import { OBJ } from '../../../core/item/obj.js';

const NAMES: Record<string, string> = {
    GAIBANG: '机关术',
    WUDANG: '观气术',
    HUASHAN: '浩然气',
    EMEI: '普渡',
    SHASHOU: '赏罚论',
    SHAOLIN: '见禅心',
    XIAOYAO: '齐逍遥',
};

/** 门派知识类技能武道材料，参数为门派 ID（如 book/lt#GAIBANG）。 */
export default class extends OBJ {
    unit = '份';
    name = '门派残卷';
    desc = '一份门派传承残卷，可用于对应门派知识类技能的武道进阶。';
    value = 5000;
    grade = 1;
    transable = true;
    otype = 1;

    on_create(_path: string, par: string): void {
        const key = par?.slice(1).toUpperCase();
        const skillName = NAMES[key];
        if (skillName) {
            this.name = skillName + '残卷';
            this.desc = `一份记载着${skillName}传承的残卷，可用于读书写字的武道进阶。`;
        }
    }
}
