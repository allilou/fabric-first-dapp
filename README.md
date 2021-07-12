

cd fabric-samples/test-network

./network.sh down


./network.sh up createChannel -c mychannel -ca


./network.sh deployCC -ccn hiring -ccp ../../fabric-first-dapp/chaincode-javascript/ -ccl javascript

export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
