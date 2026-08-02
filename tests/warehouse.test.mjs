import assert from 'node:assert/strict';
import test from 'node:test';

globalThis.__CONFIG = { DB: {} };
globalThis.__PATH = {
    BASE: '',
    WORLD: '',
    COMMAND: '',
    SKILL: '',
    MAP: '',
    NPC: '',
    OBJ: '',
    TASK: '',
    AREA: '',
    FAMILY: '',
    EXTENDS: '',
    DATA: '',
    DEF_DATA: '',
    BASE_DATA: '',
};

const [{ ITEM }, { default: StoreCommand }, { default: TakeCommand }] = await Promise.all([
    import('../server/dist/core/item.js'),
    import('../server/dist/res/cmd/dialog/store.js'),
    import('../server/dist/res/cmd/dialog/qu.js'),
]);

function makeItem({ id, path = id, count = 1, combined = true, otype = 0 }) {
    return {
        id,
        path,
        count,
        combined,
        otype,
        unit: '个',
        color_name: id,
        is_money: false,
        check_obj() {
            return true;
        },
        is(other) {
            return this.path === other?.path;
        },
        uncombine(splitCount) {
            if (!splitCount || splitCount === this.count) return this;
            if (splitCount < 1 || splitCount > this.count) return;
            const split = makeItem({
                id: `${this.id}-split`,
                path: this.path,
                count: splitCount,
                combined: this.combined,
                otype: this.otype,
            });
            this.count -= splitCount;
            return split;
        },
        combine(other) {
            this.count += other.count;
        },
    };
}

function makePlayer({ items = [], stores = [], maxItemCount = 20, maxStoreCount = 20 } = {}) {
    const messages = [];
    const notifications = [];
    return {
        environment: { allow_store: true },
        items,
        stores,
        max_item_count: maxItemCount,
        max_store_count: maxStoreCount,
        messages,
        notifications,
        check_player: () => true,
        check_follower: () => false,
        find_obj(id) {
            return this.find_obj_byid(this.items, id);
        },
        find_obj_byid: ITEM.prototype.find_obj_byid,
        find_obj_bypath: ITEM.prototype.find_obj_bypath,
        remove_item_byid: ITEM.prototype.remove_item_byid,
        push_item: ITEM.prototype.push_item,
        is_full: ITEM.prototype.is_full,
        query_temp: () => 0,
        set_temp: () => undefined,
        send(message) {
            messages.push(message);
        },
        send_room(message) {
            messages.push(message);
        },
        notify(message) {
            notifications.push(message);
        },
    };
}

test('qu removes from the warehouse and adds to the backpack', () => {
    const stored = makeItem({ id: 'store1', path: 'obj/herb', count: 5, otype: 3 });
    const player = makePlayer({ stores: [stored] });

    new TakeCommand().enter(player, '2 ', 'store1');

    assert.equal(player.stores[0].count, 3);
    assert.equal(player.items.length, 1);
    assert.equal(player.items[0].count, 2);
    assert.match(player.notifications.at(-1), /store:-2,otype:3,sum:1/);
});

test('store removes from the backpack and reports the warehouse category and total', () => {
    const bagItem = makeItem({ id: 'bag1', path: 'obj/herb', count: 5, otype: 3 });
    const player = makePlayer({ items: [bagItem] });

    new StoreCommand().enter(player, '2', 'bag1');

    assert.equal(player.items[0].count, 3);
    assert.equal(player.stores.length, 1);
    assert.equal(player.stores[0].count, 2);
    assert.match(player.notifications.at(-1), /store:2,otype:3,sum:1/);
});

test('store all sets a six-second cooldown and rejects repeated requests', () => {
    const stored = makeItem({ id: 'store1', path: 'obj/herb', count: 5 });
    const bagItem = makeItem({ id: 'bag1', path: 'obj/herb', count: 2 });
    const player = makePlayer({ items: [bagItem], stores: [stored] });
    let cooldown = 0;
    let cooldownDuration;
    player.query_temp = () => cooldown;
    player.set_temp = (name, value, duration) => {
        assert.equal(name, 'store_all');
        cooldown = value;
        cooldownDuration = duration;
    };

    new StoreCommand().enter(player, undefined, 'all');

    assert.equal(player.items.length, 0);
    assert.equal(stored.count, 7);
    assert.equal(cooldownDuration, 6000);

    player.items.push(makeItem({ id: 'bag2', path: 'obj/herb', count: 3 }));
    new StoreCommand().enter(player, undefined, 'all');

    assert.equal(player.items.length, 1);
    assert.equal(stored.count, 7);
    assert.equal(player.messages.at(-1), '自动存仓冷却中，请稍后再试。');
});

