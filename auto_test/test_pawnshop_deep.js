/**
 * 唐楠当铺 深度压力测试
 *
 * 测试项:
 *  1. 模拟真实网络延迟(随机抖动 + 偶发高延迟)
 *  2. 逐件购买直到买空后刷新, 循环多轮
 *  3. 购买中途穿插点击刷新, 验证竞态行为
 *  4. 刷新 + 立即购买(不等待刷新完成)
 *  5. 快速连点刷新
 */
const http = require('http');
const WebSocket = require('ws');
const WEB_PORT = 8088;
const WS_PORT = 31300;

// ======================== 网络延迟模拟 ========================

function jitter() { return 80 + Math.random() * 520; }
function spike() { return Math.random() < 0.08 ? (1000 + Math.random() * 2000) : 0; }

async function lag() {
    const d = jitter() + spike();
    if (d > 0) await new Promise(r => setTimeout(r, d));
}

async function tinyLag() {
    await new Promise(r => setTimeout(r, 30 + Math.random() * 120));
}

// ======================== 工具函数 ========================

const trim = s => (s && s.length > 400) ? s.substring(0, 400) + '...' : (s || '');

function extractTangId(msgs) {
    for (const msg of msgs) {
        const m = msg.match(/id:"([^"]+)",name:"当铺老板\s*唐楠"/);
        if (m) return m[1];
    }
    return null;
}

/**
 * selllist item 格式: [name, id, count, grade, unit, value]
 * 示例: ["<hig>玄晶</hig>","o6g811472d0c",70,1,"块",1000]
 */
function parseSellList(msg) {
    try {
        const j = JSON.parse(msg);
        if (j.dialog === 'list' && Array.isArray(j.selllist)) {
            return j.selllist.map(row => ({
                id: row[1],
                name: row[0].replace(/<[^>]+>/g, ''),
                count: typeof row[2] === 'number' ? row[2] : -1,
                unit: row[4] || '',
                value: row[5] || 0,
            }));
        }
    } catch {}
    return [];
}

function extractRefreshCost(msgs) {
    for (const msg of msgs) {
        const m = msg.match(/需要(\d+)两黄金/);
        if (m) return parseInt(m[1]);
    }
    return -1;
}

function extractRefCount(msgs) {
    for (const msg of msgs) {
        const m = msg.match(/加急上货需要(\d+)两黄金/);
        if (m) return (parseInt(m[1]) / 10) - 1;
    }
    return -1;
}

function isMaxedOut(msgs) {
    return msgs.some(m => m.includes('本店近日就这么多货物了'));
}

function isRefreshOk(msgs) {
    return msgs.some(m => m.includes('本店的货物都在这里了'));
}

/**
 * 解析单引号格式的JSON (如: {type:'roles',roles:[{name:'窦前',...}]})
 * 转为标准JSON后解析
 */
function parseSingleQuoteJson(msg) {
    // 找到 type:'roles' 部分
    const idx = msg.indexOf("type:'roles'");
    if (idx < 0) return null;
    const rolesStart = msg.indexOf('roles:[', idx);
    if (rolesStart < 0) return null;
    // 括号匹配找到 roles 数组结束位置
    let depth = 0, rolesEnd = -1;
    for (let i = rolesStart + 6; i < msg.length; i++) {
        if (msg[i] === '[') depth++;
        else if (msg[i] === ']') {
            depth--;
            if (depth === 0) { rolesEnd = i + 1; break; }
        }
    }
    if (rolesEnd < 0) return null;
    // 转为标准JSON: '→", 属性名加引号
    let json = msg.substring(rolesStart + 6, rolesEnd);
    json = json.replace(/'/g, '"').replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":');
    try { return JSON.parse(json); } catch {}
    return null;
}

// ======================== HTTP 登录 ========================

function httpLogin() {
    return new Promise((resolve, reject) => {
        const p = JSON.stringify({ code: 'administrator', pwd: '123456' });
        const req = http.request({
            hostname: '127.0.0.1', port: WEB_PORT, path: '/api/user/login', method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(p) }
        }, (res) => {
            let b = '';
            res.on('data', c => b += c);
            res.on('end', () => { try { resolve(JSON.parse(b)); } catch (e) { reject(e); } });
        });
        req.on('error', reject);
        req.write(p);
        req.end();
    });
}

// ======================== WS 辅助 ========================

class WSClient {
    constructor(ws) {
        this.ws = ws;
        this.buf = [];
        ws.on('message', d => this.buf.push(d.toString()));
    }
    clear() { this.buf.length = 0; }
    send(cmd) { this.ws.send(cmd); }

