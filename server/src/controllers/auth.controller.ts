import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { Tokens } from "src/auth/types";
import { Public } from "src/common/decorators";
import { UserBodyModel } from "src/models/User.dto";
import { AuthService } from "src/services/auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() { name, email, password }: UserBodyModel): Promise<Tokens> {
        return await this.authService.signUp({ name, email, password });
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
    ): Promise<Tokens> {
        return await this.authService.login(email, password);
    }
}