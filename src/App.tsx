import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<div>WITH AUTH PROVIDER - CHECK FOR LOOPS</div>}
          />
          <Route path="/login" element={<div>LOGIN PAGE</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
