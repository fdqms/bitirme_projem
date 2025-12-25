/**
 * @fileoverview gRPC-Web generated client stub for fdqms
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.fdqms = require('./chess_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.fdqms.SatrancServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.fdqms.SatrancServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.fdqms.LoginRequest,
 *   !proto.fdqms.User>}
 */
const methodDescriptor_SatrancService_Login = new grpc.web.MethodDescriptor(
  '/fdqms.SatrancService/Login',
  grpc.web.MethodType.UNARY,
  proto.fdqms.LoginRequest,
  proto.fdqms.User,
  /**
   * @param {!proto.fdqms.LoginRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.fdqms.User.deserializeBinary
);


/**
 * @param {!proto.fdqms.LoginRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.fdqms.User)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.fdqms.User>|undefined}
 *     The XHR Node Readable Stream
 */
proto.fdqms.SatrancServiceClient.prototype.login =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/fdqms.SatrancService/Login',
      request,
      metadata || {},
      methodDescriptor_SatrancService_Login,
      callback);
};


/**
 * @param {!proto.fdqms.LoginRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.fdqms.User>}
 *     Promise that resolves to the response
 */
proto.fdqms.SatrancServicePromiseClient.prototype.login =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/fdqms.SatrancService/Login',
      request,
      metadata || {},
      methodDescriptor_SatrancService_Login);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.fdqms.RegisterRequest,
 *   !proto.fdqms.User>}
 */
const methodDescriptor_SatrancService_Register = new grpc.web.MethodDescriptor(
  '/fdqms.SatrancService/Register',
  grpc.web.MethodType.UNARY,
  proto.fdqms.RegisterRequest,
  proto.fdqms.User,
  /**
   * @param {!proto.fdqms.RegisterRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.fdqms.User.deserializeBinary
);


/**
 * @param {!proto.fdqms.RegisterRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.fdqms.User)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.fdqms.User>|undefined}
 *     The XHR Node Readable Stream
 */
proto.fdqms.SatrancServiceClient.prototype.register =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/fdqms.SatrancService/Register',
      request,
      metadata || {},
      methodDescriptor_SatrancService_Register,
      callback);
};


/**
 * @param {!proto.fdqms.RegisterRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.fdqms.User>}
 *     Promise that resolves to the response
 */
proto.fdqms.SatrancServicePromiseClient.prototype.register =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/fdqms.SatrancService/Register',
      request,
      metadata || {},
      methodDescriptor_SatrancService_Register);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.fdqms.Empty,
 *   !proto.fdqms.GameID>}
 */
const methodDescriptor_SatrancService_CreateGame = new grpc.web.MethodDescriptor(
  '/fdqms.SatrancService/CreateGame',
  grpc.web.MethodType.UNARY,
  proto.fdqms.Empty,
  proto.fdqms.GameID,
  /**
   * @param {!proto.fdqms.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.fdqms.GameID.deserializeBinary
);


/**
 * @param {!proto.fdqms.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.fdqms.GameID)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.fdqms.GameID>|undefined}
 *     The XHR Node Readable Stream
 */
proto.fdqms.SatrancServiceClient.prototype.createGame =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/fdqms.SatrancService/CreateGame',
      request,
      metadata || {},
      methodDescriptor_SatrancService_CreateGame,
      callback);
};


/**
 * @param {!proto.fdqms.Empty} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.fdqms.GameID>}
 *     Promise that resolves to the response
 */
proto.fdqms.SatrancServicePromiseClient.prototype.createGame =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/fdqms.SatrancService/CreateGame',
      request,
      metadata || {},
      methodDescriptor_SatrancService_CreateGame);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.fdqms.Empty,
 *   !proto.fdqms.GameID>}
 */
const methodDescriptor_SatrancService_SearchGame = new grpc.web.MethodDescriptor(
  '/fdqms.SatrancService/SearchGame',
  grpc.web.MethodType.UNARY,
  proto.fdqms.Empty,
  proto.fdqms.GameID,
  /**
   * @param {!proto.fdqms.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.fdqms.GameID.deserializeBinary
);


/**
 * @param {!proto.fdqms.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.fdqms.GameID)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.fdqms.GameID>|undefined}
 *     The XHR Node Readable Stream
 */
proto.fdqms.SatrancServiceClient.prototype.searchGame =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/fdqms.SatrancService/SearchGame',
      request,
      metadata || {},
      methodDescriptor_SatrancService_SearchGame,
      callback);
};


