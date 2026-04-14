import { useState } from "react";
import { SearchIcon, ReceiptTextIcon, CheckCircleIcon, PrinterIcon, XIcon, FilterIcon, WalletIcon } from "lucide-react";

const Fees = () => {
   const [activeBatch, setActiveBatch] = useState("Class 10");
   const [selectedStudent, setSelectedStudent] = useState(null);
   const batches = ["All", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];

   const feeRecords = [
      { id: "STU-1001", name: "Rahul Sharma", batch: "Class 10", totalFee: 5000, paid: 5000, status: "Paid", dues: 0, lastPaid: "Apr 5, 2026" },
      { id: "STU-1002", name: "Priya Patel", batch: "Class 10", totalFee: 5000, paid: 2000, status: "Pending", dues: 3000, lastPaid: "Mar 1, 2026" },
      { id: "STU-1005", name: "Vikram Singh", batch: "Class 9", totalFee: 4500, paid: 4500, status: "Paid", dues: 0, lastPaid: "Apr 2, 2026" },
      { id: "STU-1006", name: "Anjali Desai", batch: "Class 8", totalFee: 4000, paid: 0, status: "Overdue", dues: 4000, lastPaid: "None" },
   ];

   const filteredRecords = activeBatch === "All" ? feeRecords : feeRecords.filter(r => r.batch === activeBatch);

   return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
               <h1 className="text-3xl font-bold text-gray-800">Fee Collection</h1>
               <p className="text-gray-500 mt-1">Track dues and collect fees manually batch-wise.</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
               <WalletIcon size={20} className="text-blue-600" />
               <div>
                  <p className="text-xs text-gray-500 font-medium">Today's Collection</p>
                  <p className="text-lg font-bold text-gray-800">₹ 12,500</p>
               </div>
            </div>
         </div>

         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Toolbar */}
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
                  <div className="relative w-full sm:w-80">
                     <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                     <input 
                        type="text" 
                        placeholder="Search student or ID..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                     />
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                     <FilterIcon size={16} />
                     <span>Filter Unpaid</span>
                  </button>
               </div>
            </div>

            {/* Fees Table */}
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                        <th className="px-6 py-4 font-medium">Student Info</th>
                        <th className="px-6 py-4 font-medium">Batch</th>
                        <th className="px-6 py-4 font-medium text-right">Total Fee</th>
                        <th className="px-6 py-4 font-medium text-right">Dues Left</th>
                        <th className="px-6 py-4 font-medium text-center">Status</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {filteredRecords.map((record, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                           <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                 <div>
                                    <h3 className="font-semibold text-gray-800">{record.name}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">{record.id}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-gray-600 text-sm font-medium">{record.batch}</td>
                           <td className="px-6 py-4 font-medium text-gray-800 text-right">₹ {record.totalFee}</td>
                           <td className="px-6 py-4 text-right">
                              <span className={`font-bold ${record.dues > 0 ? "text-red-500" : "text-green-500"}`}>
                                 ₹ {record.dues}
                              </span>
                              {record.dues > 0 && <p className="text-[10px] text-gray-400 mt-1">Last Paid: {record.lastPaid}</p>}
                           </td>
                           <td className="px-6 py-4 text-center">
                              <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                                 record.status === 'Paid' ? 'bg-green-100 text-green-700 border border-green-200' :
                                 record.status === 'Overdue' ? 'bg-red-100 text-red-700 border border-red-200 animate-pulse' :
                                 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                              }`}>
                                 {record.status}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              {record.status === 'Paid' ? (
                                 <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1.5 ml-auto">
                                    <ReceiptTextIcon size={16} /> Receipt
                                 </button>
                              ) : (
                                 <button 
                                    onClick={() => setSelectedStudent(record)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm w-max ml-auto"
                                 >
                                    Collect Fee
                                 </button>
                              )}
                           </td>
                        </tr>
                     ))}
                     {filteredRecords.length === 0 && (
                        <tr>
                           <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                              No records found.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Collect Fee Modal */}
         {selectedStudent && (
            <div className="fixed inset-0 z-50 flexItems-center justify-center p-4">
               <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedStudent(null)} />
               <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative z-10 animate-in zoom-in-95 duration-200 m-auto mt-20">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                     <div>
                        <h2 className="text-xl font-bold text-gray-800">Collect Payment</h2>
                        <p className="text-sm text-gray-500 mt-1">Collecting for {selectedStudent.name} ({selectedStudent.id})</p>
                     </div>
                     <button onClick={() => setSelectedStudent(null)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <XIcon size={20} className="text-gray-600" />
                     </button>
                  </div>
                  
                  <div className="p-6 space-y-6">
                     <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex justify-between items-center text-red-800">
                        <span className="font-medium text-sm">Total Dues Remaining</span>
                        <span className="font-bold text-xl">₹ {selectedStudent.dues}</span>
                     </div>

                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-700">Amount Received (₹)</label>
                           <input type="number" defaultValue={selectedStudent.dues} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-lg" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-700">Payment Mode</label>
                           <div className="grid grid-cols-2 gap-3">
                              <label className="border border-blue-500 bg-blue-50 text-blue-700 rounded-xl p-3 flex items-center justify-center cursor-pointer font-medium transition-colors ring-2 ring-blue-500/20">
                                 <input type="radio" name="paymentMode" defaultChecked className="sr-only" />
                                 <span>Cash</span>
                              </label>
                              <label className="border border-gray-200 rounded-xl p-3 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent font-medium text-gray-700">
                                 <input type="radio" name="paymentMode" className="sr-only" />
                                 <span>UPI / Online</span>
                              </label>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-700">Remarks (Optional)</label>
                           <input type="text" placeholder="e.g. Month of April" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                     </div>
                  </div>

                  <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 bg-gray-50/50 rounded-b-2xl">
                     <button onClick={() => setSelectedStudent(null)} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-colors">
                        Cancel
                     </button>
                     <button className="px-5 py-2.5 rounded-xl font-medium text-white bg-green-600 hover:bg-green-700 shadow-md shadow-green-200 transition-colors flex items-center justify-center gap-2">
                        <CheckCircleIcon size={18} />
                        Collect & Generate Slip
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default Fees;