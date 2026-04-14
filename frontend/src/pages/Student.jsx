import { SearchIcon, FilterIcon, MoreVerticalIcon, UserPlusIcon, XIcon, WalletIcon, LibraryIcon } from "lucide-react";
import { useState } from "react";

const Student = () => {
  const [activeBatch, setActiveBatch] = useState("All");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const batches = ["All", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];

  const students = [
    { id: "STU-001", name: "Rahul Sharma", batch: "Class 12", status: "Active", attendance: "92%", feeStatus: "Paid" },
    { id: "STU-002", name: "Priya Patel", batch: "Class 10", status: "Active", attendance: "88%", feeStatus: "Pending" },
    { id: "STU-003", name: "Amit Kumar", batch: "Class 11", status: "Inactive", attendance: "45%", feeStatus: "Overdue" },
    { id: "STU-004", name: "Sneha Gupta", batch: "Class 12", status: "Active", attendance: "95%", feeStatus: "Paid" },
    { id: "STU-005", name: "Vikram Singh", batch: "Class 9", status: "Active", attendance: "89%", feeStatus: "Paid" },
    { id: "STU-006", name: "Anjali Desai", batch: "Class 8", status: "Warning", attendance: "70%", feeStatus: "Pending" },
  ];

  const filteredStudents = activeBatch === "All" ? students : students.filter(s => s.batch === activeBatch);

  return(
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Directory</h1>
          <p className="text-gray-500 mt-1">Manage 300+ students, track batches, and view fee statuses.</p>
        </div>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-colors shadow-blue-200 flex items-center space-x-2 shrink-0"
        >
          <UserPlusIcon size={18} />
          <span>Add New Student</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar & Batches */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col gap-4">
           {/* Batch Filters */}
           <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {batches.map(batch => (
                 <button 
                    key={batch}
                    onClick={() => setActiveBatch(batch)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                       activeBatch === batch 
                       ? "bg-blue-600 text-white shadow-md" 
                       : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                 >
                    {batch}
                 </button>
              ))}
           </div>
           
           <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
              <div className="relative w-full sm:w-96">
                 <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input 
                    type="text" 
                    placeholder={`Search within ${activeBatch}...`}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                 />
              </div>
              <div className="flex space-x-3 w-full sm:w-auto">
                 <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                    <FilterIcon size={16} />
                    <span>More Filters</span>
                 </button>
              </div>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                    <th className="px-6 py-4 font-medium">Student Info</th>
                    <th className="px-6 py-4 font-medium">Student ID</th>
                    <th className="px-6 py-4 font-medium">Batch</th>
                    <th className="px-6 py-4 font-medium">Fee Status</th>
                    <th className="px-6 py-4 font-medium">Attendance</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 {filteredStudents.map((student, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                       <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shrink-0">
                                {student.name.split(' ').map(n=>n[0]).join('')}
                             </div>
                             <div>
                                <h3 className="font-semibold text-gray-800">{student.name}</h3>
                                <div className="flex items-center space-x-2 mt-0.5">
                                   <span className={`w-2 h-2 rounded-full ${student.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                   <p className="text-xs text-gray-500">{student.status}</p>
                                </div>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4 text-gray-600 text-sm font-medium">{student.id}</td>
                       <td className="px-6 py-4">
                          <span className="font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-lg text-sm">{student.batch}</span>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                             student.feeStatus === 'Paid' ? 'bg-green-100 text-green-700 border border-green-200' :
                             student.feeStatus === 'Overdue' ? 'bg-red-100 text-red-700 border border-red-200' :
                             'bg-yellow-100 text-yellow-700 border border-yellow-200'
                          }`}>
                             {student.feeStatus}
                          </span>
                       </td>
                       <td className="px-6 py-4 font-medium text-gray-700">
                          {student.attendance}
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                             <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors tooltip" aria-label="View Academics">
                                <LibraryIcon size={18} />
                             </button>
                             <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors tooltip" aria-label="Collect Fees">
                                <WalletIcon size={18} />
                             </button>
                             <div className="w-px h-4 bg-gray-200 mx-1"></div>
                             <button className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                                <MoreVerticalIcon size={18} />
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
                 {filteredStudents.length === 0 && (
                    <tr>
                       <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          No students found in {activeBatch}.
                       </td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>

      {/* Add Student Drawer Slide-over */}
      {isDrawerOpen && (
         <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)} />
            <div className="fixed inset-y-0 right-0 max-w-md w-full flex bg-white shadow-2xl animate-in slide-in-from-right duration-300">
               <div className="flex flex-col w-full h-full">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                     <div>
                        <h2 className="text-xl font-bold text-gray-800">Add New Student</h2>
                        <p className="text-sm text-gray-500">Register a student to a specific batch.</p>
                     </div>
                     <button onClick={() => setIsDrawerOpen(false)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <XIcon size={20} className="text-gray-600" />
                     </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" placeholder="e.g. Mohd Asad" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-700">Parent Phone</label>
                           <input type="text" placeholder="+91 xxxxxxxxxx" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-700">Enrollment Date</label>
                           <input type="date" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-600" />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Assign to Batch</label>
                        <div className="grid grid-cols-3 gap-3">
                           {["Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map(b => (
                              <label key={b} className="border border-gray-200 rounded-xl p-3 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                                 <input type="radio" name="batchOption" className="sr-only" />
                                 <span className="text-sm font-medium text-gray-700">{b}</span>
                              </label>
                           ))}
                        </div>
                     </div>
                     
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Base Monthly Fee (₹)</label>
                        <input type="number" placeholder="5000" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                     </div>
                  </div>

                  <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50/50">
                     <button onClick={() => setIsDrawerOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-colors border border-transparent">
                        Cancel
                     </button>
                     <button className="px-5 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors">
                        Register Student
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  )
}

export default Student;