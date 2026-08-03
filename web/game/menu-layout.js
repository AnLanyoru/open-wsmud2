import Setting from '../setting.js';
import * as ToolAction from './tool.js';

const DEFAULT_LAYOUT = 'reflow';
const LAYOUTS = new Set(['reflow', 'hide', 'shield', 'unchanged']);

let dialogOpen = false;
let layoutFrame = null;
let sizeObserver = null;
let scrollBar = null;
let menuHiddenByDialog = false;

function elements() {
    return {
        dialog: document.querySelector('.dialog'),
        bottomBar: document.querySelector('.bottom-bar'),
        rightBar: document.querySelector('.right-bar'),
    };
}

function visibleTools(rightBar) {
    return Array.from(rightBar.children).filter(item =>
        !item.classList.contains('dialog-close-tool')
        && getComputedStyle(item).display !== 'none'
    );
}

function resetLayout() {
    if (layoutFrame) {
        cancelAnimationFrame(layoutFrame);
        layoutFrame = null;
    }

    const {dialog, bottomBar, rightBar} = elements();
    dialog?.classList.remove('menu-shield-active', 'menu-shield-top');
    const dialogClose = dialog?.querySelector('.dialog-close');
    dialogClose?.classList.remove('glyphicon-remove');
    dialogClose?.classList.add('glyphicon-remove-circle');
    bottomBar?.classList.remove('menu-scroll-bottom-shield');
    bottomBar?.style.removeProperty('--menu-scroll-width');
    bottomBar?.style.removeProperty('--menu-scroll-bottom');
    if (scrollBar) {
        scrollBar.removeEventListener('scroll', updateShieldIndicators);
        scrollBar = null;
    }
    if (!rightBar) return;

    const closeTool = rightBar.querySelector('.dialog-close-tool');
    if (closeTool) closeTool.style.display = 'none';
    const moreTool = bottomBar?.querySelector('.br-tool');
    if (moreTool?.classList.contains('dialog-close-replacement')) {
        moreTool.classList.remove('dialog-close-replacement');
        moreTool.setAttribute('command', 'showtool');
        moreTool.replaceChildren();
    }
    rightBar.classList.remove('menu-reflow-layout', 'menu-scroll-layout');
    rightBar.style.removeProperty('height');
    rightBar.style.removeProperty('width');
    for (const item of rightBar.children) {
        item.style.removeProperty('right');
        item.style.removeProperty('bottom');
    }
}

function availableMenuSpace(dialog, bottomBar, rightBar) {
    const dialogBottom = dialog.getBoundingClientRect().bottom;
    const bottomBarRect = bottomBar.getBoundingClientRect();
    const bottomOffset = parseFloat(getComputedStyle(rightBar).bottom) || 0;
    const menuBottom = bottomBarRect.bottom - bottomOffset;
    return {
        dialogBottom,
        menuBottom,
        height: Math.max(0, menuBottom - dialogBottom),
    };
}

function toolStep(item) {
    const rect = item.getBoundingClientRect();
    const style = getComputedStyle(item);
    return {
        x: rect.width + (parseFloat(style.marginRight) || 0),
        y: rect.height + (parseFloat(style.marginBottom) || 0),
    };
}

function reflowMenu(dialog, bottomBar, rightBar, tools) {
    const naturalTop = rightBar.getBoundingClientRect().top;
    const space = availableMenuSpace(dialog, bottomBar, rightBar);
    if (naturalTop >= space.dialogBottom || !tools.length) return;

    const step = toolStep(tools[0]);
    const rows = Math.max(1, Math.floor(space.height / step.y));
    const columns = Math.ceil(tools.length / rows);

    rightBar.classList.add('menu-reflow-layout');
    rightBar.style.height = Math.min(space.height, rows * step.y) + 'px';
    rightBar.style.width = columns * step.x + 'px';

    // The existing menu is read from the bottom upwards. Fill the right column
    // first, then continue from bottom to top in each new column on its left.
    const bottomUpTools = tools.slice().reverse();
    for (let index = 0; index < bottomUpTools.length; index++) {
        const item = bottomUpTools[index];
        item.style.bottom = (index % rows) * step.y + 'px';
        item.style.right = Math.floor(index / rows) * step.x + 'px';
    }
}

