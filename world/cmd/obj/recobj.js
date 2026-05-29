import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "recobj";

    enter(me, objid) {

    return me.send('你没有可供恢复的道具和操作');

}
}
