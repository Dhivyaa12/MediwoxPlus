import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Award, Clock, Calendar, Heart, Users } from 'lucide-react';
import { doctors, specialties, clinic } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const scrollAnimation = `
@keyframes scrollUp {
  0% { transform: translateY(0%); }
  100% { transform: translateY(-50%); }
}

@keyframes flashIn {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-flash-in {
  animation: flashIn 0.5s ease-out forwards;
}`;

const PatientDashboard: React.FC = () => {
const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
const { user } = useAuth();
const [animateIn, setAnimateIn] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => setAnimateIn(true), 100);
  return () => clearTimeout(timer);
}, []);

  const filteredDoctors = selectedSpecialty === 'all'
    ? doctors
    : doctors.filter(doctor => doctor.specialty.toLowerCase() === selectedSpecialty.toLowerCase());

  const groupedDoctors: typeof doctors[][] = [];
  for (let i = 0; i < filteredDoctors.length; i += selectedSpecialty === 'all' ? 3 : filteredDoctors.length) {
    groupedDoctors.push(filteredDoctors.slice(i, i + (selectedSpecialty === 'all' ? 3 : filteredDoctors.length)));
  }

  return (
<div
  className={`min-h-screen bg-fixed bg-cover bg-center bg-no-repeat transition-opacity duration-1000 font-sans ${animateIn ? 'opacity-100' : 'opacity-0'}`}
  style={{ backgroundImage: `url('https://telehealth.asus.com/image/scenario/Family_Health_Mangement/Family_Health_Mangement-4_desktop_2x.jpg')` }}

>

      <style>{scrollAnimation}</style>
      <div className="min-h-screen flex flex-col items-center px-4 py-10 space-y-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-screen-xl bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 md:p-12 text-gray-900">
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-1 font-serif">Welcome, {user?.name  || 'Patient'}!</h1>
            <p className="text-lg text-gray-700 font-light">Manage your health and appointments with ease.</p>
          </div>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Link to="/book-appointment" className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 hover:scale-105 transition transform font-medium">
              <Calendar className="h-8 w-8 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Book Appointment</h3>
              <p className="text-blue-100">Schedule a visit with our doctors</p>
            </Link>
            <div className="bg-green-600 text-white p-6 rounded-lg hover:scale-105 transition transform font-medium">
              <Users className="h-8 w-8 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Available Doctors</h3>
              <p className="text-green-100">{doctors.length} ready to help</p>
            </div>
            <div className="bg-purple-600 text-white p-6 rounded-lg hover:scale-105 transition transform font-medium">
              <Star className="h-8 w-8 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Clinic Rating</h3>
              <p className="text-purple-100">{clinic.rating}/5.0 from {clinic.reviews} reviews</p>
            </div>
          </motion.div>

          <h2 className="text-3xl font-bold mb-6 font-serif">About {clinic.name}</h2>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            {[{
              icon: <Award className="h-8 w-8 text-blue-600" />, title: 'Ranking', value: clinic.ranking
            }, {
              icon: <Users className="h-8 w-8 text-green-600" />, title: 'Patients Served', value: `${clinic.totalPatients.toLocaleString()}+`
            }, {
              icon: <Heart className="h-8 w-8 text-purple-600" />, title: 'Expert Doctors', value: `${clinic.totalDoctors}+ specialists`
            }, {
              icon: <Star className="h-8 w-8 text-yellow-600" />, title: 'Patient Rating', value: `${clinic.rating}/5.0 stars`
            }].map((item, i) => (
              <div key={i} className="text-center font-medium">
                <div className="mb-2 flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-semibold font-serif">{item.title}</h3>
                <p className="text-gray-600">{item.value}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Specialties */}
        <motion.div className="w-full max-w-screen-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
         <h2 className="text-3xl font-bold mb-6 text-white font-serif text-center transform-gpu hover:translate-z-2 hover:scale-105 transition duration-500 drop-shadow-[2px_4px_6px_rgba(0,0,0,0.4)] border border-black px-4 py-2 rounded-lg">
  Browse by Specialty
</h2>


          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-10">
            <button
              onClick={() => setSelectedSpecialty('all')}
              className={`p-3 rounded-lg text-center font-medium transition-all hover:scale-105 ${
                selectedSpecialty === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              <div className="text-2xl mb-1">🏥</div>
              All
            </button>
            {specialties.map((specialty) => (
              <button
                key={specialty.name}
                onClick={() => setSelectedSpecialty(specialty.name)}
                className={`p-3 rounded-lg text-center font-medium transition-all hover:scale-105 ${
                  selectedSpecialty === specialty.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
              >
                <div className="text-2xl mb-1">{specialty.icon}</div>
                {specialty.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Doctors */}
        <motion.div className="w-full max-w-screen-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <h2 className="text-3xl font-bold mb-2 text-white font-serif text-center border border-black px-4 py-2 rounded-lg drop-shadow-[2px_4px_6px_rgba(0,0,0,0.4)]">
            {selectedSpecialty === 'all' ? 'All Doctors' : `${selectedSpecialty} Specialists`}
          </h2>
          <p className="text-gray-100 mb-8 font-light text-center">{filteredDoctors.length} doctor{filteredDoctors.length !== 1 && 's'} available</p>
          <div className="relative h-[500px] overflow-hidden rounded-lg">
            <div className={`${selectedSpecialty === 'all' ? 'animate-[scrollUp_20s_linear_infinite]' : ''} space-y-6`}>
              {groupedDoctors.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
                  {row.map((doctor) => (
                    <div key={doctor.id} className="p-6 rounded-lg bg-white bg-opacity-90 hover:shadow-lg hover:scale-[1.01] transition">
                      <div className="flex items-center mb-4 space-x-4">
                        <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full object-cover" />
                        <div>
                          <h3 className="text-lg font-semibold font-serif">{doctor.name}</h3>
                          <p className="text-blue-600">{doctor.specialty}</p>
                          <div className="flex items-center text-sm text-gray-600">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            {doctor.rating} ({doctor.reviews} reviews)
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 space-y-2 font-light">
                        <p className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          {doctor.experience} years experience
                        </p>
                        <div>
                          <h4 className="font-medium">Degrees:</h4>
                          {doctor.degrees.map((d, i) => <p key={i}>• {d}</p>)}
                        </div>
                        <div>
                          <h4 className="font-medium">Achievements:</h4>
                          {doctor.achievements.map((a, i) => <p key={i}>• {a}</p>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Guidelines */}
        <motion.div className="w-full max-w-screen-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          <h2 className="text-3xl font-bold mb-6 text-white font-serif text-center border border-black px-4 py-2 rounded-lg drop-shadow-[2px_4px_6px_rgba(0,0,0,0.4)]">Patient Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{
              title: "✅ Do's",
              items: [
                '✔️ Bring valid ID & documents Carry your government ID, appointment slip, and insurance card.',
                '✔️ Arrive on time Be punctual for appointments, tests, or surgeries.',
                '✔️ Follow hospital rules Respect hospital visiting hours, silence zones, and sanitation protocols.',
                '✔️ Wear a mask (if required) For infection control.',
                '✔️ Inform staff of allergies Notify about any drug/food allergies.',
                '✔️ Use hand sanitizer Sanitize hands frequently.',
                '✔️ Ask questions Clarify doubts with medical staff.',
                '✔️ Respect privacy of other patients.',
                '✔️ Use hospital helpline if needed.'
              ]
            }, {
              title: "❌ Don'ts",
              items: [
                '❌ Don’t bring too many visitors.',
                '❌ Don’t touch medical equipment.',
                '❌ Don’t offer food to patients.',
                '❌ Don’t ignore safety signs.',
                '❌ Don’t smoke or vape.',
                '❌ Don’t use phones in restricted zones.',
                '❌ Don’t record without permission.',
                '❌ Don’t crowd emergency areas.',
                '❌ Don’t offer bribes or tips.',
                '❌ Don’t bring valuables.'
              ]
            }].map((section, idx) => (
              <motion.div key={idx} className="p-6 bg-white/80 rounded-xl shadow-md group">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-serif">{section.title}</h3>
                <ol className="list-disc list-inside text-gray-800 text-base space-y-1 font-light font-sans">
                  {section.items.map((text, i) => (
                    <ol key={i} className="opacity-100 group-hover:animate-flash-in" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}>{text}</ol>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDashboard;

