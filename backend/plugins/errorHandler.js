import fp from "fastify-plugin";

// Maps internal error types to user-friendly messages
const ERROR_MESSAGES = {
  AUTH_REQUIRED: "Please log in to continue.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  DUPLICATE_EMAIL: "An account with this email already exists.",
  INVALID_CREDENTIALS: "Incorrect email or password.",
  PAYMENT_FAILED: "Payment could not be processed. Please try again.",
  MT5_ERROR: "Unable to connect to the trading server. Please try again.",
  INTERNAL_ERROR: "Something went wrong. Please try again later.",
};

export default fp(
  async function (fastify) {
    fastify.setErrorHandler(function (error, request, reply) {
      fastify.log.error({ err: error, url: request.url }, "Request error");

      // Validation errors from Fastify schema
      if (error.validation) {
        const field =
          error.validation[0]?.instancePath?.replace("/", "") || "input";
        return reply.code(422).send({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Please check your input and try again.",
            details: error.validation.map((v) => v.message).join(", "),
          },
        });
      }

      // Duplicate key (Postgres error code 23505)
      if (error.code === "23505") {
        return reply.code(409).send({
          success: false,
          error: {
            code: "DUPLICATE_EMAIL",
            message: ERROR_MESSAGES.DUPLICATE_EMAIL,
          },
        });
      }

      const statusCode = error.statusCode || 500;
      const code = error.code || "INTERNAL_ERROR";

      return reply.code(statusCode).send({
        success: false,
        error: {
          code,
          message:
            ERROR_MESSAGES[code] ||
            error.message ||
            ERROR_MESSAGES.INTERNAL_ERROR,
        },
      });
    });

    // Helper to throw standard errors cleanly from route handlers
    fastify.decorate("fail", function (reply, statusCode, code, message) {
      return reply.code(statusCode).send({
        success: false,
        error: {
          code,
          message: message || ERROR_MESSAGES[code] || "An error occurred.",
        },
      });
    });

    // Helper to send success responses
    fastify.decorate("ok", function (reply, data, statusCode = 200) {
      return reply.code(statusCode).send({ success: true, data });
    });
  },
  { name: "errorHandler" },
);
