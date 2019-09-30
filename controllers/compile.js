const fs = require('fs');
const web3 = require('./web3');
const Contract3 = require('contract3');
let contract3 = new Contract3(web3, require('solc'));

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
    return compiledStuff;
}

async function getInstances() {
    let deployedContract = {};
    try {
        deployedContract = await readFile('./deployedContract.json');
        deployedContract = JSON.parse(deployedContract);
    } catch (err) {

    }
   
    let instance;
    if (deployedContract.address === undefined) {
        let compiled = await compile();
        const DocumentStore = compiled["DocumentStore"];
        const accounts = await web3.eth.getAccounts();
        const defaultAccount = accounts[0];
        instance = await contract3.deploy(DocumentStore.abi, DocumentStore.bytecode, [], defaultAccount, 0, {
            gas: 4712388,
            //privateFor: []
        });
        instance = instance.instance;
        await writeFile("./deployedContract.json", JSON.stringify({
            address: instance.receipt.contractAddress
        }));
    } else {
        console.log("Already exists");
        let compiledContracts = await readFile('./compiledContracts.json');
        compiledContracts = JSON.parse(compiledContracts);
        instance = await contract3.getInstance(compiledContracts["DocumentStore"].abi, deployedContract.address);
    
    }

    return instance;
}

getInstances().then(async instance => {
    const accounts = await web3.eth.getAccounts();
    const defaultAccount = accounts[0];
    //const result = await instance.get('isAdmin', [defaultAccount], defaultAccount);
    //console.log('Owner:', result)
    const result2 = await instance.set('transferOwnership', [defaultAccount], defaultAccount,{
        gas: 4700000
    });
    console.log(result2)
    /*if (result2) {
        const result = await instance.get('getValue', [], defaultAccount);
        console.log('New Asset Value:', result)
    }*/
})