test('follower store all deltas identify the source backpack', () => {
    const stored = makeItem({ id: 'store1', path: 'obj/herb', count: 5 });
    const target = makePlayer({ stores: [stored] });
    const follower = makePlayer({
        items: [makeItem({ id: 'bag1', path: 'obj/herb', count: 2 })],
    });
    follower.id = 'follower1';
    follower.check_player = () => false;
    follower.check_follower = () => true;

    new StoreCommand().store_all(target, follower);

    assert.match(target.notifications.at(-1), /sourceid:"follower1"/);
});

test('warehouse commands reject zero quantities without mutating items', () => {
    const bagItem = makeItem({ id: 'bag1', count: 5 });
    const stored = makeItem({ id: 'store1', count: 5 });
    const player = makePlayer({ items: [bagItem], stores: [stored] });

    new StoreCommand().enter(player, '0', 'bag1');
    new TakeCommand().enter(player, '0 ', 'store1');

    assert.equal(bagItem.count, 5);
    assert.equal(stored.count, 5);
    assert.deepEqual(player.notifications.slice(0, 2), ['存入数量不正确。', '取出数量不正确。']);
});

test('qu enforces backpack capacity but permits merging into an existing stack', () => {
    const occupied = makeItem({ id: 'occupied', combined: false });
    const equipment = makeItem({ id: 'equipment', combined: false, otype: 4 });
    const player = makePlayer({
        items: [occupied],
        stores: [equipment],
        maxItemCount: 1,
    });

    new TakeCommand().enter(player, '1 ', 'equipment');

    assert.equal(player.stores.length, 1);
    assert.equal(player.items.length, 1);
    assert.equal(player.notifications.at(-1), '你的背包放不下那么多东西了。');

    const bagStack = makeItem({ id: 'bag-herb', path: 'obj/herb', count: 2 });
    const storeStack = makeItem({ id: 'store-herb', path: 'obj/herb', count: 3 });
    const mergePlayer = makePlayer({
        items: [bagStack],
        stores: [storeStack],
        maxItemCount: 1,
    });

    new TakeCommand().enter(mergePlayer, '2 ', 'store-herb');

    assert.equal(bagStack.count, 4);
    assert.equal(storeStack.count, 1);
});

test('warehouse commands are unavailable outside warehouse rooms', () => {
    const bagItem = makeItem({ id: 'bag1' });
    const stored = makeItem({ id: 'store1' });
    const player = makePlayer({ items: [bagItem], stores: [stored] });
    player.environment = { allow_store: false };

    new StoreCommand().enter(player, undefined, 'bag1');
    new TakeCommand().enter(player, '1 ', 'store1');

    assert.equal(player.items[0], bagItem);
    assert.equal(player.stores[0], stored);
    assert.deepEqual(player.notifications, ['这里没有仓库。', '这里没有仓库。']);
});

test('store list responses identify filtering and the selected category', () => {
    const player = makePlayer({ maxStoreCount: 400 });

    new StoreCommand().enter(player, undefined, '4');

    assert.match(player.messages.at(-1), /max_store_count:400,sum:0,filtered:1,otype:4/);
});

if (!Array.prototype.Remove) {
    Object.defineProperty(Array.prototype, 'Remove', {
        configurable: true,
        writable: true,
        value(item) {
            const index = this.indexOf(item);
            if (index >= 0) this.splice(index, 1);
        },
    });
}

globalThis.navigator ??= { userAgent: '' };
const { default: listDialog } = await import('../web/dialog/list.js');

test('background store deltas update the player backpack immediately', () => {
    const updates = [];
    globalThis.Dialog = {
        pack: { updateitem: data => updates.push(data) },
    };
    const context = { ...listDialog, stores: null, isShow: false };

    assert.equal(context.onBackgroundData({id: 'bag1', store: 2}), true);
    assert.deepEqual(updates, [{remove: 2, id: 'bag1'}]);
});

