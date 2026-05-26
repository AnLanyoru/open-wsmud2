const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs").promises;
const crypto = require("crypto");

const stmtCaches = new Map();

class SqliteDatabase {
	db_path = null;
	constructor() {
		this.db = null;
	}

	// 获取预编译语句（带缓存）
	getStmt(sql) {
		let stmt = stmtCaches.get(sql);
		if (!stmt) {
			stmt = this.db.prepare(sql);
			stmtCaches.set(sql, stmt);
		}
		return stmt;
	}

	// 初始化数据库
	async init(db_name) {
		try {
			this.db_path = path.join(__dirname, db_name);
			const fileExists = await this.checkDbFileExists();

			if (!fileExists) {
				console.log("数据库文件不存在，正在创建...");
				this.db = new Database(this.db_path);
				await this.executeDefaultScripts();
				console.log("数据库初始化完成");
			} else {
				console.log("数据库文件已存在，正在连接...");
				this.db = new Database(this.db_path);
				await this.executeAlterScripts();
				console.log("数据库连接成功");
			}
		} catch (error) {
			console.error("数据库初始化失败:", error);
			throw error;
		}
	}

	// 检查数据库文件是否存在
	async checkDbFileExists() {
		try {
			await fs.access(this.db_path);
			return true;
		} catch (error) {
			return false;
		}
	}

	// 执行 ALTER 脚本（数据库已存在时）
	async executeAlterScripts() {
		for (let sql of ALTER_SCRIPTS) {
			try {
				await this.query(sql);
			} catch (error) {
				console.error(sql, "查询失败", error);
			}
		}
	}

	// 执行默认建表脚本（数据库新建时）
	async executeDefaultScripts() {
		for (let sql of DEFAULT_TABLE_SCRIPTS) {
			try {
				await this.query(sql);
			} catch (error) {
				console.error(sql, "查询失败", error);
			}
		}
	}

	// 执行 INSERT/UPDATE/DELETE 等操作
	query(sql, params = []) {
		return new Promise((resolve, reject) => {
			try {
				const stmt = this.getStmt(sql);
				const info = stmt.run(...params);
				resolve({ lastID: info.lastInsertRowid, changes: info.changes });
			} catch (err) {
				console.error("SQL执行错误:", err);
				reject(err);
			}
		});
	}

	// 查询单行数据
	get(sql, params = []) {
		return new Promise((resolve, reject) => {
			try {
				const stmt = this.getStmt(sql);
				const row = stmt.get(...params);
				resolve(row);
			} catch (err) {
				console.error("SQL查询错误:", err);
				reject(err);
			}
		});
	}

	// 查询多行数据
	all(sql, params = []) {
		return new Promise((resolve, reject) => {
			try {
				const stmt = this.getStmt(sql);
				const rows = stmt.all(...params);
				resolve(rows);
			} catch (err) {
				console.error("SQL查询错误:", err);
				reject(err);
			}
		});
	}

	// 关闭数据库连接
	close() {
		return new Promise((resolve, reject) => {
			try {
				if (this.db) {
					this.db.close();
					this.db = null;
				}
				resolve();
			} catch (err) {
				console.error("关闭数据库连接失败:", err);
				reject(err);
			}
		});
	}
}

// 导出单例
module.exports = new SqliteDatabase();

// ---------- 建表及初始脚本 ----------
const DEFAULT_TABLE_SCRIPTS = [
	`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(60) NOT NULL,
      pwd VARCHAR(60) NOT NULL,
      phone VARCHAR(20),
      state INTEGER DEFAULT 1,
      level INTEGER DEFAULT 0,
      create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (name)
    )`,
	`CREATE TABLE IF NOT EXISTS servers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(60) NOT NULL,
      ip VARCHAR(60) NOT NULL,
      port VARCHAR(60) NOT NULL,
      state INTEGER DEFAULT 1,
      isdef INTEGER DEFAULT 0,
      istest INTEGER DEFAULT 0,
      create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
	`CREATE TABLE IF NOT EXISTS players (
      id VARCHAR(40) NOT NULL,
      name VARCHAR(30) NOT NULL,
      userid INTEGER NOT NULL,
      sid INTEGER NOT NULL,
      level INTEGER DEFAULT 0,
      title VARCHAR(30) NOT NULL,
      data TEXT,
      create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
	`CREATE TABLE IF NOT EXISTS players_bak (
      id VARCHAR(40) NOT NULL,
      name VARCHAR(30) NOT NULL,
      userid INTEGER NOT NULL,
      sid INTEGER NOT NULL,
      level INTEGER DEFAULT 0,
      title VARCHAR(30) NOT NULL,
      data TEXT,
      create_time TIMESTAMP,
      update_time TIMESTAMP 
    )`,
	`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_name ON users (name)`,
	`CREATE UNIQUE INDEX IF NOT EXISTS idx_players_id ON players (id)`,
	`CREATE INDEX IF NOT EXISTS idx_players_userid ON players (userid)`,
	`CREATE UNIQUE INDEX IF NOT EXISTS idx_players_name ON players (name)`,
	`CREATE UNIQUE INDEX IF NOT EXISTS idx_players_bak_id ON players_bak (id)`,
	`INSERT OR IGNORE INTO users(id,name,pwd,level) VALUES(1,'administrator','${MD5("123456")}',6)`,
];

function MD5(str) {
	let md5 = crypto.createHash("md5");
	let result = md5.update(str + process.env.MD5_PREFIX).digest("hex");
	return result.toUpperCase();
}

const ALTER_SCRIPTS = [];
