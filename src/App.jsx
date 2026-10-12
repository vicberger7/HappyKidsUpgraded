// App.jsx

import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabase/supabaseClient";
import Sidebar from "./components/Sidebar";
import MobileHeader from "./components/MobileHeader";
import css from "./App.module.css";

import Home from "./pages/Home";
import About from "./pages/AboutUs";
import Services from "./pages/Services";
import FoodMenu from "./pages/FoodMenu";
import Gallery from "./pages/Gallery";
import Career from "./pages/Career";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import AdminDashboard from "./pages/AdminDashboard";
import ResetPassword from "./components/ResetPassword";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted) {
        setSession(session);
        setLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/adminLogin" replace />;
  }

  return children;
}
function App() {
  return (
    <div className={css.app}>
      <MobileHeader />
      <Sidebar />

      <div className={css.content}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/food-menu" element={<FoodMenu />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/career" element={<Career />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
