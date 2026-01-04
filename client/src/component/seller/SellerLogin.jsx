import { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const SellerLogin = () => {
  const { setIsSeller, isSeller, axios } = useContext(AppContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get("/api/sellers/isSellerAuth", {
          validateStatus: (status) => status < 500
        });
        if (data.success) {
          setIsSeller(true);
          navigate("/seller");
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };
    checkAuth();
  }, [axios, navigate, setIsSeller]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    console.log(`Attempting seller login with email: ${email}`);
    
    try {
      const { data } = await axios.post("/api/sellers/login", { email, password });
      if (data.success) {
        console.log("✓ Seller login successful");
        console.log("🍪 Cookie after login:", document.cookie);
        toast.success("Logged in successfully");
        setIsSeller(true);
        navigate("/seller");
      } else {
        console.log("✗ Seller login failed:", data.message);
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("✗ Seller login error:", error);
      toast.error(error.response?.data?.message || error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen no-scrollbar flex items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left panel: logo + title */}
          <div className="w-full lg:w-2/5 bg-primary p-8 lg:p-12 flex flex-col items-center justify-center text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 mb-6">
              <img
                src={assets.Delivery_address_amico}
                alt="Delivery Address"
                className="w-32 h-32 object-contain"
              />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-center mb-2">
              Seller Portal
            </h1>
            <p className="text-blue-100 text-center text-sm lg:text-base">
              Access your dashboard and manage your products
            </p>
          </div>

          {/* Right panel: form */}
          <div className="w-full lg:w-3/5 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-500 mb-8">
                Please enter your credentials to continue
              </p>

              <form onSubmit={onSubmitHandler} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    required
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-dull cursor-pointer text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>

                <div className="text-center">
                  <a
                    href="#"
                    className="text-sm text-primary hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info("Password reset functionality coming soon!");
                    }}
                  >
                    Forgot your password?
                  </a>
                </div>
              </form>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>Demo Credentials:</p>
                <p className="text-primary">seller@example.com/ sellerpassword</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;