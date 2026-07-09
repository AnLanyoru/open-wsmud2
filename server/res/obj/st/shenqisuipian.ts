import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
  name = "神器碎片";
  desc = "远古神器破碎后掉落的碎片，可以用来合成神器。";
  unit = "块";
  value = 500000;
  combined = true;
  transable = true;
  grade = 6;
  otype = 2;
}
