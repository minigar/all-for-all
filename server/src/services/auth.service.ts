import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt'
import { getTokens, hashData } from "src/auth/helpers";
import { Tokens } from "src/auth/types";
import { validName, validPassw } from "src/common/validation/regex";
import { AuthErrorKey, UserErrorKey } from "src/controllers/errorKeys";
import { DatabaseService } from "src/data/database.service";
import { BusinessError } from "src/error/BusinessErrors/businessError";
import { UserBodyModel, UserDecoded } from "src/models/User.dto";

@Injectable()
export class AuthService {
    constructor(private readonly db: DatabaseService, private jwtService: JwtService) { }

    async signUp({ name, email, password }: UserBodyModel): Promise<Tokens> {
        await validName(name)
        await validPassw(password)

        const user = await this.db.user.findFirst({ where: { email } })

        if (user) throw new BusinessError(AuthErrorKey.EMAIL_EXISTS)

        const password_hash = await hashData(password);

        const createdUser = await this.db.user.create({
            data: {
                name,
                email,
                password: password_hash
            }
        })

        const tokens = await getTokens(
            createdUser.id,
            createdUser.email,
            createdUser.name,
            new JwtService()
        );

        await this.updateRefreshTokenHash(createdUser.id, tokens.refresh_token);

        return tokens;
    }

    async login(email: string, password: string): Promise<Tokens> {
        await validPassw(password);

        if (!email) {
            throw new BusinessError(AuthErrorKey.EMAIL_CAN_NOT_BE_EMPTY);
        }

        if (!password) {
            throw new BusinessError(AuthErrorKey.PASSWORD_CAN_NOT_BE_EMPTY);
        }

        const user = await this.db.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new BusinessError(AuthErrorKey.EMAIL_BAD_REQUEST);
        }

        const isMatches = await bcrypt.compare(password, user.password);

        if (!isMatches) {
            throw new BusinessError(AuthErrorKey.PASSWORDS_ARE_NOT_SAME);
        }

        const tokens = await getTokens(user.id, user.email, user.name, new JwtService());
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
        return tokens;
    }

    async updateRefreshTokenHash(userId: number, refresh_token: string) {
        if (!userId) {
          throw new BusinessError(UserErrorKey.USER_NOT_FOUND);
        }
    
        const decoded = <UserDecoded>await this.jwtService.verify(refresh_token, {
          secret: process.env.REFRESH_SECRET,
        });
    
        const refreshTokenId = decoded.refreshTokenId;
    
        const hash = await hashData(refreshTokenId); //TODO
    
        await this.db.user.update({
          where: {
            id: userId,
          },
          data: {
            hashedRT: hash,
          },
        });
      }u
}