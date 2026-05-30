#!/usr/bin/env node

/**
 * migrate-imports.ts
 *
 * 批量迁移 world/**\/*.js 中的导入路径:
 *   os/ → server/dist/core/
 *
 * 相对路径层级自动适配:
 *   from "../../../os/xxx.js" → from "../../../server/dist/core/xxx.js"
 *   from "../../os/xxx.js"    → from "../../server/dist/core/xxx.js"
 *   from "../os/xxx.js"       → from "../server/dist/core/xxx.js"
 *
 * 同时也处理 require("...os/...") 以及 import "..." 裸导入。
 *
 * 使用方式:
 *   node --loader ts-node/esm server/scripts/migrate-imports.ts
 *   # 或编译后:
 *   node server/dist/scripts/migrate-imports.js
 *
 * 对每个修改的文件创建 .bak 备份。
 * 纯 Node.js 内置模块，无外部依赖。
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ============================================================
// 路径解析
// ============================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** world/ 目录的绝对路径 */
const WORLD_DIR = path.resolve(__dirname, '../../world');

// ============================================================
// 文件遍历
// ============================================================

/**
 * 递归遍历目录，返回所有 .js 文件的绝对路径
 */
function walkDir(dir: string): string[] {
  const files: string[] = [];
  let entries: string[];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    return files;
  }
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    let stat: fs.Stats;
    try {
      stat = fs.statSync(fullPath);
    } catch {
      continue;
    }
    if (stat.isDirectory()) {
      files.push(...walkDir(fullPath));
    } else if (entry.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

// ============================================================
// 替换规则
// ============================================================

/**
 * 将字符串中的 os/ 相对导入路径替换为 server/dist/core/
 *
 * 匹配的 import 形式:
 *   - from "X../os/…"
 *   - import "X../os/…"      (裸导入)
 *   - export … from "X../os/…"
 *   - require("X../os/…")
 *
 * 其中 X 表示一个或多个 "../" 前缀。
 */
function migrateContent(content: string): string {
  const result = content
    // 处理 from/import "os/" 路径
    .replace(
      /((?:from|import)\s+['"])((?:\.\.\/)+)os\/([^'"]*)(['"])/g,
      (_match, prefix, upLevels, filePath, quote) => {
        return `${prefix}${upLevels}server/dist/core/${filePath}${quote}`;
      },
    )
    // 处理 require("os/") 路径
    .replace(
      /(require\s*\(\s*['"])((?:\.\.\/)+)os\/([^'"]*)(['"]\s*\))/g,
      (_match, prefix, upLevels, filePath, suffix) => {
        return `${prefix}${upLevels}server/dist/core/${filePath}${suffix}`;
      },
    );
  return result;
}

// ============================================================
// 文件迁移
// ============================================================

/**
 * 迁移单个文件的导入路径
 * @returns true 如果文件被修改
 */
function migrateFile(filePath: string): boolean {
  let content: string;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error(`  读取失败: ${filePath}`, (err as Error).message);
    return false;
  }

  const newContent = migrateContent(content);

  if (newContent === content) {
    return false; // 无变化
  }

  // 备份原文件
  try {
    fs.writeFileSync(filePath + '.bak', content, 'utf-8');
  } catch (err) {
    console.error(`  备份失败: ${filePath}`, (err as Error).message);
    return false;
  }

  // 写入新内容
  try {
    fs.writeFileSync(filePath, newContent, 'utf-8');
  } catch (err) {
    console.error(`  写入失败: ${filePath}`, (err as Error).message);
    // 尝试恢复
    try {
      fs.copyFileSync(filePath + '.bak', filePath);
    } catch {
      // ignore
    }
    return false;
  }

  return true;
}

// ============================================================
// 主流程
// ============================================================

function main(): void {
  console.log('扫描目录:', WORLD_DIR);

  if (!fs.existsSync(WORLD_DIR)) {
    console.error('错误: world/ 目录不存在:', WORLD_DIR);
    process.exit(1);
  }

  const files = walkDir(WORLD_DIR);
  console.log('找到 %d 个 .js 文件', files.length);

  let migrated = 0;
  let skipped = 0;
  let errorCount = 0;

  for (const file of files) {
    const relative = path.relative(WORLD_DIR, file);
    const result = migrateFile(file);
    if (result) {
      console.log(`  [迁移] ${relative}`);
      migrated++;
    } else {
      skipped++;
    }
  }

  console.log('\n完成!');
  console.log('  迁移: %d 个文件', migrated);
  console.log('  跳过: %d 个文件 (无 os/ 导入路径)', skipped - errorCount);
  if (errorCount > 0) {
    console.log('  错误: %d 个文件', errorCount);
  }
}

main();
