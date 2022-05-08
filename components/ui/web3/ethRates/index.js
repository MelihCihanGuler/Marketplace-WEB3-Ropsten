import { useGoldPrice, useCopperPrice } from "@components/hooks/currency";
import { useEthPrice, COURSE_PRICE } from "@components/hooks/useEthPrice";
import { Loader } from "@components/ui/common";
import Image from "next/image";

export default function EthRates() {


  const { eth } = useEthPrice()
  const { gold } = useGoldPrice()
  const { copper } = useCopperPrice()
  return (
    <div className="flex flex-col xs:flex-row text-center">
      <div className="p-6 border drop-shadow rounded-md mr-2">
        <div className="flex items-center justify-center">
          { eth.data ?
            <>
              <Image
                layout="fixed"
                height="35"
                width="35"
                src="/small-eth.webp"
              />
              <span className="text-xl font-bold">
                = {eth.data}$
              </span>
            </> :
            <div className="w-full flex justify-center">
              <Loader size="md" />
            </div>
          }
        </div>
        <p className="text-lg text-gray-500">Current Eth Price</p>
      </div>
      <div className="p-6 border drop-shadow rounded-md mr-2">
        <div className="flex items-center justify-center">
          { gold.data ?
            <>
              <Image
                layout="fixed"
                height="35"
                width="45"
                src="/img/gold.png"
              />
              <span className="text-xl font-bold ml-2">
                = {gold.data}$
              </span>
            </> :
            <div className="w-full flex justify-center">
              <Loader size="md" />
            </div>
          }
        </div>
        <p className="text-lg text-gray-500">Current Gold Price</p>
      </div>
      <div className="p-6 border drop-shadow rounded-md">
        <div className="flex items-center justify-center">
          { gold.data ?
            <>
              <Image
                layout="fixed"
                height="35"
                width="35"
                src="/img/Copper.png"
              />
              <span className="text-xl font-bold ml-2">
                = {copper.data}$
              </span>
            </> :
            <div className="w-full flex justify-center">
              <Loader size="md" />
            </div>
          }
        </div>
        <p className="text-lg text-gray-500">Current Copper Price</p>
      </div>
    </div>
  )
}