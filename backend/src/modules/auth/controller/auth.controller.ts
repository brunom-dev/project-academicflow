import { Request, Response } from 'express'
import { AuthService } from "../service/auth.service";
import { RegisterSchema } from '../schemas/register-schema';
import { LoginSchema } from '../schemas/login-schema';

export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    async register(req: Request, res: Response) {
        const { name, email, password }: RegisterSchema = req.body;
        const user = await this.authService.register({name, email, password});

        return res.status(201).json(user);
    }

    async login(req: Request, res: Response) {
        const { email, password}: LoginSchema = req.body;
        const result = await this.authService.login({ email, password });

        return res.status(200).json(result);
    }
}