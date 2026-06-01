import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { WORLD } from "../../../core/world.js";

export default class extends COMMAND {
    command = "map";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    map_json;
    buffer = {};

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, area) {
    //if (!area) {
    //    if (!this.map_json) this.map_json = getAllMaps(me);

    //    return me.send(this.map_json);
    //}
    if (!area || area == "here") {
        if (!me.environment) return;
        var str = me.environment.path;
        area = str.substr(0, str.lastIndexOf("/"));
    }
    var path = area + "/"
    if (this.buffer[area]) return me.send(this.buffer[area]);
    var area_obj: import("../../../core/room/area.js").AREA | null = null;
    for (var i = 0; i < WORLD.AREAS.length; i++) {
        if (path == WORLD.AREAS[i].room_path) {
            area_obj = WORLD.AREAS[i];
            break;
        }
    }
    if (!area_obj) return;
    if (area_obj.render_map) return area_obj.render_map(me);
    this.buffer[area] = this.createMapJson(area_obj, area);
    me.send(this.buffer[area]);
}
    clearCache() {
    this.buffer = {};
}
    update_map(id, rm, pos) {
    this.buffer[id] = null;
    if (!rm) {
        var area_obj: import("../../../core/room/area.js").AREA | null = null;
        for (var i = 0; i < WORLD.AREAS.length; i++) {
            if (id == WORLD.AREAS[i].room_path) {
                area_obj = WORLD.AREAS[i];
                break;
            }
        }
        return;
    }

    var str = "{type:'updatemap',map:'" + id + "',id:'" + rm.path + "',n:'" + rm.name + "'";
    if (pos) str += ",pos:[" + pos.join() + "]}";
    else str += "}";
    for (var i = 0; i < rm.items.length; i++) {
        if (rm.items[i].is_player)
            rm.items[i].send(str);
    }
}
    createMapJson(area_obj, area) {
    if (!area_obj) return '{type:"map",maps:[]}';
    var obj: { type: string; path: string; map: any[] } = {
        type: "map",
        path: area,
        map: area_obj.map,
    };
    return JSON.stringify(obj);
}
}

var world_map = null;
function getAreaByPath(areas, path) {
    if (!areas) return;
    for (var i = 0; i < areas.length; i++) {
        if (areas[i].path == path) return areas[i];
    }
}
