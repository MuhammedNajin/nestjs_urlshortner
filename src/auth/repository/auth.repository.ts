import { BaseRepository } from "src/common/repositories/base.repository";
import { User, UserDocument } from "../schema/auth.schema";
import { IUserRepository } from "../interfaces/IUser.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";


@Injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository {
    constructor(@InjectModel('User') private readonly usermodel: Model<User>) {
        super(usermodel);
    }

    async findByEmail(email: string): Promise<UserDocument> {
        return this.usermodel.findOne({ email }).exec();
    }

}