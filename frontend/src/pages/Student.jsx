import { SearchIcon, FilterIcon, MoreVerticalIcon, UserPlusIcon, XIcon, WalletIcon, LibraryIcon, Loader2Icon, TrendingUpIcon, CalendarIcon, AwardIcon, AlertCircleIcon, HistoryIcon, CreditCardIcon, Trash2Icon } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../api.js";

const Student = () => {
  const [activeBatch, setActiveBatch] = useState("All");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);
  const [ledgerData, setLedgerData] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
     name: "",
     parentPhone: "",
     enrollmentDate: new Date().toISOString().split('T')[0],
     batch: "",
     totalCourseFee: ""
  });
  const [registering, setRegistering] = useState(false);

  const fetchBatches = async () => {
     try {
        const { data } = await api.get('/batches');
        if (data.success) {
           setBatches(data.batches);
        }
     } catch (err) {
        console.error("Failed to fetch batches:", err);
     }
  };

  const fetchStudents = async () => {
     setLoading(true);
     try {
        const query = activeBatch !== "All" ? `?batch=${activeBatch}` : "";
        const { data } = await api.get(`/students${query}`);
        if (data.success) {
           setStudents(data.students);
        }
     } catch (err) {
        console.error("Failed to fetch students:", err);
     } finally {
        setLoading(false);
     }
  };

  const fetchStudentProfile = async (id) => {
     setProfileLoading(true);
     setIsProfileOpen(true);
     try {
        const { data } = await api.get(`/students/performance/${id}`);
        if (data.success) {
           setSelectedStudentProfile(data.performance);
        }
     } catch (err) {
        console.error("Failed to fetch student profile:", err);
     } finally {
        setProfileLoading(false);
     }
  };

  const fetchFeeLedger = async (id) => {
     setLedgerLoading(true);
     setIsLedgerOpen(true);
     try {
        const { data } = await api.get(`/fees/student/${id}`);
        if (data.success) {
           setLedgerData(data.ledger);
        }
     } catch (err) {
        console.error("Failed to fetch fee ledger:", err);
     } finally {
        setLedgerLoading(false);
     }
  };

  const handleDeleteStudent = async (id, name) => {
     if (window.confirm(`Are you sure you want to delete ${name}? This will also remove their entire fee history.`)) {
        try {
           const { data } = await api.delete(`/students/${id}`);
           if (data.success) {
              fetchStudents();
           }
        } catch (err) {
           console.error("Failed to delete student:", err);
           alert("Failed to delete student.");
        }
     }
  };

  useEffect(() => {
     fetchBatches();
  }, []);

  useEffect(() => {
     fetchStudents();
  }, [activeBatch]);

  const handleAddStudent = async (e) => {
     e.preventDefault();
     if (!formData.batch) {
        alert("Please select a batch first.");
        return;
     }
     setRegistering(true);
     try {
        const { data } = await api.post('/students', formData);
        if (data.success) {
           setIsDrawerOpen(false);
           fetchStudents();
           setFormData({
               name: "",
               parentPhone: "",
               enrollmentDate: new Date().toISOString().split('T')[0],
               batch: "",
               totalCourseFee: ""
            });
        }
     } catch (err) {
        console.error("Failed to add student:", err);
        const errMsg = err.response?.data?.error || err.response?.data?.message || "Failed to add student. Check all fields.";
        alert(`Error: ${errMsg}`);
     } finally {
        setRegistering(false);
     }
  };

  return(
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Directory</h1>
          <p className="text-gray-500 mt-1">Manage students, track batches, and view fee statuses.</p>
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
              <button 
                 onClick={() => setActiveBatch("All")}
                 className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    activeBatch === "All" 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                 }`}
              >
                 All Records
              </button>
              {batches.map(batch => (
                 <button 
                    key={batch._id}
                    onClick={() => setActiveBatch(batch._id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                       activeBatch === batch._id 
                       ? "bg-blue-600 text-white shadow-md" 
                       : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                 >
                    {batch.name}
                 </button>
              ))}
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
           {loading ? (
              <div className="flex justify-center items-center h-48">
                 <Loader2Icon className="animate-spin text-blue-600" size={32} />
              </div>
           ) : (
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                       <th className="px-6 py-4 font-medium">Student Info</th>
                       <th className="px-6 py-4 font-medium">Student ID</th>
                       <th className="px-6 py-4 font-medium">Batch</th>
                       <th className="px-6 py-4 font-medium">Fee Balance</th>
                       <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {students.map((student) => (
                       <tr key={student._id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                          <td className="px-6 py-4">
                             <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shrink-0">
                                   {student.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
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
                          <td className="px-6 py-4 text-gray-600 text-sm font-medium">{student.studentId}</td>
                          <td className="px-6 py-4">
                             <span className="font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-lg text-sm">{student.batch?.name || 'N/A'}</span>
                          </td>
                          <td className="px-6 py-4">
                             <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                                student.totalDues === 0 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                             }`}>
                                {student.totalDues === 0 ? 'Fully Paid' : `₹${student.totalDues} Left`}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end space-x-2">
                                <button 
                                   onClick={(e) => { e.stopPropagation(); fetchStudentProfile(student._id); }}
                                   className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors tooltip" aria-label="View Performance"
                                >
                                   <LibraryIcon size={18} />
                                </button>
                                <button 
                                   onClick={(e) => { e.stopPropagation(); fetchFeeLedger(student._id); }}
                                   className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors tooltip" aria-label="Fee Ledger"
                                >
                                   <WalletIcon size={18} />
                                </button>
                                <button 
                                   onClick={(e) => { e.stopPropagation(); handleDeleteStudent(student._id, student.name); }}
                                   className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors tooltip" aria-label="Delete Student"
                                >
                                   <Trash2Icon size={18} />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           )}
        </div>
      </div>

      {/* Add Student Drawer Slide-over */}
      {isDrawerOpen && (
         <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => !registering && setIsDrawerOpen(false)} />
            <div className="fixed inset-y-0 right-0 max-w-md w-full flex bg-white shadow-2xl animate-in slide-in-from-right duration-300">
               <form onSubmit={handleAddStudent} className="flex flex-col w-full h-full">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                     <div>
                        <h2 className="text-xl font-bold text-gray-800">Add New Student</h2>
                        <p className="text-sm text-gray-500">Register a student for the Yearly Course.</p>
                     </div>
                     <button type="button" onClick={() => setIsDrawerOpen(false)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <XIcon size={20} className="text-gray-600" />
                     </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" placeholder="e.g. Mohd Asad" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-700">Parent Phone</label>
                           <input required value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} type="text" placeholder="+91 xxxxxxxxxx" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-700">Enrollment Date</label>
                           <input required value={formData.enrollmentDate} onChange={e => setFormData({...formData, enrollmentDate: e.target.value})} type="date" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-600" />
                        </div>
                     </div>
                     
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Assign to Batch</label>
                        <div className="grid grid-cols-3 gap-3">
                           {batches.map(b => (
                              <label key={b._id} className={`border rounded-xl p-3 flex items-center justify-center cursor-pointer transition-all ${formData.batch === b._id ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                                 <input required type="radio" value={b._id} checked={formData.batch === b._id} onChange={() => setFormData({...formData, batch: b._id})} className="sr-only" />
                                 <span className="text-sm font-medium">{b.name}</span>
                              </label>
                           ))}
                        </div>
                     </div>
                     
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Total Yearly/Course Fee (₹)</label>
                        <p className="text-[10px] text-gray-400 -mt-1 uppercase font-bold tracking-tight">Students can pay this in installments later.</p>
                        <input required value={formData.totalCourseFee} onChange={e => setFormData({...formData, totalCourseFee: e.target.value})} type="number" placeholder="25000" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                     </div>
                  </div>
                  <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50/50">
                     <button type="submit" disabled={registering} className="px-5 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors flex items-center gap-2">
                        {registering ? <Loader2Icon size={18} className="animate-spin" /> : "Register Student"}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* Fee Ledger Drawer */}
      {isLedgerOpen && (
         <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsLedgerOpen(false)} />
            <div className="fixed inset-y-0 right-0 max-w-lg w-full flex bg-white shadow-2xl animate-in slide-in-from-right duration-300">
               <div className="flex flex-col w-full h-full">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-green-600 text-white">
                     <div>
                        <h2 className="text-xl font-bold">Fee Ledger</h2>
                        <p className="text-green-100 text-sm">Payment history and balance tracking.</p>
                     </div>
                     <button onClick={() => setIsLedgerOpen(false)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <XIcon size={20} />
                     </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                     {ledgerLoading ? (
                        <div className="flex justify-center items-center h-full"><Loader2Icon size={32} className="animate-spin text-green-600" /></div>
                     ) : ledgerData && (
                        <>
                           <div className="flex items-center space-x-4 mb-6">
                              <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 font-bold text-2xl">
                                 {ledgerData.student.name.split(' ').map(n=>n[0]).join('')}
                              </div>
                              <div>
                                 <h3 className="text-xl font-bold text-gray-800">{ledgerData.student.name}</h3>
                                 <p className="text-gray-500 font-medium tracking-wide">TOTAL COURSE FEE: ₹{ledgerData.student.totalCourseFee}</p>
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                              <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                                 <p className="text-xs font-bold text-green-700 uppercase mb-1">Total Paid</p>
                                 <p className="text-2xl font-bold text-green-800">₹{ledgerData.student.paidAmount}</p>
                              </div>
                              <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                                 <p className="text-xs font-bold text-red-700 uppercase mb-1">Remaining</p>
                                 <p className="text-2xl font-bold text-red-800">₹{ledgerData.student.totalDues}</p>
                              </div>
                           </div>
                           
                           {/* ... rest of profiling UI (same as before) ... */}
                           <div>
                              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                 <HistoryIcon size={18} className="text-gray-400" />
                                 Payment History
                              </h4>
                              <div className="space-y-4">
                                 {ledgerData.payments.length === 0 ? (
                                    <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 italic">No payments recorded yet.</div>
                                 ) : ledgerData.payments.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                                       <div className="flex items-center space-x-4">
                                          <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm text-green-600">
                                             <CreditCardIcon size={20} />
                                          </div>
                                          <div>
                                             <h5 className="font-bold text-gray-800 text-sm">₹{p.amountPaid}</h5>
                                             <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded font-bold text-gray-500">{p.paymentMode}</span>
                                                <p className="text-[10px] text-gray-400 font-medium">{new Date(p.datePaid).toLocaleDateString(undefined, { month: 'long', year: 'numeric', day: 'numeric' })}</p>
                                             </div>
                                          </div>
                                       </div>
                                       <div className="text-right">
                                           <p className="text-[10px] font-bold text-gray-400 uppercase">Received</p>
                                           <p className="text-xs font-bold text-green-600 italic">Confirmed</p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </>
                     )}
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Performance Profile Drawer (Existing) */}
      {isProfileOpen && (
         <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsProfileOpen(false)} />
            <div className="fixed inset-y-0 right-0 max-w-lg w-full flex bg-white shadow-2xl animate-in slide-in-from-right duration-300">
               <div className="flex flex-col w-full h-full">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-600 text-white">
                     <div>
                        <h2 className="text-xl font-bold">Academic Performance</h2>
                        <p className="text-blue-100 text-sm">Comprehensive student evaluation.</p>
                     </div>
                     <button onClick={() => setIsProfileOpen(false)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <XIcon size={20} />
                     </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                     {profileLoading ? (
                        <div className="flex justify-center items-center h-full"><Loader2Icon size={32} className="animate-spin text-blue-600" /></div>
                     ) : selectedStudentProfile && (
                        <>
                           <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                                 {selectedStudentProfile.student.name.split(' ').map(n=>n[0]).join('')}
                              </div>
                              <div>
                                 <h3 className="text-xl font-bold text-gray-800">{selectedStudentProfile.student.name}</h3>
                                 <p className="text-gray-500 font-medium">{selectedStudentProfile.student.studentId} • {selectedStudentProfile.student.batch?.name || 'Unknown Batch'}</p>
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                              <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                                 <div className="flex items-center space-x-2 text-green-700 mb-1">
                                    <TrendingUpIcon size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Attendance Rate</span>
                                 </div>
                                 <p className="text-3xl font-bold text-green-800">{selectedStudentProfile.attendanceRate}%</p>
                              </div>
                              <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                                 <div className="flex items-center space-x-2 text-indigo-700 mb-1">
                                    <AwardIcon size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Academic Grade</span>
                                 </div>
                                 <p className="text-3xl font-bold text-indigo-800">A</p>
                              </div>
                           </div>

                           <div>
                              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                 <AwardIcon size={18} className="text-gray-400" />
                                 Examination Records
                              </h4>
                              <div className="space-y-3">
                                 {selectedStudentProfile.results.length === 0 ? (
                                    <p className="text-sm text-gray-400 italic">No exams recorded yet.</p>
                                 ) : selectedStudentProfile.results.map((res, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                       <div>
                                          <p className="font-bold text-sm text-gray-800">{res.examTitle}</p>
                                          <p className="text-xs text-gray-500">{res.subject}</p>
                                       </div>
                                       <span className="font-bold text-blue-600">{res.marksObtained}/{res.maxMarks}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </>
                     )}
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  )
}

export default Student;