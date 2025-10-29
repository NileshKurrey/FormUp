import { Users } from "../entities/Users.js";
export interface IUserRepository {
    findById(id: string): Promise<Users | null>;
    login(oidcType:string,state:string,nonce:string):string;
    callback(oidcType:string,code:string,state:string,savednonce:string,savedstate:string):Promise<{token:string,status:number}>;
    create(user: Users): Promise<Users>;
    update(user: Users): Promise<Users>;
    delete(id: string): Promise<void>;
    findAll(): Promise<Users[]>;
}