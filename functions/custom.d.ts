declare namespace Express {
    export interface Request {
        authCtx: import("./src/https/auth/AuthCtx").default
    }
}