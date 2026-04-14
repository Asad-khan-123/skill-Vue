import { useState } from "react";
import { PlusIcon, SaveIcon, FileTextIcon, SearchIcon, DownloadIcon } from "lucide-react";

const Results = () => {
   const [activeBatch, setActiveBatch] = useState("Class 10");
   const [selectedSubject, setSelectedSubject] = useState("Mathematics");
   const batches = ["Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
   const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English"];

   const students = [
      { id: "STU-1001", name: "Rahul Sharma", marks: "" },
      { id: "STU-1002", name: "Priya Patel", marks: "85" },
      { id: "STU-1003", name: "Amit Kumar", marks: "" },
      { id: "STU-1004", name: "Sneha Gupta", marks: "92" },
      { id: "STU-1005", name: "Vikram Singh", marks: "" },
   ];

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
                     <select className="w-full bg-white border border-gray-200 text-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                        <option>Mid-Term Examination 2026</option>
                        <option>First Term Evaluation 2026</option>
                        <option>Monthly Test - April</option>
                     </select>
                  </div>
                  <div className="space-y-1.5 w-full">
                     <label className="text-xs font-semibold text-gray-500 uppercase">Batch</label>
                     <select 
                        value={activeBatch} 
                        onChange={e => setActiveBatch(e.target.value)}
                        className="w-full bg-white border border-gray-200 text-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                     >
                        {batches.map(b => <option key={b} value={b}>{b}</option>)}
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
                  <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-colors shadow-green-200 flex items-center space-x-2">
                     <SaveIcon size={18} />
                     <span>Save Marks</span>
                  </button>
               </div>
            </div>

            <div className="overflow-x-auto min-h-[400px]">
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
                     {students.map((student, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                           <td className="px-6 py-4 text-center font-medium text-gray-400">{i + 1}</td>
                           <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                 <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                                    {student.name.split(' ').map(n=>n[0]).join('')}
                                 </div>
                                 <div>
                                    <h3 className="font-semibold text-gray-800">{student.name}</h3>
                                    <p className="text-xs text-gray-500">{student.id}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-gray-500 font-medium">100</td>
                           <td className="px-6 py-4">
                              <input 
                                 type="number" 
                                 defaultValue={student.marks} 
                                 placeholder="--" 
                                 className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg text-center font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-gray-700 bg-gray-50 focus:bg-white"
                              />
                           </td>
                           <td className="px-6 py-4 text-center">
                              {student.marks ? (
                                 <span className={`font-bold px-3 py-1 rounded-full ${parseInt(student.marks) >= 90 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {parseInt(student.marks) >= 90 ? 'A+' : parseInt(student.marks) >= 80 ? 'A' : 'B'}
                                 </span>
                              ) : (
                                 <span className="text-gray-300">-</span>
                              )}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

         </div>
      </div>
   );
};

export default Results;
