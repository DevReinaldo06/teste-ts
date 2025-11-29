import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import { BadRequestError } from '../errors/ApiError';

export const validate = (schema: ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        
        const validationErrors = error.issues;

        const errorMessage = validationErrors
          .map(err => `${err.path.join('.')}: ${err.message}`)
          .join('; ');

        return next(new BadRequestError(`Erro de validação: ${errorMessage}`));
      }

      if (error instanceof Error) {
        next(error);
      } else {
        next(new Error("Erro desconhecido durante a validação."));
      }
    }
  };
