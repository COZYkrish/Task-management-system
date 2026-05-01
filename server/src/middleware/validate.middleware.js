/**
 * Validation Middleware Factory
 * Uses Joi schemas to validate request body, query, or params
 */

const validate = (schema, target = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,      // Return all errors at once
      stripUnknown: true,     // Remove unknown fields
      convert: true,          // Type coercion (string to date, etc.)
    });

    if (error) {
      const errors = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      }));

      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    // Replace req[target] with the validated/sanitized value
    req[target] = value;
    next();
  };
};

module.exports = { validate };
