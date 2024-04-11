import { JwtService } from '@nestjs/jwt';
import { Tokens } from "../types";
import { v4 as uuid } from 'uuid';

export async function getTokens(
    userId: number,
    email: string,
    name: string,
    jwtService: JwtService,
): Promise<Tokens> {
    const refreshTokenId = await uuid();
    const [access_token, refresh_token] = await Promise.all([
        jwtService.signAsync(
            {
                userId,
                name,
                email,
            },
            {
                secret: process.env.SECRET,
                expiresIn: '1d',
            },
        ),
        jwtService.signAsync(
            {
                userId,
                name,
                email,
                refreshTokenId,
            },
            {
                secret: process.env.REFRESH_SECRET,
                expiresIn: '1d',
            },
        ),
    ]);
    return {
        access_token,
        refresh_token,
    };
}
