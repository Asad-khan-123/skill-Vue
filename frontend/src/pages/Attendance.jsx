import { useState, useEffect } from "react";
import { CheckCircleIcon, XCircleIcon, SearchIcon, CalendarIcon, UsersIcon, Loader2Icon, HistoryIcon, ClipboardCheckIcon, ChevronRightIcon } from "lucide-react";
import api from "../api.js";

const Attendance = () => {
   const [mode, setMode] = useState("mark"); // "mark" or "history"
   const [activeBatch, setActiveBatch] = useState("");
   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
   const [batches, setBatches] = useState([]);
   
   const [attendanceList, setAttendanceList] = useState([]);
   const [historyList, setHistoryList] = useState([]);
   const [loading, setLoading] = useState(false);
   const [historyLoading, setHistoryLoading] = useState(false);
   const [saving, setSaving] = useState(false);

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
      if (mode === "mark") {
         fetchAttendance();
      } else {
         fetchHistory();
      }
   }, [activeBatch, selectedDate, mode]);

   const fetchAttendance = async () => {
      if(!activeBatch || !selectedDate) return;
      setLoading(true);
      try {
         const { data } = await api.get(`/attendance/batch?batch=${activeBatch}&date=${selectedDate}`);
         if (data.success) {
            const hydratedRecords = data.records.map(r => ({
               id: r.student._id,
               studentId: r.student.studentId,
               name: r.student.name,
               status: r.status
            }));
            setAttendanceList(hydratedRecords);
         }
      } catch (err) {
         console.error("Failed to fetch attendance:", err);
         setAttendanceList([]);
      } finally {
         setLoading(false);
      }
   };

   const fetchHistory = async () => {
      if(!activeBatch) return;
      setHistoryLoading(true);
      try {
         const { data } = await api.get(`/attendance/history?batch=${activeBatch}`);
         if (data.success) {
            setHistoryList(data.history);
         }
      } catch (err) {
         console.error("Failed to fetch history:", err);
      } finally {
         setHistoryLoading(false);
      }
   };

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

   const saveAttendance = async () => {
      setSaving(true);
      try {
         const records = attendanceList.map(s => ({
            student: s.id,
            status: s.status
         }));

         const payload = {
            batch: activeBatch,
            date: selectedDate,
            records
         };
         
         const { data } = await api.post('/attendance/batch', payload);
         if(data.success) {
            alert('Attendance saved successfully!');
         }
      } catch (err) {
         console.error("Failed to save attendance:", err);
         alert("Could not save attendance to database.");
      } finally {
         setSaving(false);
      }
   };

   return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
               <h1 className="text-3xl font-bold text-gray-800">Attendance Center</h1>
               <p className="text-gray-500 mt-1">Manage daily presence and track historical records.</p>
            </div>
            
            <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200 shadow-sm">
               <button 
                  onClick={() => setMode("mark")}
                  className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === "mark" ? "bg-white text-blue-600 shadow-md" : "text-gray-500 hover:text-gray-700"}`}
               >
                  <ClipboardCheckIcon size={18} />
                  Mark Daily
               </button>
               <button 
                  onClick={() => setMode("history")}
                  className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === "history" ? "bg-white text-blue-600 shadow-md" : "text-gray-500 hover:text-gray-700"}`}
               >
                  <HistoryIcon size={18} />
                  View Logs
               </button>
            </div>
         </div>

         {/* Batch Selector (Sticky/Shared) */}
         <div className="bg-white rounded-t-2xl border border-gray-100 p-4 md:p-6 shadow-sm border-b-0">
            <div className="flex flex-wrap items-center gap-4">
               <div className="space-y-1.5 w-full sm:w-64">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                     <UsersIcon size={12} /> Select Batch
                  </label>
                  <select 
                     value={activeBatch} 
                     onChange={e => setActiveBatch(e.target.value)}
                     className="w-full bg-gray-50 border border-gray-100 text-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold appearance-none cursor-pointer"
                  >
                     {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>
               </div>
               
               {mode === "mark" && (
                  <div className="space-y-1.5 w-full sm:w-48">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <CalendarIcon size={12} /> Date
                     </label>
                     <input 
                        type="date" 
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 text-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold"
                     />
                  </div>
               )}

               <div className="ml-auto hidden md:flex items-center gap-4">
                  <div className="text-right">
                     <p className="text-xs text-gray-400 font-bold uppercase">Today is</p>
                     <p className="text-sm font-bold text-gray-800">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
            {mode === "mark" ? (
               <>
                  <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                     <div className="flex gap-6 items-center shrink-0">
                        <div className="text-center">
                           <p className="text-2xl font-black text-green-600">{attendanceList.filter(s => s.status === 'present').length}</p>
                           <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">Present</p>
                        </div>
                        <div className="text-center">
                           <p className="text-2xl font-black text-red-500">{attendanceList.filter(s => s.status === 'absent').length}</p>
                           <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">Absent</p>
                        </div>
                        <div className="text-center">
                           <p className="text-2xl font-black text-gray-300">{attendanceList.filter(s => s.status === 'none').length}</p>
                           <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">Unmarked</p>
                        </div>
                     </div>
                     <div className="flex gap-3 w-full md:w-auto">
                        <button onClick={markAllPresent} disabled={loading || attendanceList.length === 0} className="flex-1 md:flex-none bg-white text-gray-600 hover:bg-gray-50 font-bold px-4 py-2.5 rounded-xl transition-all border border-gray-200 disabled:opacity-50 text-sm shadow-sm">
                           All Present
                        </button>
                        <button onClick={saveAttendance} disabled={saving || loading || attendanceList.length === 0} className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all shadow-green-100 flex items-center justify-center gap-2 text-sm border border-green-700">
                           {saving ? <Loader2Icon size={16} className="animate-spin" /> : <ClipboardCheckIcon size={16} />}
                           <span>Submit</span>
                        </button>
                     </div>
                  </div>

                  <div className="p-6">
                     {loading ? (
                        <div className="flex flex-col justify-center items-center h-64 gap-3">
                           <Loader2Icon className="animate-spin text-blue-600" size={32} />
                           <p className="text-sm font-bold text-gray-400 animate-pulse">Syncing Roster...</p>
                        </div>
                     ) : attendanceList.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-64 text-gray-400 gap-2 italic">
                           <UsersIcon size={48} className="opacity-10 mb-2" />
                           No students enrolled in this batch yet.
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                           {attendanceList.map(student => {
                              let statusClass = "bg-white border-gray-100 hover:border-blue-200";
                              let indicator = <div className="w-5 h-5 rounded-full border-2 border-gray-200" />;
                              
                              if (student.status === 'present') {
                                 statusClass = "bg-green-50 border-green-200 ring-2 ring-green-100 ring-offset-2";
                                 indicator = <CheckCircleIcon size={22} className="text-green-600 fill-white" />;
                              } else if (student.status === 'absent') {
                                 statusClass = "bg-red-50 border-red-200 ring-2 ring-red-100 ring-offset-2";
                                 indicator = <XCircleIcon size={22} className="text-red-500 fill-white" />;
                              }

                              return (
                                 <div 
                                    key={student.id}
                                    onClick={() => handleToggle(student.id)}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group select-none ${statusClass}`}
                                 >
                                    <div className="flex items-center gap-3">
                                       <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-blue-600 font-black text-xs shadow-sm shadow-blue-50">
                                          {student.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                                       </div>
                                       <div>
                                          <h3 className="font-bold text-gray-800 text-sm whitespace-nowrap truncate max-w-[120px]">{student.name}</h3>
                                          <p className="text-[10px] text-gray-400 font-bold font-mono tracking-tighter">{student.studentId}</p>
                                       </div>
                                    </div>
                                    <div className="transition-transform group-hover:scale-110">
                                       {indicator}
                                    </div>
                                 </div>
                              )
                           })}
                        </div>
                     )}
                  </div>
               </>
            ) : (
               /* ATTENDANCE LOGS VIEW */
               <div className="p-0 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-6 border-b border-gray-100 bg-gray-50/30">
                     <h3 className="text-xl font-bold text-gray-800 mb-1">Attendance History</h3>
                     <p className="text-sm text-gray-500">Log of all submitted attendance for {activeBatch && batches.find(b=>b._id === activeBatch)?.name}.</p>
                  </div>
                  
                  <div className="p-6">
                     {historyLoading ? (
                        <div className="flex flex-col justify-center items-center h-64 gap-3">
                           <Loader2Icon className="animate-spin text-blue-600" size={32} />
                           <p className="text-sm font-bold text-gray-400 animate-pulse">Loading Archives...</p>
                        </div>
                     ) : historyList.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                           <HistoryIcon size={40} className="mx-auto text-gray-300 mb-3" />
                           <p className="text-gray-400 font-medium">No records found for this batch.</p>
                        </div>
                     ) : (
                        <div className="space-y-3">
                           {historyList.map((log, idx) => {
                              const present = log.records.filter(r => r.status === 'present').length;
                              const absent = log.records.filter(r => r.status === 'absent').length;
                              const total = log.records.length;
                              const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

                              return (
                                 <div key={log._id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all cursor-default">
                                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                                       <div className="w-12 h-12 bg-blue-50 rounded-xl flex flex-col items-center justify-center text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                          <span className="text-[10px] font-black uppercase leading-none opacity-60">{new Date(log.date).toLocaleString('default', { month: 'short' })}</span>
                                          <span className="text-lg font-black leading-none">{new Date(log.date).getDate()}</span>
                                       </div>
                                       <div>
                                          <h4 className="font-bold text-gray-800">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                                          <div className="flex items-center gap-3 mt-1">
                                             <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-black rounded uppercase border border-green-100">{present} Present</span>
                                             <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-black rounded uppercase border border-red-100">{absent} Absent</span>
                                          </div>
                                       </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-6">
                                       <div className="text-right">
                                          <p className="text-xs text-gray-400 font-black uppercase tracking-tighter">Day Score</p>
                                          <p className="text-xl font-black text-gray-800">{percentage}%</p>
                                       </div>
                                       <button 
                                          onClick={() => {
                                             setSelectedDate(log.date);
                                             setMode("mark");
                                          }}
                                          className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-gray-100"
                                       >
                                          <ChevronRightIcon size={20} />
                                       </button>
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     )}
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default Attendance;