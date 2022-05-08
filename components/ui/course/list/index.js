

export default function List({courses, children}){

    return(
        //md: 1 item for small screen lg: 2 items for large screen
        <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
           
           {courses.map((course) => children(course))}


            
            
        </section>
    )
}