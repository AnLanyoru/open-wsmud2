/** Shared family-equipment pools used by family supplies and family battles. */
export interface FamilyEquipmentDef {
    path: string;
    weapon?: boolean;
}

function equipmentSet(family: string, names: string[]): FamilyEquipmentDef[] {
    return names.map((name, index) => ({ path: `eq/${family}/${name}`, weapon: index === 0 }));
}

export const FAMILY_EQUIPMENT: Record<string, FamilyEquipmentDef[]> = {
    WUDANG: equipmentSet('wudang', ['zhenwujian', 'zhenwudaopao', 'zhenwudaoxue', 'zhenwudaozan', 'zhenwuhuwan', 'zhenwuyaodai']),
    SHAOLIN: equipmentSet('shaolin', ['luohanjiedao', 'luohansengpao', 'luohansengxie', 'luohanmao', 'luohanhuwan', 'luohanyaodai']),
    HUASHAN: equipmentSet('huashan', ['junzijian', 'junziqingshan', 'junzixue', 'junzitoujin', 'junzihushou', 'junzipandai']),
    EMEI: equipmentSet('emei', ['shuguangjian', 'shuguangfoyi', 'shuguangxie', 'shuguangfazan', 'shuguanghuwan', 'shuguangshuyao']),
    XIAOYAO: equipmentSet('xiaoyao', ['kunpengshouyin', 'kunpengchangpao', 'kunpengxue', 'kunpengguan', 'kunpenghushou', 'kunpengyaodai']),
    GAIBANG: equipmentSet('gaibang', ['huntiangun', 'huntiansuoyi', 'huntianmaxie', 'huntianguan', 'huntianhuwan', 'huntianyaodai']),
    SHASHOU: [{ path: 'eq/shashou/qianyu', weapon: true }],
};

FAMILY_EQUIPMENT.NONE = Object.entries(FAMILY_EQUIPMENT)
    .filter(([family]) => family !== 'NONE')
    .flatMap(([, equipment]) => equipment);
