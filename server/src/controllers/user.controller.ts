import { Controller, Get } from "@nestjs/common";
import { CurrentUser, Public } from "src/common/decorators";
import { UserDecoded } from "src/models/User.dto";
import { UserService } from "src/services/user.service";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Public()
  @Get()
  async getList() {
    return await this.userService.getList()
  }

  @Get('info')
  async userInfo(@CurrentUser() { userId }: UserDecoded) {
    return await this.userService.userInfo(userId)
  }
}