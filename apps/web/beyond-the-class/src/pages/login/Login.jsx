import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import axiosInstance from "../../config/users/axios.instance";
import LabelInputCustomizable from '../../components/TextField/LabelInputCustomizable';
import DarkButton from '../../components/Buttons/DarkButton';
import GoogleButton from '../../components/Buttons/GoogleButton';
import routesForLinks, { routesForApi } from "../../utils/routes/routesForLinks";
import { ShinyButtonParam } from "../../components/Shinny/ShinnyButton";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEO from "../../components/seo/SEO";


export default function Login() {
  const [email, setEmail] = useState("");
  const [inputType, setInputType] = useState("email");

  const [password, setPassword] = useState("");
  // console.log('in login')
  const { loading, login } = useLogin();

  const location = useLocation();
const [showRedirectMsg, setShowRedirectMsg] = useState(false);

useEffect(() => {
  const params = new URLSearchParams(location.search);
  if (params.get("deleteAccount") === "true") {
    setShowRedirectMsg(true);
    setTimeout(() => setShowRedirectMsg(false), 6000); // hide after 6 seconds
  }
}, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email.toLocaleLowerCase(), password);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // If email does not contain '@', consider it as a username
    setInputType(e.target.value.includes("@") ? "email" : "username");
  };

  function navigate(url) {
    window.location.href = url;
  }

  async function auth(e) {
    e.preventDefault();
    const response = await axiosInstance.post(routesForApi.oauth.google.request);
    // '/api/google/request'

    const data = response.data;
    // console.log("The data before secure: ", data);
    navigate(data.url);


  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };


  const loginStructuredData = {
        
            
                    
    "@context": "https://schema.org",
"@type": "WebSite",
        "author": {
          "@type": "Person",
          "name": "Muhammad Bilal Ellahi"
        },        "name": "Socian",
    "alternateName": [
        "Socian",
        "socian.app",
        "socian",
        "socian.app",
        "socian.app",
        "MuhammadBilalEllahi",
        "bilal_illahi",
        "Muhammad Ellahi",
        "Bilal Ellahi Portfolio",
        "Bilal Full Stack Dev",
        "Bilal from Pakistan",
        "Bilal Ellahi", "M Bilal", "M Bilal Ellahi", "bilalellahi", "bilalellahi.com", "bilal_illahi", "bilal", "illahi", "github bilal", "github bilal ellahi",  "Bilal Elahi",
        "bilalelahi",
        "M Bilal",
        "M Bilal Elahi",
        "Muhammad B Elahi",
        "Bilal Elahi Dev",
        "bilalelahi.com",
        "Bilal MERN Developer",
        "Bilal Flutter Developer",
        "MuhammadBilalElahi",
        "bilal_elahi",
        "Muhammad Elahi",
        "Bilal Elahi Portfolio",
        "Bilal Full Stack Dev",
        "Bilal from Pakistan",
        "bilal", 
        "elahi",
        "github bilal", 
        "github bilal elahi"],
    "url": "https://socian.app",
    "jobTitle": "Student Community Platform",
    "worksFor": {
        "@type": "Organization",
        "name": "Self-employed"
    },
    "description": "Socian is a comprehensive student community platform connecting students, teachers, and alumni. Share resources, discuss courses, and build meaningful connections within your academic community.",
    "image": "https://socian.app/Socian.png",
    "sameAs": [
        "https://github.com/MuhammadBilalEllahi",
        "https://linkedin.com/in/bilal-ellahi",
        "https://twitter.com/bilal_illahi"
    ],
    "knowsAbout": ["Student Community Platform", "Academic Networking", "Student Resources", "Campus Social Network", "Educational Platform", "Student Collaboration"],
    "email": "support@socian.app",
    "address": {
        "@type": "PostalAddress",
        "addressCountry": "Pakistan"
    }
};




  return (
    <div className="select-none flex flex-col justify-center items-center min-h-svh  w-full auth_page_style auth_page_style-gradient" >
      <SEO
                title="Login"
                description="Socian is a comprehensive student community platform connecting students, teachers, and alumni. Share resources, discuss courses, and build meaningful connections within your academic community."
                keywords="Socian, student community, university platform, academic networking, student resources, campus social network, educational platform, student collaboration"
                structuredData={loginStructuredData}
            />
      <div className=" flex flex-col justify-center items-center">
        <h1 className="dark:text-white text-lg md:text-xl lg:text-2xl font-bold my-4 select-none">Login to your account</h1>
        <p className="dark:text-white text-sm px-2">Open gate to Opportunities</p>
      </div>
      
      {showRedirectMsg && (
  <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-600 px-4 py-3 rounded-lg mb-4 text-sm max-w-md mx-auto">
    You were redirected here to log in before deleting your account. You'll be redirected to the delete account page after logging in.
  </div>
)}

      <form
        noValidate={true}
        className="flex flex-col justify-center items-center"
        // my-5 border-2 border-[#838383] rounded-lg p-4 pb-6 bg-white dark:bg-[#1d1d1d]
        onSubmit={handleSubmit}
      >
        <LabelInputCustomizable
          type={inputType === "email" ? "email" : "text"}
          name={inputType === "email" ? "email" : "username"}
          className="my-3 dark:text-white"
          value={email}
          label={"Email/Username"}
          placeholder="fa21-bcs-000@cuilahore.pk"
          onChange={(e) => handleEmailChange(e)}
          autoComplete="on"
        />

        <LabelInputCustomizable
          type="password"
          name="password"
          className="my-2 dark:text-white"
          value={password}
          label={"Password"}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          hideShowPass={true}
          autoComplete="on"
          onKeyDown={handleKeyDown}

        />

        <div className="flex flex-row justify-evenly w-full">

          <Link className="dark:text-[#c4c3c3] text-black" to={routesForLinks.signup}>Don&apos;t Have an Account?</Link>
          <Link className="dark:text-white underline" to={routesForLinks.signup}>Sign Up</Link>

        </div>

        <Link className="dark:text-white underline my-2" to={routesForLinks.forgotPassword}>forgot password</Link>



        {/* 
        <DarkButton className="my-5 " text="Login"
          loading={loading}
        /> */}


        <ShinyButtonParam className="w-full" text="Login"
          loading={loading}
          loadingText={'Logging In...'}
        />

        <div className="flex justify-center items-center m-4 w-full">
          <hr className="w-full " />
          <p className="flex flex-nowrap w-full dark:text-[#c4c3c3]   whitespace-nowrap mx-2">or continue with</p>
          <hr className="w-full " />
        </div>

        {/* <GoogleLogin
          onSuccess={async (credentialResponse) => {
            console.log(credentialResponse, "\n",);

            console.log(jwtDecode(credentialResponse.credential))

            fetch("http://")
          }}

          onError={() => {
            console.log('Login Failed');
          }}
          useOneTap
        /> */}




        <GoogleButton onClick={(e) => auth(e)} />




      </form>

      {/* Mobile: Compact Better on the app section below login button */}
      <div className="block md:hidden w-full max-w-md mx-auto mt-6 rounded-xl border bg-white dark:bg-[#18181b] shadow p-4 flex flex-col items-center">
        <h2 className="font-semibold text-base mb-1 text-center dark:text-white">Better on the app</h2>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 text-center">Connect, explore universities, access past papers & teacher reviews. One platform for all campus life.</p>
        <a
          href="https://linktr.ee/socian.app"
          target="_blank"
          rel="noopener noreferrer"
          className="dark:text-white text-black font-medium underline text-sm hover:text-blue-700 dark:hover:text-blue-400"
        >
          <p className="text-sm">Explore the app</p>
        </a>
      </div>

      {/* Desktop: Floating QR code section */}
      <div className="hidden md:fixed md:z-50 md:bottom-4 md:right-4 md:w-80 md:max-w-[90vw] md:rounded-xl md:border md:bg-white md:dark:bg-[#18181b] md:shadow-lg md:p-4 md:flex md:flex-col md:items-center md:transition-all md:duration-300"
        style={{boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)'}}
      >
        <h2 className="font-semibold text-lg mb-2 text-center dark:text-white">Better on the app</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">Connect, explore universities, access past papers & teacher reviews. One platform for all campus life.</p>
        <div className="flex flex-row gap-6 items-center justify-center w-full">
          {/* LinkedIn QR */}
          <div className="flex flex-col items-center">
            <div className="bg-white dark:bg-black p-2 rounded-lg border mb-2">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://www.linkedin.com/company/socian-app/"
                alt="LinkedIn QR"
                width={100}
                height={100}
                className="rounded"
              />
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300">LinkedIn</span>
          </div>
          {/* App QR (SVG) */}
          <div className="flex flex-col items-center">
            <div className="bg-white dark:bg-white p-2 rounded-lg border mb-2">
              <img
                src={'/socian.app.svg'}
                alt="Socian App QR"
                width={100}
                height={100}
                className="rounded"
              />
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300">@socian.app</span>
          </div>
        </div>
        <a
          href="https://linktr.ee/socian.app"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 dark:text-white text-black font-medium underline text-sm hover:text-blue-700 dark:hover:text-blue-400"
        >
          <p className="text-sm">Explore the app</p>
        </a>
      </div>

    </div>
  );
}
