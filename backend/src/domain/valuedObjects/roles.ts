enum UserRole {
    Admin = "admin",
    User = "user",
    Moderator = "moderator",
}
// Value Object for User Roles
export class Roles {
    constructor(private readonly role: UserRole) {
        if (!Object.values(UserRole).includes(role)) {
            throw new Error(`Invalid role: ${role}`);
        }
    }
    getRole(): UserRole {
        return this.role;
    }

}