/**
 * @param {!proto.fdqms.Empty} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.fdqms.GameID>}
 *     Promise that resolves to the response
 */
proto.fdqms.SatrancServicePromiseClient.prototype.searchGame =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/fdqms.SatrancService/SearchGame',
      request,
      metadata || {},
      methodDescriptor_SatrancService_SearchGame);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.fdqms.GameID,
 *   !proto.fdqms.Empty>}
 */
const methodDescriptor_SatrancService_LeaveGame = new grpc.web.MethodDescriptor(
  '/fdqms.SatrancService/LeaveGame',
  grpc.web.MethodType.UNARY,
  proto.fdqms.GameID,
  proto.fdqms.Empty,
  /**
   * @param {!proto.fdqms.GameID} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.fdqms.Empty.deserializeBinary
);


/**
 * @param {!proto.fdqms.GameID} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.fdqms.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.fdqms.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.fdqms.SatrancServiceClient.prototype.leaveGame =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/fdqms.SatrancService/LeaveGame',
      request,
      metadata || {},
      methodDescriptor_SatrancService_LeaveGame,
      callback);
};


/**
 * @param {!proto.fdqms.GameID} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.fdqms.Empty>}
 *     Promise that resolves to the response
 */
proto.fdqms.SatrancServicePromiseClient.prototype.leaveGame =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/fdqms.SatrancService/LeaveGame',
      request,
      metadata || {},
      methodDescriptor_SatrancService_LeaveGame);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.fdqms.GameID,
 *   !proto.fdqms.Empty>}
 */
const methodDescriptor_SatrancService_SendDraw = new grpc.web.MethodDescriptor(
  '/fdqms.SatrancService/SendDraw',
  grpc.web.MethodType.UNARY,
  proto.fdqms.GameID,
  proto.fdqms.Empty,
  /**
   * @param {!proto.fdqms.GameID} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.fdqms.Empty.deserializeBinary
);


/**
 * @param {!proto.fdqms.GameID} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.fdqms.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.fdqms.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.fdqms.SatrancServiceClient.prototype.sendDraw =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/fdqms.SatrancService/SendDraw',
      request,
      metadata || {},
      methodDescriptor_SatrancService_SendDraw,
      callback);
};


/**
 * @param {!proto.fdqms.GameID} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.fdqms.Empty>}
 *     Promise that resolves to the response
 */
proto.fdqms.SatrancServicePromiseClient.prototype.sendDraw =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/fdqms.SatrancService/SendDraw',
      request,
      metadata || {},
      methodDescriptor_SatrancService_SendDraw);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.fdqms.GameID,
 *   !proto.fdqms.Empty>}
 */
const methodDescriptor_SatrancService_AccetpDraw = new grpc.web.MethodDescriptor(
  '/fdqms.SatrancService/AccetpDraw',
  grpc.web.MethodType.UNARY,
  proto.fdqms.GameID,
  proto.fdqms.Empty,
  /**
   * @param {!proto.fdqms.GameID} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.fdqms.Empty.deserializeBinary
);


/**
 * @param {!proto.fdqms.GameID} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.fdqms.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.fdqms.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.fdqms.SatrancServiceClient.prototype.accetpDraw =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/fdqms.SatrancService/AccetpDraw',
      request,
      metadata || {},
      methodDescriptor_SatrancService_AccetpDraw,
      callback);
};


/**
 * @param {!proto.fdqms.GameID} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.fdqms.Empty>}
 *     Promise that resolves to the response
 */
proto.fdqms.SatrancServicePromiseClient.prototype.accetpDraw =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/fdqms.SatrancService/AccetpDraw',
      request,
      metadata || {},
      methodDescriptor_SatrancService_AccetpDraw);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.fdqms.GameID,
 *   !proto.fdqms.Empty>}
 */
