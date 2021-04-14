const Web3 = require('web3');

const customProvider = {
    sendAsync : (payload, cb) => {
        console.log('you call');
        console.log(payload);
        cb(undefined, 100);
    }
}
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
// await window.etherum.enable()
const web3 = new Web3(customProvider);
// conected
const contract = new web3.eth.Contract(
    abi,
    address,
)
// web3.eth.getBlockNumber().then((e) => {
//     console.log(e, 'DONE');
// })
