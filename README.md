# Fabric First Decentralized Application


## Deploy the chaincode to the ledger 

```
cd fabric-samples/test-network

./network.sh down

./network.sh up createChannel -c mychannel -ca

./network.sh deployCC -ccn hiring -ccp ../../fabric-first-dapp/chaincode-javascript/ -ccl javascript
```

## Execute the Javascript Application 

```
cd fabric-first-dapp/application-javascript
node app.js
```

# invoke chainecode from command line

```
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
```

