import { Users } from "../entities/Users.js";
interface IUserRepository {
    findById(id: string): Promise<Users | null>;
    findByEmail(email: string): Promise<Users | null>;
    createUser(userData: Partial<Users>): Promise<Users>;
    updateUser(id: string, updateData: Partial<Users>): Promise<Users | null>;
    deleteUser(id: string): Promise<void>;
    listUsers(): Promise<Users[]>;
}