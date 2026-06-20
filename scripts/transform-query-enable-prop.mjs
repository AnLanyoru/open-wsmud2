/**
 * Transform static lv=1000 values in query_enable_prop to dynamic formulas.
 * Formula: base + lv * gain, where gain has ≤3 significant digits.
 * Uses a search-based approach to find clean gain/base splits.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');
const LV = 1000;

function walkDir(dir) {
    const results = [];
    const list = readdirSync(dir);
    for (const item of list) {
        const fullPath = join(dir, item);
        if (statSync(fullPath).isDirectory()) {
            results.push(...walkDir(fullPath));
        } else if (item.endsWith('.ts')) {
            results.push(fullPath);
        }
    }
    return results;
}

/**
 * Count significant digits in a number.
 */
function countSigDigits(n) {
    if (n === 0) return 1;
    const s = Math.abs(n).toExponential();
    // Extract mantissa digits
    const match = s.match(/^(\d)\.(\d+)e/);
    if (!match) return String(Math.abs(n)).replace(/\./, '').replace(/^0+/, '').length;
    const digits = match[1] + match[2];
    // Remove trailing zeros... actually, count all digits in mantissa
    return digits.length;
}

/**
 * Generate candidate gain values near rawGain with ≤maxSig significant digits.
 */
function generateCandidates(rawGain, maxSig = 3) {
    const candidates = new Set();

    // Integer candidates near rawGain
    const intFloor = Math.floor(rawGain);
    const intCeil = Math.ceil(rawGain);
    for (let g = Math.max(0, intFloor - 2); g <= intCeil + 2; g++) {
        if (g >= 0 && countSigDigits(g) <= maxSig) candidates.add(g);
    }

    // Half-integer candidates
    for (let g = Math.max(0.5, intFloor - 1); g <= intCeil + 1; g += 0.5) {
        if (g >= 0 && countSigDigits(g) <= maxSig) candidates.add(Math.round(g * 10) / 10);
    }

    // Tenth-precision candidates
    for (let d = -5; d <= 5; d++) {
        const g = Math.round((rawGain + d * 0.1) * 10) / 10;
        if (g > 0 && countSigDigits(g) <= maxSig) candidates.add(g);
    }

    // Hundredth-precision candidates (closer search)
    for (let d = -10; d <= 10; d++) {
        const g = Math.round((rawGain + d * 0.01) * 100) / 100;
        if (g > 0 && countSigDigits(g) <= maxSig) candidates.add(g);
    }

    // Thousandth-precision for small gains
    if (rawGain < 1) {
        for (let d = -10; d <= 10; d++) {
            const g = Math.round((rawGain + d * 0.001) * 1000) / 1000;
            if (g > 0 && countSigDigits(g) <= maxSig) candidates.add(g);
        }
    }

    // Also include the raw gain rounded to 3 sig digits
    const rawRounded = roundToSigDigits(rawGain, maxSig);
    if (rawRounded > 0) candidates.add(rawRounded);

    return [...candidates].sort((a, b) => a - b);
}

function roundToSigDigits(n, maxSigDigits = 3) {
    if (n === 0) return 0;
    const sign = n < 0 ? -1 : 1;
    n = Math.abs(n);
    const d = Math.ceil(Math.log10(n));
    const digits = maxSigDigits - d;
    if (digits >= 0) return sign * n;
    const factor = Math.pow(10, digits);
    return sign * Math.round(n / factor) * factor;
}

/**
 * Find the best (gain, base) pair for a given value at lv=1000.
 * Prefers: integer gains, small base, positive base.
 */
function findBestGainBase(value, propName) {
    const rawGain = value / LV;
    const candidates = generateCandidates(rawGain);

    if (candidates.length === 0) return null;

    // Score each candidate: lower score is better
    const scored = candidates.map(gain => {
        const base = value - LV * gain;
        const roundedBase = Math.round(base);
        const error = Math.abs(value - (roundedBase + LV * gain));

        // Must be within 0.5 of target value
        if (error > 0.5) return null;

        // Reject negative base entirely (formula would give negative values at low levels)
        if (roundedBase < 0) return null;

        const absBase = Math.abs(roundedBase);
        const isIntGain = Number.isInteger(gain);

        // Score: lower is better
        // - Integer gains get a massive bonus (prefer 30 + lv * 2 over Math.floor(lv * 2.03))
        // - Small base is preferred
        // - Fewer significant digits is preferred
        let score = absBase;
        if (!isIntGain) {
            score += 50 + countSigDigits(gain) * 5; // Heavy penalty for fractional gains
        } else {
            score += countSigDigits(gain); // Small complexity bonus for cleaner ints
        }

        return { gain, base: roundedBase, error, score };
    }).filter(Boolean);

    if (scored.length === 0) {
        // All candidates had negative base or failed verification.
        // Fallback: use raw gain rounded to 3 sig digits with base=0
        const gain = roundToSigDigits(rawGain, 3);
        // Verify
        const check = Math.floor(LV * gain);
        if (Math.abs(check - value) < 0.5) {
            return { gain, base: 0, error: 0, score: 0 };
        }
        // If Math.floor fails (float issue), try adjusting
        const adjusted = Math.round(value / LV * 1000) / 1000;
        if (Math.abs(Math.floor(LV * adjusted) - value) < 0.5) {
            return { gain: adjusted, base: 0, error: 0, score: 0 };
        }
        return null;
    }

    // Sort by score (lower is better)
    scored.sort((a, b) => a.score - b.score);
    return scored[0];
}

/**
 * Generate the code formula from gain and base.
 */
