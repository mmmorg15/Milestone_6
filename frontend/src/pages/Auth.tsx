import { useState } from "react";
import { ArrowLeft, User } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
const CURRENT_USER_KEY = "mindbridge-current-user";

const Auth = () => {
  const { toast } = useToast();
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [emailTips, setEmailTips] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupForm.email || !signupForm.password) {
      toast({
        title: "Looks like something is missing",
        description: "Please fill in your email and password to continue.",
        variant: "destructive",
      });
      return;
    }

    if (signupForm.password !== signupForm.confirm) {
      toast({
        title: "Passwords do not match",
        description: "Please double-check and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSigningUp(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupForm.name.trim() || null,
          email: signupForm.email.trim().toLowerCase(),
          password: signupForm.password,
          emailTips,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast({
          title: "Sign up failed",
          description: data.message || "Unable to create account.",
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
      window.dispatchEvent(new Event("current-user-changed"));

      toast({
        title: "Welcome",
        description: "Your account has been created and saved.",
      });

      setLoginForm({ email: signupForm.email.trim(), password: signupForm.password });
      setSignupForm({ name: "", email: "", password: "", confirm: "" });
      setEmailTips(false);
    } catch {
      toast({
        title: "Server unavailable",
        description: "Could not reach the backend server.",
        variant: "destructive",
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "Looks like something is missing",
        description: "Please fill in your email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoggingIn(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginForm.email.trim().toLowerCase(),
          password: loginForm.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast({
          title: "Login failed",
          description: data.message || "Invalid login credentials.",
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
      window.dispatchEvent(new Event("current-user-changed"));

      const displayName = data?.user?.name || "there";
      toast({
        title: "Welcome back",
        description: `Good to see you again, ${displayName}.`,
      });
    } catch {
      toast({
        title: "Server unavailable",
        description: "Could not reach the backend server.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <PageWrapper>
      <div className="px-5 py-6 pb-32">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 min-h-[44px]"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <User className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Your space, your pace</h1>
          <p className="text-sm text-muted-foreground mt-1">Your information stays private.</p>
        </motion.div>

        <Tabs defaultValue="signup" className="w-full">
          <TabsList className="w-full grid grid-cols-2 rounded-xl bg-muted h-11">
            <TabsTrigger value="signup" className="rounded-lg text-sm">
              Sign Up
            </TabsTrigger>
            <TabsTrigger value="login" className="rounded-lg text-sm">
              Log In
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signup" className="mt-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Display Name (optional)</label>
                <Input
                  placeholder="How should we greet you?"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                  className="h-11 rounded-xl border-border"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  className="h-11 rounded-xl border-border"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</label>
                <Input
                  type="password"
                  placeholder="Create a password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  className="h-11 rounded-xl border-border"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  value={signupForm.confirm}
                  onChange={(e) => setSignupForm({ ...signupForm, confirm: e.target.value })}
                  className="h-11 rounded-xl border-border"
                />
              </div>
              <div className="flex items-center gap-2 py-1">
                <Checkbox
                  id="tips"
                  checked={emailTips}
                  onCheckedChange={(v) => setEmailTips(v === true)}
                  className="rounded"
                />
                <label htmlFor="tips" className="text-xs text-muted-foreground cursor-pointer">
                  Send me supportive tips via email
                </label>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl text-sm font-semibold" disabled={isSigningUp}>
                {isSigningUp ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="login" className="mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="h-11 rounded-xl border-border"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</label>
                <Input
                  type="password"
                  placeholder="Your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="h-11 rounded-xl border-border"
                />
              </div>
              <button type="button" className="text-xs text-primary hover:underline">
                Forgot password?
              </button>
              <Button type="submit" className="w-full h-12 rounded-xl text-sm font-semibold" disabled={isLoggingIn}>
                {isLoggingIn ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Continue as guest -&gt;
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Auth;

