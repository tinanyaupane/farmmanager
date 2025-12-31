import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineUser, HiOutlineCheckCircle } from "react-icons/hi2";
import { GiChicken } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const { register, isAuthenticated } = useAuth();
    const { addToast } = useToast();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        farmName: "",
        location: "",
        phone: "",
        agreeToTerms: false,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 1) {
            // Validate passwords match
            if (formData.password !== formData.confirmPassword) {
                addToast("Passwords do not match!", "error");
                return;
            }
            setStep(2);
        } else {
            setIsLoading(true);

            const result = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                farmName: formData.farmName,
                location: formData.location,
            });

            if (result.success) {
                addToast("Registration successful! Welcome to Farm Manager.", "success");
                navigate("/dashboard");
            } else {
                addToast(result.error || "Registration failed. Please try again.", "error");
            }

            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-4 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200 rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 animate-breathe"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200 rounded-full filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2 animate-breathe" style={{ animationDelay: "2s" }}></div>

            {/* Register Card */}
            <div className="relative w-full max-w-md animate-scale-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-200 mb-4 animate-float">
                        <GiChicken className="text-3xl text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 animate-fade-delay-1">
                        Create Your Account
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 animate-fade-delay-2">
                        Start managing your farm in minutes
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8 animate-fade-delay-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${step >= 1 ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}>
                                1
                            </div>
                            <span className="text-sm font-medium text-slate-700">Account</span>
                        </div>
                        <div className={`flex-1 h-1 mx-4 rounded ${step >= 2 ? "bg-emerald-500" : "bg-slate-200"}`}></div>
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${step >= 2 ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}>
                                2
                            </div>
                            <span className="text-sm font-medium text-slate-700">Farm Info</span>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="card-organic p-8 animate-fade-delay-3">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {step === 1 && (
                            <>
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="input-organic pl-12"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="input-organic pl-12"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="input-organic pl-12 pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <HiOutlineEyeSlash className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500">Must be at least 8 characters</p>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="input-organic pl-12 pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showConfirmPassword ? <HiOutlineEyeSlash className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                {/* Farm Name */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Farm Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Arm Farm"
                                        value={formData.farmName}
                                        onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                                        className="input-organic"
                                        required
                                    />
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Central Nepal"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="input-organic"
                                        required
                                    />
                                </div>

                                {/* Terms Checkbox */}
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={formData.agreeToTerms}
                                        onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                                        className="w-4 h-4 mt-1 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                        required
                                    />
                                    <label htmlFor="terms" className="text-sm text-slate-600">
                                        I agree to the{" "}
                                        <Link to="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link to="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>
                            </>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            {step === 2 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 btn-ghost"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 btn-primary py-3 text-sm relative overflow-hidden group disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Creating...</span>
                                    </div>
                                ) : (
                                    <span>{step === 1 ? "Continue" : "Create Account"}</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sign In Link */}
                <p className="text-center mt-6 text-sm text-slate-600 animate-fade-delay-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
