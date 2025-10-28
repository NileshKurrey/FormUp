export interface IAuthRepository {
    getJwksClient(): any;
    getSigningKey(kid: string | undefined): Promise<string>;
    verifyToken(token: string): Promise<string>;
    login(state:string,nonce:string): string;
    handleCallback(code:string,state:string,savednonce:string,savedstate:string):Promise<string> ;
}