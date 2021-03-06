// Contacts
var rocketHub = artifacts.require("./RocketHub.sol");
var rocketPool = artifacts.require("./RocketPool.sol");
var rocketNode = artifacts.require("./RocketNode.sol");
var rocketPoolMiniDelegate = artifacts.require("./RocketPoolMiniDelegate.sol");
var rocketDepositToken = artifacts.require("./RocketDepositToken.sol");
var rocketPartnerAPI = artifacts.require("./RocketPartnerAPI.sol");
var rocketSettings = artifacts.require("./RocketSettings.sol");
var rocketFactory = artifacts.require("./RocketFactory.sol");
var dummyCasper = artifacts.require("./contract/casper/DummyCasper.sol");

// Interfaces
var rocketSettingsInterface = artifacts.require("./contracts/interface/RocketSettingsInterface.sol");
// Libs
var arithmeticLib = artifacts.require("./lib/Arithmetic.sol");
// Accounts
var accounts = web3.eth.accounts;

// TODO: Optimise this using the simpler deploy option
module.exports = function (deployer, network) {
    // Deploy rockethub first - has to be done in this order so that the following contracts already know the hub address
    deployer.deploy(arithmeticLib, rocketSettingsInterface).then(function () {
        // Lib Links
        deployer.link(arithmeticLib, [rocketPool, rocketPoolMiniDelegate, rocketDepositToken]);
        // Deploy rockethub first - has to be done in this order so that the following contracts already know the hub address
        return deployer.deploy(rocketHub).then(function () {
            // Deploy casper dummy contract
            return deployer.deploy(dummyCasper).then(function () {
                // Seed Casper with some funds to cover the rewards + deposit sent back
                web3.eth.sendTransaction({ from: accounts[9], to: dummyCasper.address, value: web3.toWei('6', 'ether'), gas: 1000000 });
                // Deploy rocket 3rd party partner API
                return deployer.deploy(rocketPartnerAPI, rocketHub.address).then(function () {
                    // Deploy rocket deposit token
                    return deployer.deploy(rocketDepositToken, rocketHub.address).then(function () {
                        // Deploy rocket factory
                        return deployer.deploy(rocketFactory, rocketHub.address).then(function () {
                            // Deploy rocket settings
                            return deployer.deploy(rocketSettings, rocketHub.address).then(function () {
                                // Deploy the main rocket pool
                                return deployer.deploy(rocketPool, rocketHub.address).then(function () {
                                    // Deploy the rocket node
                                    return deployer.deploy(rocketNode, rocketHub.address).then(function () {
                                        // Deploy the rocket pool mini delegate
                                        return deployer.deploy(rocketPoolMiniDelegate, rocketHub.address).then(function () {
                                            // Update the hub with the new addresses
                                            return rocketHub.deployed().then(function (rocketHubInstance) {
                                                console.log("\n");
                                                // Set rocket pool
                                                rocketHubInstance.setRocketPoolAddress(rocketPool.address);
                                                console.log('\x1b[33m%s\x1b[0m:', 'Updated Hub RocketPool Address');
                                                console.log(rocketPool.address);
                                                // Set rocket pool mini delegate
                                                rocketHubInstance.setRocketPoolMiniDelegateAddress(rocketPoolMiniDelegate.address);
                                                console.log('\x1b[33m%s\x1b[0m:', 'Updated Hub RocketPoolMiniDelegate Address');
                                                console.log(rocketPoolMiniDelegate.address);
                                                // Set rocket pool deposit token contract
                                                rocketHubInstance.setRocketDepositTokenAddress(rocketDepositToken.address);
                                                console.log('\x1b[33m%s\x1b[0m:', 'Updated Hub RocketDepositToken Address');
                                                console.log(rocketDepositToken.address);
                                                // Set rocket node
                                                rocketHubInstance.setRocketNodeAddress(rocketNode.address);
                                                console.log('\x1b[33m%s\x1b[0m:', 'Updated Hub RocketNode Address');
                                                console.log(rocketNode.address);
                                                // Set rocket factory
                                                rocketHubInstance.setRocketFactoryAddress(rocketFactory.address);
                                                console.log('\x1b[33m%s\x1b[0m:', 'Updated Hub RocketFactory Address');
                                                console.log(rocketFactory.address);
                                                // Set rocket partner API
                                                rocketHubInstance.setRocketPartnerAPIAddress(rocketPartnerAPI.address);
                                                console.log('\x1b[33m%s\x1b[0m:', 'Updated Hub RocketPartnerAPI Address');
                                                console.log(rocketPartnerAPI.address);
                                                // Set rocket settings
                                                rocketHubInstance.setRocketSettingsAddress(rocketSettings.address);
                                                console.log('\x1b[33m%s\x1b[0m:', 'Updated Hub RocketSettings Address');
                                                console.log(rocketSettings.address);
                                                // Set casper address
                                                rocketHubInstance.setCasperAddress(dummyCasper.address);
                                                console.log('\x1b[33m%s\x1b[0m:', 'Updated Dummy Casper Address');
                                                console.log(dummyCasper.address);
                                                // Reeturn
                                                return deployer;
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};
