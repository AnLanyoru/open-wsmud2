import { Page } from '../base/page.js';

class NewsPage extends Page {
  constructor() {
    super();
    this.template = `
        <div id="new_panel" class="mypanel" style="display:none">
            <ul>
                <li class="content" style="height:20rem;">
                    <iframe frameborder="0" id="news_frame" width="100%" height="100%"></iframe>
                </li>
                <li class="panel_item" command="ToRolePanel"><span class="glyphicon glyphicon-chevron-left"></span><span
                        style="margin-left:0.5rem">返回</span></li>
            </ul>
        </div>
`;
  }
}

export default NewsPage;
