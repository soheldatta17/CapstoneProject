import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CircleAlert as AlertCircle, Loader as Loader2 } from "lucide-react";
import { useAppDispatch } from "@/store/store";
import { loginSuccess } from "@/store/slices/authSlice";
import api from "@/services/api";

const ease = [0.25, 0.1, 0.25, 1] as const;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/signin", {
        workEmail: email,
        password,
      });

      if (response.data.token && response.data.user) {
        dispatch(loginSuccess({ user: response.data.user, token: response.data.token }));
        navigate("/dashboard");
      } else {
        setError(response.data.error || "Login failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease }}
        className="hidden lg:flex lg:w-1/2 bg-foreground text-background p-12 flex-col justify-between relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-2xl tracking-tight">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground text-base font-bold">E</div>
            EventZen
          </Link>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-medium tracking-tight mb-4">Welcome back to EventZen</h1>
          <p className="text-background/70 text-lg leading-relaxed max-w-md">
            The engine for seamless event management. Sign in to access your dashboard.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-4 opacity-60">
          <div className="h-2 bg-primary rounded-full" />
          <div className="h-2 bg-background/30 rounded-full" />
          <div className="h-2 bg-background/30 rounded-full" />
        </div>
      </motion.div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-sm font-bold">E</div>
              EventZen
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-medium tracking-tight text-foreground mb-2">Sign in to your account</h2>
            <p className="text-muted-foreground">Enter your credentials to access your dashboard</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} className="h-11" />
            </div>
            <Button type="submit" className="w-full h-11 text-base font-medium" disabled={loading}>
              {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>) : "Sign in"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-medium hover:underline">Get started</Link>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-center text-xs text-muted-foreground">
              By signing in, you agree to our{" "}
              <a href="#" className="text-foreground hover:underline">Terms of Service</a> and{" "}
              <a href="#" className="text-foreground hover:underline">Privacy Policy</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
