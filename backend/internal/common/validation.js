const Joi = require('joi');
const { AppError } = require('./error-handler');

const schemas = {
  userSignup: Joi.object({
    name: Joi.string().required().min(2).max(100),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(100),
  }),

  adminSignup: Joi.object({
    name: Joi.string().required().min(2).max(100),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(100),
    adminSecret: Joi.string().required(),
  }),

  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  adminLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  updateUser: Joi.object({
    name: Joi.string().min(2).max(100),
    email: Joi.string().email(),
  }),
};

const validate = (data, schemaName) => {
  const schema = schemas[schemaName];
  if (!schema) {
    throw new AppError('Invalid schema name', 500, 'VALIDATION_ERROR');
  }

  const { error, value } = schema.validate(data, { abortEarly: false });

  if (error) {
    const messages = error.details.map((detail) => detail.message).join(', ');
    throw new AppError(messages, 400, 'VALIDATION_ERROR');
  }

  // Normalize email to lowercase for consistency
  if (value.email) {
    value.email = value.email.toLowerCase().trim();
  }

  return value;
};

module.exports = { validate, schemas };