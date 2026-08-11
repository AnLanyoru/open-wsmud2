import { COMMAND } from '../../../core/command.js';
import type { CmdAndText, USER } from '../../../core/char/user.js';
import { OBJ } from '../../../core/item/obj.js';
import {
    CATEGORY_NAMES,
    CUSTOM_PROPS,
    REPLACE_COST,
    type CustomPropCategory,
} from '../../cmd/obj/reforge.js';

const CATEGORIES: readonly CustomPropCategory[] = [
    'base',
    'acquired',
    'advanced',
    'rare',
    'special',
];

interface MaterialSummary {
    items: OBJ[];
    sample: OBJ;
    count: number;
}

export default class extends COMMAND {
    command = 'wdexchange';
    regex = /^(\w+)(?:\s+(input|target))?(?:\s+(\w+))?(?:\s+(\w+))?(?:\s+(ok))?$/;
    allow_fight = false;

    enter(
        me: USER,
        npcId: string,
        stage?: string,
        inputKey?: string,
        outputKey?: string,
        confirmation?: string,
    ): void {
        const npc = me.environment?.find_obj(npcId);
        if (!npc?.check_npc() || npc.path !== 'pub/wudao_zhu') {
            return me.notify('武道塔主不在这里。');
        }
        if (!stage) return showInputs(me, npcId);
        if (stage === 'input' && inputKey) return showTargets(me, npcId, inputKey);
        if (stage === 'target' && inputKey && outputKey) {
            return exchange(me, npcId, inputKey, outputKey, confirmation);
        }
        me.notify('这项兑换操作已经失效，请重新选择。');
    }
}

function requiredInput(key: string): number {
    return CUSTOM_PROPS[key]?.category === 'special' ? 1 : 2;
}

function queryMaterial(me: USER, key: string): MaterialSummary | undefined {
    const items = (me.items ?? []).filter(item => item.path === 'st/p#' + key);
    if (!items.length) return;
    return {
        items,
        sample: items[0],
        count: items.reduce((sum, item) => sum + item.count, 0),
    };
}

function targetCategory(inputKey: string): CustomPropCategory | undefined {
    const category = CUSTOM_PROPS[inputKey]?.category;
    if (!category) return;
    if (category === 'special') return 'base';
    return CATEGORIES[CATEGORIES.indexOf(category) + 1];
}

function showInputs(me: USER, npcId: string): void {
    const choices: CmdAndText[] = [];
    for (const category of CATEGORIES) {
        let first = true;
        for (const [key, def] of Object.entries(CUSTOM_PROPS)) {
            if (def.category !== category) continue;
            const material = queryMaterial(me, key);
            if (!material || material.count < requiredInput(key)) continue;
            choices.push([
                'wdexchange ' + npcId + ' input ' + key,
                material.sample.unit_name(material.count),
                undefined,
                false,
                first ? CATEGORY_NAMES[category] : undefined,
            ]);
            first = false;
        }
    }
    if (!choices.length) return me.notify('你背包内暂无可兑换的词条材料。');
    me.notify('请选择你要用于兑换的词条：');
    me.send_cmd_and_text(...choices);
}

function showTargets(me: USER, npcId: string, inputKey: string): void {
    const material = queryMaterial(me, inputKey);
    if (!CUSTOM_PROPS[inputKey] || !material || material.count < requiredInput(inputKey)) {
        return me.notify('这项词条材料数量不足，请重新选择。');
    }
    const category = targetCategory(inputKey);
    if (!category) return me.notify('这项词条材料无法兑换。');
    const choices: CmdAndText[] = [];
    for (const [outputKey, def] of Object.entries(CUSTOM_PROPS)) {
        if (def.category !== category) continue;
        const output = OBJ.CREATE('st/p#' + outputKey);
        if (!output) continue;
        choices.push([
            'wdexchange ' + npcId + ' target ' + inputKey + ' ' + outputKey,
            output.color_name,
        ]);
    }
    me.notify(material.sample.color_name + '可换为如下' + CATEGORY_NAMES[category] + '：');
    me.send_cmd_and_text(...choices);
}

function exchange(
    me: USER,
    npcId: string,
    inputKey: string,
    outputKey: string,
    confirmation?: string,
): void {
    const inputDef = CUSTOM_PROPS[inputKey];
    const outputDef = CUSTOM_PROPS[outputKey];
    const category = targetCategory(inputKey);
    if (!inputDef || !outputDef || outputDef.category !== category) {
        return me.notify('不能兑换为这种词条材料。');
    }
    const material = queryMaterial(me, inputKey);
    const inputCount = requiredInput(inputKey);
    if (!material || material.count < inputCount) return me.notify('对应词条材料不足。');
    const outputCount = inputDef.category === 'special' ? 16 : 1;
    const fee = inputDef.category === 'special' ? REPLACE_COST : 0;
    const output = OBJ.CREATE('st/p#' + outputKey, outputCount);
    if (!output) return me.notify('兑换材料配置错误。');

    if (confirmation !== 'ok') {
        me.notify(
            '<hiy>请确认词条兑换：\n' +
                '消耗：' + material.sample.unit_name(inputCount) + '\n' +
                '获得：' + output.unit_name(outputCount) + '\n' +
                '费用：' + (fee ? '100两黄金' : '免费') + '</hiy>',
        );
        return me.send_commands(
            'wdexchange ' + npcId + ' target ' + inputKey + ' ' + outputKey + ' ok',
            '确认兑换',
            'wdexchange ' + npcId,
            '取消',
        );
    }

    if (me.money < fee) return me.notify('你的黄金不足，本次兑换需要100两黄金。');
    if (!consumeMaterial(me, material.items, inputCount)) {
        return me.notify('词条材料扣除失败。');
    }
    if (fee) me.add_money(-fee);
    me.add_obj(output);
    me.notify('<hig>兑换成功，你获得了' + output.unit_name(outputCount) + '。</hig>');
}

function consumeMaterial(me: USER, items: OBJ[], count: number): boolean {
    let remaining = count;
    for (const item of items) {
        if (remaining <= 0) break;
        const take = Math.min(item.count, remaining);
        if (!me.remove_obj(item, take)) return false;
        remaining -= take;
    }
    return remaining === 0;
}
