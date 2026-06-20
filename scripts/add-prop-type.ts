/**
 * 给装备文件的 prop 属性标上 PropMap 类型
 *
 * 用法: npx tsx scripts/add-prop-type.ts [--dry-run]
 *   --dry-run  只打印将要修改的内容，不实际写入文件
 *
 * 功能:
 *   1. 将 prop = { 改为 prop: PropMap = {
 *   2. 自动添加 import type { PropMap } from "..." 导入
 *   3. 跳过已有类型标注的文件
 */

import * as fs from "fs";
import * as path from "path";

const SERVER_DIR = path.resolve(__dirname, "../server");
const EQ_DIR = path.resolve(SERVER_DIR, "res/obj/eq");
const TYPES_FILE = path.resolve(SERVER_DIR, "types/props.js");
const DRY_RUN = process.argv.includes("--dry-run");

interface FileChange {
    file: string;
    content: string;
    /** 简要描述变更 */
    diff: string;
}

function findTsFiles(dir: string): string[] {
    const results: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...findTsFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith(".ts")) {
            results.push(fullPath);
        }
    }
    return results;
}

/**
 * 计算从源文件到 types/props.js 的相对导入路径
 */
function computeTypesImportPath(filePath: string): string {
    let relative = path.relative(path.dirname(filePath), TYPES_FILE);
    // path.relative on Windows gives backslashes, normalize
    relative = relative.replace(/\\/g, "/");
    // ensure starts with ./ or ../
    if (!relative.startsWith(".")) {
        relative = "./" + relative;
    }
    return relative;
}

function processFile(filePath: string): FileChange | null {
    const raw = fs.readFileSync(filePath, "utf-8");
    const original = raw;

    // 检查是否已有带类型的 prop
    if (/prop\s*:\s*PropMap\s*=/.test(raw)) {
        return null;
    }

    // 检查是否有不带类型的 prop = {
    if (!/^\s+prop\s*=\s*\{/m.test(raw)) {
        return null;
    }

    const diffs: string[] = [];

    // Step 1: 替换 prop = { -> prop: PropMap = {
    let content = raw.replace(/^(\s+)prop\s*=\s*\{/m, (_, indent: string) => {
        diffs.push(`  prop = {  →  prop: PropMap = {`);
        return `${indent}prop: PropMap = {`;
    });

    // Step 2: 检查是否已有从 types/props 的导入
    if (!/from\s+["'].*types\/props\.js["']/.test(content)) {
        const importPath = computeTypesImportPath(filePath);

        // 找到最后一个 import 语句所在行尾
        const importRegex = /^import\b.*$/gm;
        let lastImportEnd = -1;
        let match: RegExpExecArray | null;
        while ((match = importRegex.exec(content)) !== null) {
            lastImportEnd = match.index + match[0].length;
        }

        const importLine = `import type { PropMap } from "${importPath}";`;
        diffs.push(`  + ${importLine}`);

        if (lastImportEnd >= 0) {
            content =
                content.slice(0, lastImportEnd) +
                "\n" + importLine +
                content.slice(lastImportEnd);
        } else {
            content = importLine + "\n" + content;
        }
    }

    if (content === original) return null;
    return { file: filePath, content, diff: diffs.join("\n") };
}

function main() {
    const files = findTsFiles(EQ_DIR);
    console.log(`找到 ${files.length} 个 .ts 文件\n`);

    const changes: FileChange[] = [];
    let skipped = 0;
    let alreadyTyped = 0;

    for (const file of files) {
        const result = processFile(file);
        if (result) {
            changes.push(result);
        } else {
            skipped++;
            const raw = fs.readFileSync(file, "utf-8");
            if (/prop\s*:\s*PropMap\s*=/.test(raw)) {
                alreadyTyped++;
            }
        }
    }

    if (changes.length === 0) {
        console.log("所有文件都已有类型标注，无需修改。");
        return;
    }

    console.log(`将修改 ${changes.length} 个文件 (跳过 ${skipped} 个，其中已有类型标注 ${alreadyTyped} 个):\n`);

    if (DRY_RUN) {
        for (const change of changes) {
            const relPath = path.relative(EQ_DIR, change.file);
            console.log(`--- ${relPath} ---`);
            console.log(change.diff);
            console.log();
        }
        console.log("[DRY RUN] 未实际修改文件。去掉 --dry-run 参数执行实际修改。");
    } else {
        for (const change of changes) {
            fs.writeFileSync(change.file, change.content, "utf-8");
            const relPath = path.relative(EQ_DIR, change.file);
            console.log(`✓ ${relPath}`);
            console.log(change.diff);
        }
        console.log(`\n完成! 共修改 ${changes.length} 个文件。`);
    }
}

main();
