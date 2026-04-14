import { UsersIcon, WalletIcon, TrendingUpIcon, AlertCircleIcon, BellIcon, CalendarIcon, ChevronRightIcon } from "lucide-react";

const AdminDashboard = () => {
   const batches = [
      { name: "Class 12", strength: 65, attendance: "92%", classTeacher: "Mr. Sharma" },
      { name: "Class 11", strength: 58, attendance: "88%", classTeacher: "Mrs. Verma" },
      { name: "Class 10", strength: 72, attendance: "95%", classTeacher: "Ms. Gupta" },
      { name: "Class 9", strength: 60, attendance: "90%", classTeacher: "Mr. Singh" },
      { name: "Class 8", strength: 45, attendance: "85%", classTeacher: "Mrs. Patel" },
   ];

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
                     <h3 className="text-3xl font-bold text-gray-800 mt-1">300</h3>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                     <UsersIcon size={24} />
                  </div>
               </div>
               <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
                  <TrendingUpIcon size={16} className="mr-1" />
                  <span>+12 this month</span>
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-sm font-medium text-gray-500">Today's Attendance</p>
                     <h3 className="text-3xl font-bold text-gray-800 mt-1">91%</h3>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl text-green-600">
                     <CalendarIcon size={24} />
                  </div>
               </div>
               <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span className="font-medium text-gray-800 mr-1">273</span> present out of 300
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-transparent">
               <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
               <div className="flex justify-between items-start relative z-10">
                  <div>
                     <p className="text-blue-100 font-medium">Fees Collected (This Month)</p>
                     <h3 className="text-4xl font-bold mt-1">₹ 4,25,000</h3>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl text-white backdrop-blur-sm">
                     <WalletIcon size={24} />
                  </div>
               </div>
               <div className="mt-4 flex items-center text-sm text-blue-50 font-medium relative z-10">
                  <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden mr-4">
                     <div className="bg-green-400 h-full rounded-full w-[85%]"></div>
                  </div>
                  <span className="shrink-0 tracking-wide gap-1 flex items-center whitespace-nowrap text-xs"><span className="font-bold">₹ 75,000</span> Pending</span>
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
                        <div key={index} className="border border-gray-100 p-4 rounded-xl hover:border-blue-100 hover:bg-blue-50/50 transition-colors group cursor-pointer">
                           <div className="flex justify-between items-center mb-2">
                              <h3 className="font-bold text-gray-800">{batch.name}</h3>
                              <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-md group-hover:bg-white transition-colors">{batch.strength} Students</span>
                           </div>
                           <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <span>Teacher: <span className="font-medium text-gray-700">{batch.classTeacher}</span></span>
                              <span>Att: <span className={`font-medium ${parseInt(batch.attendance) < 90 ? 'text-red-500' : 'text-green-500'}`}>{batch.attendance}</span></span>
                           </div>
                        </div>
                     ))}
                     {/* Add Batch Placeholder */}
                     <div className="border border-dashed border-gray-300 p-4 rounded-xl flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer bg-gray-50/50">
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
                     <div className="bg-white border border-red-100 p-4 rounded-xl shadow-sm relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                        <h4 className="font-semibold text-gray-800 text-sm">Fee Defaulters</h4>
                        <p className="text-xs text-gray-500 mt-1">12 students have fees overdue by &gt; 30 days.</p>
                        <button className="mt-2 text-xs font-bold text-red-600 hover:underline">View List</button>
                     </div>
                     <div className="bg-white border border-orange-100 p-4 rounded-xl shadow-sm relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                        <h4 className="font-semibold text-gray-800 text-sm">Low Attendance Warning</h4>
                        <p className="text-xs text-gray-500 mt-1">Class 8 attendance dropped below 85% this week.</p>
                        <button className="mt-2 text-xs font-bold text-orange-600 hover:underline">Message Teacher</button>
                     </div>
                     <div className="bg-white border border-blue-100 p-4 rounded-xl shadow-sm relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                        <h4 className="font-semibold text-gray-800 text-sm">Exam Pending Release</h4>
                        <p className="text-xs text-gray-500 mt-1">Maths Mid-Term marks for Class 10 not published.</p>
                        <button className="mt-2 text-xs font-bold text-blue-600 hover:underline">Go to Results</button>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
};

export default AdminDashboard;