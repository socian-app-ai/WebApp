
import { useAuthContext } from '../../../context/AuthContext'

export default function StudentDashboard() {
    const { authUser } = useAuthContext()
    console.log("here")

    return (
        <div className="min-h-screen">

            {authUser && authUser.university && authUser.university.campusLocation ? (
                typeof authUser.university.campusLocation === 'string' ? (
                    <p>{authUser.university.campusLocation}</p>
                ) : (
                    <div>
                        {Array.isArray(authUser.university.campusLocation) ? (
                            authUser.university.campusLocation.map((location, index) => (
                                <p key={index}>{location.name}</p>
                            ))
                        ) : (
                            <p>{authUser.university.campusLocation.name}</p>
                        )}
                    </div>
                )
            ) : (
                <p>No campus data available</p>
            )}


            <div className="min-h-screen p-4">
                {authUser ? (
                    <div>

                        <div className="profile-info mb-4">
                            <img src={authUser.profile.picture} alt="Profile" className="rounded-full w-20 h-20 mb-2" />
                            <h1 className="text-xl font-bold">{authUser.email}</h1>
                            <p>Role: {authUser.role}</p>
                            <p>Bio: {authUser.profile.bio || "No bio available"}</p>
                        </div>


                        <div className="university-info mb-4">
                            <h2 className="text-lg font-bold">University Information</h2>
                            <p>University: {authUser.university.name.name}</p>
                            <p>Location: {authUser.university.name.mainLocationAddress}</p>
                            <img src={authUser.university.name.picture} alt="University Logo" className="w-12 h-12" />
                        </div>


                        <div className="campus-info mb-4">
                            <h3 className="text-lg font-bold">Campus Information</h3>
                            <p>Campus: {authUser.university.campusLocation.name}</p>
                            <p>Location: {authUser.university.campusLocation.location}</p>
                            <img src={authUser.university.campusLocation.picture} alt="Campus Logo" className="w-12 h-12" />


                            {authUser.university.campusLocation.emailPatterns.studentPatterns.length > 0 && (
                                <div className="email-patterns mt-2">
                                    <h4 className="font-bold">Allowed Student Email Patterns:</h4>
                                    <ul>
                                        {authUser.university.campusLocation.emailPatterns.studentPatterns.map((pattern, index) => (
                                            <li key={index}>{pattern}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>


                        <div className="respect-info mb-4">
                            <h3 className="text-lg font-bold">Respect Information</h3>
                            <p>Post Respect: {authUser.profile.respect.postRespect}</p>
                            <p>Comment Respect: {authUser.profile.respect.commentRespect}</p>
                        </div>
                    </div>
                ) : (
                    <p>No user information available.</p>
                )}
            </div>
        </div>
    )
}






// import { useState } from 'react'
// import { useAuthContext } from '../../../context/AuthContext'


// export default function StudentDashboard({ campusData }) {
//     // const [campusInfo, setCampusInfo] = useState(campusData || [])
//     const { authUser } = useAuthContext()


//     return (
//         <div className=" min-h-screen">
//             This {authUser && authUser.university.campusLocation}
//             {/* // .map(d => (
//             //     <div key={d._id}>

//             //         <p>{d.emailPatterns}</p>
//             //         <p>{d.registered}</p>
//             //         <p>{d._id}</p>

//             //         <p>{d.universityOrigin}</p>
//             //         <p>{d.name}</p>
//             //         <p>{d.location}</p>
//             //         <p>{d.departments}</p>
//             //         <p>{d.__v}</p>
//             //         <p>{d.picture}</p>

//             //     </div>

//             // ))} */}
//         </div>
//     )
// }






// import { useAuthContext } from '../../../context/AuthContext'

// export  function test() {
//     const { authUser } = useAuthContext()

//     return (
//         <div className="min-h-screen">
//             {authUser && authUser.university && authUser.university.campusLocation ? (
//                 typeof authUser.university.campusLocation === 'string' ? (
//                     <p>{authUser.university.campusLocation}</p>
//                 ) : (
//                     <div>
//                         {Array.isArray(authUser.university.campusLocation) ? (
//                             authUser.university.campusLocation.map((location, index) => (
//                                 <p key={index}>{location.name}</p>
//                             ))
//                         ) : (
//                             <p>{authUser.university.campusLocation.name}</p>
//                         )}
//                     </div>
//                 )
//             ) : (
//                 <p>No campus data available</p>
//             )}


//             <div className="min-h-screen p-4">
//                 {authUser ? (
//                     <div>

//                         <div className="profile-info mb-4">
//                             <img src={authUser.profile.picture} alt="Profile" className="rounded-full w-20 h-20 mb-2" />
//                             <h1 className="text-xl font-bold">{authUser.email}</h1>
//                             <p>Role: {authUser.role}</p>
//                             <p>Bio: {authUser.profile.bio || "No bio available"}</p>
//                         </div>


//                         <div className="university-info mb-4">
//                             <h2 className="text-lg font-bold">University Information</h2>
//                             <p>University: {authUser.university.name.name}</p>
//                             <p>Location: {authUser.university.name.mainLocationAddress}</p>
//                             <img src={authUser.university.name.picture} alt="University Logo" className="w-12 h-12" />
//                         </div>


//                         <div className="campus-info mb-4">
//                             <h3 className="text-lg font-bold">Campus Information</h3>
//                             <p>Campus: {authUser.university.campusLocation.name}</p>
//                             <p>Location: {authUser.university.campusLocation.location}</p>
//                             <img src={authUser.university.campusLocation.picture} alt="Campus Logo" className="w-12 h-12" />


//                             {authUser.university.campusLocation.emailPatterns.studentPatterns.length > 0 && (
//                                 <div className="email-patterns mt-2">
//                                     <h4 className="font-bold">Allowed Student Email Patterns:</h4>
//                                     <ul>
//                                         {authUser.university.campusLocation.emailPatterns.studentPatterns.map((pattern, index) => (
//                                             <li key={index}>{pattern}</li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             )}
//                         </div>


//                         <div className="respect-info mb-4">
//                             <h3 className="text-lg font-bold">Respect Information</h3>
//                             <p>Post Respect: {authUser.profile.respect.postRespect}</p>
//                             <p>Comment Respect: {authUser.profile.respect.commentRespect}</p>
//                         </div>
//                     </div>
//                 ) : (
//                     <p>No user information available.</p>
//                 )}
//             </div>
//         </div>
//     )
// }

