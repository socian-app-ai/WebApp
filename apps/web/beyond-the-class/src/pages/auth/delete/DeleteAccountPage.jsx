import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import axiosInstance from "../../../config/users/axios.instance";
import { useNavigate } from "react-router-dom";
import SEO from "../../../components/seo/SEO";

export default function DeleteAccountPage() {
  const { authUser, setAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authUser) {
      navigate("/login?deleteAccount=true");
    }
  }, [authUser, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action is irreversible.")) return;

    setLoading(true);
    setMessage("");
    try {
      await axiosInstance.delete("/api/auth/user/delete");
      setAuthUser(null);
      setMessage("✅ Your account has been deleted.");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMessage("❌ Failed to delete account.");
    } finally {
      setLoading(false);
    }
  };

  if (!authUser) return null;

  return (
    <>
      <SEO 
        title="Delete Account" 
        description="Permanently delete your Socian account. This action is irreversible and will remove all your data from the platform."
        keywords="delete account, account deletion, permanent removal, socian account"
        pageType="default"
      />
      <div className="max-w-md mx-auto mt-20 px-6 py-8 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-black text-black dark:text-white rounded-2xl shadow-sm">
      <img src="/Socian.png" alt="Socian" className="mx-auto w-24 h-24 mb-3 rounded-full border border-neutral-300 dark:border-neutral-700" />
      <h1 className="text-2xl font-semibold text-center mb-4">Socian</h1>

      <h1 className="text-3xl font-semibold text-center mb-4 underline">Delete Your Account</h1>
      <p className="text-center text-neutral-500 dark:text-neutral-400 mb-6">
        You're logged in as <strong>{authUser?.email}</strong>
      </p>

      <div className="flex justify-center">
        <button
          onClick={handleDelete}
          className={`w-full py-3 px-5 rounded-lg font-medium transition-all duration-200
            ${loading
              ? "bg-neutral-400 cursor-not-allowed"
              : "bg-black text-white bg-neutral-800 hover:bg-neutral-900"}`}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete My Account"}
        </button>
      </div>
      
      

      {message && (
        <p className="mt-6 text-sm text-center font-medium text-neutral-700 dark:text-neutral-300">
          {message}
        </p>
      )}

<p className="text-lg text-neutral-700 dark:text-neutral-300 mb-3 mt-5 underline">Instruction and Note</p>
      <ul className="text-sm text-neutral-700 dark:text-neutral-300 list-disc pl-5 space-y-2 mb-6">
        <li>🔒 <strong>Login Required:</strong> You must be logged in to delete your account.</li>
        <li>🔄 <strong>Redirect on Login:</strong> If you weren’t logged in, you’ll be redirected here right after logging in.</li>
        <li>🗑️ <strong>Permanent Deletion:</strong> Once deleted, your account cannot be recovered.</li>
        <li>📧 <strong>Final Goodbye Email:</strong> You will receive a final email confirming the deletion.</li>
        <li>🚫 <strong>Restricted Access:</strong> After deletion, your account can no longer:
          <ul className="list-disc pl-6 mt-1">
            <li>Post content</li>
            <li>Comment</li>
            <li>React or like</li>
            <li>Access member-only features</li>
          </ul>
        </li>
        <li>❌ <strong>Session Cleared:</strong> Your session will be deleted.</li>
        <li>🧠 <strong>Still Logged In?</strong> Even if a session remains, your account is fully disabled and inactive.</li>
      </ul>
      </div>

    </>
  );
}
