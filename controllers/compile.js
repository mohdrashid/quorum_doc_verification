const fs = require('fs');
const web3 = require('./web3');
const Contract3 = require('contract3');
let contract3 = new Contract3(web3);

function readFile(address) {
    return new Promise((resolve, reject) => {
        fs.readFile(address, 'utf8', (err, contents) => {
            if (err) { reject(err) } else {
                resolve(contents)
            }
        })
    })
}

function writeFile(location, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(location, content, 'utf8', (err, contents) => {
            if (err) { reject(err) } else {
                resolve(contents)
            }
        })
    })
}

async function compile() {
    let Owned = await readFile('./contracts/owned.sol');
    let DocumentStore = await readFile('./contracts/documentStore.sol');

    let input = {
        'Owned.sol': {
            content: Owned
        },
        'DocumentStore.sol': {
            content: DocumentStore
        }
    }
    const compiledStuff = await contract3.compile(input);
    await writeFile("./compiledContracts.json", JSON.stringify(compiledStuff));
    console.log(compiledStuff)

    const contractInstances = await contract3.getInstances(input);
    //Returns a new instance of the contract Asset 
    return contractInstances['DocumentStore']();
}

async function deploy() {
    let compiled = await compile();
    const accounts = await web3.eth.getAccounts();
    const defaultAccount = accounts[0];
    const result = await compiled.deployContract(
        //args to constuctor
        [],
        //deployer
        defaultAccount,
        //Ether to send
        0,
        //Other Parameters
        {
            gas: 4712388
        });

    console.log('Contract Address: ', result.options.address)


}

deploy();