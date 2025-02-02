var PROTO_PATH = __dirname + '/../protos/helloworld.proto';

const fs = require('fs');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
const { ReflectionService } = require('@grpc/reflection'); 

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call, callback) {
  callback(null, {message: 'Hello ' + call.request.name});
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
    const serverCert = fs.readFileSync('server.crt');
    const serverKey = fs.readFileSync('server.key');
    const credentials = grpc.ServerCredentials.createSsl(null, [{ cert_chain: serverCert, private_key: serverKey }], false);

  var server = new grpc.Server();
  server.addService(hello_proto.Greeter.service, {sayHello: sayHello});

  const reflection = new ReflectionService(packageDefinition)
  reflection.addToServer(server);
  server.bindAsync('0.0.0.0:50051', credentials, () => {
    server.start();
    console.log('server started')
  });
}

main();