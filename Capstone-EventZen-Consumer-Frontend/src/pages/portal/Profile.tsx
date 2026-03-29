import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { logout, updateUser } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import PortalLayout from "@/components/portal/PortalLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, User, Zap, LogOut, ShieldCheck, Calendar as CalendarIcon } from "lucide-react";
import { BASE_URL } from "@/services/api";
import api from "@/services/api";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!user) return null;

  const initials = user.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const avatarSrc = user.avatar
    ? user.avatar.startsWith("http") ? user.avatar : `${BASE_URL}/uploads/${user.avatar}`
    : null;

  const handleUpgrade = async () => {
    const userId = user.id || user._id;
    try {
      const response = await api.post("/auth/upgrade", { userId });
      if (response.data.user) {
        dispatch(updateUser({ ...user, ...response.data.user }));
        toast.success("Congratulations! You are now an Organizer.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Upgrade failed");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <PortalLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">My Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="text-destructive border-destructive/20 hover:bg-destructive/5 gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Basic Info */}
          <Card className="lg:col-span-1 border-border/60">
            <CardContent className="pt-8 flex flex-col items-center text-center">
              <Avatar className="w-32 h-32 border-4 border-primary/10 shadow-lg">
                <AvatarImage src={avatarSrc || ""} alt={user.fullName} className="object-cover" />
                <AvatarFallback className="bg-primary/5 text-primary text-4xl font-bold">{initials}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold mt-6 text-foreground">{user.fullName}</h2>
              <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary border-primary/20 uppercase tracking-wider text-[10px] font-bold px-2.5 py-0.5">
                <ShieldCheck className="w-3 h-3 mr-1" /> {user.role}
              </Badge>
              
              <div className="w-full border-t border-border/60 mt-8 pt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground px-2">
                  <Mail className="w-4 h-4 text-primary/60" />
                  <span className="truncate">{user.workEmail || user.email}</span>
                </div>
                {user.mobileNumber && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground px-2">
                    <Phone className="w-4 h-4 text-primary/60" />
                    <span>{user.mobileNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-muted-foreground px-2">
                  <CalendarIcon className="w-4 h-4 text-primary/60" />
                  <span>Joined March 2026</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Account Actions & Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-lg">Account Actions</CardTitle>
                <CardDescription>Upgrade your account or manage your subscription</CardDescription>
              </CardHeader>
              <CardContent>
                {user.role === "consumer" ? (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <Zap className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Become an Organizer</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Start creating and managing your own events. Reach thousands of potential attendees.
                        </p>
                        <Button onClick={handleUpgrade} className="mt-4 gap-2">
                          Upgrade Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center shrink-0">
                        <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Organizer Account Active</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          You have full access to the Admin Portal to create and manage events.
                        </p>
                        <Button variant="outline" className="mt-4 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30" onClick={() => window.open(import.meta.env.VITE_ADMIN_URL || "http://localhost:3000", "_blank")}>
                          Go to Admin Portal
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/60 opacity-60">
              <CardHeader>
                <CardTitle className="text-lg">Preferences</CardTitle>
                <CardDescription>Notification and privacy settings (Coming Soon)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Profile;