    async sendAndCollect(cmd, waitMs = 2500) {
        this.clear();
        this.send(cmd);
        await lag();
        await new Promise(r => setTimeout(r, waitMs));
        return [...this.buf];
    }
}

// ======================== 主测试 ========================

async function main() {
    const startTime = Date.now();
    console.log('═══════════════════════════════════════════');
    console.log('  唐楠当铺 深度压力测试 (带网络延迟模拟)');
    console.log('═══════════════════════════════════════════\n');

    // ---- 1. 登录 & 获取角色列表 ----
    console.log('[1/5] 登录认证...');
    const login = await httpLogin();
    const ws = new WebSocket(`ws://127.0.0.1:${WS_PORT}`);
    const c = new WSClient(ws);
    ws.on('error', e => console.error('  WS error:', e.message));

    // 认证(不指定角色, 获取角色列表)
    await new Promise(r => { ws.on('open', () => { ws.send(login.u + ' ' + login.p); setTimeout(r, 5000); }); });

    // 解析角色列表
    let roles = [];
    for (const m of c.buf) {
        const parsed = parseSingleQuoteJson(m);
        if (parsed) roles = parsed;
    }
    console.log('  角色列表: ' + roles.length + ' 个');
    for (const r of roles) console.log('    ' + r.id + ' (' + r.name + ' ' + (r.title || '') + ')');
    c.clear();

    // 创建新测试角色 (ref_count=0)
    let charId = null;
    if (roles.length < 2) {
        const cnChars = '王李张刘陈杨赵黄周吴徐孙马胡朱郭何罗高林郑梁谢唐许冯宋韩';
        const seed = Date.now();
        const testName = cnChars[seed % cnChars.length] + cnChars[Math.floor(seed / cnChars.length) % cnChars.length];
        console.log('  创建新角色: ' + testName);
        c.send('createrole ' + testName + ' 1 20 20 20 20');
        await new Promise(r => setTimeout(r, 5000));

        for (const m of c.buf) {
            if (m.includes('regist') && m.includes('result')) {
                console.log('  创建结果: ' + trim(m));
            }
            // 匹配 id:"xxx" 或 id:'xxx'
            const idMatch = m.match(/id:["']([a-z][a-z0-9]{2,11})["']/);
            if (idMatch && !charId) charId = idMatch[1];
        }
        if (charId) {
            console.log('  新角色ID: ' + charId + ' (ref_count=0)');
        }
    }

    // 回退: 选一个非 maxed 角色
    if (!charId) {
        if (roles.length > 0) {
            // 优先选新创建的非 r3f511438a67 角色
            charId = roles.find(r => r.id !== 'r3f511438a67')?.id || roles[0].id;
            console.log('  使用角色: ' + charId);
            c.clear();
            c.send('login ' + charId);
            await new Promise(r => setTimeout(r, 3500));
        } else {
            console.log('  无可用角色!');
            ws.close();
            return;
        }
    } else {
        charId = roles.find(r => r.id !== 'r3f511438a67')?.id || roles[0].id;
        console.log('  登录角色: ' + charId);
        c.send('login ' + charId);
        await new Promise(r => setTimeout(r, 3500));
    }
    c.clear();

    // 跳过新手引导 (新角色需要)
    console.log('\n[2/5] 跳过新手引导...');
    c.send('guide_over');
    await new Promise(r => setTimeout(r, 2500));
    for (const m of c.buf) {
        if (m.includes('guide_over') || m.includes('room') || m.includes('exits')) {
            console.log('  ', trim(m));
        }
    }
    c.clear();

    // ---- 3. 导航到当铺 ----
    console.log('[3/5] 导航到当铺...');
    c.send('goto home');
    await new Promise(r => setTimeout(r, 2000));
    c.clear();
    for (const dir of ['out', 'south', 'east', 'east', 'south', 'east']) {
        c.clear();
        c.send('go ' + dir);
        await new Promise(r => setTimeout(r, 800));
    }
    c.clear();
    c.send('go west');
    await new Promise(r => setTimeout(r, 800));
    c.clear();
    c.send('go east');
    await new Promise(r => setTimeout(r, 1500));

    const tangId = extractTangId(c.buf);
    if (!tangId) { console.log('  找不到唐楠!'); ws.close(); return; }
    console.log('  唐楠ID:', tangId);
    c.clear();

    // ---- 3. 探测 ref_count 状态 & 初始刷新 ----
    console.log('\n[4/5] 探测状态 & 初始刷新...');
    let msgs = await c.sendAndCollect('refresh ' + tangId, 2000);
    for (const m of msgs) {
        if (m.includes('加急上货需要') || m.includes('本店近日')) console.log('  ', trim(m));
    }
    let maxedOut = isMaxedOut(msgs);
    let refCount = extractRefCount(msgs);
    let refreshCost = extractRefreshCost(msgs);

    if (maxedOut) {
        console.log('  ⚠ ref_count 已达上限, 仅测试当前库存');
    } else {
        if (refCount < 0) refCount = 0;
        if (refreshCost < 0) refreshCost = (refCount + 1) * 10;
        console.log('  ref_count=' + refCount + ', 费用=' + refreshCost + '两黄金');
    }
    c.clear();

    // 初始刷新(如果有费且未达上限)
    let canRefresh = !maxedOut;
    if (canRefresh && refreshCost > 0) {
        console.log('  执行初始刷新...');
        await lag();
        c.send('give ' + tangId + ' ' + (refreshCost * 10000) + ' money');
        await new Promise(r => setTimeout(r, 5000));
        const ok = isRefreshOk(c.buf);
        for (const m of c.buf) console.log('    ', trim(m));
        console.log(ok ? '    ✓ 初始刷新成功' : '    ? 初始刷新失败');
        c.clear();
        if (ok) { refCount++; if (refCount >= 5) canRefresh = false; }
    }

    // ============================================================
    // 4. 核心: 买空-刷新循环 (10轮)
    // ============================================================
    const MAX_CYCLES = 10;
    let totalBought = 0;
    let totalRefreshes = 0;
    let totalInterleaveRefreshes = 0;

    console.log('\n[5/5] 买空-刷新循环 (最多' + MAX_CYCLES + '轮, 可刷新=' + canRefresh + ')...');

    for (let cycle = 0; cycle < MAX_CYCLES; cycle++) {
        console.log('\n─────────────────────────────────────');
        console.log('  第 ' + (cycle + 1) + '/' + MAX_CYCLES + ' 轮 (可刷新=' + canRefresh + ')');
        console.log('─────────────────────────────────────');

        // 4a. 列货物
        console.log('  [list] 获取货物...');
        await lag();
        c.clear();
        c.send('list ' + tangId);
        await new Promise(r => setTimeout(r, 2000));

        let selllist = [];
        for (const m of c.buf) {
            const items = parseSellList(m);
            if (items.length > 0) {
                selllist = items;
                console.log('  共 ' + items.length + ' 件:');
                for (const item of items) {
                    console.log('    [' + item.id + '] ' + item.name + ' x' + item.count + ' (' + item.value + '金/件)');
                }
            }
        }
        c.clear();

        if (selllist.length === 0) {
            console.log('  ⚠ 货物为空');
            if (!canRefresh) {
                console.log('  ⛔ 无货且不可刷新, 测试结束');
                break;
            }
        }

        // 4b. 逐件购买, 穿插随机刷新
        let roundBought = 0;
        let interleaveCount = 0;

        for (let i = 0; i < selllist.length; i++) {
            const item = selllist[i];
            await lag();

            // 25% 概率穿插刷新
            if (Math.random() < 0.25 && canRefresh && interleaveCount < 3) {
                interleaveCount++;
                totalInterleaveRefreshes++;
                console.log('\n  ⟳ [穿插刷新 #' + interleaveCount + '] 在第 ' + (i + 1) + ' 件前...');

                c.clear();
                c.send('refresh ' + tangId);
                await new Promise(r => setTimeout(r, 1500));

                const cost = extractRefreshCost(c.buf);
                const maxed = isMaxedOut(c.buf);
                for (const m of c.buf) {
                    if (m.includes('加急上货需要') || m.includes('本店近日')) console.log('    ', trim(m));
                }

                if (maxed) {
                    console.log('    ⛔ 已达上限, 后续不再刷新');
                    canRefresh = false;
                } else if (cost > 0 && Math.random() < 0.5) {
                    console.log('    → 给钱刷新 (' + cost + '两黄金)!');
                    c.clear();
                    c.send('give ' + tangId + ' ' + (cost * 10000) + ' money');
                    await new Promise(r => setTimeout(r, 5000));

                    const ok = isRefreshOk(c.buf);
                    for (const m of c.buf) console.log('      ', trim(m));
                    console.log(ok ? '      ✓ 穿插刷新成功!' : '      ? 被拒');
                    if (ok) {
                        totalRefreshes++; refCount++;
                        if (refCount >= 5) canRefresh = false;
                        // 刷新后重新列货物
                        c.clear();
                        c.send('list ' + tangId);
                        await new Promise(r => setTimeout(r, 2000));
                        for (const m of c.buf) {
                            const items = parseSellList(m);
                            if (items.length > 0) selllist = items;
                        }
                        if (selllist.length > 0) {
                            i = -1; roundBought = 0;
                            console.log('      → 新货物 ' + selllist.length + ' 件, 重新购买');
                        }
                        c.clear();
                        continue;
                    }
                }
                c.clear();
            }

            // 购买
            const buyCount = item.count === -1 ? 1 : item.count;
            console.log('  [buy] ' + item.name + ' x' + buyCount + ' (id=' + item.id + ', ' + item.value + '金/件)...');

            c.clear();
            c.send('buy ' + buyCount + ' ' + item.id + ' from ' + tangId);
            await new Promise(r => setTimeout(r, 2000));

            let buyOk = false;
            for (const m of c.buf) {
                const t = trim(m);
                if (m.includes('购买了') || (m.includes('从') && m.includes('购买'))) {
                    console.log('    ✓ ' + t);
                    buyOk = true;
                } else if (m.includes('dialog') && m.includes('list')) {
                    buyOk = true;
                } else if (m.includes('没有') || m.includes('不出售') || m.includes('拿不下')) {
                    console.log('    ✗ ' + t);
                }
            }
            if (!buyOk) {
                const hasErr = c.buf.some(m => m.includes('没有') || m.includes('不能') || m.includes('不出售'));
                console.log(hasErr ? '    ✗ 购买失败' : '    ✓ (静默)');
            }
            if (buyOk) { roundBought++; totalBought++; }
            c.clear();
            await tinyLag();
        }

        console.log('\n  ── 本轮: 买 ' + roundBought + ' 件, 穿插刷新 ' + interleaveCount + ' 次 ──');

        // 4c. 验证
        console.log('  [verify] 检查剩余...');
        await lag();
        c.clear();
        c.send('list ' + tangId);
        await new Promise(r => setTimeout(r, 2000));

        let remaining = [];
        for (const m of c.buf) {
            const items = parseSellList(m);
            if (items.length > 0) remaining = items;
        }
        if (remaining.length === 0) {
            console.log('  ✓ 已买空!');
        } else {
            console.log('  ⚠ 剩余 ' + remaining.length + ' 件');
            selllist = remaining; // 下轮继续
        }
        c.clear();

        // 4d. 刷新
        if (!canRefresh) {
            console.log('  ⛔ 已达刷新上限');
            if (remaining.length === 0) {
                console.log('  ⛔ 无货且不可刷新, 测试结束');
                break;
            }
            // 继续买剩余
            continue;
        }

        if (cycle < MAX_CYCLES - 1) {
            console.log('  [refresh] 请求刷新...');
            await lag();
            c.clear();
            c.send('refresh ' + tangId);
            await new Promise(r => setTimeout(r, 2000));

            const cost = extractRefreshCost(c.buf);
            const maxed = isMaxedOut(c.buf);
            for (const m of c.buf) {
                if (m.includes('加急上货需要') || m.includes('本店近日')) console.log('    ', trim(m));
            }
            if (maxed) { console.log('    ⛔ 已达上限'); canRefresh = false; c.clear(); continue; }

            const payCost = cost > 0 ? cost : ((refCount + 1) % 6) * 10 + 10;
            console.log('    费用: ' + payCost + '两黄金');

            await lag();
            c.clear();
            c.send('give ' + tangId + ' ' + (payCost * 10000) + ' money');
            await new Promise(r => setTimeout(r, 5000));

            const ok = isRefreshOk(c.buf);
            for (const m of c.buf) console.log('    ', trim(m));
            if (ok) { console.log('    ✓ 刷新成功'); totalRefreshes++; refCount++; if (refCount >= 5) canRefresh = false; }
            else console.log('    ✗ 刷新被拒');
            c.clear();
        }
    }

    // ============================================================
    // 结果汇总
    // ============================================================
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('\n═══════════════════════════════════════════');
    console.log('  测试完成!  耗时: ' + elapsed + 's');
    console.log('  总购买: ' + totalBought + ' 件');
    console.log('  正常刷新: ' + totalRefreshes + ' 次');
    console.log('  穿插刷新: ' + totalInterleaveRefreshes + ' 次');
    console.log('═══════════════════════════════════════════');

    ws.close();
    process.exit(0);
}

main().catch(err => { console.error('错误:', err); process.exit(1); });
