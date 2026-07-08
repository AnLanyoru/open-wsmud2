import fs from 'fs';

const content = fs.readFileSync('res/skill/base/sword.js', 'utf8');

function unescapeJS(str, quote) {
    return str.replace(/\(.)/g, (_, c) => {
        if (c === quote) return quote;
        if (c === 'n') return '\n';
        if (c === 't') return '\t';
        if (c === 'r') return '\r';
        if (c === '\') return '\';
        return c;
    });
}

const ACTION_ARR_RE = /((?:this\.)?(?:attack_actions|dodge_actions|parry_actions|weapon_vs_weapon_actions|unarmed_vs_weapon_actions)\s*[=:]\s*\[)([\s\S]*?)(\])/g;
const STR_RE = /(["'])((?:[^"'\\n\r]|\.)*?)\1(?!\s*\+)/g;

let count = 0;
let newContent = content.replace(ACTION_ARR_RE, (match, prefix, body, suffix) => {
    console.log('Body:', JSON.stringify(body.slice(0, 200)));
    const replaced = body.replace(STR_RE, (m, q, raw) => {
        const lit = unescapeJS(raw, q);
        if (lit.includes('$')) { count++; return '999'; }
        return m;
    });
    console.log('Replaced:', count);
    return prefix + replaced + suffix;
});

console.log('Total:', count);
console.log('Changed:', newContent !== content);
