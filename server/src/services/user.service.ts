import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/data/database.service";

@Injectable()
export class UserService {
    constructor(private readonly db: DatabaseService) { }

    async getList() {
        return await this.db.user.findMany()
    }

    async userInfo(userId: number) {
        return await this.db.user.findFirst({ where: { id: userId } })
    }
}