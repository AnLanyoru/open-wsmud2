PERFORM.prototype.query_releasetime = function (me, lv) {
    var rtime = this.release_time;
    if (!(rtime >= 0)) rtime = me.gjsd;

    if (this.releasetime_key) {
        rtime = rtime - me.query_prop("releasetime") - me.query_prop(this.releasetime_key);
    } else {
        rtime = rtime - me.query_prop("releasetime");
    }

    if (this.releasetime_per_key) {
        rtime = rtime - rtime * (me.query_prop("releasetime_per") + me.query_prop(this.releasetime_per_key)) / 100;
    } else {
        rtime = rtime - rtime * (me.query_prop("releasetime_per")) / 100;
    }
    if (rtime < 500) return 500;
    return parseInt(rtime);
}

PERFORM.prototype.query_distime = function (me, lv, isref) {
    var dis = this.distime;
    if (!dis) dis = me.gjsd;
    if (isref) dis = dis * 2;
    if (this.distime_key) {
        dis = dis - me.query_prop("distime") - me.query_prop(this.distime_key);
    } else {
        dis = dis - me.query_prop("distime");
    }
    if (this.distime_per_key) {
        dis = dis - dis * (me.query_prop("distime_per") + me.query_prop(this.distime_per_key)) / 100;
    } else {
        dis = dis - dis * (me.query_prop("distime_per")) / 100;
    }


    if (dis < 3000) return 3000;
    return parseInt(dis);
}
PERFORM.prototype.query_mp = function (me, lv) {
    var mp = this.mp || 0;

    mp = mp + lv * mp / 20;
    if (this.expend_mp_per_key) {
        mp = mp - mp * (me.query_prop("expend_mp_per")
            + me.query_prop(this.expend_mp_per_key)) / 100;
    } else {
        mp = mp - mp * me.query_prop("expend_mp_per") / 100;
    }
    if (mp < 0) mp = 0;
    return parseInt(mp);
}
export default function() {}
