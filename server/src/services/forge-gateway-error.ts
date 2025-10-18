export class ForgeGatewayError extends Error {
  private readonly status: number;
  private readonly type: string;
  private readonly source: string;
  private readonly metadata?: object;

  constructor(status: number, type: string, source: string, message: string, metadata?: object) {
    super(message);
    this.status = status;
    this.type = type;
    this.source = source;
    this.metadata = metadata;
  }

  static BadRequest(source, message, metadata?) {
    return new ForgeGatewayError(400, 'BAD_REQUEST', source, message, metadata);
  }

  static Unauthorized(source, message, metadata?) {
    return new ForgeGatewayError(401, 'UNAUTHORIZED', source, message, metadata);
  }

  static Forbidden(source, message, metadata?) {
    return new ForgeGatewayError(403, 'FORBIDDEN', source, message, metadata);
  }

  static NotFound(source, message, metadata?) {
    return new ForgeGatewayError(404, 'NOT_FOUND', source, message, metadata);
  }

  static NotAcceptable(source, message, metadata?) {
    return new ForgeGatewayError(406, 'NOT_ACCEPTABLE', source, message, metadata);
  }

  static Conflict(source, message, metadata?) {
    return new ForgeGatewayError(409, 'CONFLICT', source, message, metadata);
  }

  static PreconditionFailed(source, message, metadata?) {
    return new ForgeGatewayError(412, 'PRECONDITION_FAILED', source, message, metadata);
  }

  static RequestEntityTooLarge(source, message, metadata?) {
    return new ForgeGatewayError(413, 'REQUEST_ENTITY_TOO_LARGE', source, message, metadata);
  }

  static RequestRangeNotSatisfiable(source, message, metadata?) {
    return new ForgeGatewayError(416, 'REQUEST_RANGE_NOT_SATISFIABLE', source, message, metadata);
  }

  static TooManyRequests(source, message, metadata?) {
    return new ForgeGatewayError(429, 'TO_MANY_REQUEST', source, message, metadata);
  }

  static Internal(source, metadata?) {
    return new ForgeGatewayError(500, 'INTERNAL_ERROR', source, 'Internal server error.', metadata);
  }

  static PayloadTooLarge(source, message, metadata?): ForgeGatewayError {
    return new ForgeGatewayError(413, 'PAYLOAD_TOO_LARGE', source, message, metadata);
  }

  static NotModified(source, metadata?) {
    return new ForgeGatewayError(304, 'NOT_MODIFIED', source, 'Not modified error.', metadata);
  }

  static authentication = {
    400: 'One or more parameters are invalid. Examine the response payload body for details.',
    401: 'The client_id and client_secret combination is not valid.',
    403: 'The client_id is not authorized to access this endpoint.',
    415: 'The Content-Type header is missing or specifies a value other than application/x-www-form-urlencoded.',
    429: 'Rate limit exceeded; wait some time before retrying.',
  };

  static dataManagement = {
    400: 'The request could not be understood by the server due to malformed syntax or missing request headers. The client SHOULD NOT repeat the request without modifications. The response body may give an indication of what is wrong with the request.',
    401: 'The supplied Authorization header was not valid or the supplied token scope was not acceptable. Verify authentication and try again.',
    403: 'The Authorization was successfully validated but permission is not granted. Don’t try again unless you solve permissions first.',
  };

  static createBucket = {
    ...this.dataManagement,
    409: 'The specified bucket key already exists.',
  };

  static fetchAllBuckets = {
    ...this.dataManagement,
    404: 'Resource not found.',
  };

  static deleteBucket = {
    ...this.dataManagement,
    404: 'The specified bucketKey does not exist.',
    409: 'The bucket is currently marked for deletion',
  };

  static getObjectDetails = {
    ...this.dataManagement,
    304: "The user's browser then uses its cached copy of the resource because it's still considered up-to-date",
    401: 'Invalid authorization header.',
    403: 'Access denied regardless of authorization status.',
    404: 'Object does not exist.',
  };
  static putObject = {
    ...this.dataManagement,
    404: 'The specified bucket does not exist.',
    412: 'Conditional update failed because the hash value supplied in the header does not match the SHA-1 hash value of the current object in OSS.',
  };

  static putResumableObject = {
    ...this.dataManagement,
    409: 'Unable to persist data.',
    416: 'Missing Content-Range header.',
  };

  static deleteObject = {
    ...this.dataManagement,
    404: 'The specified bucketKey/objectKey does not exist.',
  };

  static modelDerivative = {
    401: 'Invalid authorization header.',
    403: 'Access denied regardless of authorization status.',
    404: 'Endpoint does not exist.',
    409: 'The request conflicts with a previous request that is still in progress.',
  };

  static job = {
    ...this.modelDerivative,
    400: 'Invalid request. E.g., the input URN format is invalid.',
    406: 'The request is not acceptable. E.g., the output type is not supported.',
    429: 'Rate limit exceeded (500 requests per minute); wait some time before retrying.',
  };

  static fetchManifest = {
    ...this.modelDerivative,
    400: 'The request is invalid. E.g., the payload was not formatted correctly.',
  };

  static fetchThumbnails = {
    ...this.modelDerivative,
    400: 'The request is invalid. E.g., the payload was not formatted correctly.',
  };

  static deleteManifest = {
    ...this.modelDerivative,
    404: 'The manifest does not exist.',
  };

  static fetchDerivativeInfo = {
    ...this.modelDerivative,
    400: 'Invalid request. E.g., the input URN format is invalid, or the range header is specified but not formatted correctly.',
  };

  static fetchDerivative = {
    ...this.modelDerivative,
    400: 'Invalid request. E.g., the input URN format is invalid, or the range header is specified but not formatted correctly.',
    413: 'The resource exceeded the maximum length (256 MB); use range request instead.',
  };

  static fetchMetadata = {
    ...this.modelDerivative,
    404: 'Endpoint does not exist.',
  };

  static fetchObjectTree = {
    ...this.modelDerivative,
    404: 'Endpoint does not exist or failed to extract the content.',
    406: 'The request is not supported. For example, when you have attempted to query a property larger than the allowable limit; 300 MB.',
    413: 'The resource exceeded the expected maximum length (20 MB).',
    429: 'Rate limit exceeded (60 requests per minute for force getting); wait some time before retrying.',
  };

  static fetchProperties = {
    ...this.modelDerivative,
    400: 'Invalid request.',
    404: 'Endpoint does not exist or failed to extract the content.',
    406: 'The request is not supported. For example, when you have attempted to query a property larger than the allowable limit; 300 MB.',
    413: 'The resource exceeded the expected maximum length (20 MB).',
    429: 'Rate limit exceeded (60 requests per minute for force getting); wait some time before retrying.',
  };

  static createWebhook = {
    ...this.modelDerivative,
    400: 'Invalid request.',
  };

  static deleteWebhook = {
    ...this.modelDerivative,
    400: 'Invalid request.',
  };

  static getWebhook = {
    ...this.modelDerivative,
    400: 'Invalid request.',
  };

  static getDerivativeSource = {
    ...this.modelDerivative,
    400: 'Invalid request.',
  };

  static startWorkitem = {
    400: 'One or more parameters are invalid. Examine the response payload body for details.',
    401: 'Invalid authorization header.',
    403: 'The client_id is not authorized to access this endpoint.',
    413: 'Maximum size of the item exceeded.',
  };

  static getFileSource = {
    ...this.dataManagement,
    304: "The user's browser then uses its cached copy of the resource because it's still considered up-to-date",
    404: 'Object does not exist.',
  };

  static signUrls = {
    ...this.dataManagement,
    404: 'Object or bucket does not exist.',
    429: 'Rate limit exceeded (60 requests per minute for force getting); wait some time before retrying.',
  };
}
