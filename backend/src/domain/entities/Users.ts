import { Roles } from "../valuedObjects/roles.js";

enum UserStatus {
    Active = "active",
    Disabled = "disabled",
    
}
export class Users{
    constructor(
        public name: string,
        public email: string,
        public isMember: boolean,
        public refreshToken?: string,
        public oidcId?: string,
        public role?: Roles,
        public id?: string,
        public groupId?: string,
        public profileLinks?: string[],
        public userStatus?: UserStatus,
        public auditlogId?: string
    ){}
    


}