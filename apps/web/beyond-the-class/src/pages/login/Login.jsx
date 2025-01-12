import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import axiosInstance from "../../config/users/axios.instance";
import LabelInputCustomizable from '../../components/TextField/LabelInputCustomizable';
import DarkButton from '../../components/Buttons/DarkButton';
import GoogleButton from '../../components/Buttons/GoogleButton';
import routesForLinks, { routesForApi } from "../../utils/routes/routesForLinks";


export default function Login() {
  const [email, setEmail] = useState("");
  const [inputType, setInputType] = useState("email");

  const [password, setPassword] = useState("");
  // console.log('in login')
  const { loading, login } = useLogin();

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

  async function auth() {
    const response = await axiosInstance.post(routesForApi.google.request);
    // '/api/request'

    const data = response.data;
    // console.log("The data before secure: ", data);
    navigate(data.url);


  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };





  return (
    <div className="flex flex-col justify-center items-center min-h-svh  w-full">
      <div className=" flex flex-col justify-center items-center">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold my-4">Login to your account</h1>
        <p className=" text-lg p-2">Open gate to Opportunities</p>
      </div>

      <form
        className="flex flex-col justify-center items-center my-5"
        onSubmit={handleSubmit}
      >
        <LabelInputCustomizable
          type={inputType === "email" ? "email" : "text"}
          name={inputType === "email" ? "email" : "username"}
          className="my-2"
          value={email}
          label={"Email/Username"}
          placeholder="fa21-bcs-000@cuilahore.pk"
          onChange={(e) => handleEmailChange(e)}
          autoComplete="on"
        />

        <LabelInputCustomizable
          type="password"
          name="password"
          className="my-2"
          value={password}
          label={"Password"}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          hideShowPass={true}
          autoComplete="on"
          onKeyDown={handleKeyDown}

        />

        <div className="flex flex-row justify-evenly w-full">

          <Link className="[&&]:dark:text-[#c4c3c3] [&&]:text-black" to={routesForLinks.signup}>Don&apos;t Have an Account?</Link>
          <Link className=" underline" to={routesForLinks.signup}>Sign Up</Link>

        </div>




        <DarkButton className="my-5 " text="Login"
          loading={loading}
        />
        <div className="flex justify-center items-center m-4 w-full">
          <hr className="w-full " />
          <p className="flex flex-nowrap w-full [&&]dark:text-[#c4c3c3]   whitespace-nowrap mx-2">or continue with</p>
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




        <GoogleButton onClick={() => auth()} />




      </form>
    </div>
  );
}
