import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "https://ytotaiiqfimhlfllasfk.supabase.co",
  import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0b3RhaWlxZmltaGxmbGxhc2ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjkwNzgsImV4cCI6MjA4OTM0NTA3OH0.cZ_boCDwWciIEa8Ov6AkA3vcYtKH4paFlRzggH5S6X4"
);

export default function AuthCallback() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function handleCallback() {
      try {
        // Get the full URL including fragment
        const hash = window.location.hash;
        
        if (hash && hash.includes("access_token=")) {
          // Parse the fragment data (Supabase implicit flow)
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");
          
          if (accessToken) {
            // Set the session in Supabase client
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || "",
            });
            
            if (sessionError) {
              throw sessionError;
            }
            
            const user = sessionData.user;
            
            if (user) {
              // Get user metadata from Supabase
              const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0];
              
              // Sync with our backend
              try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/dev/auth/sync`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    supabaseUserId: user.id,
                    email: user.email,
                    fullName: fullName,
                    provider: "google",
                  }),
                });
                
                const data = await response.json();
                
                if (data.data?.token && data.data?.user) {
                  // Store in localStorage with our JWT
                  localStorage.setItem("noble_token", data.data.token);
                  localStorage.setItem("noble_user", JSON.stringify(data.data.user));
                } else {
                  // Fallback to Supabase token if backend fails
                  localStorage.setItem("noble_token", accessToken);
                  localStorage.setItem("noble_user", JSON.stringify({
                    id: user.id,
                    email: user.email,
                    fullName: fullName,
                    role: "trader",
                    supabaseUserId: user.id,
                  }));
                }
              } catch (err) {
                console.error("Failed to sync with backend:", err);
                // Still allow login with Supabase token
                localStorage.setItem("noble_token", accessToken);
                localStorage.setItem("noble_user", JSON.stringify({
                  id: user.id,
                  email: user.email,
                  fullName: fullName,
                  role: "trader",
                  supabaseUserId: user.id,
                }));
              }
              
              toast.success("Successfully signed in with Google!");
              
              // Clean URL
              window.history.replaceState({}, document.title, window.location.pathname);
              
              // Redirect to dashboard
              navigate("/dashboard", { replace: true });
              return;
            }
          }
        }
        
        // Check if there's an error in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get("error");
        
        if (error) {
          toast.error(`Authentication failed: ${error}`);
          navigate("/login", { replace: true });
          return;
        }
        
        // No valid data found
        toast.error("Authentication failed. Please try again.");
        navigate("/login", { replace: true });
        
      } catch (error) {
        console.error("Auth callback error:", error);
        toast.error(error.message || "Authentication failed. Please try again.");
        navigate("/login", { replace: true });
      }
    }

    handleCallback();
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070b11",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <ToastContainer position="top-right" theme="dark" />
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "3px solid #1e2f4a",
          borderTopColor: "#c9a84c",
          animation: "spin 1s linear infinite",
        }}
      />
      <p style={{ color: "#7a8fa6", fontSize: "0.9rem" }}>
        Signing you in with Google...
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
