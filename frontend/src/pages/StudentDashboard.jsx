import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  BookOpenIcon,
  AwardIcon,
  AlertCircleIcon,
  Loader2Icon,
  LogOutIcon,
  UserIcon,
  FileTextIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getUserIdFromStorage } from "../utils/tokenUtils.js";
import api from "../api.js";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const userRole = localStorage.getItem("role");

        // Verify this is a student
        if (userRole !== "student") {
          navigate("/dashboard");
          return;
        }

        // Get userId with multiple fallbacks
        const userId = getUserIdFromStorage();

        if (!userId) {
          setError("User ID not found. Please login again.");
          console.error("Failed to extract userId from storage or token");
          return;
        }

        // Fetch student data by userId
        const { data } = await api.get(`/students/user/${userId}`);

        if (data.success) {
          setStudentData(data.student);
        } else {
          setError(data.message || "Failed to fetch student data");
        }
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load student data. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [navigate]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2Icon
            size={48}
            className="animate-spin mx-auto mb-4 text-blue-600"
          />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-8 rounded-lg max-w-md">
          <AlertCircleIcon size={48} className="mx-auto mb-4 text-red-600" />
          <p className="text-red-800 font-semibold mb-4">{error}</p>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No student data found</p>
      </div>
    );
  }

  const batchInfo = studentData.batch || {};
  const userName = studentData.userId?.name || studentData.name || "Student";
  const enrollmentDate = formatDate(studentData.enrollmentDate);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Banner */}
      <div className="mb-8 p-8 bg-gradient-to-r from-blue-700 to-indigo-900 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <AwardIcon size={120} />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-blue-100 max-w-xl">
            You are enrolled in <strong>{batchInfo.name || "N/A"}</strong>{" "}
            batch. Your class teacher is{" "}
            <strong>{batchInfo.classTeacher || "N/A"}</strong>.
          </p>
        </div>
      </div>

      {/* Student Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Batch Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <BookOpenIcon size={24} className="text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium mb-1">Your Batch</p>
          <p className="text-2xl font-bold text-gray-900">
            {batchInfo.name || "N/A"}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Batch ID: {batchInfo._id || "N/A"}
          </p>
        </div>

        {/* Teacher Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <UserIcon size={24} className="text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium mb-1">
            Class Teacher
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {batchInfo.classTeacher || "N/A"}
          </p>
          <p className="text-xs text-gray-500 mt-2">Lead Instructor</p>
        </div>

        {/* Enrollment Date Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <CalendarIcon size={24} className="text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium mb-1">
            Enrollment Date
          </p>
          <p className="text-lg font-bold text-gray-900">{enrollmentDate}</p>
          <p className="text-xs text-gray-500 mt-2">Joined on</p>
        </div>

        {/* Course Fee Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <FileTextIcon size={24} className="text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium mb-1">Course Fee</p>
          <p className="text-2xl font-bold text-gray-900">
            ₹{(studentData.totalCourseFee || 0).toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-gray-500 mt-2">Total</p>
        </div>
      </div>

      {/* Student Details Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Full Name</p>
            <p className="text-lg font-semibold text-gray-900">
              {studentData.name}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">
              Email Address
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {studentData.email}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Age</p>
            <p className="text-lg font-semibold text-gray-900">
              {studentData.age || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">
              Parent/Guardian Phone
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {studentData.parentPhone || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Fee Payment Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Fee Payment Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
            <p className="text-green-700 text-sm font-medium mb-2">
              Amount Paid
            </p>
            <p className="text-3xl font-bold text-green-900">
              ₹{(studentData.paidAmount || 0).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
            <p className="text-orange-700 text-sm font-medium mb-2">
              Total Dues
            </p>
            <p className="text-3xl font-bold text-orange-900">
              ₹{(studentData.totalDues || 0).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
            <p className="text-blue-700 text-sm font-medium mb-2">Status</p>
            <p className="text-3xl font-bold text-blue-900">
              {studentData.status || "Active"}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={() => navigate("/attendance")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          View Attendance
        </button>
        <button
          onClick={() => navigate("/results")}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          View Exam Results
        </button>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="ml-auto px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <LogOutIcon size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
