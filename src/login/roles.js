
import { Page } from '../base/page.js';
import * as Client from '../client.js';
import { Confirm } from '../confirm.js';

var _name0 = "万俟司马上官欧阳夏侯诸葛闻人东方赫连皇甫尉迟公羊澹台公冶宗政濮阳淳于单于太叔申屠公孙仲孙轩辕令狐锺离宇文长孙慕容鲜于闾丘司徒司空丌官司寇子车颛孙端木巫马公西乐正公良拓拔夹谷谷梁梁丘左丘东门西门";
var _name1 = "赵钱孙李周吴郑王冯陈楮卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎";

var _name2 = "世舜丞主产仁仇仓仕仞任伋众伸佐佺侃侪促俟信俣修倝倡倧偿储僖僧僳儒俊伟列则刚创前剑助劭势勘参叔吏嗣士壮孺守宽宾宋宗宙宣实宰尊峙峻崇崈川州巡帅庚战才承拯操斋昌晁暠曹曾珺玮珹琒琛琩琮琸瑎玚璟璥瑜生畴矗矢石磊砂碫示社祖祚祥禅稹穆竣竦综缜绪舱舷船蚩襦轼辑轩子杰榜碧葆莱蒲天乐东钢铎铖铠铸铿锋镇键镰馗旭骏骢骥驹驾骄诚诤赐慕端征坚建弓强彦御悍擎攀旷昂晷健冀凯劻啸柴木林森朴骞寒函高魁魏鲛鲲鹰丕乒候冕勰备宪宾密封山峰弼彪彭旁日明昪昴胜汉涵汗浩涛淏清澜浦澉澎澔瀚瀛灏沧虚豪豹辅辈迈邶合部阔雄霆震韩俯颁颇频颔风飒飙飚马亮仑仝代儋利力劼勒卓哲喆展帝弛弢弩彰征律德志忠思振挺掣旲旻昊昮晋晟晸朕朗段殿泰滕炅炜煜煊炎选玄勇君稼黎利贤谊金鑫辉墨欧有友闻问";

var _name3 = "筠柔竹霭凝晓欢霄枫芸菲寒伊亚宜姬舒影荔枝思丽秀娟英华慧巧美娜静淑惠珠翠雅芝玉萍红娥玲芬芳燕彩春菊勤珍贞莉兰凤洁梅琳素云莲真环雪荣妹霞香月莺媛艳瑞凡佳嘉琼桂娣叶璧璐娅琦晶妍茜秋珊莎锦黛青倩婷姣婉娴瑾颖露瑶怡婵雁蓓纨仪荷丹蓉眉君琴蕊薇菁梦岚苑婕馨瑗琰韵融园艺咏卿聪澜纯毓悦昭冰爽琬茗羽希宁欣飘育滢馥";

function create_name(s, t) {
  t = t || (parseInt(Math.random() * 2) + 1);
  var str = [];
  if (t == 2) {
    var key = parseInt(Math.random() * _name0.length);
    if (key % 2 == 1) key -= 1;
    str.push(_name0[key++]);
    str.push(_name0[key]);
  } else {
    str.push(_name1[parseInt(Math.random() * _name1.length)]);
  }
  if (s == 0) {
    str.push(_name2[parseInt(Math.random() * _name2.length)]);
  } else {
    str.push(_name3[parseInt(Math.random() * _name3.length)]);
  }
  if (parseInt(Math.random() * 4) > 1) {
    if (s == 0) {
      str.push(_name2[parseInt(Math.random() * _name2.length)]);
    } else {
      str.push(_name3[parseInt(Math.random() * _name3.length)]);
    }
  }
  return str.join("");
}

function create_id() {
  var key1 = 'abcdefghijklmnopqrstuvwxyz';
  var key2 = '123456789';
  var str = [];
  var length = parseInt(Math.random() * 3) + 3;
  for (var i = 0; i < length; i++) {
    if (i < 3) {
      str.push(key1[parseInt(Math.random() * key1.length)]);
    } else {
      str.push(key2[parseInt(Math.random() * key2.length)]);
    }
  }
  return str.join("");
}

function create_prop() {
  var sum = 20;
  var ary = [];
  for (var i = 0; i < 4; i++) {
    var rand = parseInt(Math.random() * 15 + 1);
    if (sum >= rand) {
      i == 3 ? rand = sum : sum -= rand;
      ary[i] = rand;
    } else {
      ary[i] = sum;
      sum = 0;
    }
  }
  var me = {};
  me.str = ary[0] + 15;
  me.con = ary[1] + 15;
  me.dex = ary[2] + 15;
  me.int = ary[3] + 15;
  return me;
}

function RefreshInput(type) {
  switch (type) {
    case 'name':
      $("#reg_name").val(create_name($("#gender_0").is(":checked") ? 0 : 1));
      break;
    case 'id':
      $("#reg_id").val(create_id());
      break;
    case 'prop':
      var obj = create_prop();
      $("#reg_str").val(obj.str);
      $("#reg_con").val(obj.con);
      $("#reg_dex").val(obj.dex);
      $("#reg_int").val(obj.int);
      break;
  }
}

class RolesPage extends Page {
  constructor() {
    super();
    this.template = `
     <div id="role_panel" class="mypanel" style="display:none">
            <ul>
                <li class="panel_item active">选择你的角色</li>
                <li class="content">
                    <ul class="role-list"></ul>
                </li>
                <li class="panel_item" command="SelectRole"><span class="glyphicon glyphicon-ok"></span><span
                        style="margin-left:0.5rem">登陆</span></li>
                <li class="panel_item" command="AddRole"><span class="glyphicon glyphicon-plus"></span><span
                        style="margin-left:0.5rem">创建角色</span></li>
                <li class="panel_item" command="DeleteRole"><span class="glyphicon glyphicon-remove"></span><span
                        style="margin-left:0.5rem">删除角色</span></li>
                <li class="panel_item" command="ToServerPanel"><span
                        class="glyphicon glyphicon-chevron-left"></span><span style="margin-left:0.5rem">返回列表</span>
                </li>
                <li class="bottom">
                    <ul class="new-list">
                        <li nid="251026">10月27日重启更新预告</li>
                        <li nid="250928">国庆活动和更新说明</li>
                    </ul>
                </li>
            </ul>
        </div>
`;
  }

  select() {
    var item = $(".role-list>.select");
    if (!item.length) return;
    var id = item.attr("roleid");
    SendCommand("login " + id);
    Client.showLoader("正在进入游戏", "#role_panel");
  }

  addRole() {
    var count = $(".role-list>.role-item").length;
    if (count > 4) return Confirm.Show({
      content: "你只能最多创建五个角色"
    });
    Client.hide2show($("#addrole_panel"));
    RefreshInput("name");
    RefreshInput("prop");
    RefreshInput("id");
  }

  delete() {
    var item = $(".role-list>.select");
    if (!item.length) return;
    var id = item.attr("roleid");
    if (!id) return;
    Confirm.Show({
      content: "是否确认删除角色：" + item.html(),
      onOK: function () {
        SendCommand("deleterole " + id);
      }
    });
  }
}

export default RolesPage;
export { RefreshInput };
