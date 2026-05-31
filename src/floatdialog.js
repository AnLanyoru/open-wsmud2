import Dialog from './dialog/base.js';
import { SendCommand } from './client.js';

const float_css = `
.float-dialog {
    position: fixed;
    z-index: 100;
    width: 24em;
    background: #000;
    border-radius: 6px;
    border: 1px solid #343434;
    box-shadow: 0 0 40px rgba(0,0,0,0.7);
    user-select: none;
    overflow: hidden;
}
.float-dialog>.float-dialog-header {
    height: 1.6em;
    line-height: 1.6em;
    background: #242424;
    padding: 0 0.5em;
    cursor: move;
    border-radius: 6px 6px 0 0;
    color: #9a9a50;
    font-size: 0.8em;
    font-weight: bold;
    touch-action: none;
}
.float-dialog .fb-actions {
    margin-top: 0;
    padding: 0.5em;
}
.float-dialog .fb-actions>.fb-action {
    line-height: 2em;
    padding-left: 1em;
    border-radius: 4px;
    border-left: 2px solid gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0;
    background-color: #111;
    cursor: default;
    display: flex;
    flex-direction: row;
}
.float-dialog .fb-actions>.fb-action>.action-desc {
    flex: 1;
    white-space: pre-wrap;
    color: #aaa;
    overflow-x: auto;
    scrollbar-width: none;
    padding-right: 1em;
    line-height: 1.8em;
}
.float-dialog .fb-actions>.fb-action>.action-desc::-webkit-scrollbar {
    display: none;
}
.float-dialog .action-desc .float-cmd {
    display: inline-block;
    border: solid 1px #555;
    color: #aaa;
    background-color: transparent;
    text-align: center;
    cursor: pointer;
    border-radius: 0.25em;
    padding: 0.1em 0.6em;
    margin: 0.1em 0.3em;
    white-space: nowrap;
    transition: background-color 0.15s, color 0.15s;
}
.float-dialog .action-desc .float-cmd:hover {
    background-color: #333;
    color: #ddd;
}
.float-dialog .fb-actions>.fb-action>.action-name {
    flex: 0;
    background-color: #281818;
    padding: 0.3em 0.5em;
    cursor: pointer;
    color: #c55;
    text-align: center;
    line-height: 1.6em;
    font-weight: bold;
    font-size: 0.95em;
    transition: background-color 0.15s, color 0.15s;
}
.float-dialog .fb-actions>.fb-action>.action-name:hover {
    background-color: #4a2020;
    color: #e77;
}
.float-dialog-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.55);
    z-index: 150;
}
.float-dialog-unified {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 151;
    width: 24em;
    max-height: 50vh;
    overflow-y: auto;
    overflow-x: hidden;
    background: #000;
    border-radius: 6px;
    border: 1px solid #343434;
    box-shadow: 0 0 40px rgba(0,0,0,0.7);
}

.float-dialog-unified>.unified-fade {
    background: linear-gradient(to bottom, transparent, #000);
}
.float-dialog-unified>.unified-fade {
    position: sticky;
    bottom: 0;
    left: 0; right: 0;
    height: 2.5em;
    background: linear-gradient(to bottom, transparent, #111);
    pointer-events: none;
    border-radius: 0 0 6px 6px;
}
.float-dialog-unified>.unified-header {
    position: sticky;
    top: 0;
    z-index: 1;
    height: 1.8em;
    line-height: 1.8em;
    background: #242424;
    padding: 0 0.5em;
    border-radius: 6px 6px 0 0;
    color: #9a9a50;
    font-size: 0.85em;
    font-weight: bold;
    display: flex;
}
.float-dialog-unified>.unified-header>.unified-title {
    flex: 1;
}
.float-dialog-unified>.unified-header>.unified-close {
    color: #666;
    cursor: pointer;
    padding: 0 0.3em;
    transition: color 0.15s;
}
.float-dialog-unified>.unified-header>.unified-close:hover {
    color: #c55;
}
.float-dialog-unified .fb-actions {
    margin-top: 0;
    padding: 0.5em;
}
.float-dialog-unified .fb-actions>.fb-action {
    line-height: 2em;
    padding-left: 1em;
    border-radius: 4px;
    border-left: 2px solid gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    display: flex;
    flex-direction: row;
}
.float-dialog-unified .fb-actions>.fb-action>.action-desc {
    flex: 1;
    white-space: pre-wrap;
    color: #aaa;
    overflow-x: auto;
    scrollbar-width: none;
    padding-right: 1em;
    line-height: 1.8em;
}
.float-dialog-unified .fb-actions>.fb-action>.action-desc::-webkit-scrollbar {
    display: none;
}
.float-dialog-unified .action-desc .float-cmd {
    display: inline-block;
    border: solid 1px #555;
    color: #aaa;
    background-color: transparent;
    text-align: center;
    cursor: pointer;
    border-radius: 0.25em;
    padding: 0.1em 0.6em;
    margin: 0.1em 0.3em;
    white-space: nowrap;
    transition: background-color 0.15s, color 0.15s;
}
.float-dialog-unified .action-desc .float-cmd:hover {
    background-color: #333;
    color: #ddd;
}
.float-dialog-unified .fb-actions>.fb-action>.action-name {
    flex: 0;
    background-color: #281818;
    padding: 0.3em 0.5em;
    cursor: pointer;
    color: #c55;
    text-align: center;
    line-height: 1.6em;
    font-weight: bold;
    font-size: 0.95em;
    transition: background-color 0.15s, color 0.15s;
}
.float-dialog-unified .fb-actions>.fb-action>.action-name:hover {
    background-color: #4a2020;
    color: #e77;
}
.float-warn {
    border-top-color: gray !important;
}
.float-warn .float-view-btn {
    color: #5a8a5a !important;
    border-color: #4a6a4a !important;
}
.float-warn .float-ignoreall-btn {
    color: #a55 !important;
    border-color: #744 !important;
}
`;

