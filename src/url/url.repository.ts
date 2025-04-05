import { BaseRepository } from "src/common/repositories/base.repository";
import { Url } from "./schema/url.schema";
import { IUrlRepository } from "./interface/IUrl.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";


@Injectable()
export class UrlRepository extends BaseRepository<Url> implements IUrlRepository {
    constructor(@InjectModel('Url') private readonly urlModal: Model<Url>) {
        super(urlModal);
    }

    async findByKey(shortId: string): Promise<Url> {
         return await this.urlModal.findOne({ shortId }).lean();
    }

}