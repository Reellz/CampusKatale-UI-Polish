import React, { useState, useEffect } from "react";
import { useSignIn, useSignUp, useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "@fontsource-variable/lexend";
import logo from "../assets/CampusKatale.png";
import googleIcon from "../assets/Google.png";
import facebookIcon from "../assets/facebook.png";
import appleIcon from "../assets/icloud.png";
import { getImageUrl } from "../utils/imageUtils";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const toggleForm = (form) => setIsLogin(form === "login");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        if (!signInLoaded) return;

        const result = await signIn.create({
          identifier: email,
          password,
        });

        if (result.status === "complete") {
          navigate("/");
        } else {
          console.log("Sign-in next step:", result);
        }
      } else {
        if (!signUpLoaded) return;

        const result = await signUp.create({
          emailAddress: email,
          password,
          firstName: name,
        });

        if (result.status === "complete") {
          navigate("/");
        } else {
          console.log("Sign-up next step:", result);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.errors ? err.errors[0].message : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    try {
      if (isLogin && signInLoaded) {
        await signIn.authenticateWithRedirect({
          strategy: provider,
          redirectUrl: "/",
        });
      } else if (signUpLoaded) {
        await signUp.authenticateWithRedirect({
          strategy: provider,
          redirectUrl: "/",
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const goHome = () => navigate("/");

  // Optional: redirect if already signed in
  useEffect(() => {
    if (isSignedIn && user) {
      navigate(`/profile/${user.id}`);
    }
  }, [isSignedIn, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-[Lexend] py-8 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={getImageUrl(logo)}
            alt="Campus Katale Logo"
            className="h-16 md:h-20 w-auto"
          />
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => toggleForm("login")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              isLogin 
                ? "bg-[#177529] text-white" 
                : "text-[#177529] hover:text-[#97C040]"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => toggleForm("signup")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              !isLogin 
                ? "bg-[#177529] text-white" 
                : "text-[#177529] hover:text-[#97C040]"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border-2 border-[#97C040] p-6 md:p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {isLogin ? (
            /* Login Form */
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#97C040] bg-white focus:outline-none focus:ring-2 focus:ring-[#177529] text-[#0C0D19] placeholder-gray-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#97C040] bg-white focus:outline-none focus:ring-2 focus:ring-[#177529] text-[#0C0D19] placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-bold text-white bg-[#177529] hover:bg-[#135c21] transition-colors disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="flex justify-end">
                <a href="#" className="text-[#177529] text-sm hover:text-[#97C040] transition-colors">
                  Forgot Password
                </a>
              </div>

              <div className="text-center space-y-4">
                <p className="text-gray-500 text-sm">or Sign in with</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => handleOAuth("oauth_google")}
                    className="w-12 h-12 rounded-full overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    <img src={getImageUrl(googleIcon)} alt="Google" className="w-full h-full object-cover" />
                  </button>
                  <button
                    onClick={() => handleOAuth("oauth_facebook")}
                    className="w-12 h-12 rounded-full overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    <img src={getImageUrl(facebookIcon)} alt="Facebook" className="w-full h-full object-cover" />
                  </button>
                  <button
                    onClick={() => handleOAuth("oauth_apple")}
                    className="w-12 h-12 rounded-full overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    <img src={getImageUrl(appleIcon)} alt="Apple" className="w-full h-full object-cover" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Sign Up Form */
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#97C040] bg-white focus:outline-none focus:ring-2 focus:ring-[#177529] text-[#0C0D19] placeholder-gray-400"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#97C040] bg-white focus:outline-none focus:ring-2 focus:ring-[#177529] text-[#0C0D19] placeholder-gray-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#97C040] bg-white focus:outline-none focus:ring-2 focus:ring-[#177529] text-[#0C0D19] placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-bold text-white bg-[#177529] hover:bg-[#135c21] transition-colors disabled:opacity-50"
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </button>
              </form>

              <div className="text-center space-y-4">
                <p className="text-gray-500 text-sm">or Sign Up with</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => handleOAuth("oauth_google")}
                    className="w-12 h-12 rounded-full overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    <img src={getImageUrl(googleIcon)} alt="Google" className="w-full h-full object-cover" />
                  </button>
                  <button
                    onClick={() => handleOAuth("oauth_facebook")}
                    className="w-12 h-12 rounded-full overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    <img src={getImageUrl(facebookIcon)} alt="Facebook" className="w-full h-full object-cover" />
                  </button>
                  <button
                    onClick={() => handleOAuth("oauth_apple")}
                    className="w-12 h-12 rounded-full overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    <img src={getImageUrl(appleIcon)} alt="Apple" className="w-full h-full object-cover" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Back to Home Link */}
          <div className="mt-6 text-center">
            <button
              onClick={goHome}
              className="text-[#177529] text-sm hover:text-[#97C040] transition-colors"
            >
              &lt; Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
