import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setLoading(true);
      setError("");
      // Get user info from Google using the access token
      const googleUser = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
      );

      const {
        sub: googleId,
        email,
        name,
        picture: profilePicture,
      } = googleUser.data;

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/google`,
        {
          googleId,
          email,
          name,
          profilePicture,
        },
      );

      if (data.success) {
        login(data.token, data.user);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login Failed:", error);
      const errorMsg =
        error.response?.data?.message || "Login failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => console.error("Google Login Failed"),
  });

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50">
      {/* Left Side (Desktop): Branding */}
      <div className="flex flex-col justify-between items-center md:items-start p-8 md:p-16 lg:p-24 bg-gradient-to-br from-green-50 to-gray-50 md:min-h-screen">
        <div className="w-full max-w-md mx-auto md:mx-0 text-center md:text-left">
          {/* Dummy Placeholder Logo */}
          {/* <div className="w-24 h-24 bg-white rounded-3xl shadow-sm mb-12 flex items-center justify-center border border-gray-100 mx-auto md:mx-0">
            <span className="text-gray-400 font-semibold text-sm">LOGO</span>
          </div> */}
          <img
            src="../public/images/logo.jpeg"
            alt="Logo"
            className="w-48 h-48 bg-white rounded-3xl shadow-sm mb-12 flex items-center justify-center border border-gray-100 mx-auto md:mx-0"
          />
          -.
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-900 to-green-900 bg-clip-text text-transparent mb-6 leading-tight">
            Welcome to <br className="hidden md:block" />
            UMA Coaching Classes
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-12">
            Your dedicated portal for personal learning, comprehensive guidance,
            and academic success.
          </p>
        </div>

        {/* Location Icon & Text (Bottom) */}
        <div className="flex items-center gap-2 text-gray-500 w-full justify-center md:justify-start">
          <MapPin size={20} />
          <span className="font-medium">Gwalior, MP</span>
        </div>
      </div>

      {/* Right Side (Desktop): Login Card */}
      <div className="flex items-center justify-center p-6 md:p-12 lg:p-24 relative overflow-hidden">
        {/* Soft back shadow on the card */}
        <div className="absolute inset-0 bg-green-200 blur-[100px] opacity-20 -z-10 rounded-full w-2/3 h-2/3 m-auto" />

        <div className="bg-white w-full max-w-md rounded-[2rem] shadow-[0px_8px_40px_rgba(0,0,0,0.08)] p-10 md:p-12 border border-gray-50 relative z-10">
          <div className="text-center mb-10 text-gray-800">
            <h2 className="text-2xl font-bold mb-3">Sign in securely</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Use your verified Google account associated with the coaching to
              access your dashboard.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Custom Google Login Button */}
          <div className="mb-10 w-full mt-4">
            <button
              onClick={() => googleLogin()}
              disabled={loading}
              className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all font-medium text-gray-700 bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-base">Continue with Google</span>
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-400 mt-6 max-w-[260px] mx-auto leading-relaxed">
              Trouble signing in? Please contact your school administrator to
              ensure your email is correctly registered.
            </p>
          </div>

          <div className="text-center mt-8 cursor-pointer group">
            <div className="flex items-center gap-1 justify-center text-gray-300 group-hover:text-gray-400 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                />
              </svg>
              <span className="text-xs font-medium">Powered by UMA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
