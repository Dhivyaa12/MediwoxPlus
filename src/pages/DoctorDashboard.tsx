import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  Star,
  BarChart3,
} from 'lucide-react';
import { doctors } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const DoctorDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');
  const { user } = useAuth();
  const doctorData = doctors.find((doc) => doc.name === user?.name);
  const [ratingScore, setRatingScore] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!doctorData?.id || !selectedDate || !doctorData.specialty) return;

        const response = await fetch(
          `https://9dkceq681h.execute-api.ap-southeast-2.amazonaws.com/prod/appointment/doctor/${doctorData.id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              doctorId: doctorData.id,
              date: selectedDate,
              specialty: doctorData.specialty,
              viewMode,
            }),
          }
        );

        const data = await response.json();
        setAppointments(data.appointments || []);
        setChartData(data.chartData || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorData, selectedDate, viewMode]);

  useEffect(() => {
    if (!doctorData) return;
    let current = 0;
    const end = doctorData.rating;
    const step = end / 60;
    const interval = setInterval(() => {
      current += step;
      if (current >= end) {
        current = end;
        clearInterval(interval);
      }
      setRatingScore(parseFloat(current.toFixed(1)));
    }, 20);
    return () => clearInterval(interval);
  }, [doctorData]);

  const filteredAppointments = appointments.filter((apt) => {
    return apt.appointmentDate === selectedDate;
  });

  const todayStats = {
    total: filteredAppointments.length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-8">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"
        style={{
          backgroundImage: "url('public/medical video/doctoe dashboad bg image.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/75 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-6">
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome, {user?.name}!
                </h1>
                <p className="text-gray-600">
                  Manage your appointments and patient care
                </p>
                {doctorData && (
                  <div className="mt-4 flex items-center space-x-3">
                    <div className="relative w-14 h-14">
                      <svg className="absolute top-0 left-0 w-full h-full">
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          stroke="#e5e7eb"
                          strokeWidth="5"
                          fill="none"
                        />
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          stroke={doctorData.rating >= 4.5
                            ? '#22c55e'
                            : doctorData.rating >= 3.0
                            ? '#facc15'
                            : '#ef4444'}
                          strokeWidth="5"
                          fill="none"
                          strokeDasharray={`${(doctorData.rating / 5) * 150}, 150`}
                          transform="rotate(-90 28 28)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-sm font-semibold text-gray-800">
                        <span>{ratingScore.toFixed(1)}</span>
                        <Star className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-700">Doctor Rating</p>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right space-y-2">
              <p className="text-sm text-gray-600">Today's Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <StatCard
            icon={<Calendar className="text-blue-600 w-6 h-6" />}
            label="Total Today"
            value={todayStats.total}
          />
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              Patients Per {viewMode === 'daily' ? 'Day' : 'Month'}
            </h2>
            <button
              onClick={() => setViewMode(viewMode === 'daily' ? 'monthly' : 'daily')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all"
            >
              Toggle to {viewMode === 'daily' ? 'Monthly' : 'Daily'}
            </button>
          </div>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={viewMode === 'daily' ? 'day' : 'month'} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="patients" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/75 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filter Appointments</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/75 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-lg p-6 transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Appointments for {new Date(selectedDate).toLocaleDateString()}
            </h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {filteredAppointments.length} appointments
            </span>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</h3>
              <p className="text-gray-600">No appointments found for the selected date and doctor.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.appointmentId}
                  className="border border-gray-200 rounded-lg p-6 bg-white/80 backdrop-blur-md cursor-pointer hover:shadow-xl transition-transform hover:scale-[1.01]"
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {appointment.patientName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Symptoms:</strong> {appointment.symptoms}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Email:</strong> {appointment.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Date:</strong> {appointment.appointmentDate}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-opacity">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md relative shadow-lg animate-fade-in-up">
            <button
              onClick={() => setSelectedAppointment(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Appointment Details
            </h2>
            <p><strong>Patient:</strong> {selectedAppointment.patientName}</p>
            <p><strong>Email:</strong> {selectedAppointment.email}</p>
            <p><strong>Symptoms:</strong> {selectedAppointment.symptoms}</p>
            <p><strong>Date:</strong> {selectedAppointment.appointmentDate}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) => (
  <div className="bg-white/75 backdrop-blur-sm p-6 rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.01] transition-transform flex items-center space-x-4">
    <div>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-gray-600">{label}</p>
    </div>
  </div>
);

export default DoctorDashboard;



