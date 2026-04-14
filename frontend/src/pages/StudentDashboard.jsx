import { CalendarIcon, BellIcon, BookOpenIcon, TrendingUpIcon, AwardIcon } from "lucide-react";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const upcomingEvents = [
    { title: "Mathematics Mid-Term", date: "Tomorrow, 10:00 AM", type: "Exam", color: "red" },
    { title: "Physics Assignment Due", date: "Apr 15, 2026", type: "Task", color: "yellow" },
    { title: "Chemistry Practical", date: "Apr 18, 2026", type: "Lab", color: "blue" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 p-8 bg-gradient-to-r from-indigo-700 to-purple-800 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
           <AwardIcon size={120} />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Asad! 👋</h1>
          <p className="text-indigo-100 max-w-xl">You've attended 92% of your classes this week. Keep up the great work and stay focused for your upcoming mid-terms.</p>
          
          <div className="mt-8 flex gap-4">
             <Link to="/exams" className="bg-white text-indigo-700 px-5 py-2.5 rounded-xl font-medium shadow-md hover:bg-gray-50 transition-colors">
               View Schedule
             </Link>
             <Link to="/results" className="bg-indigo-600/50 hover:bg-indigo-600 border border-indigo-400 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-medium transition-colors">
               See Results
             </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
           <div className="bg-green-100 p-4 rounded-2xl text-green-600">
              <TrendingUpIcon size={24} />
           </div>
           <div>
              <p className="text-gray-500 text-sm font-medium">Class Rank</p>
              <h3 className="text-2xl font-bold text-gray-800">Top 5%</h3>
           </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
           <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
              <BookOpenIcon size={24} />
           </div>
           <div>
              <p className="text-gray-500 text-sm font-medium">Assignments</p>
              <h3 className="text-2xl font-bold text-gray-800">12 / 14 Completed</h3>
           </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
           <div className="bg-purple-100 p-4 rounded-2xl text-purple-600">
              <CalendarIcon size={24} />
           </div>
           <div>
              <p className="text-gray-500 text-sm font-medium">Overall Attendance</p>
              <h3 className="text-2xl font-bold text-gray-800">94.5%</h3>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Upcoming Schedule */}
         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
               <h2 className="font-bold text-lg text-gray-800">Upcoming Schedule</h2>
               <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-4">
               {upcomingEvents.map((event, i) => (
                 <div key={i} className="flex items-start space-x-4 p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors group">
                    <div className={`p-2.5 rounded-lg bg-${event.color}-100 text-${event.color}-600 shrink-0`}>
                       <BellIcon size={18} className="group-hover:animate-bounce" />
                    </div>
                    <div>
                       <h3 className="font-semibold text-gray-800">{event.title}</h3>
                       <p className="text-sm text-gray-500 mt-1">{event.date}</p>
                    </div>
                    <div className="ml-auto">
                       <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-${event.color}-50 text-${event.color}-700`}>
                          {event.type}
                       </span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Subject Progress */}
         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg text-gray-800 mb-6">Course Progress</h2>
            <div className="space-y-6">
               {[
                  { subject: "Mathematics", progress: 85, color: "bg-blue-500" },
                  { subject: "Physics", progress: 70, color: "bg-purple-500" },
                  { subject: "Chemistry", progress: 60, color: "bg-green-500" },
                  { subject: "Computer Science", progress: 95, color: "bg-yellow-500" },
               ].map((course, i) => (
                  <div key={i}>
                     <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-700">{course.subject}</span>
                        <span className="text-gray-500 font-medium">{course.progress}%</span>
                     </div>
                     <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className={`${course.color} h-2.5 rounded-full`} style={{ width: `${course.progress}%` }}></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default StudentDashboard;