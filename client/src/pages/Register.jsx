import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-2xl p-10 w-[400px] text-white"
      >
        <h2 className="text-3xl font-bold text-center mb-8">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {["name", "email", "password"].map((field, index) => (
            <motion.input
              key={index}
              type={field === "password" ? "password" : "text"}
              placeholder={
                field === "name"
                  ? "Full Name"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              required
              value={form[field]}
              onChange={(e) =>
                setForm({ ...form, [field]: e.target.value })
              }
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-full p-3 rounded-xl bg-white/30 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-white transition"
            />
          ))}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-white text-purple-600 font-semibold py-3 rounded-xl hover:bg-gray-100 transition duration-300 shadow-lg"
          >
            Register
          </motion.button>
        </form>

        <p className="text-center mt-6 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold underline hover:text-gray-200"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
