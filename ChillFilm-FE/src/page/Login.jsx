import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // To redirect after successful login

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for empty fields
    if (!username || !password) {
      toast("error", "Vui lòng nhập đủ thông tin");
      return;
    }

    try {
      
      const response = await axios.post("http://localhost:3000/v1/auth/login", {
        username,
        password,
      });
      console.log(response);
      
      if (response.status) {
        // Show success message
        toast("success", "Đăng nhập thành công.");
        navigate("/home");
      }
    } catch (error) {
      // Handle any errors during the API call
      toast("error", "Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };
  return (
    <div className="bg-cover bg-center h-screen bg-login">
      <div className="flex justify-center items-center h-full">
        <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-lg w-full sm:w-96">
          <Link to="/movie" className="flex justify-center items-center mb-8">
            <h4 className="text-xl font-semibold ml-4">Đăng nhập ChillFilm</h4>
          </Link>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input
              type="username"
              name="username"
              value={username}
              placeholder="Nhập tên người dùng..."
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Nhập mật khẩu..."
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              Đăng nhập
            </button>
          </form>
          <p className="text-center text-sm mt-4">
            Bạn chưa có tài khoản?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Đăng kí ngay bây giờ
            </Link>
          </p>
          <p className="text-center text-sm mt-2">
            <button className="text-blue-600 hover:underline">
              Quên mật khẩu?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
