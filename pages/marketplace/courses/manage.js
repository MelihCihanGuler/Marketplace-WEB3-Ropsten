
import { useAdmin, useManagedCourses } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button, Message } from "@components/ui/common";
import { CourseFilter, ManagedCourseCard, OwnedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { normalizeOwnedCourse } from "@utils/normalize";
import { withToast } from "@utils/toast";
import { useEffect, useState } from "react";

const VerificationInput = ({ onVerify }) => {


  const [email, setEmail] = useState("")

  return (
    <div className="flex mr-2 relative rounded-md">
      <input value={email} onChange={({ target: { value } }) => setEmail(value)}
        type="text"
        name="account"
        id="account"
        className="w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
        placeholder="0x2341ab..." />
      <Button
        onClick={() => {
          onVerify(email)
        }}
      >
        Verify
      </Button>
    </div>
  )
}


export default function ManagedCourses() {
  const { web3, contract } = useWeb3()
  const { account } = useAdmin({ redirectTo: "/marketplace" })
  const [proofedOwnership, setProofedOwnership] = useState({})
  const [searchedCourse, setSearchedCourse] = useState(null)
  const [filters, setFilters] = useState({ state: "all" })
  const { managedCourses } = useManagedCourses(account)

  const ChangeCourseState = async (courseHash, method) => {
    try {
      //await contract.methods.activateCourse(courseHash).send({from: account.data}) Bu aşağıdakiyle ikisi aynı
      const result = await contract.methods[method](courseHash).send({ from: account.data })
      return result
    } catch (e) {
      throw new Error(e.message)
    }
  }
  const aktifleCourse = async courseHash => {
    withToast(ChangeCourseState(courseHash, "activateCourse"))
  }

  const deAktifleCourse = async courseHash => {

    withToast(ChangeCourseState(courseHash, "deactivateCourse"))
  }



  const verifyCourse = (email, { hash, proof }) => {

    if(!email){
      return
    }
    const emailHash = web3.utils.sha3(email)
    const proofToCheck = web3.utils.soliditySha3(
      { type: "bytes32", value: emailHash },
      { type: "bytes32", value: hash }
    )

    proofToCheck === proof ?
      setProofedOwnership({
        ...proofToCheck,
        [hash]: true
      }) :
      setProofedOwnership({
        proofToCheck,
        [hash]: false
      })
  }

  if (!account.isAdmin) {
    return null
  }


  const searchText = async (value) => {
    if (!value) { return }

    var re = /[0-9A-Fa-f]{6}/g;
    if (re.test(value) && value.length === 66) {
      const course = await contract.methods.getCourseByHash(value).call()
      if (course.owner !== "0x0000000000000000000000000000000000000000") {
        const normalized = normalizeOwnedCourse(web3)({ value }, course)
        setSearchedCourse(normalized)
        return
      }
    }
    setSearchedCourse(null)
  }

  const renderCard = (course, isSearched) => {
    return (
      <ManagedCourseCard
        key={course.ownedCourseId}
        isSearched={isSearched}
        course={course}
      >
        <VerificationInput
          onVerify={email => {
            verifyCourse(email, {
              hash: course.hash,
              proof: course.proof
            })
          }}
        />
        {proofedOwnership[course.hash] &&
          <div className="mt-2">
            <Message>
              Verified!
            </Message>
          </div>
        }
        {proofedOwnership[course.hash] === false &&
          <div className="mt-2">
            <Message type="danger">
              Wrong Proof!
            </Message>
          </div>
        }
        {course.state === "purchased" &&
          <div className="mt-2">
            <Button
              onClick={() => aktifleCourse(course.hash)}
              variant="green">
              Activate
            </Button>
            <Button
              onClick={() => deAktifleCourse(course.hash)}
              variant="red">
              Deactivate
            </Button>
          </div>
        }
      </ManagedCourseCard>
    )
  }

  const filteredCourses = managedCourses.data?.filter((course) => {
      if (filters.state === "all") {
        return true
      }
      return course.state === filters.state
    }).map(course => renderCard(course) )

  return (
    <>
      <MarketHeader />
      <CourseFilter
        onFilterSelect={(value) => setFilters({ state: value })}
        onSearchSubmit={searchText} />
      <section className="grid grid-cols-1">
        {searchedCourse &&
          <div>
            <h1 className="text-2xl font-bold p-5">Search</h1>
            {renderCard(searchedCourse, true)}
          </div>
        }
        <h1 className="text-2xl font-bold p-5">All Courses</h1>
        { filteredCourses }
        { filteredCourses?.length === 0 &&
          <Message type="warning">
            No courses to display
          </Message>
        }
      </section>
    </>
  )
}

ManagedCourses.Layout = BaseLayout