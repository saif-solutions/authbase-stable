import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Users } from "./pages/Users";
import { Sessions } from "./pages/Sessions";
import Analytics from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./pages/PaymentSuccess";
import { Toaster } from "@/components/ui/Toaster";
import { EmailVerification } from "./pages/EmailVerification";
import CustomerPortal from "./pages/CustomerPortal";
import AdminProducts from "./pages/AdminProducts";
import { OAuthSuccess } from "./pages/OAuthSuccess";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route
              path="/"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/users"
              element={
                <Layout>
                  <Users />
                </Layout>
              }
            />
            <Route
              path="/sessions"
              element={
                <Layout>
                  <Sessions />
                </Layout>
              }
            />
            <Route
              path="/analytics"
              element={
                <Layout>
                  <Analytics />
                </Layout>
              }
            />
            <Route
              path="/settings"
              element={
                <Layout>
                  <Settings />
                </Layout>
              }
            />
            <Route
              path="/admin-products"
              element={
                <Layout>
                  <AdminProducts />
                </Layout>
              }
            />
            <Route
              path="/customer-portal"
              element={
                <Layout>
                  <CustomerPortal />
                </Layout>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
