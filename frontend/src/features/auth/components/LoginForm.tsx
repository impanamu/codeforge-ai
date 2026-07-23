import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { login } from "../services/auth.service";

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await login(email, password);

      localStorage.setItem(
        "access_token",
        response.access_token
      );

      toast.success("Welcome back!");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Email */}

        <div>
          <Label className="mb-2 block text-slate-300">
            Email Address
          </Label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <Input
              type="email"
              placeholder="abc@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11"
              required
            />
          </div>
        </div>

        {/* Password */}

        <div>
          <Label className="mb-2 block text-slate-300">
            Password
          </Label>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="pl-11 pr-11"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me + Forgot Password */}

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) =>
                setRememberMe(e.target.checked)
              }
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 accent-cyan-500"
            />

            Remember me
          </label>

          <button
            type="button"
            className="text-cyan-400 transition hover:text-cyan-300"
          >
            Forgot Password?
          </button>
        </div>

        {/* Sign In */}

        <Button
          type="submit"
          disabled={loading}
          className="
            h-12
            w-full
            rounded-xl
            bg-gradient-to-r
            from-cyan-500
            via-blue-500
            to-indigo-600
            text-base
            font-semibold
            text-white
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:shadow-xl
            hover:shadow-cyan-500/30
            active:scale-95
            disabled:opacity-70
          "
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        {/* Divider */}

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-700" />

          <span className="text-xs uppercase tracking-[0.35em] text-slate-500">
            OR
          </span>

          <div className="h-px flex-1 bg-slate-700" />
        </div>

        {/* Google Button */}

        <Button
          type="button"
          variant="outline"
          className="
            h-12
            w-full
            rounded-xl
            border-slate-700
            bg-slate-900/60
            text-white
            transition-all
            duration-300
            hover:border-cyan-500
            hover:bg-slate-800
            hover:text-white
          "
        >
          <FcGoogle className="mr-3 text-xl" />

          Continue with Google
        </Button>
      </form>

      {/* Footer */}

      <div className="mt-8 text-center text-sm text-slate-400">
        Don't have an account?{" "}
        <button
          type="button"
          className="font-semibold text-cyan-400 transition hover:text-cyan-300"
        >
          Create Account
        </button>
      </div>
    </>
  );
}