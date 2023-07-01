## ECDSA Node

This project is an example of using a client and server to facilitate transfers between different addresses. It incorporates Public Key Cryptogrphy (Elliptic Curve Digital Signatures) so the server only allows transfers that have been signed for by the person who owns the associated address. Additionally, the server checks that the message has not been altered, that the sender is the same entity that has signed the message, and that it is not a reply attack. 

The user interface allows for the transfer of funds and the creation of random private keys for testing purposes. The user needs to input a Private Key to check the balance of the account, then can specify an amount and an Ethereum format address to send those funds. The Private Key is never sent over the network.

### Video instructions
For an overview of this project as well as getting started instructions, check out [this video](https://www.loom.com/share/0d3c74890b8e44a5918c4cacb3f646c4).
 
### Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://127.0.0.1:5173/

### Server

The server folder contains a node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the depedencies 
3. Run `node index` to start the server 

The application should connect to the default server port (3042) automatically! 

_Hint_ - Use [nodemon](https://www.npmjs.com/package/nodemon) instead of `node` to automatically restart the server on any changes.
