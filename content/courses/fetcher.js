
import courses from "@content/courses/index.json"

export const getAllCourses = () => {

  return {
    data: courses,
    courseMap: courses.reduce((a, c, i) => {
      a[c.id] = c
      a[c.id].index = i
      return a
    }, {})
  }
}