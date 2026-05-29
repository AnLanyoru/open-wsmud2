import { OBJ } from "../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    name: "师门补给包",
    desc: "里面有28个橙色师门令牌,6个紫色师门令牌，50精力",
    unit: "个",
    value: 0,
    grade: 5
});
this.on_open = function (me) {
    var result = [


        {
            obj: ["cash/jing#3"], count: 1,
        }
    ];

    return OBJ.create_by_odds(result);
}
}
