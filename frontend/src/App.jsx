  import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
  import { useContext } from "react";
  import { AuthContext } from "./context/AuthContext";

  // ✅ Auth pages
  import Login from "./pages/Login";
  import Register from "./pages/Register";

  // ✅ Protected app pages
  import Dashboard from "./pages/Dashboard";
  import Home from "./pages/Home";
  import QuestionCreator from "./pages/QuestionCreator";
  import AllAnswers from "./pages/AllAnswers";

  // ✅ Public pages
  import PublicQuestion from "./pages/PublicQuestion";
  import About from "./pages/About";
  import Accessibility from "./pages/Accessibility";
  import Analytics from "./pages/Analytics";
  import Blog from "./pages/Blog";
  import Careers from "./pages/Careers";
  import Community from "./pages/Community";
  import Contact from "./pages/Contact";
  import CookieBanner from "./pages/CookieBanner";
  import CookieSettings from "./pages/CookieSettings";
  import Docs from "./pages/Docs";
  import FAQ from "./pages/FAQ";
  import Guides from "./pages/Guides";
  import PublicHome from "./pages/PublicHome";
  import Privacy from "./pages/Privacy";
  import Responses from "./pages/Responses";
  import Security from "./pages/Security";
  import SettingsPage from "./pages/Settings";   
  import Status from "./pages/Status";
  import Sitemap from "./pages/Sitemap";  
  import Terms from "./pages/Terms";
  import QuestionSetView from "./components/QuestionSetView";
  import AdminPage from "./pages/AdminPage";
  import Profile from "./pages/Profile";
  import Support from "./pages/Support";
  import ForgotPassword from "./pages/ForgotPassword";
  import UserFileUploader from "./pages/UserFileUploader";  
  import Preview from "./pages/Preview"; 

  // ✅ Layout
  import Layout from "./components/Layout";  
  import { Settings as SettingsIcon } from "@mui/icons-material"; 

  // ✅ ProtectedRoute wrapper
  const ProtectedRoute = ({ user, children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  // ✅ AdminRoute wrapper
  const AdminRoute = ({ user, children }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== "admin") return <Navigate to="/dashboard" replace />; // ✅ block non-admins
    return children;
  };

  const App = () => {
    const { user } = useContext(AuthContext);

    return (
      <BrowserRouter>
        <Routes>
          {/* Default redirect with role check */}
          <Route
            path="/"
            element={
              user
                ? user.role === "admin"
                  ? <Navigate to="/admin" />
                  : <Navigate to="/dashboard" />
                : <Navigate to="/login" />
            }
          />

          {/* Auth routes with role check */}
          <Route
            path="/login"
            element={
              <Layout>
                {!user
                  ? <Login />
                  : user.role === "admin"
                    ? <Navigate to="/admin" />
                    : <Navigate to="/dashboard" />}
              </Layout>
            }
          />

          <Route
            path="/register"
            element={
              <Layout>
                {!user
                  ? <Register />
                  : user.role === "admin"
                    ? <Navigate to="/admin" />
                    : <Navigate to="/dashboard" />}
              </Layout>
            }
          />

          {/* Public question link */}
          <Route path="/q/:slug" element={<PublicQuestion />} />
          <Route path="/set/:slug" element={<QuestionSetView />} />  {/* ✅ Updated from :id to :slug */}

          {/* Public pages with Layout */}
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/accessibility" element={<Layout><Accessibility /></Layout>} />
          <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/careers" element={<Layout><Careers /></Layout>} />
          <Route path="/community" element={<Layout><Community /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/cookie-banner" element={<Layout><CookieBanner /></Layout>} />
          <Route path="/cookies" element={<Layout><CookieSettings /></Layout>} />
          <Route path="/docs" element={<Layout><Docs /></Layout>} />
          <Route path="/faq" element={<Layout><FAQ /></Layout>} />
          <Route path="/guides" element={<Layout><Guides /></Layout>} />
          <Route path="/publichome" element={<Layout><PublicHome /></Layout>} />
          <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
          <Route path="/responses" element={<Layout><Responses /></Layout>} />
          <Route path="/security" element={<Layout><Security /></Layout>} />
          <Route path="/sitemap" element={<Layout><Sitemap /></Layout>} />
          <Route path="/status" element={<Layout><Status /></Layout>} />
          <Route path="/terms" element={<Layout><Terms /></Layout>} />
          <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />

          {/* Protected routes with Layout */}
          <Route path="/all-answers/:slug" element={<Layout><ProtectedRoute user={user}><AllAnswers /></ProtectedRoute></Layout>} />
          <Route path="/dashboard" element={<Layout><ProtectedRoute user={user}><Dashboard /></ProtectedRoute></Layout>} />
          <Route path="/home" element={<Layout><ProtectedRoute user={user}><Home /></ProtectedRoute></Layout>} />
          <Route path="/create-question" element={<Layout><ProtectedRoute user={user}><QuestionCreator /></ProtectedRoute></Layout>} />
          <Route path="/profile" element={ <Layout> <ProtectedRoute user={user}>  <Profile /> </ProtectedRoute> </Layout>} />
          <Route path="/settings" element={ <Layout> <ProtectedRoute user={user}>  <SettingsPage /> </ProtectedRoute> </Layout>} />
          <Route path="/support" element={ <Layout> <ProtectedRoute user={user}>  <Support /> </ProtectedRoute> </Layout>} />
          <Route path="/user-file" element={ <Layout> <ProtectedRoute user={user}>  <UserFileUploader /> </ProtectedRoute> </Layout>} />
          <Route path="/preview/:id" element={ <Layout> <ProtectedRoute user={user}>  <Preview /> </ProtectedRoute> </Layout>} />
          {/* Admin route */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute user={user}>
                <AdminRoute user={user}>
                  <AdminPage />
                </AdminRoute>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    );
  };

  export default App;
