import useSWR from "swr"

const URLGOLD = "https://api.metals.live/v1/spot/gold"
const URLCOPPER = "https://api.metals.live/v1/spot/copper"


const fetcher = async url => {
  const res = await fetch(URLGOLD)
  console.log("Refetching...")
  const json = await res.json()
  console.log(json[0].price)

  return json[0].price
}

const fetcher2 = async url => {
  const res = await fetch(URLCOPPER)
  console.log("Refetching...")
  const json = await res.json()
  console.log(json[0].price)

  return json[0].price
}

export const useGoldPrice = () => {
  const {data, ...rest} = useSWR(
    URLGOLD,
    fetcher,
    { refreshInterval: 200000 } //refetch for each 200 seconds additionally
  )
  return { gold: {data, ...rest}}
}

export const useCopperPrice = () => {
  const {data, ...rest} = useSWR(
    URLCOPPER,
    fetcher2,
    { refreshInterval: 200000 } //refetch for each 200 seconds additionally
  )
  return { copper: {data, ...rest}}
}