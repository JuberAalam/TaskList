import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">

      {/* Animated Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-2xl p-10 w-[400px] text-white"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-center mb-8"
        >
          Welcome Back
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {["email", "password"].map((field, index) => (
            <motion.input
              key={index}
              type={field === "password" ? "password" : "email"}
              placeholder={field === "email" ? "Email" : "Password"}
              required
              className="w-full p-3 rounded-xl bg-white/30 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-white transition"
              onChange={(e) =>
                setForm({ ...form, [field]: e.target.value })
              }
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            />
          ))}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-white text-indigo-600 font-semibold py-3 rounded-xl shadow-lg"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }}
          >
            Login
          </motion.button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6 text-sm"
        >
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold underline hover:text-gray-200"
          >
            Create one
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