Dialog.injectStyle(float_css + `
@media (min-width: 1200px) {
    .float-dialog {
        width: 36em;
    }
    .float-dialog-unified {
        width: 36em;
    }
}
`);


const FloatDialog = {
    pendingDialogs: [],
    currentFloat: null,
    currentDialogData: null,
    warnEl: null,
    autoTimer: null,

    add(text, cmdsData) {
        if (this.currentFloat) {
            this.hideCurrent();
        }
        this.createFloatWindow({ text, cmds: cmdsData.items || [] });
        this.updateWarn();
    },

    createFloatWindow(dialog) {
        this.currentDialogData = dialog;

        let cmdsHTML = '';
        if (dialog.cmds.length) {
            cmdsHTML = ' ' + dialog.cmds.map((c, i) =>
                '<span class="float-cmd" data-ci="' + i + '">' + c.name + '</span>'
            ).join('');
        }

        let inner = '<div class="float-dialog-header">对话</div>' +
            '<div class="fb-actions"><div class="fb-action">' +
            '<span class="action-desc">' + dialog.text + cmdsHTML + '</span>' +
            '<span class="action-name float-ignore-btn">忽<br>略</span>' +
            '</div></div>';

        let el = document.createElement('div');
        el.className = 'float-dialog';
        el.innerHTML = inner;

        // Inherit global font size from .container
        let container = document.querySelector('.container');
        if (container) {
            el.style.fontSize = getComputedStyle(container).fontSize;
        }

        // Center (estimate before append, re-center after)
        let ww = window.innerWidth;
        let wh = window.innerHeight;
        let fs = parseFloat(getComputedStyle(el).fontSize) || parseFloat(getComputedStyle(document.body).fontSize) || 16;
        el.style.left = Math.max(0, (ww - 24 * fs) / 2) + 'px';
        el.style.top = Math.max(0, (wh - 100) / 2) + 'px';

        document.body.appendChild(el);

        // Re-center with actual width
        let ew = el.offsetWidth;
        el.style.left = Math.max(0, (ww - ew) / 2) + 'px';

        // Command clicks — event delegation on the dialog
        el.addEventListener('click', (e) => {
            let cmdEl = e.target.closest('.float-cmd');
            if (cmdEl) {
                let ci = parseInt(cmdEl.getAttribute('data-ci'));
                if (ci >= 0 && ci < dialog.cmds.length) {
                    SendCommand(dialog.cmds[ci].cmd);
                }
                FloatDialog.dismissCurrent();
                FloatDialog.updateWarn();
                return;
            }
            let ignoreEl = e.target.closest('.float-ignore-btn');
            if (ignoreEl) {
                FloatDialog.dismissCurrent();
                FloatDialog.updateWarn();
                return;
            }
        });

        this.currentFloat = el;

        this._setupDrag(el);

        // Auto-timeout: push to pending after 30s if not interacted
        clearTimeout(this.autoTimer);
        this.autoTimer = setTimeout(() => {
            if (FloatDialog.currentFloat === el) {
                FloatDialog.hideCurrent();
                FloatDialog.updateWarn();
            }
        }, 30000);
    },

    _setupDrag(el) {
        let header = el.querySelector('.float-dialog-header');

        header.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            header.setPointerCapture(e.pointerId);

            let sx = e.clientX;
            let sy = e.clientY;
            let rect = el.getBoundingClientRect();
            let ox = rect.left;
            let oy = rect.top;

            let move = (ev) => {
                el.style.left = (ox + ev.clientX - sx) + 'px';
                el.style.top = (oy + ev.clientY - sy) + 'px';
            };

            let up = () => {
                header.releasePointerCapture(e.pointerId);
                header.removeEventListener('pointermove', move);
                header.removeEventListener('pointerup', up);
            };

            header.addEventListener('pointermove', move);
            header.addEventListener('pointerup', up);
        });
    },

    hideCurrent() {
        clearTimeout(this.autoTimer);
        this.autoTimer = null;
        if (this.currentFloat) {
            this.currentFloat.remove();
            this.currentFloat = null;
        }
        if (this.currentDialogData) {
            this.pendingDialogs.unshift(this.currentDialogData);
            if (this.pendingDialogs.length > 20) {
                this.pendingDialogs.pop();
            }
            this.currentDialogData = null;
        }
    },

    dismissCurrent() {
        clearTimeout(this.autoTimer);
        this.autoTimer = null;
        if (this.currentFloat) {
            this.currentFloat.remove();
            this.currentFloat = null;
        }
        this.currentDialogData = null;
    },

    updateWarn() {
        let count = this.pendingDialogs.length;
        if (!count) {
            if (this.warnEl) {
                this.warnEl.remove();
                this.warnEl = null;
            }
            return;
        }

        if (this.warnEl) {
            this.warnEl.remove();
            this.warnEl = null;
        }

        let el = document.createElement('div');
        el.className = 'warn-dialog float-warn';
        el.innerHTML = '<div class="warn-content">未处理的对话 (' + count + ')</div>' +
            '<div class="item-commands">' +
            '<span class="float-view-btn">查看</span>' +
            '<span class="float-ignoreall-btn">忽略</span>' +
            '</div>';

        el.querySelector('.float-view-btn').addEventListener('click', () => {
            FloatDialog.showUnified();
        });
        el.querySelector('.float-ignoreall-btn').addEventListener('click', () => {
            FloatDialog.ignoreAll();
        });

        let bottomBar = document.querySelector('.bottom-bar');
        if (bottomBar) {
            bottomBar.appendChild(el);
            this._positionWarn();
        }

        this.warnEl = el;
    },

    _positionWarn() {
        let warns = document.querySelectorAll('.bottom-bar > .warn-dialog');
        let bottomBar = document.querySelector('.bottom-bar');
        if (!bottomBar) return;
        let height = bottomBar.offsetHeight + 8;
        warns.forEach((el) => {
            el.style.bottom = height + 'px';
            height += el.offsetHeight + 6;
        });
    },

    ignoreAll() {
        this.pendingDialogs.length = 0;
        if (this.currentFloat) {
            this.currentFloat.remove();
            this.currentFloat = null;
            this.currentDialogData = null;
        }
        if (this.warnEl) {
            this.warnEl.remove();
            this.warnEl = null;
        }
    },

    showUnified() {
        if (this.currentFloat && this.currentDialogData) {
            this.pendingDialogs.push(this.currentDialogData);
            this.currentFloat.remove();
            this.currentFloat = null;
            this.currentDialogData = null;
        }
        if (this.warnEl) {
            this.warnEl.remove();
            this.warnEl = null;
        }

        if (!this.pendingDialogs.length) return;

        let itemsHTML = '';
        for (let di = 0; di < this.pendingDialogs.length; di++) {
            let d = this.pendingDialogs[di];
            let cmdsHTML = '';
            if (d.cmds.length) {
                cmdsHTML = ' ' + d.cmds.map((c, ci) =>
                    '<span class="float-cmd" data-di="' + di + '" data-ci="' + ci + '">' + c.name + '</span>'
                ).join('');
            }
            itemsHTML += '<div class="fb-action" data-di="' + di + '">' +
                '<span class="action-desc">' + d.text + cmdsHTML + '</span>' +
                '<span class="action-name unified-ignore-one">忽<br>略</span>' +
                '</div>';
        }

        let overlay = document.createElement('div');
        overlay.className = 'float-dialog-overlay';

        let unified = document.createElement('div');
        unified.className = 'float-dialog-unified';
        // Inherit global font size
        let container = document.querySelector('.container');
        if (container) {
            unified.style.fontSize = getComputedStyle(container).fontSize;
        }
        unified.innerHTML = '<div class="unified-header">' +
            '<span class="unified-title">未处理的对话</span>' +
            '<span class="unified-close glyphicon glyphicon-remove-circle"></span>' +
            '</div>' +
            '<div class="fb-actions">' + itemsHTML + '</div>' +
            '<div class="unified-fade"></div>';

        document.body.appendChild(overlay);
        document.body.appendChild(unified);

        // Fade mask at bottom when scrollable, hide when at bottom
        let fade = unified.querySelector('.unified-fade');
        let checkFade = () => {
            let atBottom = unified.scrollTop + unified.clientHeight >= unified.scrollHeight - 6;
            fade.style.opacity = atBottom ? '0' : '1';
        };
        unified.addEventListener('scroll', checkFade);
        setTimeout(checkFade, 100);

        let close = () => {
            overlay.remove();
            unified.remove();
            FloatDialog.pendingDialogs.length = 0;
            if (FloatDialog.warnEl) {
                FloatDialog.warnEl.remove();
                FloatDialog.warnEl = null;
            }
        };

        overlay.addEventListener('click', close);
        unified.querySelector('.unified-close').addEventListener('click', close);

        // Event delegation for command clicks and ignore clicks
        unified.addEventListener('click', (e) => {
            let cmdEl = e.target.closest('.float-cmd');
            if (cmdEl) {
                let di = parseInt(cmdEl.getAttribute('data-di'));
                let ci = parseInt(cmdEl.getAttribute('data-ci'));
                if (di >= 0 && di < FloatDialog.pendingDialogs.length) {
                    let cmd = FloatDialog.pendingDialogs[di].cmds[ci];
                    if (cmd) SendCommand(cmd.cmd);
                }
                FloatDialog.pendingDialogs.splice(di, 1);
                cmdEl.closest('.fb-action').remove();
                // Re-index
                unified.querySelectorAll('.fb-action').forEach((fb, i) => {
                    fb.setAttribute('data-di', i);
                    fb.querySelectorAll('.float-cmd').forEach((sp) => {
                        sp.setAttribute('data-di', i);
                    });
                });
                checkFade();
                if (!FloatDialog.pendingDialogs.length) close();
                return;
            }
            let ignoreEl = e.target.closest('.unified-ignore-one');
            if (ignoreEl) {
                let fbAction = ignoreEl.closest('.fb-action');
                let di = parseInt(fbAction.getAttribute('data-di'));
                if (di >= 0 && di < FloatDialog.pendingDialogs.length) {
                    FloatDialog.pendingDialogs.splice(di, 1);
                }
                fbAction.remove();
                unified.querySelectorAll('.fb-action').forEach((fb, i) => {
                    fb.setAttribute('data-di', i);
                    fb.querySelectorAll('.float-cmd').forEach((sp) => {
                        sp.setAttribute('data-di', i);
                    });
                });
                checkFade();
                if (!FloatDialog.pendingDialogs.length) close();
                return;
            }
        });
    }
};

export default FloatDialog;
