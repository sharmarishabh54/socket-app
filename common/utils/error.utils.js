const ERROR = {
     SYNTAX_ERROR: 'SyntaxError',
     BAD_REQUEST: 'BadRequest',
     VALIDATION_ERROR: 'ValidationError',
     UNAUTHORIZED: 'Unauthorized',
     ACCESS_CONTROL_ERROR: 'AccessControlError',
     FORBIDDEN: 'Forbidden',
     NOT_FOUND: 'NotFound',
     DUPLICATE: 'Duplicate',
     PRECONDITION_FAILED: 'PreconditionFailed',
     UNPROCESSABLE_ENTITY: 'UnprocessableEntity',
     TOO_MANY_REQUESTS: 'TooManyRequests',
     INTERNAL_SERVER_ERROR: 'InternalServerError'
};

const throwBadRequest = (message = ERROR.BAD_REQUEST) => {
     const err = new Error(message);
     err.name = ERROR.BAD_REQUEST;
     throw err;
};

const throwCustomValidationError = (
     message = ERROR.VALIDATION_ERROR,
     field_name
) => {
     const err = new Error(message);
     err.name = ERROR.VALIDATION_ERROR;
     err.details = [];
     err.details.push({
          context: { key: field_name },
          type: 'Custom Validation Error',
          message
     });
};

const throwUnAuthorized = (message = ERROR.UNAUTHORIZED) => {
     const err = new Error(message);
     err.name = ERROR.UNAUTHORIZED;
     throw err;
};

const throwForbidden = (message = ERROR.FORBIDDEN) => {
     const err = new Error(message);
     err.name = ERROR.FORBIDDEN;
     throw err;
};

const throwNotFound = (itemName = 'Item', fullMessage = null) => {
     const message = fullMessage || `${itemName} Not Found`;
     const err = new Error(message);
     err.name = ERROR.NOT_FOUND;
     throw err;
};

const throwDuplicate = (itemName = 'Item') => {
     const message = `${itemName} Already Exists`;
     const err = new Error(message);
     err.name = ERROR.DUPLICATE;
     throw err;
};

const throwPreConditionFailed = (message = ERROR.PRECONDITION_FAILED) => {
     const err = new Error(message);
     err.name = ERROR.PRECONDITION_FAILED;
     throw err;
};

const throwUnprocessableEntity = (message = ERROR.UNPROCESSABLE_ENTITY) => {
     const err = new Error(message);
     err.name = ERROR.UNPROCESSABLE_ENTITY;
     throw err;
};

const throwTooManyRequest = (message = ERROR.TOO_MANY_REQUESTS) => {
     const err = new Error(message);
     err.name = ERROR.TOO_MANY_REQUESTS;
     throw err;
};

const throwInternalServerError = (message = ERROR.INTERNAL_SERVER_ERROR) => {
     const err = new Error(message);
     err.name = ERROR.INTERNAL_SERVER_ERROR;
     throw err;
};

module.exports = {
     ERROR,
     throwBadRequest,
     throwCustomValidationError,
     throwUnAuthorized,
     throwForbidden,
     throwNotFound,
     throwDuplicate,
     throwPreConditionFailed,
     throwUnprocessableEntity,
     throwTooManyRequest,
     throwInternalServerError
};
