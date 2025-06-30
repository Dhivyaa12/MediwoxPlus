import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Phone, FileText } from 'lucide-react';
import { diseases } from '../data/mockData';
import { motion } from 'framer-motion';

const BookAppointment: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    email: '',
    address: '',
    disease: '',
    timeSlot: '',
    date: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM',
  ];

  const today = new Date().toISOString().split('T')[0];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.age) newErrors.age = 'Age is required';
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 1 || age > 120) newErrors.age = 'Please enter a valid age';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Please enter a valid email';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.disease) newErrors.disease = 'Please select a condition';
    if (!formData.date) newErrors.date = 'Please select a date';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      patientName: formData.fullName,
      doctorId: "1",
      appointmentDate: formData.date,
      symptoms: formData.disease,
      email: formData.email,
      phoneNumber: formData.phone.startsWith('+') ? formData.phone : `+91${formData.phone}`,
    };

    try {
      const response = await fetch(
        'https://9dkceq681h.execute-api.ap-southeast-2.amazonaws.com/prod/appointment',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (response.status === 200) {
        alert(
          `✅ Appointment booked successfully!\nConfirmation sent via Email & SMS.\n\nPatient: ${formData.fullName}`
        );
        navigate('/');
      } else {
        alert(`❌ Failed: ${result.message || 'Unexpected error'}`);
        console.error(result);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('🚫 Network or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat py-10 px-4"
      style={{
        backgroundImage:
          'url(https://www.shutterstock.com/image-photo/businessman-pointing-pen-virtual-screen-600nw-2514426419.jpg)',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-0">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-2/3 bg-white shadow-xl rounded-2xl overflow-hidden"
        >
          <div className="bg-blue-600 text-white p-6 flex items-center gap-4">
            <Calendar className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Book an Appointment</h1>
              <p className="text-blue-200 text-sm">Schedule your visit with our expert medical team</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Personal Info */}
            <section>
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                <User className="w-5 h-5" /> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label htmlFor="fullName" className="block font-medium text-sm mb-1">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full border px-4 py-3 rounded-lg ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label htmlFor="age" className="block font-medium text-sm mb-1">Age *</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className={`w-full border px-4 py-3 rounded-lg ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.age && <p className="text-sm text-red-600 mt-1">{errors.age}</p>}
                </div>
              </div>
            </section>

            {/* Contact Info */}
            <section>
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                <Phone className="w-5 h-5" /> Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label htmlFor="phone" className="block font-medium text-sm mb-1">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full border px-4 py-3 rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block font-medium text-sm mb-1">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full border px-4 py-3 rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="address" className="block font-medium text-sm mb-1">Address *</label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full border px-4 py-3 rounded-lg ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                ></textarea>
                {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
              </div>
            </section>

            {/* Medical Info */}
            <section>
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                <FileText className="w-5 h-5" /> Medical Information
              </h2>
              <div className="mt-4">
                <label htmlFor="disease" className="block font-medium text-sm mb-1">Type of Condition *</label>
                <select
                  id="disease"
                  name="disease"
                  value={formData.disease}
                  onChange={handleInputChange}
                  className={`w-full border px-4 py-3 rounded-lg ${errors.disease ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">-- Select a condition --</option>
                  {diseases.map((disease) => (
                    <option key={disease} value={disease}>
                      {disease}
                    </option>
                  ))}
                </select>
                {errors.disease && <p className="text-sm text-red-600 mt-1">{errors.disease}</p>}
              </div>
            </section>

            {/* Appointment Date and Time */}
            <section>
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                <Clock className="w-5 h-5" /> Appointment Preferences
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label htmlFor="date" className="block font-medium text-sm mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    min={today}
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full border px-4 py-3 rounded-lg ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label htmlFor="timeSlot" className="block font-medium text-sm mb-1">Time Slot (optional)</label>
                  <select
                    id="timeSlot"
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    className="w-full border px-4 py-3 rounded-lg border-gray-300"
                  >
                    <option value="">Any available time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Submit */}
            <div className="pt-6 border-t">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-lg"
                >
                  Cancel
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-4 text-center">
                * Required fields. A confirmation email will be sent upon booking.
              </p>
            </div>
          </form>
        </motion.div>

        {/* Right Side Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:w-1/3 bg-white/50 shadow-xl rounded-2xl overflow-hidden transition-transform duration-300 hover:shadow-2xl hover:scale-[1.01] flex flex-col"
        >
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800 font-sans mb-2 text-center">Booking Demo</h2>
          </div>
          <div className="aspect-video w-full px-4 pb-4">
            <iframe
              className="w-full h-full rounded-lg"
              src="/medical video/BOOKINGDEMO VIDEP.mp4"
              title="How to Book Appointment"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
          <div className="bg-white/50 px-4 py-2 flex-1 rounded-b-2xl">
            <h3 className="text-base font-bold font-sans text-gray-800 mb-3 text-center">Hospital Images</h3>
            <div className="overflow-hidden relative h-[700px] rounded-lg border border-gray-300">
              <motion.div
                className="absolute top-0 left-0 w-full flex flex-col"
                animate={{ y: ['0%', '-50%'] }}
                transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
              >
                {[1, 2].map((_, batchIndex) => (
                  <div key={batchIndex} className="flex flex-col">
                    {[
                      'https://www.healthtrip.com/_next/image?url=https%3A%2F%2Fd3fzwscyjtgllx.cloudfront.net%2Fuploads%2Fblogs%2Fimg_6572b8e8050741702017256.png&w=828&q=75',
                      'https://pbs.twimg.com/ext_tw_video_thumb/1110073399852699648/pu/img/FBT_kr2_yNpUNRs_.jpg:large',
                      'https://www.relainstitute.com/rela-hospitals/images/events/launch-of-dexa-scan-machine-at-rela-hospital/dexa-scan-1.jpeg',
                      'https://www.relainstitute.com/rela-hospitals/images/inauguration-of-labour-images/2.jpg',
                    ].map((src, i) => (
                      <img
                        key={`${batchIndex}-${i}`}
                        src={src}
                        alt={`Ad ${i}`}
                        className="w-full h-64 object-cover rounded-md shadow mb-2 transform transition-transform duration-300 hover:scale-105"
                      />
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookAppointment;
