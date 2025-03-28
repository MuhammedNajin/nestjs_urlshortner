 import { IBaseRepository } from "src/common/interfaces/IbaseRepository.interface";
import { User } from "../schema/auth.schema";

 export interface IUserRepository extends IBaseRepository<User> {
     findByEmail(email: string): Promise<User>;
 }