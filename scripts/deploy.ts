// imports
const { ethers, run: _run, network } = require("hardhat")

// async main
async function main() {
  const MomentumChainFactory = await ethers.getContractFactory("MomentumChain")
  console.log("Deploying contract...")
  const momentumChain = await MomentumChainFactory.deploy()
  await momentumChain.deployed()
  console.log(`Deployed contract to: ${momentumChain.address}`)
  // what happens when we deploy to our hardhat network?
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...")
    await momentumChain.deployTransaction.wait(6)
    await verify(momentumChain.address, [])
  }

  // const currentValue = await simpleStorage.retrieve()
  // console.log(`Current Value is: ${currentValue}`)

  // // Update the current value
  // const transactionResponse = await simpleStorage.store(7)
  // await transactionResponse.wait(1)
  // const updatedValue = await simpleStorage.retrieve()
  // console.log(`Updated Value is: ${updatedValue}`)
}

// async function verify(contractAddress, args) {
const verify = async (contractAddress: string, args: any) => {
  console.log("Verifying contract...")
  try {
    await _run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e: any) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e)
    }
  }
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
