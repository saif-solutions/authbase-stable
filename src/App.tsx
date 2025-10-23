import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>MINIMAL APP - NO LOOPS</div>} />
        <Route path="/login" element={<div>LOGIN PAGE</div>} />
        <Route path="/dashboard" element={<div>DASHBOARD</div>} />
      </Routes>
    </Router>
  );
}

export default App;
