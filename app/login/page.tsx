"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Briefcase, Pill, UserCog } from "lucide-react";

const roles = [
  { id: "pharmacist", label: "PHARMACIST", icon: Pill },
  { id: "manager", label: "MANAGER", icon: Briefcase },
  { id: "admin", label: "ADMINISTRATOR", icon: UserCog },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("admin");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    // Reset errors
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    }
    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    }

    if (!valid) {
      setGeneralError("Please fill all required fields.");
      return;
    }

    // Mock login logic (you can replace with API call)
    const user = {
      email,
      role: selectedRole,
      name: email.split("@")[0], // just an example
    };
    localStorage.setItem("user", JSON.stringify(user));

    // Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 to-blue-600 text-white p-10 flex-col justify-center items-start relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-32 right-20 w-48 h-48 bg-white rounded-full"></div>
        </div>
        <div className="relative z-10 max-w-md">
          <div className="mb-8 text-4xl font-bold">
            Medi<span className="text-blue-200">Lync</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Pharmacy Management System
          </h1>
          <p className="text-emerald-100 text-lg">
            Streamlined pharmaceutical operations with integrated inventory
            management, prescription tracking, and compliance monitoring for
            healthcare professionals.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-500 text-sm">Please select your role</p>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <div className="grid grid-cols-3 gap-4">
              {roles.map((role) => {
                const IconComponent = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <div key={role.id} className="relative">
                    <button
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full py-4 px-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <IconComponent
                        size={24}
                        className={
                          isSelected ? "text-blue-600" : "text-gray-400"
                        }
                      />
                      <span
                        className={`text-xs font-semibold ${
                          isSelected ? "text-blue-600" : "text-gray-500"
                        }`}
                      >
                        {role.label}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* General error */}
          {generalError && (
            <div className="mb-4 text-red-500 text-sm font-medium">
              {generalError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Type your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2.5 pl-10 border ${
                    emailError ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400`}
                />
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              {emailError && (
                <p className="text-red-500 text-xs">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Type your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2.5 pl-10 border ${
                    passwordError ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400`}
                />
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200"
            >
              Sign in
            </button>

            <div className="text-center">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Forgot your password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
