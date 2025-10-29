//oidc login data transfer object
export interface LoginDTO {
    oidcType: string;
    state: string;
    nonce: string;
}