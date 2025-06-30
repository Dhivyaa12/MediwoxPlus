import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Award, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // ensure this exists

const Hero: React.FC = () => {
  const [showSecondLine, setShowSecondLine] = useState(false);
  const totalLoopDuration = 10000;
  const navigate = useNavigate();
  const { user } = useAuth(); // assume AuthContext provides user

  useEffect(() => {
    let secondLineTimeout: ReturnType<typeof setTimeout>;
    let loopResetInterval: ReturnType<typeof setInterval>;

    const startAnimationCycle = () => {
      setShowSecondLine(false);
      secondLineTimeout = setTimeout(() => {
        setShowSecondLine(true);
      }, 500);
    };

    startAnimationCycle();
    loopResetInterval = setInterval(startAnimationCycle, totalLoopDuration);

    return () => {
      clearTimeout(secondLineTimeout);
      clearInterval(loopResetInterval);
    };
  }, []);

  const handleBookAppointment = () => {
    if (!user) {
      navigate('/patient-login');
    } else {
      navigate('/book-appointment');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-white to-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-sky-200/20 to-transparent z-0"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-snug">
                <span className="block overflow-hidden whitespace-nowrap pr-1 animate-type-full-sentence-loop">
                  <span className="inline-block text-black">Your Health,</span>
                  <span className={`block ${showSecondLine ? 'animate-type-second-line' : 'w-0 overflow-hidden'} text-blue-600`}>
                    Our Priority
                  </span>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mt-6 leading-relaxed max-w-2xl animate-fade-in-up delay-[10.5s]">
                Experience world-class healthcare with expert doctors, modern facilities, and compassionate care.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-[10.8s]">
              <button
                onClick={() => navigate('/patient-login')}
                className="transition-all transform bg-blue-600 text-white px-8 py-4 rounded-full shadow-md hover:bg-blue-700 hover:scale-105 duration-300 text-center font-semibold"
              >
                Patient Portal
              </button>
              <button
                onClick={handleBookAppointment}
                className="transition-all transform border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full hover:bg-blue-600 hover:text-white hover:scale-105 duration-300 text-center font-semibold"
              >
                Book Appointment
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 animate-fade-in-up delay-[11.1s]">
              {[
                {
                  icon: <Users className="h-8 w-8 text-blue-600" />,
                  label: 'Expert Doctors',
                  value: '150+',
                  bg: 'bg-blue-50',
                },
                {
                  icon: <Calendar className="h-8 w-8 text-green-600" />,
                  label: 'Patients Served',
                  value: '50K+',
                  bg: 'bg-green-50',
                },
                {
                  icon: <Award className="h-8 w-8 text-purple-600" />,
                  label: 'Awards Won',
                  value: '25+',
                  bg: 'bg-purple-50',
                },
                {
                  icon: <Star className="h-8 w-8 text-yellow-600" />,
                  label: 'Rating',
                  value: '4.8',
                  bg: 'bg-yellow-50',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="text-center group transition-all duration-300 hover:shadow-xl hover:scale-105 rounded-lg bg-white p-4"
                >
                  <div
                    className={`${item.bg} p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-3 group-hover:rotate-6 transition-transform`}
                  >
                    {item.icon}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  <p className="text-gray-600 text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative animate-fade-in-right delay-[0.5s]">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white hover:scale-105 transition-transform duration-500">
              <img
                src="/medical video/fist image.webp"
                alt="Modern Hospital"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
