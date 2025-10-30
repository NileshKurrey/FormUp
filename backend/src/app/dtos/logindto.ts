//oidc login data transfer object
export interface LoginDTO {
    oidcType: string;
    state: string;
    nonce: string;
}

export interface DecodedToken {
    given_name:string,
    family_name:string,
    sub: string,
    email: string
}