import { useState } from "react";
import { CheckCircleIcon, XCircleIcon, SearchIcon, CalendarIcon, UsersIcon } from "lucide-react";

const Attendance = () => {
   const [activeBatch, setActiveBatch] = useState("Class 10");
   const [selectedDate, setSelectedDate] = useState("2026-04-14");
   const batches = ["Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];

   const [attendanceList, setAttendanceList] = useState([
      { id: "STU-1001", name: "Rahul Sharma", status: 'present' },
      { id: "STU-1002", name: "Priya Patel", status: 'present' },
      { id: "STU-1003", name: "Amit Kumar", status: 'none' },
      { id: "STU-1004", name: "Sneha Gupta", status: 'none' },
      { id: "STU-1005", name: "Vikram Singh", status: 'absent' },
      { id: "STU-1006", name: "Anjali Desai", status: 'present' },
   ]);

   const handleToggle = (id) => {
      setAttendanceList(prev => prev.map(s => {
         if (s.id === id) {
            const nextStatus = s.status === 'none' ? 'present' : s.status === 'present' ? 'absent' : 'none';
            return { ...s, status: nextStatus };
         }
         return s;
      }));
   };

   const markAllPresent = () => {
      setAttendanceList(prev => prev.map(s => ({ ...s, status: 'present' })));
   };

   return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
               <h1 className="text-3xl font-bold text-gray-800">Batch Attendance</h1>
               <p className="text-gray-500 mt-1">Quickly mark daily attendance for entire batches.</p>
            </div>
            <div className="flex space-x-3">
               <button onClick={markAllPresent} className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium px-4 py-2.5 rounded-xl transition-colors shrink-0 border border-gray-200">
                  Mark All Present
               </button>
               <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-colors shadow-blue-200 shrink-0">
                  Save Attendance
               </button>
            </div>
         </div>

         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
            {/* Control Panel */}
            <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row gap-6 bg-gray-50/50">
               
               {/* Controls */}
               <div className="flex-1 flex flex-wrap gap-4">
                  <div className="space-y-1.5 w-full sm:w-48">
                     <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5">
                        <UsersIcon size={14} /> Batch
                     </label>
                     <select 
                        value={activeBatch} 
                        onChange={e => setActiveBatch(e.target.value)}
                        className="w-full bg-white border border-gray-200 text-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow appearance-none cursor-pointer"
                     >
                        {batches.map(b => <option key={b} value={b}>{b}</option>)}
                     </select>
                  </div>
                  
                  <div className="space-y-1.5 w-full sm:w-48">
                     <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5">
                        <CalendarIcon size={14} /> Date
                     </label>
                     <input 
                        type="date" 
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="w-full bg-white border border-gray-200 text-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                     />
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-[200px]">
                     <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5">
                        <SearchIcon size={14} /> Search Student
                     </label>
                     <div className="relative">
                        <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                           type="text" 
                           placeholder="Filter by name..."
                           className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                        />
                     </div>
                  </div>
               </div>

               {/* Stats Overview */}
               <div className="flex gap-4 items-center shrink-0 border-l border-gray-200 pl-6">
                  <div className="text-center">
                     <p className="text-2xl font-bold text-green-600">{attendanceList.filter(s => s.status === 'present').length}</p>
                     <p className="text-xs text-gray-500 uppercase font-medium">Present</p>
                  </div>
                  <div className="text-center">
                     <p className="text-2xl font-bold text-red-600">{attendanceList.filter(s => s.status === 'absent').length}</p>
                     <p className="text-xs text-gray-500 uppercase font-medium">Absent</p>
                  </div>
                  <div className="text-center">
                     <p className="text-2xl font-bold text-gray-400">{attendanceList.filter(s => s.status === 'none').length}</p>
                     <p className="text-xs text-gray-500 uppercase font-medium">Unmarked</p>
                  </div>
               </div>
            </div>

            {/* Attendance Grid */}
            <div className="p-6 bg-white shrink-[3] z-10 min-h-32">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {attendanceList.map(student => {
                     let cardClass = "border-gray-200 hover:border-gray-300 bg-white";
                     let icon = <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
                     
                     if (student.status === 'present') {
                        cardClass = "border-green-500 bg-green-50 shadow-sm shadow-green-100 ring-1 ring-green-500";
                        icon = <CheckCircleIcon size={20} className="text-green-600 drop-shadow-sm" />;
                     } else if (student.status === 'absent') {
                        cardClass = "border-red-500 bg-red-50 shadow-sm shadow-red-100 ring-1 ring-red-500";
                        icon = <XCircleIcon size={20} className="text-red-600 drop-shadow-sm" />;
                     }

                     return (
                        <div 
                           key={student.id}
                           onClick={() => handleToggle(student.id)}
                           className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group select-none hover:-translate-y-0.5 ${cardClass}`}
                        >
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-white flex items-center justify-center text-gray-600 font-bold text-sm shadow-sm">
                                 {student.name.split(' ').map(n=>n[0]).join('')}
                              </div>
                              <div>
                                 <h3 className="font-semibold text-gray-800 text-sm">{student.name}</h3>
                                 <p className="text-xs text-gray-500">{student.id}</p>
                              </div>
                           </div>
                           <div className="transition-transform group-hover:scale-110">
                              {icon}
                           </div>
                        </div>
                     )
                  })}
               </div>
            </div>
         </div>
      </div>
   );
};

export default Attendance;