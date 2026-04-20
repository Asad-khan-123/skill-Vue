import { useState, useEffect } from "react";
import {
  PlusIcon,
  SaveIcon,
  Loader2Icon,
  XIcon,
  TrophyIcon,
  BookOpenIcon,
  BarChart2Icon,
  CheckCircleIcon,
  AlertCircleIcon,
  CalendarIcon,
  ClockIcon,
} from "lucide-react";
import api from "../api.js";
import { getUserIdFromStorage } from "../utils/tokenUtils.js";

// ─────────────────────────────────────────────
// Shared helper: grade from percentage
// ─────────────────────────────────────────────
const getGrade = (percentage) => {
  if (percentage === null || percentage === undefined) return "-";
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "F";
};

const gradeColor = (grade) => {
  const map = {
    "A+": "bg-emerald-100 text-emerald-700",
    A: "bg-green-100 text-green-700",
    "B+": "bg-teal-100 text-teal-700",
    B: "bg-blue-100 text-blue-700",
    C: "bg-yellow-100 text-yellow-700",
    D: "bg-orange-100 text-orange-700",
    F: "bg-red-100 text-red-700",
    "-": "bg-gray-100 text-gray-500",
  };
  return map[grade] || "bg-gray-100 text-gray-500";
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ─────────────────────────────────────────────
// STUDENT VIEW
// ─────────────────────────────────────────────
const StudentResultsView = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const userId = getUserIdFromStorage();
        if (!userId) {
          setError("User session not found. Please login again.");
          return;
        }

        // Step 1: get the student record to find student._id
        const studentRes = await api.get(`/students/user/${userId}`);
        if (!studentRes.data.success) {
          setError("Could not load your student profile.");
          return;
        }
        const sid = studentRes.data.student._id;
        setStudentId(sid);

        // Step 2: fetch all exam results for this student
        const { data } = await api.get(`/exams/student-results?studentId=${sid}`);
        if (data.success) {
          setResults(data.results);
        } else {
          setError(data.message || "Failed to load results.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load results. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2Icon size={40} className="animate-spin mx-auto mb-3 text-blue-600" />
          <p className="text-gray-500 text-sm">Loading your results…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center bg-red-50 p-8 rounded-2xl max-w-sm">
          <AlertCircleIcon size={40} className="mx-auto mb-3 text-red-500" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  // ── Stats ──────────────────────────────────
  const totalExams = results.length;
  const withMarks = results.filter((r) => r.marksObtained !== null);
  const avgPercent =
    withMarks.length > 0
      ? Math.round(
          withMarks.reduce((s, r) => s + r.percentage, 0) / withMarks.length
        )
      : null;
  const bestPercent =
    withMarks.length > 0
      ? Math.max(...withMarks.map((r) => r.percentage))
      : null;
  const passed = withMarks.filter((r) => r.percentage >= 40).length;

  const statCards = [
    {
      label: "Total Exams",
      value: totalExams,
      icon: BookOpenIcon,
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
    },
    {
      label: "Average Score",
      value: avgPercent !== null ? `${avgPercent}%` : "N/A",
      icon: BarChart2Icon,
      color: "bg-purple-50 text-purple-600",
      border: "border-purple-100",
    },
    {
      label: "Best Score",
      value: bestPercent !== null ? `${bestPercent}%` : "N/A",
      icon: TrophyIcon,
      color: "bg-amber-50 text-amber-600",
      border: "border-amber-100",
    },
    {
      label: "Exams Passed",
      value: `${passed} / ${withMarks.length}`,
      icon: CheckCircleIcon,
      color: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100",
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Exam Results</h1>
        <p className="text-gray-500 mt-1">
          View all your exam marks and performance overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`bg-white border ${card.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
              <card.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">Exam Results</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalExams === 0
              ? "No results available yet."
              : `${totalExams} exam${totalExams > 1 ? "s" : ""} recorded`}
          </p>
        </div>

        {totalExams === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
              <BookOpenIcon size={32} className="text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No Results Yet
            </h3>
            <p className="text-gray-400 text-sm max-w-xs">
              Your exam results will appear here once your teacher enters your
              marks.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50/70 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold w-10 text-center">#</th>
                  <th className="px-6 py-4 font-semibold min-w-[180px]">Exam</th>
                  <th className="px-6 py-4 font-semibold">Subject</th>
                  <th className="px-6 py-4 font-semibold hidden md:table-cell">Chapter</th>
                  <th className="px-6 py-4 font-semibold hidden lg:table-cell">Date</th>
                  <th className="px-6 py-4 font-semibold text-center">Max</th>
                  <th className="px-6 py-4 font-semibold text-center">Obtained</th>
                  <th className="px-6 py-4 font-semibold text-center">%</th>
                  <th className="px-6 py-4 font-semibold text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {results.map((result, i) => {
                  const grade = getGrade(result.percentage);
                  const isPending = result.marksObtained === null;
                  return (
                    <tr
                      key={result._id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-6 py-4 text-center text-gray-400 font-medium">
                        {i + 1}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-800">
                          {result.examTitle}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <ClockIcon size={11} /> {result.timing || "N/A"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {result.subject}
                      </td>
                      <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                        {result.chapter}
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <CalendarIcon size={13} className="text-blue-400" />
                          {formatDate(result.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-gray-700">
                        {result.maxMarks}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isPending ? (
                          <span className="text-gray-400 text-xs italic">Pending</span>
                        ) : (
                          <span className="font-bold text-gray-900 text-base">
                            {result.marksObtained}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isPending ? (
                          <span className="text-gray-400">—</span>
                        ) : (
                          <div className="flex items-center justify-center">
                            <div className="relative w-12 h-12">
                              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                                <circle
                                  cx="18" cy="18" r="14"
                                  fill="none" stroke="#e5e7eb" strokeWidth="3.5"
                                />
                                <circle
                                  cx="18" cy="18" r="14"
                                  fill="none"
                                  stroke={
                                    result.percentage >= 60
                                      ? "#10b981"
                                      : result.percentage >= 40
                                      ? "#f59e0b"
                                      : "#ef4444"
                                  }
                                  strokeWidth="3.5"
                                  strokeDasharray={`${(result.percentage / 100) * 87.96} 87.96`}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-700">
                                {result.percentage}%
                              </span>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${gradeColor(grade)}`}
                        >
                          {grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// ADMIN VIEW (existing marks-entry UI)
// ─────────────────────────────────────────────
const AdminResultsView = () => {
  const [batches, setBatches] = useState([]);
  const [activeBatch, setActiveBatch] = useState("");
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [marksModalOpen, setMarksModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState("");
  const [marksInput, setMarksInput] = useState("");
  const [submittingMarks, setSubmittingMarks] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const { data } = await api.get("/batches");
        if (data.success && data.batches.length > 0) {
          setBatches(data.batches);
          setActiveBatch(data.batches[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch batches", err);
      }
    };
    fetchBatches();
  }, []);

  useEffect(() => {
    if (!activeBatch) return;
    const fetchStudentsAndExams = async () => {
      try {
        const [studentsRes, examsRes] = await Promise.all([
          api.get(`/exams/batch-students?batchId=${activeBatch}`),
          api.get(`/exams?batch=${activeBatch}`),
        ]);
        if (studentsRes.data.success) setStudents(studentsRes.data.students);
        if (examsRes.data.success) setExams(examsRes.data.exams);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchStudentsAndExams();
  }, [activeBatch]);

  const handleAddMarks = (student) => {
    setSelectedStudent(student);
    setSelectedExam("");
    setMarksInput("");
    setMarksModalOpen(true);
  };

  const submitStudentMarks = async (e) => {
    e.preventDefault();
    if (!selectedExam || !marksInput) {
      alert("Please select exam and enter marks");
      return;
    }
    setSubmittingMarks(true);
    try {
      const { data } = await api.post("/exams/student-marks", {
        examId: selectedExam,
        studentId: selectedStudent._id,
        marksObtained: parseFloat(marksInput),
      });
      if (data.success) {
        alert("Marks added successfully!");
        setMarksModalOpen(false);
        setSelectedStudent(null);
        const examsRes = await api.get(`/exams?batch=${activeBatch}`);
        if (examsRes.data.success) setExams(examsRes.data.exams);
      }
    } catch (err) {
      console.error("Failed to add marks", err);
      alert(err.response?.data?.message || "Failed to add marks");
    } finally {
      setSubmittingMarks(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Exam Results</h1>
          <p className="text-gray-500 mt-1">
            Select a batch and enter student marks.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Batch Filter */}
        <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="space-y-1.5 w-full md:w-64">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Select Batch
            </label>
            <select
              value={activeBatch}
              onChange={(e) => setActiveBatch(e.target.value)}
              className="w-full bg-white border border-gray-200 text-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {batches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {students.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No students in this batch
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="px-6 py-4 font-medium w-16 text-center">#</th>
                  <th className="px-6 py-4 font-medium min-w-[200px]">
                    Student Info
                  </th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student, i) => (
                  <tr
                    key={student._id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 text-center font-medium text-gray-400">
                      {i + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .substring(0, 2)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-sm">
                            {student.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {student.studentId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleAddMarks(student)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2 ml-auto"
                      >
                        <PlusIcon size={14} />
                        Add Marks
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Marks Modal */}
      {marksModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => !submittingMarks && setMarksModalOpen(false)}
          />
          <form
            onSubmit={submitStudentMarks}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative z-10 animate-in zoom-in-95 duration-200"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Add Marks</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedStudent?.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => !submittingMarks && setMarksModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <XIcon size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Select Test *
                </label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all mt-1"
                >
                  <option value="">Choose a test</option>
                  {exams.map((exam) => (
                    <option key={exam._id} value={exam._id}>
                      {exam.examTitle} — {exam.subject} (Max: {exam.maxMarks})
                    </option>
                  ))}
                </select>
              </div>

              {selectedExam && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Marks Obtained (out of{" "}
                    {exams.find((e) => e._id === selectedExam)?.maxMarks || 100}
                    ) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={exams.find((e) => e._id === selectedExam)?.maxMarks || 100}
                    value={marksInput}
                    onChange={(e) => setMarksInput(e.target.value)}
                    placeholder="Enter marks"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all mt-1 font-bold text-xl text-blue-600"
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
              <button
                type="button"
                onClick={() => !submittingMarks && setMarksModalOpen(false)}
                disabled={submittingMarks}
                className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingMarks}
                className="px-8 py-2.5 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {submittingMarks ? (
                  <Loader2Icon size={18} className="animate-spin" />
                ) : (
                  <SaveIcon size={18} />
                )}
                Save Marks
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// ROOT COMPONENT — role router
// ─────────────────────────────────────────────
const Results = () => {
  const role = localStorage.getItem("role");
  return role === "admin" ? <AdminResultsView /> : <StudentResultsView />;
};

export default Results;
