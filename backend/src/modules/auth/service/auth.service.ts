import bcrypt from "bcryptjs";
import { AppError } from "../../../shared/errors/AppError";
import { prisma } from "../../../shared/lib/prisma";
import { RegisterSchema } from "../schemas/register-schema";
import { LoginSchema } from "../schemas/login-schema";
import jwt from "jsonwebtoken";
import env from "dotenv";

export class AuthService {
    async register({ name, email, password }: RegisterSchema) {
        const emailAlreadyExists = await prisma.user.findUnique({
            where: { email },
        });

        if (emailAlreadyExists) throw new AppError("Email indisponível", 409);

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        return user;
    }

    async login({ email, password }: LoginSchema) {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) throw new AppError("Email/Password Inválidos");

        const passwordChecked = await bcrypt.compare(password, user.password);

        if (!password) throw new AppError("Email/Password Inválidos");

        const tokenJWT = jwt.sign(
            {sub: user.id},
            process.env.JWT_SECRET!,
            {expiresIn: "1d"}
        );

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            tokenJWT,
        }
    }
}
