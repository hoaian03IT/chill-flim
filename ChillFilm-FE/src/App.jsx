import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import Login from "./page/Login";
import Payment from "./page/Payment";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/payment/:filmId" element={<Payment />} />
        </Routes>
    );
}

export default App;
