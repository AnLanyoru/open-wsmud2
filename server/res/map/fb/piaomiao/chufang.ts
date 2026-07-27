import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '藕香榭';
    desc = '藕香榭兼作宫中膳房，竹篮里盛着雪藕与药草，灶火仍留着些许余温。';
    exits = {
        west: 'fb/piaomiao/huayuan',
    };
}
