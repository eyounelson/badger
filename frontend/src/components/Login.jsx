import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../services/api";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});
    
    try {
      const data = await loginApi(email, password);
      
      // Store authentication data
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userId", data.user.id.toString());
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("isAuthenticated", "true");
      
      navigate("/dashboard");
    } catch (err) {
      setIsLoading(false);
      
      if (err.status === 422 && err.errors) {
        setFieldErrors(err.errors);
      } else if (err.status === 401) {
        setError("Invalid email or password");
      } else {
        setError(err.message || "Unable to connect to server. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-lg">
        <div className="card-clean rounded-2xl p-8 md:p-10 animate-fadeIn">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-brand mb-2 text-teal-600">
              BADGER
            </h1>
            <p className="text-gray-600 text-sm">Loyalty Rewards Program</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-7">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-3"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20'
                  }`}
                  placeholder="Enter your email"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.email[0]}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-3"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20'
                  }`}
                  placeholder="Enter your password"
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.password[0]}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="text-center">
                  Loading...
                </span>
              ) : (
                "LOGIN"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Unlock achievements and earn rewards with every purchase
        </p>
      </div>
    </div>
  );
};