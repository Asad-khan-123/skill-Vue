import { UserIcon, BellIcon, LockIcon, ShieldCheckIcon, LogOutIcon } from "lucide-react";
import { useState } from "react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
        <p className="text-gray-500 mt-1">Manage your personal information and preferences.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-50/50 p-6 border-r border-gray-100 flex-shrink-0">
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "profile" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <UserIcon size={18} />
              <span className="font-medium text-sm">Profile Details</span>
            </button>
            <button 
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "notifications" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <BellIcon size={18} />
              <span className="font-medium text-sm">Notifications</span>
            </button>
            <button 
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "security" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <LockIcon size={18} />
              <span className="font-medium text-sm">Security</span>
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          {activeTab === "profile" && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h2>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                 <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-white shadow-md flex items-center justify-center text-blue-600 font-bold text-3xl shrink-0">
                    AK
                 </div>
                 <div className="text-center sm:text-left">
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                       Change Avatar
                    </button>
                    <p className="text-xs text-gray-400 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                 </div>
              </div>

              <form className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">First Name</label>
                    <input type="text" defaultValue="Asad" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">Last Name</label>
                    <input type="text" defaultValue="Khan" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 block">Email Address</label>
                    <input type="email" defaultValue="asad@example.com" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white" />
                  </div>
                   <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 block">Phone Number</label>
                    <input type="text" defaultValue="+91 9876543210" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="button" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="animate-in fade-in duration-300">
               <h2 className="text-xl font-bold text-gray-800 mb-6">Notification Preferences</h2>
               <div className="space-y-4 max-w-2xl">
                  {/* Toggle Component placeholder */}
                  {[
                     { title: "Exam Alerts", desc: "Get notified when exam schedules are published" },
                     { title: "Attendance Warnings", desc: "Receive alerts if attendance falls below 75%" },
                     { title: "Fee Reminders", desc: "Get reminded 3 days before fee due date" },
                  ].map((item, i) => (
                     <div key={i} className="flex items-start justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                        <div>
                           <h3 className="font-medium text-gray-800">{item.title}</h3>
                           <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in mt-1">
                           <input type="checkbox" defaultChecked name="toggle" id={`toggle_${i}`} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-blue-500 appearance-none cursor-pointer translate-x-6 transition-transform duration-200" />
                           <label htmlFor={`toggle_${i}`} className="toggle-label block overflow-hidden h-6 rounded-full bg-blue-500 cursor-pointer"></label>
                        </div>
                     </div>
                  ))}
                  
                  <style>
                     {`
                     .toggle-checkbox:checked { right: 0; border-color: #3b82f6; }
                     .toggle-checkbox:checked + .toggle-label { background-color: #3b82f6; }
                     .toggle-checkbox:not(:checked) { transform: translateX(0); border-color: #d1d5db; }
                     .toggle-checkbox:not(:checked) + .toggle-label { background-color: #d1d5db; }
                     `}
                  </style>
               </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="animate-in fade-in duration-300">
               <h2 className="text-xl font-bold text-gray-800 mb-6">Security Settings</h2>
               
               <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start space-x-4 mb-8">
                  <ShieldCheckIcon className="text-yellow-600 mt-0.5 shrink-0" size={20} />
                  <div>
                     <h3 className="font-medium text-yellow-800">Two-Factor Authentication is disabled</h3>
                     <p className="text-sm text-yellow-700 mt-1 mb-3">Add an extra layer of security to your account by turning on two-factor authentication.</p>
                     <button className="text-sm font-semibold text-yellow-800 bg-yellow-100 hover:bg-yellow-200 px-4 py-2 rounded-lg transition-colors">
                        Enable 2FA
                     </button>
                  </div>
               </div>

               <h3 className="font-semibold text-gray-800 mb-4">Change Password</h3>
               <form className="space-y-4 max-w-md">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700 block">Current Password</label>
                   <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700 block">New Password</label>
                   <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700 block">Confirm New Password</label>
                   <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                 </div>
                 <button type="button" className="bg-gray-800 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-900 transition-colors w-full sm:w-auto">
                   Update Password
                 </button>
               </form>
               
               <div className="mt-12 pt-6 border-t border-gray-100">
                  <button className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium transition-colors">
                     <LogOutIcon size={18} />
                     <span>Log out of all devices</span>
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
