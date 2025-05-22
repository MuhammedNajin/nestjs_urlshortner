import { Injectable  } from "@nestjs/common";
import { IBaseRepository } from "../interfaces/IbaseRepository.interface";
import { Document, Model } from "mongoose";


@Injectable()
export class BaseRepository<T> implements IBaseRepository<T> {

    constructor(private readonly model: Model<T>) {}
     
    create(entity: T): Promise<T> {
        return this.model.create(entity);
    }

    findById(id: string): Promise<T | null> {
        return this.model.findOne({ id }).exec();
    }

    

}
