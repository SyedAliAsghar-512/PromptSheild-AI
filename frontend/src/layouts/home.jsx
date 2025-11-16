import React, { useEffect, useRef } from 'react';
import Class from "./product/Classes.jsx"
import { useGetProductsQuery, useGetResultQuery } from "../../redux/api/productsApi.js";
import Custompagination from './customPagination.jsx';
import toast from "react-hot-toast"
import Loader from "../layouts/loader.jsx"
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Filters from "./Filters.jsx"
import { useSelector } from 'react-redux';
import { setIsAuthenticated } from "../../redux/features/userSlice";
import Sidebar from './SideBar.jsx';
import { useMyClassesQuery } from '../../redux/api/orderApi.js';
import { useGetMeQuery } from '../../redux/api/userApi.js';

const Home = () => {

  const {user, loading} = useSelector((state) => state.auth)
  const {data} = useGetMeQuery()
  const location = useLocation();
  const cgpaPercentage = (user.dashboard.academic_standings.cgpa / 4.0) * 100;

  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const keyword = searchParams.get("keyword") || "";
  const min = searchParams.get("min")
  const max = searchParams.get("max")
  const category = searchParams.get("category")
  const ratings = searchParams.get("ratings")

  const params = {page, keyword};
  const navigate = useNavigate()

  min !== null && (params.min = min)
  max !== null && (params.max = max)
  category !== null && (params.category = category)
  ratings !== null && (params.ratings = ratings)

  const {dataa, isLoading, error, isError} = useMyClassesQuery()

  



  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message)
    }
  }, [isError])

  if (loading) return <Loader />
  if (isLoading) return <Loader />

  const columnSize = keyword ? 4 : 3
  
   const classes = (data?.classes)

    return (
  <>
<div className="">
<h2 className='headings'>🏠 Dashboard</h2>
 <hr></hr>

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


    <div className="carrd">
    <h2 className='headings'>🕒 Class Schedule</h2>
        {user.dashboard.today_classes.map((cls, index) => (
          <div key={index} className="class-card">
            <p className="class-title"><strong>{cls.subject}</strong></p>
            <p className="class-time">
              {cls.start_time} - {cls.end_time}
            </p>
          </div>
        ))}
    </div>
    </div>
    <hr></hr>

    </div>
    
</>
    )
}

export default Home