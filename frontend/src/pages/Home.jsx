import { SignOutButton, useUser } from '@clerk/react';
import { BookOpen, UserCheck, CreditCard } from 'lucide-react';

const Home = () => {
  const { user } = useUser();

  const cards = [
    {
      title: 'My Courses',
      description: 'View your enrolled subjects and study materials',
      icon: <BookOpen className="text-blue-500 w-8 h-8" />,
      color: 'bg-blue-50',
    },
    {
      title: 'Attendance',
      description: 'Check your current semester attendance records',
      icon: <UserCheck className="text-green-500 w-8 h-8" />,
      color: 'bg-green-50',
    },
    {
      title: 'Fees Status',
      description: 'Review fee payment history and pending dues',
      icon: <CreditCard className="text-purple-500 w-8 h-8" />,
      color: 'bg-purple-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 w-full px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200">
            <span className="text-blue-800 font-bold text-xs">LOGO</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 hidden sm:block">UMA Dashboard</h1>
        </div>

        <div className="flex items-center gap-6">
          {user && (
            <div className="full items-center gap-3 hidden md:flex">
                <img src={user.imageUrl} alt="Profile" className="w-9 h-9 rounded-full border border-gray-200" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800 leading-tight">{user.fullName || "Student"}</span>
                  <span className="text-xs text-gray-500">{user.primaryEmailAddress?.emailAddress}</span>
                </div>
            </div>
          )}
          <SignOutButton signOutOptions={{ redirectUrl: '/' }}>
            <button className="text-sm font-medium px-5 py-2.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition flex items-center gap-2">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back! 🎉</h2>
          <p className="text-gray-600 font-medium">Here's an overview of your academic progress.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col group"
            >
              <div className={`w-14 h-14 ${card.color} rounded-xl flex items-center justify-center mb-6 shrink-0`}>
                {card.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                {card.description}
              </p>
              
              <div className="mt-auto flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                View Details 
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
