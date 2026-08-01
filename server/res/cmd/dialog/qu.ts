import { COMMAND } from '../../../core/command.js';
import type { USER } from '../../../core/char/user.js';
import { UTIL } from '../../../core/util/util.js';
import type { OBJ } from '../../../core/item/obj.js';

export default class extends COMMAND {
    command = 'qu';
    regex = /^(?:(\d+\s+))?(\w+)$/;
    allow_fight = false;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me: USER, count: string, arg: string) {
        if (!me.environment?.allow_store) return me.notify('这里没有仓库。');

        if (!arg) return me.notify('你要取什么东西？');

        me.items = me.items || [];
        me.stores = me.stores || [];
        const store = {
            remove_item_byid: me.remove_item_byid,
            items: me.stores,
        };

        const store_item = me.find_obj_byid(me.stores, arg) as OBJ | undefined;
        if (!store_item) return me.notify('你的仓库里没有这样东西。');

        const move_count = count ? Number(count.trim()) : 1;
        if (
            !Number.isSafeInteger(move_count) ||
            move_count < 1 ||
            move_count > store_item.count
        ) {
            return me.notify('取出数量不正确。');
        }

        const bag_item = store_item.combined
            ? (me.find_obj_bypath(store_item.path) as OBJ | undefined)
            : undefined;
        const can_combine = Boolean(bag_item?.combined && bag_item.check_obj());
        if (me.is_full() && !can_combine) return me.notify('你的背包放不下那么多东西了。');

        let moved_obj = store.remove_item_byid(arg, move_count) as OBJ | undefined;
        if (!moved_obj) return me.notify('你的仓库里没有这样东西。');

        moved_obj = me.push_item(moved_obj) as OBJ | undefined;
        if (!moved_obj) return me.notify('取出物品中发生错误');
        me.stores = store.items;
        me.send_room(
            `$N从仓库里取出${UTIL.to_c(move_count)}${moved_obj.unit}${moved_obj.color_name}。`,
        );

        me.notify(
            '{type:"dialog",dialog:"list",id:"' +
                moved_obj.id +
                '",storeid:"' +
                arg +
                '",store:' +
                -move_count +
                ',otype:' +
                store_item.otype +
                ',sum:' +
                me.stores.length +
                '}',
        );
    }
}
