export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Validation error",
        errors: result.error.flatten().fieldErrors
      });
    }

    req.body = result.data;
    next();
  };
}
