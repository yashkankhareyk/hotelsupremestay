import Joi from 'joi';
import createError from 'http-errors';

export const validate = (schema) => (req, res, next) => {
  try {
    const input = { body: req.body, params: req.params, query: req.query };
    
    // Log validation input for debugging
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      console.log('Validation input:', JSON.stringify({
        bodyKeys: Object.keys(req.body || {}),
        hasFile: !!req.file,
        params: req.params,
        query: req.query
      }, null, 2));
    }
    
    const { value, error } = schema.validate(input, { 
      abortEarly: false, 
      allowUnknown: true,
      stripUnknown: false // Don't strip unknown fields
    });
    
    if (error) {
      console.error('Validation error:', error.details);
      return next(createError(400, error.details.map(d => d.message).join(', ')));
    }
    
    // Merge validated values back into req
    if (value.body) {
      req.body = { ...req.body, ...value.body };
    }
    if (value.params) {
      req.params = { ...req.params, ...value.params };
    }
    if (value.query) {
      req.query = { ...req.query, ...value.query };
    }
    
    next();
  } catch (err) {
    console.error('Validation middleware error:', err);
    return next(createError(500, 'Validation error'));
  }
};

export const Schemas = {
  login: Joi.object({
    body: Joi.object({
      username: Joi.string().min(3).max(64),
      email: Joi.string().email(),
      password: Joi.string().min(8).max(128).required()
    }).xor('username', 'email')
  }),
  galleryCreate: Joi.object({
    body: Joi.object({
      url: Joi.string().uri().allow(''),
      alt: Joi.string().required(),
      order: Joi.number().integer().min(0).default(0)
    })
  }),
  galleryUpdate: Joi.object({
    params: Joi.object({ id: Joi.string().hex().length(24).required() }),
    body: Joi.object({
      url: Joi.string().uri().allow(''),
      alt: Joi.string(),
      order: Joi.number().integer().min(0)
    })
  }),
  homeCreate: Joi.object({
    body: Joi.object({
      url: Joi.string().uri().allow('').optional(),
      alt: Joi.string().required(),
      section: Joi.string().valid('hero', 'property', 'testimonial').required(),
      order: Joi.alternatives().try(
        Joi.number().integer().min(0),
        Joi.string().pattern(/^\d+$/),
        Joi.string().allow('')
      ).optional().default(0),
      meta: Joi.alternatives().try(
        Joi.object({
          description: Joi.string().allow(''),
          rating: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
          bookingUrl: Joi.string().uri().allow(''),
          name: Joi.string().allow(''),
          comment: Joi.string().allow(''),
          originalSize: Joi.number().optional(),
          compressedSize: Joi.number().optional(),
          quality: Joi.number().optional(),
          format: Joi.string().optional(),
          mime: Joi.string().optional(),
          width: Joi.number().optional(),
          height: Joi.number().optional(),
          size: Joi.number().optional()
        }),
        Joi.string().allow('') // Allow string for FormData JSON parsing
      ).optional(),
      // Allow separate fields from FormData
      description: Joi.string().allow('').optional(),
      rating: Joi.alternatives().try(
        Joi.number().min(1).max(5),
        Joi.string().pattern(/^\d+(\.\d+)?$/).allow(''),
        Joi.string().allow('')
      ).optional(),
      bookingUrl: Joi.string().uri().allow('').optional(),
      name: Joi.string().allow('').optional(),
      comment: Joi.string().allow('').optional()
    }).unknown(true) // Allow unknown fields (like file data from multer)
  }),
  homeUpdate: Joi.object({
    params: Joi.object({ id: Joi.string().hex().length(24).required() }),
    body: Joi.object({
      url: Joi.string().uri().allow(''),
      alt: Joi.string(),
      section: Joi.string().valid('hero', 'property', 'testimonial'),
      order: Joi.number().integer().min(0),
      meta: Joi.object({
        description: Joi.string().allow(''),
        rating: Joi.number().min(1).max(5),
        bookingUrl: Joi.string().uri().allow('')
      }).optional()
    })
  }),
  idParam: Joi.object({ params: Joi.object({ id: Joi.string().hex().length(24).required() }) }),
  contactCreate: Joi.object({
    body: Joi.object({
      name: Joi.string().min(2).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(6).max(32).required(),
      message: Joi.string().min(5).required()
    })
  })
};