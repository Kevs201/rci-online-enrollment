'use client'

import { use } from 'react'; // Import `use` from React to unwrap the promise
import CourseDetailsPage from "../../components/Course/CourseDetailsPage"

// Define a type for params
interface Params {
    id: string; // Assuming `id` is a string
}

const Page = ({ params }: { params: Promise<Params> }) => {
    const resolvedParams = use(params); // Unwrap the params Promise

    return (
        <div>
            <CourseDetailsPage id={resolvedParams.id} />
        </div>
    );
}

export default Page;

// 'client'
// import CourseDetailsPage from "../../components/Course/CourseDetailsPage"


// const Page = ({params}:any) => {
//     return (
//         <div>
//             <CourseDetailsPage id={params.id}/>
//         </div>
//     )
// }

// export default Page; 