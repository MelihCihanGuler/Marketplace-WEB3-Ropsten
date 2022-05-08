import { useEffect, useState } from "react"
import useSWR from "swr"

const NETWORKS = {

    1: "Ethereum Main Network",
    3: "Ropsten Test Network",
    4: "Rinkeby Test Network",
    5: "Goerli Test Network",
    42: "Kovan Test Network",
    56: "Binance Smart Chain",
    137: "Polygon Mainnet",
    250: "Fantom Opera",
    43114: "Avalanche C-Chain",
    1337: "Ganache Network"
}

const targetNetwork = NETWORKS[process.env.NEXT_PUBLIC_TARGET_CHAIN_ID]

export const handler = (web3, provider) => () => {

    const  { data, mutate, ...rest} = useSWR(()=> web3 ? "web3/network" : null, async()=>{
        
        const chainId = await web3.eth.getChainId()

        if (!chainId) {
            throw new Error("Cannot retreive network. Please refresh the browser.")
          }

        return NETWORKS[chainId]
    })

    // useEffect(()=>{
    //     provider &&     
    //     provider.on("chainChanged", 
    //     chainId => {
    //         mutate(NETWORKS[parseInt(chainId,16)])
    //     }) 
    //  },[web3])

    useEffect(()=>{
        const mutator = chainId => window.location.reload()  //Yapılması gereken!
        //const mutator = chainId => mutate(NETWORKS[parseInt(chainId,16)])
        provider?.on("chainChanged", mutator) 
        return () =>{
            provider?.removeListener("chainChanged", mutator)
        }
     },[web3])

    return{
        network:{ 
            data,
            mutate, 
            target: targetNetwork, 
            isSupported: data === targetNetwork, 
            ...rest}
    }
}