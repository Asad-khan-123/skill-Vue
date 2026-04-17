import { useState, useEffect } from "react";
import { UsersIcon, WalletIcon, TrendingUpIcon, AlertCircleIcon, BellIcon, CalendarIcon, ChevronRightIcon, XIcon, Loader2Icon, Trash2Icon } from "lucide-react";
import api from "../api.js";

const AdminDashboard = () => {
   const [stats, setStats] = useState({
      totalStudents: 0,
      totalFeesCollected: 0,
      attendancePercentage: 0,
      todayPresent: 0,
      todayMarked: 0
   });
   const [batches, setBatches] = useState([]);
   const [loading, setLoading] = useState(true);
   
   // Create Batch Modal State
   const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
   const [batchFormData, setBatchFormData] = useState({
      name: "",
      classTeacher: "",
      baseFee: ""
   });
   const [batchSaving, setBatchSaving] = useState(false);
   const [deletingBatchId, setDeletingBatchId] = useState(null);

   const fetchDashboard = async () => {
      try {
         const { data } = await api.get('/admin/dashboard');
         if (data.success) {
            setStats(data.stats);
            setBatches(data.batches);
         }
      } catch (error) {
         console.error("Failed to fetch dashboard data", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchDashboard();
   }, []);

   const handleCreateBatch = async (e) => {
      e.preventDefault();
      setBatchSaving(true);
      try {
         const { data } = await api.post('/batches', batchFormData);
         if (data.success) {
            setIsBatchModalOpen(false);
            setBatchFormData({ name: "", classTeacher: "", baseFee: "" });
            fetchDashboard(); // Refresh
         }
      } catch (error) {
         console.error("Failed to create batch:", error);
         alert(error.response?.data?.message || "Failed to create batch");
      } finally {
         setBatchSaving(false);
      }
   };

   const handleDeleteBatch = async (batchId, batchName) => {
      if (window.confirm(`Are you sure you want to delete batch "${batchName}"? This will delete all students, attendance records, fees, and results associated with this batch.`)) {
         setDeletingBatchId(batchId);
         try {
            const { data } = await api.delete(`/batches/${batchId}`);
            if (data.success) {
               alert(`Batch "${batchName}" and all related records deleted successfully`);
               fetchDashboard(); // Refresh
            }
         } catch (error) {
            console.error("Failed to delete batch:", error);
            alert(error.response?.data?.message || "Failed to delete batch");
         } finally {
            setDeletingBatchId(null);
         }
      }
   };

   if (loading) return <div className="p-8 flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

   return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
               <h1 className="text-3xl font-bold text-gray-800">Admin Overview</h1>
               <p className="text-gray-500 mt-1">Hello Admin, here's what's happening today.</p>
            </div>
            <div className="flex items-center space-x-3">
               <button className="p-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl relative">
                  <BellIcon size={20} />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
               </button>
               <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-colors shadow-blue-200">
                  Daily Report
               </button>
            </div>
         </div>

         {/* Today's KPI Cards */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-sm font-medium text-gray-500">Total Students</p>
                     <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.totalStudents}</h3>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                     <UsersIcon size={24} />
                  </div>
               </div>
               <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
                  <TrendingUpIcon size={16} className="mr-1" />
                  <span>+0 this month</span>
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-sm font-medium text-gray-500">Today's Attendance</p>
                     <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.attendancePercentage}%</h3>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl text-green-600">
                     <CalendarIcon size={24} />
                  </div>
               </div>
               <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span className="font-medium text-gray-800 mr-1">{stats.todayPresent}</span> present out of {stats.todayMarked || 0}
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-transparent">
               <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
               <div className="flex justify-between items-start relative z-10">
                  <div>
                     <p className="text-blue-100 font-medium">Fees Collected (This Month)</p>
                     <h3 className="text-4xl font-bold mt-1">₹ {stats.totalFeesCollected.toLocaleString()}</h3>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl text-white backdrop-blur-sm">
                     <WalletIcon size={24} />
                  </div>
               </div>
               <div className="mt-4 flex items-center text-sm text-blue-50 font-medium relative z-10">
                  <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden mr-4">
                     <div className="bg-green-400 h-full rounded-full w-[0%]"></div>
                  </div>
                  <span className="shrink-0 tracking-wide gap-1 flex items-center whitespace-nowrap text-xs">Awaiting data...</span>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Batch Overview */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="font-bold text-lg text-gray-800">Batch Health Overview</h2>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
                     Manage Batches <ChevronRightIcon size={16} />
                  </button>
               </div>
               <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {batches.map((batch, index) => (
                        <div key={index} className="border border-gray-100 p-4 rounded-xl hover:border-blue-100 hover:bg-blue-50/50 transition-colors group cursor-pointer relative">
                           <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-gray-800">{batch.name}</h3>
                              <div className="flex items-center gap-2">
                                 <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-md group-hover:bg-white transition-colors">{batch.strength} Students</span>
                                 <button
                                    onClick={() => handleDeleteBatch(batch._id, batch.name)}
                                    disabled={deletingBatchId === batch._id}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                    title="Delete batch"
                                 >
                                    {deletingBatchId === batch._id ? <Loader2Icon size={16} className="animate-spin" /> : <Trash2Icon size={16} />}
                                 </button>
                              </div>
                           </div>
                           <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <span>Teacher: <span className="font-medium text-gray-700">{batch.classTeacher}</span></span>
                              <span>Att: <span className="font-medium text-gray-500">{batch.attendance || 'N/A'}</span></span>
                           </div>
                        </div>
                     ))}
                     {/* Add Batch Button */}
                     <div 
                        onClick={() => setIsBatchModalOpen(true)}
                        className="border border-dashed border-gray-300 p-4 rounded-xl flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer bg-gray-50/50"
                     >
                        <span className="font-medium flex items-center gap-2">
                           <span className="text-xl">+</span> Add New Batch
                        </span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Alerts & Critical Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
               <div className="p-6 border-b border-gray-100">
                  <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                     <AlertCircleIcon size={20} className="text-red-500" />
                     Action Needed
                  </h2>
               </div>
               <div className="p-6 flex-1 bg-red-50/20">
                  <div className="space-y-4">
                     <div className="bg-white border border-orange-100 p-4 rounded-xl shadow-sm relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                        <h4 className="font-semibold text-gray-800 text-sm">Automated Alerts</h4>
                        <p className="text-xs text-gray-500 mt-1">All thresholds are currently looking normal.</p>
                     </div>
                  </div>
               </div>
            </div>

         </div>

         {/* Create Batch Modal */}
         {isBatchModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => !batchSaving && setIsBatchModalOpen(false)} />
               <form onSubmit={handleCreateBatch} className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative z-10 animate-in zoom-in-95 duration-200">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                     <h2 className="text-xl font-bold text-gray-800">Create New Batch</h2>
                     <button type="button" onClick={() => setIsBatchModalOpen(false)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <XIcon size={20} className="text-gray-600" />
                     </button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Batch Name (e.g. Class 10)</label>
                        <input 
                           required 
                           value={batchFormData.name} 
                           onChange={e => setBatchFormData({...batchFormData, name: e.target.value})}
                           type="text" 
                           placeholder="Enter batch name" 
                           className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Class Teacher</label>
                        <input 
                           required 
                           value={batchFormData.classTeacher} 
                           onChange={e => setBatchFormData({...batchFormData, classTeacher: e.target.value})}
                           type="text" 
                           placeholder="Teacher's name" 
                           className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Standard Monthly Fee (₹)</label>
                        <input 
                           required 
                           value={batchFormData.baseFee} 
                           onChange={e => setBatchFormData({...batchFormData, baseFee: e.target.value})}
                           type="number" 
                           placeholder="e.g. 5000" 
                           className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                        />
                     </div>
                  </div>

                  <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50/50 rounded-b-2xl">
                     <button type="button" disabled={batchSaving} onClick={() => setIsBatchModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-colors">
                        Cancel
                     </button>
                     <button type="submit" disabled={batchSaving} className="px-5 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors flex items-center gap-2">
                        {batchSaving ? <Loader2Icon size={18} className="animate-spin" /> : "Create Batch"}
                     </button>
                  </div>
               </form>
            </div>
         )}
      </div>
   );
};

export default AdminDashboard;