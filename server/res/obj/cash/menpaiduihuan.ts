import { OBJ } from "../../../core/item/obj.js";
import { EQUIPMENT } from "../../../core/item/equipment.js";
import { UTIL } from "../../../core/util.js";
import type { CHARACTER } from "../../../core/char/character.js";


export default class extends OBJ {
    unit = "张";
    name = "门派装备兑换券";
    desc = "一张可以兑换门派装备的兑换券，使用后可自选门派和装备。";
    grade = 3;
    value = 10000;
    transable = true;
    combined = true;

    on_create(path: string, par?: string) {
        if (!par) return;
        const lv = parseInt(par.slice(1));
        if (!(lv >= 2 && lv <= 5)) {
            return false;
        };
        this.grade = lv;
        const q = QUALITIES[this.grade] ?? "传说";
        this.name = "门派装备兑换券";
        this.desc = `一张可以兑换门派${q}装备的兑换券，使用后可自选门派和装备。`;
    }

    on_use(me: CHARACTER, par?: string) {
        if (!par) {
            return this._showFactions(me);
        }

        // 门派选择
        if (FACTIONS[par]) {
            return this._showEquipment(me, par);
        }

        // 确认兑换
        if (par === "confirm") {
            return this._doExchange(me);
        }

        // 装备预览
        return this._showPreview(me, par);
    }

    private _showFactions(me: CHARACTER) {
        const q = QUALITIES[this.grade] ?? "传说";
        me.notify(`<hiy>你要选择哪个门派的${q}装备？</hiy>`);

        const cmds: string[] = [];
        for (const [key, fac] of Object.entries(FACTIONS)) {
            cmds.push(`use ${this.id} ${key}`, fac.name);
        }
        me.send_commands(...cmds);
        return false;
    }

    private _showEquipment(me: CHARACTER, faction: string) {
        const fac = FACTIONS[faction];
        if (!fac) return me.notify("未知的门派。");

        me.set_temp("menpai_faction", faction, 600000);

        const q = QUALITIES[this.grade] ?? "传说";
        me.notify(`<hiy>请选择${fac.name}的${q}装备：</hiy>`);

        const cmds: string[] = [];
        for (const eq of fac.eqs) {
            cmds.push(`use ${this.id} ${eq.key}`, UTIL.gradeColor(eq.name, this.grade));
        }
        me.send_commands(...cmds);
        return false;
    }

    private _showPreview(me: CHARACTER, eqKey: string) {
        const faction = me.query_temp<string>("menpai_faction");
        if (!faction) {
            // 没选门派直接点了装备，回到第一步
            return this._showFactions(me);
        }

        const fac = FACTIONS[faction];
        const eq = fac?.eqs.find((e) => e.key === eqKey);
        if (!eq) return me.notify("未知的装备。");

        me.set_temp("menpai_eq", eqKey, 600000);

        const eqPath = `eq/${faction}/${eqKey}#${this.grade}`;
        const preview = OBJ.CREATE(eqPath) as EQUIPMENT;
        if (!preview) {
            return me.notify("装备数据异常，请联系管理员。");
        }

        const q = QUALITIES[this.grade] ?? "传说";
        me.notify(`<hiy>${fac.name} · ${UTIL.gradeColor(eq.name, this.grade)}（${q}）</hiy>`);
        me.notify(preview.get_desc(me));

        me.send_commands(
            `use ${this.id} confirm`,
            "确认兑换"
        );
        return false;
    }

    private _doExchange(me: CHARACTER) {
        const faction = me.query_temp<string>("menpai_faction");
        const eqKey = me.query_temp<string>("menpai_eq");

        if (!faction || !eqKey) {
            return me.notify("操作超时，请重新使用兑换券。");
        }

        const fac = FACTIONS[faction];
        const eq = fac?.eqs.find((e) => e.key === eqKey);
        if (!eq) return me.notify("未知的装备。");

        const eqPath = `eq/${faction}/${eqKey}#${this.grade}`;
        const equipment = OBJ.CREATE(eqPath);
        if (!equipment) {
            return me.notify("装备创建失败，请联系管理员。");
        }

        me.remove_temp("menpai_faction");
        me.remove_temp("menpai_eq");

        me.add_obj(equipment);
        me.notify(`<hiy>你使用门派装备兑换券兑换了${equipment.color_name}。</hiy>`);
        me.send_room(`$N使用门派装备兑换券兑换了${equipment.color_name}。`);
        // 返回非 false, 由 use 命令自动消耗兑换券
        return true;
    }
}

