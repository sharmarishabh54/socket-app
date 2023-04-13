const getSuccessPayload = (data) => data;

const getErrorPayload = (error) => ({
     error: {
          message: error.message || error
     }
});

const getValidationErrorPayload = (error) => {
     const response = {
          error: {
               message: '',
               fields: []
          }
     };

     error.details.forEach((e) => {
          response.error.fields.push({
               key: e.context.key,
               type: e.type,
               message: e.message
          });
     });

     response.error.message = response.error.message
          .map((fields = fields.message))
          .join(', ');
     return response;
};

module.exports = {
     getSuccessPayload,
     getErrorPayload,
     getValidationErrorPayload
};
