
// export default function NotUniversityMail() {
//     return (
//         <div className='min-h-screen w-full flex flex-col justify-center items-center'>
//             <h3>Sorry You need a university eMail to Login</h3>
//             <p>However if email was university email. Contact us here <a href='developer.bilalellahi.com/contact'>Beyond Help</a></p>
//             <h6>If you want to join but your university doesnot provide an email or some other medium. Message us here.
//                 <a href='developer.bilalellahi.com/contact'>Beyond This wayyy...</a>
//             </h6>
//             <a href={`${import.meta.env.VITE_FRONTENT_URL}/login`}>Mistake? Back to Login </a>
//         </div>
//     )
// }

import SEO from '../../components/seo/SEO';

export default function NotUniversityMail() {
    return (
        <>
            <SEO 
                title="University Email Required" 
                description="Socian requires a university email address for registration. Learn about our university email policy and contact us for support."
                keywords="university email, student registration, email policy, socian login"
                pageType="default"
            />
            <div className='min-h-screen w-full flex flex-col justify-center items-center bg-gray-50 p-4'>
            <div className='bg-white p-8 rounded-lg shadow-lg text-center max-w-md'>
                <h3 className='text-2xl font-bold text-gray-800 mb-4'>
                    Sorry, You Need a University Email to Login
                </h3>
                <p className='text-gray-600 mb-4'>
                    If your email is a university email, please contact us here:
                    <a
                        href='https://developer.bilalellahi.com/contact'
                        className='text-blue-500 hover:text-blue-700 underline ml-1'
                    >
                        Beyond Help
                    </a>
                </p>
                <p className='text-gray-600 mb-6'>
                    If your university does not provide an email or you have other issues, message us here:
                    <br />
                    <a
                        href='https://developer.bilalellahi.com/contact'
                        className='text-blue-500 hover:text-blue-700 underline ml-1'
                    >
                        Beyond This wayyy...
                    </a>
                </p>
                <a
                    href={`${import.meta.env.VITE_FRONTENT_URL}/login`}
                    className='text-sm text-gray-500 hover:text-gray-700 underline'
                >
                    Mistake? Back to Login
                </a>
            </div>
            </div>
        </>
    );
}