import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Mock data - in production this would come from API
const mockUserData = {
  userName: "John Doe",
  current_badge: "Bronze Member",
  next_badge: "Silver Member",
  remaining_to_unlock_next_badge: 3,
  unlocked_achievements: [
    { id: 1, name: "First Purchase", icon: "🎯", date: "2 days ago" },
    { id: 2, name: "Early Adopter", icon: "⭐", date: "5 days ago" },
    { id: 3, name: "Weekend Warrior", icon: "🔥", date: "1 week ago" },
    { id: 4, name: "Loyal Customer", icon: "💎", date: "2 weeks ago" },
    { id: 5, name: "Big Spender", icon: "💰", date: "3 weeks ago" }
  ],
  next_available_achievements: [
    { id: 6, name: "Bulk Buyer", icon: "📦", description: "Purchase 10+ items in one order" },
    { id: 7, name: "Product Explorer", icon: "🔍", description: "Browse 50+ products" },
    { id: 8, name: "Review Master", icon: "✍️", description: "Write 5 product reviews" }
  ]
};

export const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      navigate("/login");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setUserData(mockUserData);
      setIsLoading(false);
    }, 500);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const progressPercentage = userData 
    ? ((userData.unlocked_achievements.length / (userData.unlocked_achievements.length + userData.remaining_to_unlock_next_badge)) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold font-brand text-teal-600">
              BADGER
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors border border-gray-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">Welcome back, {userData.userName}!</h2>
          <p className="text-gray-600">Track your achievements and unlock exclusive rewards</p>
        </div>

        <div className="mb-12 animate-fadeIn">
          <div className="card-clean rounded-xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full tier-badge flex items-center justify-center">
                  <svg className="w-16 h-16 md:w-20 md:h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <p className="text-sm text-teal-600 mb-2 font-semibold uppercase tracking-wide">Current Badge</p>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  {userData.current_badge}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress to {userData.next_badge}</span>
                    <span className="text-teal-600 font-semibold">
                      {userData.remaining_to_unlock_next_badge} purchases away
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-teal-500 transition-all duration-1000 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12 animate-fadeIn">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900">
            <span>Your Achievements</span>
            <span className="text-sm font-normal text-teal-700 bg-teal-100 px-3 py-1 rounded-full">
              {userData.unlocked_achievements.length}
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData.unlocked_achievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className="card-clean rounded-xl p-6 transition-all duration-200 animate-fadeIn"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center text-2xl">
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1 truncate">{achievement.name}</h4>
                    <p className="text-xs text-gray-500">Earned {achievement.date}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-teal-600 text-sm">
                    <span className="font-medium">✓ Completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fadeIn">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900">
            <span>Available Achievements</span>
            <span className="text-sm font-normal text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
              {userData.next_available_achievements.length} available
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData.next_available_achievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className="card-clean rounded-xl p-6 opacity-70 transition-all duration-200 animate-fadeIn"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl grayscale opacity-50">
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-700 mb-1 truncate">{achievement.name}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2">{achievement.description}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span>🔒 Locked</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};