function shieldMenu(dialog, bottomBar, rightBar, tools) {
    const naturalTop = rightBar.getBoundingClientRect().top;
    const space = availableMenuSpace(dialog, bottomBar, rightBar);
    if (naturalTop >= space.dialogBottom || !tools.length) return;

    const step = toolStep(tools[0]);
    dialog.classList.add('menu-shield-active');
    rightBar.classList.add('menu-scroll-layout');
    rightBar.style.height = space.height + 'px';
    rightBar.style.width = step.x + 'px';
    bottomBar.style.setProperty('--menu-scroll-width', step.x + 'px');
    bottomBar.style.setProperty('--menu-scroll-bottom', getComputedStyle(rightBar).bottom);

    // Keep the lowest menu item at the bottom initially. Dragging the menu down
    // decreases scrollTop and pulls the hidden upper items into view.
    rightBar.scrollTop = rightBar.scrollHeight;
    scrollBar = rightBar;
    scrollBar.addEventListener('scroll', updateShieldIndicators, {passive: true});
    updateShieldIndicators();
}

function updateShieldIndicators() {
    if (!scrollBar) return;
    const {dialog, bottomBar} = elements();
    const maxScroll = Math.max(0, scrollBar.scrollHeight - scrollBar.clientHeight);
    const hasHiddenAbove = scrollBar.scrollTop > 1;
    const hasHiddenBelow = scrollBar.scrollTop < maxScroll - 1;
    dialog?.classList.toggle('menu-shield-top', hasHiddenAbove);
    bottomBar?.classList.toggle('menu-scroll-bottom-shield', hasHiddenBelow);
}

function applyLayout() {
    layoutFrame = null;
    if (!dialogOpen) return;

    resetLayout();
    const {dialog, bottomBar, rightBar} = elements();
    if (!dialog || !bottomBar || !rightBar) return;

    const tools = visibleTools(rightBar);
    const layout = LAYOUTS.has(Setting.w_type) ? Setting.w_type : DEFAULT_LAYOUT;
    if (layout === 'hide') {
        if (tools.length) menuHiddenByDialog = true;
        ToolAction.HideTools();
        if (Setting.dlog_cbtn == 1) {
            const closeTool = rightBar.querySelector('.dialog-close-tool');
            if (closeTool) closeTool.style.display = 'flex';
        } else if (Setting.dlog_cbtn == 2) {
            const moreTool = bottomBar.querySelector('.br-tool');
            if (moreTool) {
                moreTool.classList.add('dialog-close-replacement');
                moreTool.setAttribute('command', 'closedialog');
                moreTool.innerHTML = '<span class="glyphicon glyphicon-remove-circle tool-icon"></span>'
                    + '<span class="tool-text">关闭</span>';
            }
            const dialogClose = dialog.querySelector('.dialog-close');
            dialogClose?.classList.remove('glyphicon-remove-circle');
            dialogClose?.classList.add('glyphicon-remove');
        }
    } else if (layout === 'reflow') {
        reflowMenu(dialog, bottomBar, rightBar, tools);
    } else if (layout === 'shield') {
        shieldMenu(dialog, bottomBar, rightBar, tools);
    }
}

function scheduleLayout() {
    if (layoutFrame) cancelAnimationFrame(layoutFrame);
    layoutFrame = requestAnimationFrame(applyLayout);
}

export function onDialogOpen() {
    const wasOpen = dialogOpen;
    dialogOpen = true;
    if (!wasOpen) menuHiddenByDialog = false;
    sizeObserver?.disconnect();
    if (window.ResizeObserver) {
        const {dialog, bottomBar} = elements();
        sizeObserver = new ResizeObserver(scheduleLayout);
        if (dialog) sizeObserver.observe(dialog);
        if (bottomBar) sizeObserver.observe(bottomBar);
    }
    scheduleLayout();
}

export function onDialogClose() {
    dialogOpen = false;
    sizeObserver?.disconnect();
    sizeObserver = null;
    resetLayout();
    if (menuHiddenByDialog) {
        menuHiddenByDialog = false;
        ToolAction.OpenTools();
    }
}

window.addEventListener('resize', scheduleLayout);
window.addEventListener('menu-layout-change', scheduleLayout);
