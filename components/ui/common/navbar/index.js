


import { useWeb3 } from "@components/providers"
import Link from "next/link"
import {Button} from "@components/ui/common"
import { setupHooks } from "@components/providers/web3/hooks/setupHooks"
import { useAccount } from "@components/hooks/web3"
import ActiveLink from "../link"
//import { useRouter } from "next/router"

export default function Navbar() {
  const { connect, isLoading, isWeb3Loaded } = useWeb3()
  //const router = useRouter()

//   const _useAccount = useAccount(web3)
//   const {account} = _useAccount  bu iki satır yerine 
//   const {account} = useAccount(web3)()
    //const {pathName} = useRouter() bulunduğun urlin pathını verir. "/marketplace gibi"
    const {account} = useAccount()

  return (
    <section>
      <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
        <nav className="relative" aria-label="Global">
        <div className="flex flex-col xs:flex-row justify-between items-center">
            <div>
              <ActiveLink href="/" >
                <a
                  className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                  Home
                </a>
              </ActiveLink>
              <ActiveLink href="/marketplace" >
                <a
                  className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                  Marketplace
                </a>
              </ActiveLink>
              <ActiveLink href="/" >
                <a
                  className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                  Blogs
                </a>
              </ActiveLink>
            </div>
            <div className="text-center">
              <ActiveLink href="/wishlist" >
                <a
                className="font-medium sm:mr-8 mr-1 text-gray-500 hover:text-gray-900">
                  Wishlist
                </a>
              </ActiveLink>
              { (isLoading) ? 
                <Button
                disabled={true}
                onClick={connect}>
                    Loading..
                </Button> 
                : 
                !isWeb3Loaded ?
                <Button
                //onClick={() => router.push("https://metamask.io/download/")}>
                onClick={() => window.open("https://metamask.io/download/", "_blank")}>
                    Install Metamask
                </Button>
                :
                !account.data ?
                <Button
                onClick={connect}>
                    Connect
                </Button>
                :
                <Button>
                    Hi {account.isAdmin && "Admin"} {account.data.slice(0,6)}...
                </Button>
            }

            </div>
          </div>
        </nav>
      </div>
    </section>
  )
}