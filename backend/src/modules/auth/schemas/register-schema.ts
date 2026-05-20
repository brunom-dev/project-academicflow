import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(3, 'Seu nome precisa ter ao menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Senha precisa ter pelo menos 8 caracteres'),
});

export type RegisterSchema = z.infer<typeof registerSchema>