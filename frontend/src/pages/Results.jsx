import { useState, useEffect } from "react";
import { PlusIcon, SaveIcon, SearchIcon, DownloadIcon, Loader2Icon } from "lucide-react";
import api from "../api.js";

const Results = () => {
   const [activeBatch, setActiveBatch] = useState("");
   const [selectedSubject, setSelectedSubject] = useState("Mathematics");
   const [examTitle, setExamTitle] = useState("Monthly Test - April");
   
   const [batches, setBatches] = useState([]);
   const [matrix, setMatrix] = useState(null);
   const [loading, setLoading] = useState(false);
   const [saving, setSaving] = useState(false);

   const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Studies"];
   const examTypes = ["Monthly Test - April", "First Term Evaluation 2026", "Mid-Term Examination 2026", "Final Examination 2026"];

   useEffect(() => {
      const fetchBatches = async () => {
         try {
            const { data } = await api.get('/batches');
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
      const fetchMatrix = async () => {
         if (!activeBatch || !selectedSubject || !examTitle) return;
         setLoading(true);
         try {
            const { data } = await api.get(`/exams?batch=${activeBatch}&examTitle=${examTitle}&subject=${selectedSubject}`);
            if (data.success) {
               setMatrix(data.matrix);
            }
         } catch (err) {
            console.error("Failed to fetch marks matrix", err);
         } finally {
            setLoading(false);
         }
      };

      fetchMatrix();
   }, [activeBatch, selectedSubject, examTitle]);

   const handleMarksChange = (studentId, value) => {
      setMatrix(prev => ({
         ...prev,
         scores: prev.scores.map(s => 
            s.student._id === studentId ? { ...s, marksObtained: value } : s
         )
      }));
   };

   const saveMarks = async () => {
      setSaving(true);
      try {
         const payload = {
            ...matrix,
            // Map student object back to just ID for payload
            scores: matrix.scores.map(s => ({
               student: s.student._id,
               marksObtained: s.marksObtained
            }))
         };
         const { data } = await api.post('/exams/marks', payload);
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

   return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
               <h1 className="text-3xl font-bold text-gray-800">Exam Results</h1>
               <p className="text-gray-500 mt-1">Create exams and enter student marks batch-wise.</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-colors shadow-blue-200 flex items-center space-x-2 shrink-0">
               <PlusIcon size={18} />
               <span>Create New Exam</span>
            </button>
         </div>

         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 bg-gray-50/50">
               <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 w-full">
                     <label className="text-xs font-semibold text-gray-500 uppercase">Exam Type</label>
                     <select 
                        value={examTitle}
                        onChange={e => setExamTitle(e.target.value)}
                        className="w-full bg-white border border-gray-200 text-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                     >
                        {examTypes.map(type => <option key={type} value={type}>{type}</option>)}
                     </select>
                  </div>
                  <div className="space-y-1.5 w-full">
                     <label className="text-xs font-semibold text-gray-500 uppercase">Batch</label>
                     <select 
                        value={activeBatch} 
                        onChange={e => setActiveBatch(e.target.value)}
                        className="w-full bg-white border border-gray-200 text-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                     >
                        {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                     </select>
                  </div>
                  <div className="space-y-1.5 w-full">
                     <label className="text-xs font-semibold text-gray-500 uppercase">Subject</label>
                     <select 
                        value={selectedSubject} 
                        onChange={e => setSelectedSubject(e.target.value)}
                        className="w-full bg-white border border-gray-200 text-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                     >
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                  </div>
               </div>
               <div className="flex items-end shrink-0 gap-3">
                  <button className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium px-4 py-2.5 rounded-xl transition-colors flex items-center space-x-2">
                     <DownloadIcon size={18} />
                     <span>Export</span>
                  </button>
                  <button 
                     onClick={saveMarks}
                     disabled={loading || saving || !matrix}
                     className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-colors shadow-green-200 flex items-center space-x-2 disabled:opacity-50"
                  >
                     {saving ? <Loader2Icon size={18} className="animate-spin" /> : <SaveIcon size={18} />}
                     <span>Save Marks</span>
                  </button>
               </div>
            </div>

            <div className="overflow-x-auto min-h-[400px]">
               {loading ? (
                  <div className="flex justify-center items-center h-48">
                     <Loader2Icon className="animate-spin text-blue-600" size={32} />
                  </div>
               ) : !matrix ? (
                  <div className="p-8 text-center text-gray-500">
                     Select batch and subject to load students.
                  </div>
               ) : (
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                           <th className="px-6 py-4 font-medium w-16 text-center">#</th>
                           <th className="px-6 py-4 font-medium min-w-[200px]">Student Info</th>
                           <th className="px-6 py-4 font-medium w-40">Max Marks</th>
                           <th className="px-6 py-4 font-medium w-48">Marks Obtained</th>
                           <th className="px-6 py-4 font-medium text-center w-32">Grade (Auto)</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {matrix.scores.map((score, i) => (
                           <tr key={score.student._id} className="hover:bg-gray-50/50 transition-colors group">
                              <td className="px-6 py-4 text-center font-medium text-gray-400">{i + 1}</td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                                       {score.student.name.split(' ').map(n=>n[0]).join('').toUpperCase().substring(0,2)}
                                    </div>
                                    <div>
                                       <h3 className="font-semibold text-gray-800 text-sm">{score.student.name}</h3>
                                       <p className="text-xs text-gray-500">{score.student.studentId}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-gray-500 font-medium">{matrix.maxMarks}</td>
                              <td className="px-6 py-4">
                                 <input 
                                    type="number" 
                                    value={score.marksObtained}
                                    onChange={e => handleMarksChange(score.student._id, e.target.value)}
                                    placeholder="--" 
                                    className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg text-center font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-gray-700 bg-gray-50 focus:bg-white"
                                 />
                              </td>
                              <td className="px-6 py-4 text-center">
                                 {score.marksObtained !== "" ? (
                                    <span className={`font-bold px-3 py-1 rounded-full text-xs ${
                                       getGrade(score.marksObtained, matrix.maxMarks) === 'A+' || getGrade(score.marksObtained, matrix.maxMarks) === 'A' 
                                       ? 'bg-green-100 text-green-700' 
                                       : getGrade(score.marksObtained, matrix.maxMarks) === 'F' 
                                       ? 'bg-red-100 text-red-700' 
                                       : 'bg-blue-100 text-blue-700'
                                    }`}>
                                       {getGrade(score.marksObtained, matrix.maxMarks)}
                                    </span>
                                 ) : (
                                    <span className="text-gray-300">-</span>
                                 )}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               )}
            </div>
         </div>
      </div>
   );
};

export default Results;
