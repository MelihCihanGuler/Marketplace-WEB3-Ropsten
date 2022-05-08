import { useEffect } from "react"
import useSWR from "swr"


//hex of 9E67bCeb06967CFB661a063720831378bE84475b to keccak256 with prefix 0x
const adminAddresses = {"0x05201120ca8b529ec93585dcc1767ea8e949a099ffbd3501ad32845f3970e350" : true,
                        "0xfb59401aa7323cd3fc8da2a844d423cde94fed574877378cfbed8e43983f3344" : true}

export const handler = (web3, provider) => () => {
    
    //const [account, SetAccount] = useState(null)

    const { data, mutate, ...rest} = useSWR (() =>
        web3 ? "web3/accounts" : null,
        async () =>{
            const accounts = await web3.eth.getAccounts()
            return accounts[0]
        }
    )
    //V1
    // useEffect(() =>{
    //     const getAccount = async() => {
    //         const accounts = await web3.eth.getAccounts()
    //         SetAccount(accounts[0])
    //     }
    //     web3 && getAccount()
    // }, [web3])

    //V2
    // useEffect(()=>{
    //    provider && 
    //    provider.on("accountsChanged", 
    //    accounts => mutate(accounts[0] ?? null)) 
    // },[])

    //V3
    useEffect(()=>{
        const mutator = (accounts) => mutate(accounts[0] ?? null)
        provider?.on("accountsChanged", mutator) 

        return () =>{
            provider?.removeListener("accountsChanged", mutator)
        }


     },[provider])

    return{account: {data, isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]),mutate, ...rest}}
}