const methodDescriptor_SatrancService_DeclineDraw = new grpc.web.MethodDescriptor(
  '/fdqms.SatrancService/DeclineDraw',
  grpc.web.MethodType.UNARY,
  proto.fdqms.GameID,
  proto.fdqms.Empty,
  /**
   * @param {!proto.fdqms.GameID} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.fdqms.Empty.deserializeBinary
);


/**
 * @param {!proto.fdqms.GameID} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.fdqms.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.fdqms.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.fdqms.SatrancServiceClient.prototype.declineDraw =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/fdqms.SatrancService/DeclineDraw',
      request,
      metadata || {},
      methodDescriptor_SatrancService_DeclineDraw,
      callback);
};


/**
 * @param {!proto.fdqms.GameID} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.fdqms.Empty>}
 *     Promise that resolves to the response
 */
proto.fdqms.SatrancServicePromiseClient.prototype.declineDraw =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/fdqms.SatrancService/DeclineDraw',
      request,
      metadata || {},
      methodDescriptor_SatrancService_DeclineDraw);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.fdqms.Empty,
 *   !proto.fdqms.Position>}
 */
const methodDescriptor_SatrancService_Connect = new grpc.web.MethodDescriptor(
  '/fdqms.SatrancService/Connect',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.fdqms.Empty,
  proto.fdqms.Position,
  /**
   * @param {!proto.fdqms.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.fdqms.Position.deserializeBinary
);


/**
 * @param {!proto.fdqms.Empty} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.fdqms.Position>}
 *     The XHR Node Readable Stream
 */
proto.fdqms.SatrancServiceClient.prototype.connect =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/fdqms.SatrancService/Connect',
      request,
      metadata || {},
      methodDescriptor_SatrancService_Connect);
};


/**
 * @param {!proto.fdqms.Empty} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.fdqms.Position>}
 *     The XHR Node Readable Stream
 */
proto.fdqms.SatrancServicePromiseClient.prototype.connect =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/fdqms.SatrancService/Connect',
      request,
      metadata || {},
      methodDescriptor_SatrancService_Connect);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.fdqms.Position,
 *   !proto.fdqms.Result>}
 */
const methodDescriptor_SatrancService_Move = new grpc.web.MethodDescriptor(
  '/fdqms.SatrancService/Move',
  grpc.web.MethodType.UNARY,
  proto.fdqms.Position,
  proto.fdqms.Result,
  /**
   * @param {!proto.fdqms.Position} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.fdqms.Result.deserializeBinary
);


/**
 * @param {!proto.fdqms.Position} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.fdqms.Result)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.fdqms.Result>|undefined}
 *     The XHR Node Readable Stream
 */
proto.fdqms.SatrancServiceClient.prototype.move =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/fdqms.SatrancService/Move',
      request,
      metadata || {},
      methodDescriptor_SatrancService_Move,
      callback);
};


/**
 * @param {!proto.fdqms.Position} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.fdqms.Result>}
 *     Promise that resolves to the response
 */
proto.fdqms.SatrancServicePromiseClient.prototype.move =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/fdqms.SatrancService/Move',
      request,
      metadata || {},
      methodDescriptor_SatrancService_Move);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.fdqms.Position,
 *   !proto.fdqms.Empty>}
 */
const methodDescriptor_SatrancService_Promotion = new grpc.web.MethodDescriptor(
  '/fdqms.SatrancService/Promotion',
  grpc.web.MethodType.UNARY,
  proto.fdqms.Position,
  proto.fdqms.Empty,
  /**
   * @param {!proto.fdqms.Position} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.fdqms.Empty.deserializeBinary
);


/**
 * @param {!proto.fdqms.Position} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.fdqms.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.fdqms.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.fdqms.SatrancServiceClient.prototype.promotion =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/fdqms.SatrancService/Promotion',
      request,
      metadata || {},
      methodDescriptor_SatrancService_Promotion,
      callback);
};


/**
 * @param {!proto.fdqms.Position} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.fdqms.Empty>}
 *     Promise that resolves to the response
 */
proto.fdqms.SatrancServicePromiseClient.prototype.promotion =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/fdqms.SatrancService/Promotion',
      request,
      metadata || {},
      methodDescriptor_SatrancService_Promotion);
};


module.exports = proto.fdqms;

