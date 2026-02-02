import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout as logoutApi, getUserAchievements, createOrder } from "../services/api";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import badgeIcon from '../assets/badge.svg';
import { OrderModal } from './OrderModal';

dayjs.extend(relativeTime);

export const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const fetchAchievements = async () => {
    const isAuth = localStorage.getItem("isAuthenticated");
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    
    if (!isAuth || !token || !userId) {
      navigate("/login");
      return;
    }

    try {
      const data = await getUserAchievements(userId, token);
      
      setUserData({
        userName: userName || "User",
        current_badge: data.current_badge || "No Badge Yet",
        next_badge: data.next_badge || "All Unlocked",
        remaining_to_unlock_next_badge: data.remaining_to_unlock_next_badge || 0,
        unlocked_achievements: data.unlocked_achievements.map((achievement, index) => ({
          id: index + 1,
          name: achievement.name,
          icon: achievement.icon,
          date: dayjs(achievement.unlocked_at).fromNow(),
        })),
        next_available_achievements: data.next_available_achievements.map((achievement, index) => ({
          id: index + 100,
          name: achievement.name,
          icon: achievement.icon,
          description: `${achievement.progress.current}/${achievement.progress.required} purchases`,
        })),
      });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      
      if (err.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        setError(err.message || "Failed to load achievements");
      }
    }
  };


  useEffect(() => {
    fetchAchievements();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    
    try {
      await logoutApi(token);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("isAuthenticated");
      navigate("/login");
    }
  };

  const handleCreateOrder = async (amount) => {
    const token = localStorage.getItem("authToken");
    setIsCreatingOrder(true);
    setOrderError(null);

    try {
      await createOrder(amount, token);
      setIsModalOpen(false);
      setSuccessMessage("Order created successfully!");
      
      setIsLoading(true);
      await fetchAchievements();
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setIsCreatingOrder(false);
      
      if (err.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else if (err.status === 422 && err.errors) {
        setOrderError(err.errors.amount?.[0] || "Invalid order amount");
      } else {
        setOrderError(err.message || "Failed to create order");
      }
    }
  };

  const progressPercentage = userData 
    ? ((userData.unlocked_achievements.length / (userData.unlocked_achievements.length + userData.remaining_to_unlock_next_badge)) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your achievements...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold mb-1">Error Loading Achievements</p>
            <p className="text-sm">{error}</p>
          </div>
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-sm bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
              >
                Create Order
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors border border-gray-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {successMessage && (
          <div className="mb-6 bg-teal-50 border border-teal-200 text-teal-700 px-6 py-4 rounded-lg animate-fadeIn">
            <p className="font-semibold">{successMessage}</p>
          </div>
        )}

        <div className="mb-8 animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">Welcome back, {userData.userName}!</h2>
          <p className="text-gray-600">Track your achievements and unlock exclusive rewards</p>
        </div>

        <div className="mb-12 animate-fadeIn">
          <div className="card-clean rounded-xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full tier-badge flex items-center justify-center">
                  <img 
                    src={badgeIcon} 
                    className="w-16 h-16 md:w-20 md:h-20" 
                    alt="Current Badge"
                  />
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

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setOrderError(null);
        }}
        onSubmit={handleCreateOrder}
        isLoading={isCreatingOrder}
        error={orderError}
      />
    </div>
  );
};