function makeFormula(gain, base, propName) {
    const isStat = ['str', 'con', 'dex', 'int'].includes(propName);
    const isLimitMp = propName === 'limit_mp';

    // If gain is essentially 0, keep the value static
    if (gain === 0 || Math.abs(gain) < 0.0001) {
        return String(Math.round(base));
    }

    if (isLimitMp) {
        // limit_mp always uses simple lv * gain
        const g = Math.round(gain);
        return `lv * ${g}`;
    }

    if (base === 0) {
        if (Number.isInteger(gain)) {
            return `lv * ${gain}`;
        }
        if (isStat) {
            return `Math.floor(lv * ${gain})`;
        }
        return `Math.floor(lv * ${gain})`;
    }

    // base != 0
    if (Number.isInteger(gain)) {
        if (isStat) {
            return `${base} + lv * ${gain}`;
        }
        return `${base} + lv * ${gain}`;
    }

    // Fractional gain
    if (isStat) {
        return `${base} + Math.floor(lv * ${gain})`;
    }
    return `${base} + Math.floor(lv * ${gain})`;
}

function verifyFormula(formula, expectedValue) {
    const lv = LV;
    try {
        const result = eval(formula.replace(/Math\.floor/g, 'Math.floor'));
        return Math.abs(result - expectedValue) < 0.5;
    } catch (e) {
        return false;
    }
}

/**
 * Properties that should remain static (not level-scaled).
 */
const STATIC_PROPS = new Set([
    'gjsd',           // attack speed - typically a fixed value
    'bj_per', 'add_sh_per', 'diff_sh_per', 'diff_sh_per2',
    'gj_per', 'fy_per', 'mz_per', 'ds_per', 'zj_per',
    'hp_per', 'mp_per', 'gjsd_per', 'exp_per', 'pot_per',
    'add_bjsh_per', 'diff_fy_per', 'diff_fy_per2', 'diff_bj',
    'diff_busy', 'diff_busy_per', 'diff_downside_per',
    'expend_mp_per', 'dazuo_per', 'recover_per', 'per',
    'damage_per', 'skill_damage', 'reduce_damage',
    'ignore_fy', 'ignore_mz', 'attack_num',
    'busy', 'busy_per', 'obs', 'shield', 'force_rad',
    'desc',  // description text
]);

function transformFile(filePath) {
    let content = readFileSync(filePath, 'utf-8');
    if (!content.includes('query_enable_prop')) return null;

    const fnStart = content.indexOf('query_enable_prop(');
    if (fnStart === -1) return null;

    // Find the function body by matching braces
    let braceCount = 0;
    let fnEnd = fnStart;
    let inFn = false;
    for (let i = fnStart; i < content.length; i++) {
        if (content[i] === '{') {
            braceCount++;
            inFn = true;
        } else if (content[i] === '}') {
            braceCount--;
            if (inFn && braceCount === 0) {
                fnEnd = i + 1;
                break;
            }
        }
    }

    const fnBody = content.substring(fnStart, fnEnd);

    // Skip if already dynamic (uses lv in calculations)
    if (/\blv\s*[\*\+\-\/]/.test(fnBody) || /\bparseInt\s*\(\s*lv\b/.test(fnBody) || /\bMath\.floor\s*\(\s*lv\b/.test(fnBody)) {
        return null;
    }

    // Extract all property lines
    const lines = fnBody.split('\n');
    let modified = false;
    const newLines = [];
    const changes = [];

    for (const line of lines) {
        const match = line.match(/^(\s*)(\w+):\s*(-?\d+(?:\.\d+)?)(.*)/);
        if (!match) {
            newLines.push(line);
            continue;
        }

        const [, indent, propName, valueStr, rest] = match;
        const value = parseFloat(valueStr);

        if (STATIC_PROPS.has(propName)) {
            newLines.push(line);
            continue;
        }

        const result = findBestGainBase(value, propName);
        if (!result) {
            newLines.push(line);
            continue;
        }

        const formula = makeFormula(result.gain, result.base, propName);

        if (!verifyFormula(formula, value)) {
            console.error(`  FAIL: ${filePath}:${propName}=${value}, formula=${formula}`);
            console.error(`    gain=${result.gain}, base=${result.base}, at lv=1000: ${eval(formula.replace(/Math\.floor/g, 'Math.floor').replace(/lv/g, '1000'))}`);
            newLines.push(line);
            continue;
        }

        changes.push(`  ${propName}: ${value} -> ${formula} (gain=${result.gain}, base=${result.base})`);
        newLines.push(`${indent}${propName}: ${formula}${rest}`);
        modified = true;
    }

    if (!modified) return null;

    // Replace the function body
    const newFnBody = newLines.join('\n');
    const newContent = content.substring(0, fnStart) + newFnBody + content.substring(fnEnd);

    return { content: newContent, changes };
}

// Main
const baseDir = 'server/res/skill';
const dirs = ['blade', 'club', 'dodge', 'force', 'parry', 'staff', 'sword', 'throwing', 'unarmed', 'whip'];

let totalFiles = 0;
let modifiedFiles = 0;

for (const d of dirs) {
    const dirPath = join(baseDir, d);
    try { if (!statSync(dirPath).isDirectory()) continue; } catch(e) { continue; }
    const files = walkDir(dirPath);
    for (const file of files) {
        totalFiles++;
        const result = transformFile(file);
        if (result) {
            modifiedFiles++;
            const shortName = file.replace(/\\/g, '/');
            console.log(`\n${shortName}:`);
            for (const c of result.changes) {
                console.log(c);
            }
            if (!DRY_RUN) {
                writeFileSync(file, result.content, 'utf-8');
            }
        }
    }
}

console.log(`\n=== Summary: ${modifiedFiles}/${totalFiles} files modified ===`);
if (DRY_RUN) {
    console.log('DRY RUN - no files were actually written. Remove --dry-run to apply changes.');
}
