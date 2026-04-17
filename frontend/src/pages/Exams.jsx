import { useState, useEffect } from "react";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PlusIcon,
  XIcon,
  Loader2Icon,
} from "lucide-react";
import api from "../api.js";

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    examTitle: "",
    batch: "",
    subject: "",
    chapter: "",
    date: "",
    timing: "",
    maxMarks: "100",
  });

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const { data } = await api.get("/batches");
        if (data.success) {
          setBatches(data.batches);
        }
      } catch (err) {
        console.error("Failed to fetch batches", err);
      }
    };
    fetchBatches();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/exams");
      if (data.success) {
        setExams(data.exams);
      }
    } catch (err) {
      console.error("Failed to fetch exams", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleCreateExam = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const { data } = await api.post("/exams", formData);
      if (data.success) {
        alert("Exam created successfully!");
        setIsModalOpen(false);
        setFormData({
          examTitle: "",
          batch: "",
          subject: "",
          chapter: "",
          date: "",
          timing: "",
          maxMarks: "100",
        });
        fetchExams();
      }
    } catch (err) {
      console.error("Failed to create exam", err);
      alert(err.response?.data?.message || "Failed to create exam");
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const upcomingExams = exams;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Exam Schedule</h1>
          <p className="text-gray-500 mt-1">
            View upcoming examinations and create new tests.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <PlusIcon size={20} />
          Create Exam
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-lg text-gray-800 mb-2">
            Upcoming Tests
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2Icon className="animate-spin text-blue-600" size={32} />
            </div>
          ) : upcomingExams.length === 0 ? (
            <div className="bg-white border border-gray-100 p-8 rounded-2xl text-center">
              <p className="text-gray-500">No exams scheduled yet</p>
            </div>
          ) : (
            upcomingExams.map((exam) => (
              <div
                key={exam._id}
                className="bg-white border text-left border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-blue-500"
              >
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {exam.examTitle}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-semibold">Subject:</span>{" "}
                    {exam.subject}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-semibold">Chapter:</span>{" "}
                    {exam.chapter}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                      <CalendarIcon size={16} className="text-blue-500" />
                      <span>{formatDate(exam.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                      <ClockIcon size={16} className="text-blue-500" />
                      <span>{exam.timing}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                      <MapPinIcon size={16} className="text-blue-500" />
                      <span>Max Marks: {exam.maxMarks}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex sm:flex-col justify-end gap-2 text-right">
                  <span className="bg-blue-50 text-blue-700 font-medium text-xs px-3 py-1 rounded-full w-max">
                    {exam.batch?.name || "Batch"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar info */}
        <div>
          <div className="bg-gradient-to-b from-[#1e2640] to-gray-900 rounded-2xl p-6 text-white shadow-lg sticky top-6">
            <h3 className="font-bold text-lg mb-4 text-blue-400">
              Important Instructions
            </h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <p>
                  Students must report to the examination hall 30 minutes before
                  the scheduled time.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <p>Admit card and institutional ID are mandatory for entry.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <p>
                  Electronic gadgets, smartwatches, and programmable calculators
                  are strictly prohibited.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Create Exam Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => !isCreating && setIsModalOpen(false)}
          />
          <form
            onSubmit={handleCreateExam}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative z-10 animate-in zoom-in-95 duration-200"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-800">
                Create New Exam
              </h2>
              <button
                type="button"
                onClick={() => !isCreating && setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <XIcon size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Test Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Unit Test 1, Mid Term..."
                  value={formData.examTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, examTitle: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Batch *
                </label>
                <select
                  value={formData.batch}
                  onChange={(e) =>
                    setFormData({ ...formData, batch: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all mt-1"
                >
                  <option value="">Select a batch</option>
                  {batches.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Subject *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Mathematics, Physics..."
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Chapter/Topic *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Algebra, Chapter 5..."
                    value={formData.chapter}
                    onChange={(e) =>
                      setFormData({ ...formData, chapter: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Timing *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 10:00 AM - 1:00 PM"
                    value={formData.timing}
                    onChange={(e) =>
                      setFormData({ ...formData, timing: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Max Marks
                </label>
                <input
                  type="number"
                  value={formData.maxMarks}
                  onChange={(e) =>
                    setFormData({ ...formData, maxMarks: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all mt-1"
                  min="1"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
              <button
                type="button"
                onClick={() => !isCreating && setIsModalOpen(false)}
                disabled={isCreating}
                className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-8 py-2.5 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {isCreating ? (
                  <Loader2Icon size={18} className="animate-spin" />
                ) : (
                  <PlusIcon size={18} />
                )}
                Create Exam
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Exams;
