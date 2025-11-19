import React, { useEffect } from 'react';
import Class from "./product/Classes.jsx";
import { useGetProductsQuery, useGetResultQuery } from "../../redux/api/productsApi.js";
import Custompagination from './customPagination.jsx';
import toast from "react-hot-toast";
import Loader from "../layouts/loader.jsx";
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Filters from "./Filters.jsx";
import { useSelector } from 'react-redux';
import { setIsAuthenticated } from "../../redux/features/userSlice";
import Sidebar from './SideBar.jsx';
import { useMyClassesQuery } from '../../redux/api/orderApi.js';
import { useGetMeQuery } from '../../redux/api/userApi.js';
import { motion } from "framer-motion";

const Home = () => {

  const { user, loading } = useSelector((state) => state.auth);
  const { data } = useGetMeQuery();
  const location = useLocation();
  const cgpaPercentage = (user.dashboard.academic_standings.cgpa / 4.0) * 100;

  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const keyword = searchParams.get("keyword") || "";
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const category = searchParams.get("category");
  const ratings = searchParams.get("ratings");

  const params = { page, keyword };
  const navigate = useNavigate();

  if (min !== null) params.min = min;
  if (max !== null) params.max = max;
  if (category !== null) params.category = category;
  if (ratings !== null) params.ratings = ratings;

  const { dataa, isLoading, error, isError } = useMyClassesQuery();

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]);

  if (loading) return <Loader />;
  if (isLoading) return <Loader />;

  const columnSize = keyword ? 4 : 3;
  const classes = data?.classes;

  return (
    <>

      {/* ====================== */}
      {/* YOUR STUDENT DASHBOARD */}
      {/* ====================== */}

      <div className="">
        <h2 className='headings'>🏠 Dashboard</h2>
        <hr />

        <div className="containeer">

          {/* Student Info Card */}
          <div className="carrd">
            <h2 className='headings'>🎓 Student Info</h2>
            <p className='writing'><strong>ID:</strong> {user.student_info.student_id}</p>
            <p className='writing'><strong>Name:</strong> {user.student_info.name}</p>
            <p className='writing'><strong>Campus:</strong> {user.student_info.campus}</p>
            <p className='writing'><strong>Status:</strong> {user.student_info.status}</p>
          </div>

          {/* CGPA Progress Card */}
          <div className="carrd">
            <h2 className='headings'>📊 CGPA</h2>
            <div className="progress-circle">
              <div className="progress-fill" style={{ "--progress": cgpaPercentage + "%" }}></div>
              <div className="progress-text">{user.dashboard.academic_standings.cgpa}</div>
            </div>
          </div>

          {/* Schedule */}
          <div className="carrd">
            <h2 className='headings'>🕒 Class Schedule</h2>
            {user.dashboard.today_classes.map((cls, index) => (
              <div key={index} className="class-card">
                <p className="class-title"><strong>{cls.subject}</strong></p>
                <p className="class-time">{cls.start_time} - {cls.end_time}</p>
              </div>
            ))}
          </div>

        </div>

        <hr />
      </div>


      {/* ============================ */}
      {/* PROMPTSHIELD DASHBOARD SECTION */}
      {/* ============================ */}

      <div className="min-h-screen bg-gradient-to-b from-[#03071e] to-[#001219] text-white flex mt-10 rounded-xl overflow-hidden">

        {/* Sidebar */}
        <aside className="w-64 bg-[#001524] border-r border-cyan-800 p-6 hidden md:block">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-8">
            PromptShield
          </h1>

          <nav className="space-y-4 text-gray-300">
            <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-[#002030] transition">Dashboard</button>
            <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-[#002030] transition">Logs</button>
            <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-[#002030] transition">Classifier</button>
            <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-[#002030] transition">Settings</button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">

          {/* Header */}
          <header className="flex justify-between items-center mb-10">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-semibold text-cyan-300"
            >
              Dashboard Overview
            </motion.h2>

            <div className="flex items-center gap-4 text-gray-300">
              <button className="px-4 py-2 bg-[#002b36] rounded-lg hover:bg-[#003544] transition">
                Profile
              </button>
            </div>
          </header>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { title: "Total Prompts Scanned", value: "0" },
              { title: "Safe Prompts", value: "0" },
              { title: "Unsafe Prompts", value: "0" },
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-[#002030] p-6 rounded-2xl border border-cyan-800 shadow-lg"
              >
                <h3 className="text-lg text-cyan-400 mb-2">{card.title}</h3>
                <p className="text-3xl font-bold text-white">{card.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Logs */}
          <section>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-semibold text-cyan-300 mb-4"
            >
              Recent Prompt Activity
            </motion.h3>

            <div className="bg-[#001524] p-6 rounded-xl border border-cyan-900">
              <p className="text-gray-400">
                No logs available. This area will display recent prompts once functionality is added.
              </p>
            </div>
          </section>

        </main>
      </div>

    </>
  );
};

export default Home;
