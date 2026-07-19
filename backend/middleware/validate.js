const { z } = require('zod');

// Middleware factory to validate request bodies against a Zod schema
const validate = (schema) => {
  return (req, res, next) => {
    try {
      // parse will throw an error if validation fails
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          issues: error.errors
        });
      }
      next(error);
    }
  };
};

// --- Schemas ---

const farmerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contact_info: z.string().optional()
});

const listingSchema = z.object({
  farmer_id: z.number().int().positive(),
  crop_type: z.string().min(1, 'Crop type is required'),
  quantity: z.number().positive('Quantity must be positive'),
  estimated_harvest_window: z.string().optional()
});

const warehouseSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  capacity: z.number().int().positive()
});

const preorderSchema = z.object({
  consumer_id: z.number().int().positive(),
  listing_id: z.number().int().positive()
});

const bookingSchema = z.object({
  warehouse_id: z.number().int().positive(),
  listing_id: z.number().int().positive()
});

const bookingStatusSchema = z.object({
  status: z.enum(['requested', 'confirmed', 'stored', 'released'])
});

const matchSchema = z.object({
  listing_id: z.number().int().positive()
});

module.exports = {
  validate,
  schemas: {
    farmerSchema,
    listingSchema,
    warehouseSchema,
    preorderSchema,
    bookingSchema,
    bookingStatusSchema,
    matchSchema
  }
};
