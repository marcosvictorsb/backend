import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});


export const getUsersSchema = Joi.object({
  id_company: Joi.number().required(),
  limit: Joi.number().integer().min(1).max(100),
})