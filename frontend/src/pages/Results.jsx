import { useState, useEffect } from "react";
import { PlusIcon, SaveIcon, Loader2Icon, XIcon } from "lucide-react";
import api from "../api.js";

const Results = () => {
  const [batches, setBatches] = useState([]);
  const [activeBatch, setActiveBatch] = useState("");

  // Student view state
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

  const handleMarksChange = (studentId, value) => {
    setMatrix((prev) => ({
      ...prev,
      scores: prev.scores.map((s) =>
        s.student._id === studentId ? { ...s, marksObtained: value } : s,
      ),
    }));
  };

  const saveMarks = async () => {
    setSaving(true);
    try {
      const payload = {
        ...matrix,
        // Map student object back to just ID for payload
        scores: matrix.scores.map((s) => ({
          student: s.student._id,
          marksObtained: s.marksObtained,
        })),
      };
      const { data } = await api.post("/exams/marks", payload);
      if (data.success) {
        alert("Marks saved successfully!");
      }
    } catch (err) {
      console.error("Failed to save marks", err);
      alert("Could not save marks to database.");
    } finally {
      setSaving(false);
    }
  };

  const getGrade = (marks, max) => {
    if (marks === "" || marks === undefined) return "-";
    const percent = (parseFloat(marks) / max) * 100;
    if (percent >= 90) return "A+";
    if (percent >= 80) return "A";
    if (percent >= 70) return "B+";
    if (percent >= 60) return "B";
    if (percent >= 50) return "C";
    if (percent >= 40) return "D";
    return "F";
  };

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
        // Refresh exams list
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
            Create exams and enter student marks batch-wise.
          </p>
        </div>
      </div>

      {/* Student View - List of students with Add Marks button */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                      {exam.examTitle} - {exam.subject} (Max: {exam.maxMarks})
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
                    max={
                      exams.find((e) => e._id === selectedExam)?.maxMarks || 100
                    }
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

export default Results;
