import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CircleAlert as AlertCircle, Loader as Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch } from "@/store/store";
import { loginSuccess } from "@/store/slices/authSlice";
import api from "@/services/api";

const ease = [0.25, 0.1, 0.25, 1] as const;

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const autoFillCard = () => {
    setCardNumber(`4562 1122 4594 ${Math.floor(1000 + Math.random() * 9000)}`);
    setCardExpiry("11/28");
    setCardCvc("999");
    setNameOnCard(fullName || "EventZen User");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError("Please agree to the Terms and Conditions");
      return;
    }
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("workEmail", email);
    formData.append("mobileNumber", mobileNumber);
    formData.append("password", password);
    formData.append("agreedToTerms", "true");
    if (avatar) {
      formData.append("avatar", avatar);
    }

    // Billing details logic from legacy signup
    if (cardNumber) {
      const billingDetails = {
        cardNumber,
        cardExpiry,
        cardCvc,
        nameOnCard: nameOnCard || fullName,
      };
      formData.append("billingDetails", JSON.stringify(billingDetails));
    }

    try {
      const response = await api.post("/auth/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        // Legacy behavior: Redirect to signin after registration
        navigate("/login");
      } else {
        setError(response.data.error || "Registration failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
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
          <h1 className="text-4xl font-medium tracking-tight mb-4">Start managing events effortlessly</h1>
          <p className="text-background/70 text-lg leading-relaxed max-w-md">
            Create your free account and experience the power of seamless event coordination.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-4 opacity-60">
          <div className="h-2 bg-primary rounded-full" />
          <div className="h-2 bg-primary rounded-full" />
          <div className="h-2 bg-background/30 rounded-full" />
        </div>
      </motion.div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="w-full max-w-md my-8"
        >
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-sm font-bold">E</div>
              EventZen
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-medium tracking-tight text-foreground mb-2">Create your account</h2>
            <p className="text-muted-foreground">Get started with EventZen in seconds</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={loading} className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} className="h-11" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input id="mobileNumber" type="text" placeholder="+91 9876543210" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required disabled={loading} className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} className="h-11" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar Image</Label>
              <Input id="avatar" type="file" accept="image/*" onChange={handleFileChange} disabled={loading} className="h-11 pt-2" />
            </div>

            <div className="pt-4 border-t border-border mt-4">
              <h3 className="text-sm font-semibold mb-4 text-foreground">Billing Information (Optional)</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" type="text" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} disabled={loading} className="h-11" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardExpiry">Expiry (MM/YY)</Label>
                    <Input id="cardExpiry" type="text" placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} disabled={loading} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardCvc">CVC</Label>
                    <Input id="cardCvc" type="password" placeholder="123" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} disabled={loading} className="h-11" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameOnCard">Name on Card</Label>
                  <Input id="nameOnCard" type="text" placeholder="John Doe" value={nameOnCard} onChange={(e) => setNameOnCard(e.target.value)} disabled={loading} className="h-11" />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={autoFillCard} disabled={loading} className="w-full mt-2 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10">
                  Auto-Fill Testing Card
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2 my-4">
              <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} />
              <Label htmlFor="terms" className="text-sm font-normal leading-none cursor-pointer">
                I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a>
              </Label>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-medium mt-6" disabled={loading}>
              {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</>) : "Create account"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-center text-xs text-muted-foreground">
              By signing up, you agree to our{" "}
              <a href="#" className="text-foreground hover:underline">Terms of Service</a> and{" "}
              <a href="#" className="text-foreground hover:underline">Privacy Policy</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
