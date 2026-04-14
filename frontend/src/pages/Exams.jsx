import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";

const Exams = () => {
  const upcomingExams = [
    { id: 1, subject: "Mathematics - Mid Term", date: "April 20, 2026", time: "10:00 AM - 1:00 PM", room: "Hall B" },
    { id: 2, subject: "Physics - Practical", date: "April 25, 2026", time: "09:00 AM - 12:00 PM", room: "Lab 3" },
    { id: 3, subject: "Chemistry - Theory", date: "May 2, 2026", time: "11:00 AM - 2:00 PM", room: "Hall A" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Exam Schedule</h1>
        <p className="text-gray-500 mt-1">View your upcoming examinations and seat allocations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-lg text-gray-800 mb-2">Upcoming Tests</h2>
          
          {upcomingExams.map((exam) => (
            <div key={exam.id} className="bg-white border text-left border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-blue-500">
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-3">{exam.subject}</h3>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                    <CalendarIcon size={16} className="text-blue-500" />
                    <span>{exam.date}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                    <ClockIcon size={16} className="text-blue-500" />
                    <span>{exam.time}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                    <MapPinIcon size={16} className="text-blue-500" />
                    <span>{exam.room}</span>
                  </div>
                </div>
              </div>
              
              <div className="shrink-0 flex sm:flex-col justify-end gap-2 text-right">
                <span className="bg-blue-50 text-blue-700 font-medium text-xs px-3 py-1 rounded-full w-max">Mandatory</span>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar info */}
        <div>
           <div className="bg-gradient-to-b from-[#1e2640] to-gray-900 rounded-2xl p-6 text-white shadow-lg sticky top-6">
             <h3 className="font-bold text-lg mb-4 text-blue-400">Important Instructions</h3>
             <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                   <p>Students must report to the examination hall 30 minutes before the scheduled time.</p>
                </li>
                <li className="flex gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                   <p>Admit card and institutional ID are mandatory for entry.</p>
                </li>
                <li className="flex gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                   <p>Electronic gadgets, smartwatches, and programmable calculators are strictly prohibited.</p>
                </li>
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Exams;
