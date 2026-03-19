import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";

const CURRENT_USER_KEY = "mindbridge-current-user";

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const rawUser = localStorage.getItem(CURRENT_USER_KEY);
    if (!rawUser) {
      navigate("/auth", { replace: true });
      return;
    }

    try {
      const parsed = JSON.parse(rawUser) as { id?: number; email?: string };
      if (!parsed?.id || !parsed?.email) {
        navigate("/auth", { replace: true });
      }
    } catch {
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.dispatchEvent(new Event("current-user-changed"));
    navigate("/auth");
  };

  return (
    <PageWrapper>
      <div className="min-h-[70vh] px-5 py-6 flex items-center justify-center">
        <div className="w-full max-w-xs flex flex-col gap-4">
          <Button asChild className="h-12 rounded-xl text-sm font-semibold">
            <Link to="/journal-entries">View Journal Entries</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            className="h-12 rounded-xl text-sm font-semibold border-accent text-accent hover:bg-accent/10 hover:text-accent"
          >
            Log Out
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Profile;