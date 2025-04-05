 import { IBaseRepository } from "src/common/interfaces/IbaseRepository.interface";
import { Url } from "../schema/url.schema";

 export interface IUrlRepository extends IBaseRepository<Url> {
     findByKey(key: string): Promise<Url> ;
 }