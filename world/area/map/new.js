
this.inherits(AREA);
this.set({
    name: "新手",
    first: "new/new1",
    is_copy: true,
    not_fb: true,
    room_path:"new/"
});
this.map = [{ n: "训练室", id: "new/new1", p: [0, 0], exits: ["e"] },
            { n: "训练室", id: "new/new2", p: [1, 0] },
            { n: "训练室", id: "new/new3", p: [1, 1], exits: ["n"] },
];