test('background follower store deltas update the matching follower backpack', () => {
    const updates = [];
    globalThis.Dialog = {
        pack: { updateitem: () => assert.fail('the player backpack must not be updated') },
        pack2: { id: 'follower1', updateitem: data => updates.push(data) },
    };
    const context = { ...listDialog, stores: null, isShow: false };

    assert.equal(
        context.onBackgroundData({id: 'bag1', store: 2, sourceid: 'follower1'}),
        true,
    );
    assert.deepEqual(updates, [{remove: 2, id: 'bag1'}]);
});

function makeListContext({ packItems, stores, selectedType = 0, storeCount = stores.length }) {
    return {
        ...listDialog,
        stores,
        selected_type: selectedType,
        store_count: storeCount,
        max_store_count: 400,
        is_store_filtered: true,
        isstore: true,
        isShow: true,
        create_items() {},
        update_pack() {},
        leftElement: {},
        packItems,
    };
}

test('filtered warehouse deltas do not insert another category into the visible list', () => {
    const visible = makeItem({ id: 'visible', otype: 0 });
    const offCategory = makeItem({ id: 'bag-resource', count: 5, otype: 3 });
    const context = makeListContext({ packItems: [offCategory], stores: [visible] });
    globalThis.Dialog = {
        pack: { items: context.packItems },
        title() {},
    };
    globalThis.SendCommand = () => assert.fail('a valid delta should not require a refresh');

    context.updateitem({
        id: 'bag-resource',
        storeid: 'store-resource',
        store: 2,
        otype: 3,
        sum: 2,
    });

    assert.equal(offCategory.count, 3);
    assert.deepEqual(context.stores, [visible]);
    assert.equal(context.store_count, 2);
});

test('take deltas retain the server-provided total warehouse count', () => {
    const stored = makeItem({ id: 'store-herb', count: 2, otype: 0 });
    const context = makeListContext({ packItems: [], stores: [stored], storeCount: 9 });
    globalThis.Dialog = {
        pack: { items: context.packItems },
        title() {},
    };
    globalThis.SendCommand = () => assert.fail('a valid delta should not require a refresh');

    context.updateitem({
        id: 'bag-herb',
        storeid: 'store-herb',
        store: -1,
        otype: 0,
        sum: 8,
    });

    assert.equal(stored.count, 1);
    assert.equal(context.packItems[0].count, 1);
    assert.equal(context.store_count, 8);
});

test('an empty filtered warehouse still exposes category navigation', () => {
    const typeChildren = Array.from({ length: 5 }, () => ({ selected: false }));
    typeChildren.removeClass = () => {
        for (const child of typeChildren) child.selected = false;
    };
    const typeElement = {
        visible: false,
        show() {
            this.visible = true;
        },
        hide() {
            this.visible = false;
        },
        children() {
            return typeChildren;
        },
    };
    const context = {
        ...listDialog,
        show() {},
        typeElement,
        create_items() {},
        update_pack() {},
        leftElement: [{ scrollTop: 10 }],
    };
    globalThis.$ = child => ({
        addClass() {
            child.selected = true;
        },
    });
    globalThis.Dialog = {
        pack: { formatItems: () => [] },
        titleElement: { html() {} },
        icon() {},
    };

    context.onData({
        stores: [],
        max_store_count: 400,
        sum: 0,
        filtered: 1,
        otype: 4,
    });

    assert.equal(typeElement.visible, true);
    assert.equal(context.selected_type, 4);
    assert.equal(typeChildren[4].selected, true);
    assert.equal(context.store_count, 0);
});

test('a take response received after closing the warehouse refreshes the backpack', () => {
    const commands = [];
    globalThis.Dialog = {
        pack: { updateitem: () => false },
    };
    globalThis.SendCommand = command => commands.push(command);

    listDialog.updateitem.call(
        { ...listDialog, stores: null, isShow: false },
        { id: 'bag-new', storeid: 'store-old', store: -1, otype: 0, sum: 0 },
    );

    assert.deepEqual(commands, ['pack']);
});
