OBJ.prototype.format_to_sell = function () {

    return `["${this.color_name}","${this.id}",${this.count},${this.grade},"${this.unit}",${this.value}]`;
}


OBJ.prototype.format_to_pack = function () {

    return `["${this.color_name}","${this.id}",${this.count},${this.grade},"${this.unit}",${this.transable ? this.value : 0},${this.is_equipment ? 1 : 0},${this.on_use ? 1 : 0},${this.on_study ? 1 : 0},${this.on_open ? 1 : 0},${this.combine_count > 0 ? this.combine_count : 0},${this.is_locked ? 1 : 0},${this.otype}]`;
}
