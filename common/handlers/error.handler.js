const { errorUtils, payloadUtils } = require('../utils');

const { ERROR } = errorUtils;

module.exports = (err, req, res, next) => {
     switch (err.name) {
          case ERROR.SYNTAX_ERROR:
          case ERROR.BAD_REQUEST:
               return res.status(400).send(payloadUtils.getErrorPayload(err));
          case ERROR.VALIDATION_ERROR:
               return res
                    .status(400)
                    .send(payloadUtils.getValidationErrorPayload(err));
          case ERROR.UNAUTHORIZED:
               return res.status(401).send(payloadUtils.getErrorPayload(err));
          case ERROR.FORBIDDEN:
          case ERROR.ACCESS_CONTROL_ERROR:
               return res.status(406).send(payloadUtils.getErrorPayload(err));
          case ERROR.NOT_FOUND:
               return res.status(404).send(payloadUtils.getErrorPayload(err));
          case ERROR.DUPLICATE:
               return res.status(409).send(payloadUtils.getErrorPayload(err));
          case ERROR.PRECONDITION_FAILED:
               return res.status(412).send(payloadUtils.getErrorPayload(err));
          case ERROR.UNPROCESSABLE_ENTITY:
               return res.status(422).send(payloadUtils.getErrorPayload(err));
          case ERROR.TOO_MANY_REQUESTS:
               return res.status(429).send(payloadUtils.getErrorPayload(err));
          default:
               return res.status(500).send(payloadUtils.getErrorPayload(err));
     }
};
