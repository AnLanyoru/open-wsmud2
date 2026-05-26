
EVENTS = function () {

}
EVENTS.inherits(BASE);

EVENTS.add = function (item) {
    if (!item || !item.id) return;
    Object.setPrototypeOf(item, EVENT_BASE);
    const items = WORLD.USER_EVENTS;
    for (var i = 0; i < items.length; i++) {
        if (items[i].id == item.id) {
            items[i] = item;
            return this.notify(item, 1);
        }
    }
    items.push(item);
    this.notify(item, 0);
}
EVENTS.ACTIONS = ['add', 'update', 'finish'];
EVENTS.notify = function (item, act) {
    let users = WORLD.USERS;
    let msg = `{type: "dialog", dialog: "events",${EVENTS.ACTIONS[act]}:1}`;
    for (let user of users) {
        if (!user.socket) continue;
        if (item.check && !item.check(user))
            continue;
        user.send(msg);
    }
}
EVENTS.remove = function (id) {
    if (!id) return;
    const items = WORLD.USER_EVENTS;
    for (var i = 0; i < items.length; i++) {
        if (items[i].id == id) {
            EVENTS.notify(items[i], 2);
            return items.splice(i, 1);
        }
    }
}

const EVENT_BASE = {
    query_desc: function () {
        return this.desc;
    },
    query_grade: function () {
        return this.grade;
    }
};