const QUALITIES = ["普通", "精良", "高级", "稀有", "绝世", "传说", "神器"];

const FACTIONS: Record<string, { name: string; eqs: { key: string; name: string }[] }> = {
    wudang: {
        name: "武当派",
        eqs: [
            { key: "zhenwujian", name: "真武剑" },
            { key: "zhenwudaopao", name: "真武道袍" },
            { key: "zhenwudaoxue", name: "真武道靴" },
            { key: "zhenwudaozan", name: "真武道簪" },
            { key: "zhenwuhuwan", name: "真武护腕" },
            { key: "zhenwuyaodai", name: "真武腰带" },
        ],
    },
    shaolin: {
        name: "少林派",
        eqs: [
            { key: "luohanjiedao", name: "罗汉戒刀" },
            { key: "luohansengpao", name: "罗汉僧袍" },
            { key: "luohansengxie", name: "罗汉僧鞋" },
            { key: "luohanmao", name: "罗汉帽" },
            { key: "luohanhuwan", name: "罗汉护腕" },
            { key: "luohanyaodai", name: "罗汉腰带" },
        ],
    },
    huashan: {
        name: "华山派",
        eqs: [
            { key: "junzijian", name: "君子剑" },
            { key: "junziqingshan", name: "君子青衫" },
            { key: "junzixue", name: "君子靴" },
            { key: "junzitoujin", name: "君子头巾" },
            { key: "junzihushou", name: "君子护手" },
            { key: "junzipandai", name: "君子鞶带" },
        ],
    },
    emei: {
        name: "峨眉派",
        eqs: [
            { key: "shuguangjian", name: "曙光剑" },
            { key: "shuguangfoyi", name: "曙光佛衣" },
            { key: "shuguangxie", name: "曙光鞋" },
            { key: "shuguangfazan", name: "曙光发簪" },
            { key: "shuguanghuwan", name: "曙光护腕" },
            { key: "shuguangshuyao", name: "曙光束腰" },
        ],
    },
    xiaoyao: {
        name: "逍遥派",
        eqs: [
            { key: "kunpengshouyin", name: "鲲鹏手印" },
            { key: "kunpengchangpao", name: "鲲鹏长袍" },
            { key: "kunpengxue", name: "鲲鹏靴" },
            { key: "kunpengguan", name: "鲲鹏冠" },
            { key: "kunpenghushou", name: "鲲鹏护手" },
            { key: "kunpengyaodai", name: "鲲鹏腰带" },
        ],
    },
    gaibang: {
        name: "丐帮",
        eqs: [
            { key: "huntiangun", name: "混天棍" },
            { key: "huntiansuoyi", name: "混天蓑衣" },
            { key: "huntianmaxie", name: "混天麻鞋" },
            { key: "huntianhuwan", name: "混天护腕" },
            { key: "huntianguan", name: "混天冠" },
            { key: "huntianyaodai", name: "混天腰带" },
        ],
    },
    xiangyang: {
        name: "襄阳",
        eqs: [
            { key: "dasongjunqiang", name: "大宋军枪" },
            { key: "dasongjunfu", name: "大宋军服" },
            { key: "dasongjunmao", name: "大宋军帽" },
            { key: "dasongjunxue", name: "大宋军靴" },
            { key: "menggujunqiang", name: "蒙古军枪" },
            { key: "menggujunfu", name: "蒙古军服" },
            { key: "lizimao", name: "笠子帽" },
            { key: "menggujunxue", name: "蒙古军靴" },
        ],
    },
};