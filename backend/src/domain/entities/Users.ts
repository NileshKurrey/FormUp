import { Roles } from "../valuedObjects/roles.js";

enum UserStatus {
    Active = "active",
    Disabled = "disabled",
    
}
export class Users{
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public createdAt: Date,
        public updatedAt: Date,
        public role: Roles,
        public isMember: boolean,
        public refreshToken?: string,
        public OidcId?: string,
        public groupId?: string,
        public profileLinks?: string[],
        public userStatus?: UserStatus,
        public auditlogId?: string
    ){}
    
    changerole(newRole: Roles){
        const validroles =['admin','user','moderator'];
        if(!validroles.includes(newRole.getRole())){
            throw new Error(`Invalid role: ${newRole.getRole()}`);
        }
        this.role = newRole;
    }

    isAdmin(): boolean {
        return this.role.getRole() === 'admin';
    }

}