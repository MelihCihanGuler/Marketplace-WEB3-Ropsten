import { CourseCard, CourseList } from "@components/ui/course"
import { BaseLayout } from "@components/ui/layout"
import { getAllCourses } from "@content/courses/fetcher"
import { useOwnedCourses, useWalletInfo } from "@components/hooks/web3"
import { Button, Loader } from "@components/ui/common"
import { OrderModal } from "@components/ui/order"
import { useState } from "react"
import { MarketHeader } from "@components/ui/marketplace"
import { useWeb3 } from "@components/providers"
import { contracts_build_directory } from "truffle-config"
import { withToast } from "@utils/toast"

export default function Marketplace({ courses }) {
  const { web3, contract } = useWeb3()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [inChargingProgressCourseId, setInChargingProgressCourseId] = useState(null)
  const { account, isConnecting, hasConnectedWallet } = useWalletInfo()
  const { ownedCourses } = useOwnedCourses(courses, account.data)


  const PurchaseCourse = async (order, course) => {

    const hexCourseId = web3.utils.utf8ToHex(course.id)

    const orderHash = web3.utils.soliditySha3(
      { type: "bytes16", value: hexCourseId },
      { type: "address", value: account.data }
    )

    const emailHash = web3.utils.sha3(order.email)

    const proof = web3.utils.soliditySha3(
      { type: "bytes32", value: emailHash },
      { type: "bytes32", value: orderHash }
    )

    const value = web3.utils.toWei(String(order.price))


    //PURCHASE COURSE AND NOTIFY TOAST

    setInChargingProgressCourseId(course.id)
    console.log(`SetInChargingProcess ${course.id}`)
    withToast(_purchaseCourse({hexCourseId, proof, value}, course))

  }

  //Mutate fonksiyonunu çağırabilmek için course datası ekliyoruz
  const _purchaseCourse = async ({hexCourseId, proof, value}, course ) => {

    try {
      const result = await contract.methods.purchaseCourse(hexCourseId, proof).send({ from: account.data, value })

      //Kurs satın alındığında, SWR ı tetikle. Böylece bekleme yapmasın, marketplace sayfasında otomatik butonlar güncellensin 
      //Mutate fonksiyonu boş çağırılırsa, git fetch et dataları demek oluyor. Kendimiz de oluşturabiliriz aşağıdaki gibi.
      ownedCourses.mutate([
        ...ownedCourses.data, {
          ...course,
          proof,
          state: "purchased",
          owner: account.data,
          price: value
        }

      ])
      //Yukarıdaki mutate, sıfırdan istek yollayıp data alır. Bu sebeple satın alınma sonrası YOURS butonu hemen gözükmüyor. 2-3 sn data yüklenmesini alıyor.
      //Eğer ki satın alınma anında IN PROGRESS butonundan YOURS butona dönüşsün isteniyorsa, mutate içine değerin girilmesi gerekli.
      return result
    
    } catch (error) {
    
      throw new Error(error.message)
    
    }finally{
      setInChargingProgressCourseId(null)
    }
  }

  const cleanUpModal = () => {

    setSelectedCourse(null)

  }


  return (
    <>
      <div className="py-4">
        <MarketHeader />
      </div>
      <CourseList
        courses={courses}
      >
        {course => {

          const owned = ownedCourses.lookup[course.id]

          return (<CourseCard
            key={course.id}
            disabled={!hasConnectedWallet}
            course={course}
            state={owned?.state}
            Footer={() => {

              const inChargingProcess = course.id === inChargingProgressCourseId
              if(!!inChargingProgressCourseId){
                console.log("inChargingProcess = " + inChargingProcess + "course.id =" + course.id +  "setInChargingProgressCourseId: " + setInChargingProgressCourseId)
              }

              if (owned) {
                return (
                  <div className="mt-4 flex flex-row-reverse">
                    <Button
                      disabled={false}
                      variant="white">
                      Yours &#10003;
                    </Button>
                  </div>)
              }


              if (!ownedCourses.hasInitialResponse) {
                return (
                  <div className="mt-4 flex flex-row-reverse">
                    <Button
                      disabled={true}
                      variant="white">
                      {hasConnectedWallet ? "Loading State ..." : "Connect"}
                    </Button>
                  </div>)
              }

              return (
                <div className="mt-4 flex flex-row-reverse">
                  <Button
                    onClick={() => setSelectedCourse(course)}
                    disabled={!hasConnectedWallet || inChargingProcess}
                    variant="lightPurple">
                    {inChargingProcess ? 
                    <div className="flex">
                      <Loader size="sm"/>
                      <div className="ml-2">In Progress</div>
                    </div>
                    : 
                    <div>Purchase</div>
                    }
                  </Button>
                </div>)

            }
            }
          />)
        }}
      </CourseList>
      {selectedCourse &&
        <OrderModal
          course={selectedCourse}
          onSubmit={(formData, course) => { 
            PurchaseCourse(formData, course)
            cleanUpModal()
          }}
          onClose={cleanUpModal}
        />
      }
    </>
  )
}
export function getStaticProps() {
  const { data } = getAllCourses()
  return {
    props: {
      courses: data
    }
  }
}
Marketplace.Layout = BaseLayout