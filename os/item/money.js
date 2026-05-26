require("../item/obj.js");
MONEY = function () {
    this.is_cash = false;
    this.combined = true;
    this.count = 1;
}
MONEY.inherits(OBJ);
MONEY.prototype.is_money = true;
MONEY.prototype.transable = true;

MONEY.prototype.create = function () {
    this.create_id();
    if (this.is_cash) {
        this.color_name = "<hio>" + this.name + "</hio>";
    } else {
        if (this.value == 1)
            this.color_name = "<yel>" + this.name + "</yel>";
        else if (this.value == 100)
            this.color_name = "<hiw>" + this.name + "</hiw>";
        else
            this.color_name = "<hiy>" + this.name + "</hiy>";
    }

}

