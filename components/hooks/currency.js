import useSWR from "swr"

const URL = "http://hasanadiguzel.com.tr/api/kurgetir"

const fetcher = async url => {
  const res = await fetch(url)
  console.log("Refetching...")
  const json = await res.json()
  console.log(json.TCMB_AnlikKurBilgileri[0])

  return json.TCMB_AnlikKurBilgileri[0] ?? null
}

export const useCurrencyPrice = () => {
  const {data, ...rest} = useSWR(
    URL,
    fetcher,
    { refreshInterval: 200000 } //refetch for each 200 seconds additionally
  )
  return { usd: {data, ...rest}}
}