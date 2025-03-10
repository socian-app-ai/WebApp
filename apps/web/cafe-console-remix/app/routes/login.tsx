import { json, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { LoginForm } from "../components/login-form";
import { useActionData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");
  if (cookie && cookie.includes("cafe_session=")) {
    return redirect("/dashboard");
  }
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const identifier = formData.get("identifier");
  const password = formData.get("password");

  try {
    const response = await fetch("http://localhost:8080/api/cafe/login", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        "x-platform": "web",
      },
      body: JSON.stringify({ identifier, password }),
      credentials: 'include'
    });

    const data = await response.json();

    if (response.ok) {
      // Store login data in session
      return json(
        { user: data },
        {
          headers: {
            "Set-Cookie": `cafe_session=${JSON.stringify(data)}; Path=/`,
            Location: "/dashboard"
          },
          status: 302,
          
        }
      );
    }

    return json(
      { error: data.message || "Invalid credentials" },
      { status: response.status }
    );
  } catch (error) {
    console.error("Login error:", error);
    return json({ error: "Login failed" }, { status: 500 });
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  return <LoginForm error={actionData?.error} />;
}
