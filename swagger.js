import swaggerAutogen from 'swagger-autogen';

let swagger=swaggerAutogen();

const doc={
    info:{
        title:"WasserStoff Assignment"
    },
    host:{
        host:""
    }
}
const outputFile='./swagger-output.json';
const route =["./server.js"]
swagger(outputFile,route,doc)