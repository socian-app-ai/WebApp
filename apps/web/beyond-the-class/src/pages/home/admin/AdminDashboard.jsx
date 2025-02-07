
export default function AdminDashboard() {
    return (
        <div className='min-h-screen w-full px-2 pt-8'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  w-full'>
                <div className=' border p-2 my-2 mx-2 md:mx-5'>All time user : <strong>19.2K</strong></div>

                <div className=' border p-2 my-2 mx-2 md:mx-5'>Total Universities: <strong>25</strong></div>

                <div className=' border p-2 my-2 mx-2 md:mx-5'>Total Campus: <strong>45</strong></div>

                <div className=' border p-2 my-2 mx-2 md:mx-5'>Total Societies: <strong>39K</strong></div>

                <div>
                    {/* analytics showing quantity of users[1] created in previous month,year
                    analytics showing quantity of universities[2] created in previous month,year
                    analytics showing quantity of campuses[3] created in previous month,year
                    analytics showing quantity of societies[4] created in previous month,year
                    analytics showing quantity of subSocieties[5] created in previous month,year

                    on click [1], next page, further shows quantity of alumni/students/external organization/moderators/admins
                    on click [4], next page, further shows quantity of private/restricted/public societies {and list of them, ith their campus name on it}
                    on click [5], next page, further shows quantity of private/restricted/public subSocieties  {and list of them, ith their campus name on it} */}

                </div>
            </div>

        </div>)
}
