import React, { useState } from "react";
import { User, Lock, Mail, Shield, UserPlus, LogIn, X, CheckCircle, AlertCircle } from "lucide-react";
import { secureStorage } from "../utils/secureStorage";

interface UserProfile {
  name: string;
  email: string;
  role: "Administrator" | "CDRRMO Officer" | "Field Responder" | "Citizen";
  token: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"CDRRMO Officer" | "Field Responder" | "Citizen">("CDRRMO Officer");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (isSignUp && !name)) {
      setError("Please fill in all required fields.");
      return;
    }

    // Check for Super Admin credentials
    const isSuperAdmin = (email.trim().toLowerCase() === "superadmin" || email.trim().toLowerCase() === "SuperAdminAccess") && password === "Admin@123";

    if (!isSignUp && !isSuperAdmin && password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    let userProfile: UserProfile;

    if (isSuperAdmin) {
      userProfile = {
        name: "Super Administrator",
        email: "superadmin@aurassure.gov.ph",
        role: "Administrator",
        token: `aurassure-superadmin-token-${Date.now()}`
      };
    } else if (isSignUp) {
      userProfile = {
        name,
        email,
        role: role as any,
        token: `aurassure-jwt-${Date.now()}`
      };
    } else {
      userProfile = {
        name: email.split("@")[0],
        email,
        role: "CDRRMO Officer",
        token: `aurassure-jwt-${Date.now()}`
      };
    }

    // Record login/register activity log in localStorage for Super Admin Active Logs
    try {
      const existingLogs = secureStorage.getItem("aurassure_activity_logs") || [];
      const newLog = {
        id: `log-${Date.now()}`,
        name: userProfile.name,
        email: userProfile.email,
        role: userProfile.role,
        action: isSignUp ? "REGISTER & LOGIN" : "LOGIN",
        timestamp: new Date().toLocaleString()
      };
      secureStorage.setItem("aurassure_activity_logs", [newLog, ...existingLogs]);
    } catch (e) {}

    setSuccess(isSignUp ? "Account created successfully! Logging you in..." : "Login successful!");
    
    setTimeout(() => {
      secureStorage.setItem("aurassure_user", userProfile);
      onLoginSuccess(userProfile);
      setSuccess("");
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-white space-y-6 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-600/20 border border-blue-500/30 text-cyan-400 rounded-2xl">
            {isSignUp ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">
              {isSignUp ? "Create Operator Account" : "Operator & Super Admin Login"}
            </h3>
            <p className="text-xs text-slate-400">
              {isSignUp ? "Register for standard disaster response access" : "Sign in to access the dashboard and manage disaster response operations."}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Username or Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Username or Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Assigned Role</label>
              <div className="relative">
                <Shield className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CDRRMO Officer">CDRRMO Dispatch Officer</option>
                  <option value="Field Responder">Field Rescue Responder</option>
                  <option value="Citizen">Barangay Monitor</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 text-sm mt-2"
          >
            {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{isSignUp ? "Create Account & Sign In" : "Sign In to Dashboard"}</span>
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 text-center text-xs text-slate-400">
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <button onClick={() => setIsSignUp(false)} className="text-cyan-400 font-bold hover:underline">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Need an operator account?{" "}
              <button onClick={() => setIsSignUp(true)} className="text-cyan-400 font-bold hover:underline">
                Create Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
