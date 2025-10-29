import crypto from "crypto";

export const generateState = (): string => {
    return crypto.randomBytes(16).toString("hex");
}

export const generateNonce = (): string => {
    return crypto.randomBytes(16).toString("hex");
}
