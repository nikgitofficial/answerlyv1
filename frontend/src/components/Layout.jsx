import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import UserFooter from "./UserFooter"; 
import { Box } from "@mui/material";

const Layout = ({ children }) => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const showNavbarRoutes = [
    "/dashboard", "/profile", "/settings","/home","/login","/register",
    "/create-question","/questions","/all-answers","/about",
    "/accessibility","/analytics","/blog","/careers","/community","/contact",
    "/cookie-banner","/cookie-settings","/docs","/faq","/guides",
    "/privacy","/responses","/security","/sitemap","/status","/terms",
    "/publichome","/cookies"
  ];

  const showFooterRoutes = [
    "/dashboard", "/home", "/create-question","/questions","/all-answers",
    "/profile", "/settings","/about","/accessibility","/analytics","/blog",
    "/careers","/community","/contact","/cookie-banner","/cookie-settings",
    "/docs","/faq","/guides","/privacy","/responses","/security",
    "/sitemap","/status","/terms","/publichome","/cookies",
  ];

  const shouldShowNavbar = showNavbarRoutes.includes(location.pathname);
  const shouldShowFooter = showFooterRoutes.includes(location.pathname);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {shouldShowNavbar && <Navbar />}

      {/* Main content will grow to fill space */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      {/* Footer always at bottom */}
      {shouldShowFooter && (user ? <UserFooter /> : <Footer />)}
    </Box>
  );
};

export default Layout;
