this.inherits(COMMAND);
this.command = "combine";
this.regex = /^(\w+)(?:\s(\d+))?$/;
this.enter = function (player, objid, count) {
    var obj = player.find_obj(objid);
    if (!obj) {
        return player.notify("你要用什么合成？");
    }
    if (!obj.combine_count || !obj.combine_to) return player.send(obj.color_name + "不能合成任何东西。");
    var result_count = parseInt(count || 1);
    if (!(result_count > 0)) return;
    var need_count = result_count * obj.combine_count;

    if (obj.count < need_count) return player.notify("你身上的" + obj.color_name + "不够合成那么多。");
    var remove_obj = player.remove_obj(obj, need_count);
    if (!remove_obj) return player.notify("移除" + obj.color_name + "失败。");
    let ispacket = obj.grade !== 5 || !obj.path.startsWith('st/st_');
    if (ispacket) {

        //if (obj.on_combine && obj.on_combine(result_count) == false) return;
        let result = player.add_obj(obj.combine_to, result_count);
       
        if (result) {
            if (result.is_equipment && result.grade > 5) {
                COMMAND.DO("rumor", "听说有人合成了" + result.unit_name(1)+ "。");
            }
            player.notify("你合成了" + UTIL.to_c(result_count) + result.unit + result.color_name + "。");
        } else {
            player.notify("合成" + obj.color_name + "失败。");
        }
    } else {
        for (let i = 0; i < result_count; i++) {
            let result = player.add_obj(obj.combine_to, 1);
            if (result) {
                player.notify("你合成了" + UTIL.to_c(1) + result.unit + result.color_name + "。");
            }
        }
    }
  
}