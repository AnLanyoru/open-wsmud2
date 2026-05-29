/** 全局路径配置（main.js 中设置到 globalThis） */
declare var __PATH: {
    BASE: string;
    WORLD: string;
    COMMAND: string;
    SKILL: string;
    MAP: string;
    NPC: string;
    OBJ: string;
    TASK: string;
    AREA: string;
    FAMILY: string;
    EXTENDS: string;
    DATA: string;
    DEF_DATA: string;
    [key: string]: string;
};

/** 全局服务器配置（main.js 中加载 config.cjs 到 globalThis） */
declare var __CONFIG: {
    DB: any;
    init(): Promise<void>;
    WEB_PORT: number;
    CONNECT_LEVEL: number;
    MD5: string;
    SESSION_SECRET: string;
    HEARTBEAT: number;
    DESIV: Buffer | null;
    def_server: {
        ip: string;
        port: number;
        id: number;
        name: string;
        istest: boolean;
    };
    [key: string]: any;
};
