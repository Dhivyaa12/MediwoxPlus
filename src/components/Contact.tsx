import React, { useState } from 'react';
import { Phone, MapPin, Mail, Clock, Send } from 'lucide-react';
import { FaFacebook, FaYoutube , FaInstagram, FaLinkedin,FaWhatsapp } from 'react-icons/fa';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-sky-100 via-white to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-xl text-gray-600">
            Get in touch with us for any inquiries or support
          </p>
        </div>

        <div className="text-center mb-10">
          <p className="text-lg text-gray-700">
            For appointments or emergencies, call us at <strong>98406 35391</strong>.
          </p>
          <p className="text-lg text-gray-700">
            Or email us at <strong>contact@mediwoxplus.com</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h3>
            <div className="space-y-6">
              {[{Icon: Phone,bg: 'bg-red-100',color: 'text-red-600',title: 'Emergency Hotline',desc: '24/7 Emergency Services',link: '+91 9840635391',href: 'tel:+91 9840635391',},{Icon: Phone,bg: 'bg-blue-100',color: 'text-blue-600',title: 'Appointments',desc: 'Book your appointment',link: '+91 9342929499',href: 'tel:+91 9342929499',},{Icon: MapPin,bg: 'bg-green-100',color: 'text-green-600',title: 'Address',desc: 'Chennai Institute of Technology\nKundrathur\nChennai-69, India',},{Icon: Mail,bg: 'bg-purple-100',color: 'text-purple-600',title: 'Email',desc: 'General inquiries',link: 'contact@mediwoxplus.com',href: 'mailto:contact@mediwoxplus.com',},{Icon: Clock,bg: 'bg-yellow-100',color: 'text-yellow-600',title: 'Operating Hours',desc: `Mon–Fri: 8AM–8PM\nSat: 9AM–6PM\nSun: 10AM–4PM\nEmergency: 24/7`,},].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-white/60 hover:bg-white/80 shadow hover:shadow-md transition-all group"
                >
                  <div
                    className={`${item.bg} p-3 rounded-full transition-all group-hover:animate-shake`}
                  >
                    <item.Icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-gray-600 whitespace-pre-line">{item.desc}</p>
                    {item.link && (
                      <a
                        href={item.href}
                        className={`${item.color} font-semibold hover:underline`}
                      >
                        {item.link}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 p-8 rounded-lg shadow-md backdrop-blur-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {[{
                label: 'Full Name *',
                type: 'text',
                name: 'name',
                placeholder: 'Your full name',
              },{
                label: 'Email Address *',
                type: 'email',
                name: 'email',
                placeholder: 'your.email@example.com',
              },{
                label: 'Subject *',
                type: 'text',
                name: 'subject',
                placeholder: 'What is this about?',
              }].map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    required
                    value={(formData as any)[field.name]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please describe your inquiry in detail..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 hover:scale-105 hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5 animate-pulse" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 bg-red-50 border border-red-200 rounded-lg p-8 text-center shadow-md animate-fadeInUp">
          <h3 className="text-2xl font-bold text-red-900 mb-4">Medical Emergency?</h3>
          <p className="text-red-700 mb-6">
            If you are experiencing a medical emergency, please call our emergency hotline
            immediately or visit our emergency department.
          </p>
          <a
            href="tel:+91 9840635391"
            className="inline-flex items-center space-x-2 bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold hover:scale-105"
          >
            <Phone className="h-6 w-6 animate-shake" />
            <span>Call Emergency: +91 9840635391</span>
          </a>
        </div>

        {/* Footer */}
         <footer className="mt-20 pt-8 border-t border-gray-200 text-center text-sm text-gray-600 bg-gray-200/40 rounded-lg py-6">
        <p className="text-gray-800 font-medium">
          &copy; {new Date().getFullYear()} Mediwox. All rights reserved.
        </p>
        <div className="flex justify-center space-x-6 mt-4 text-gray-700">
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 text-xl transition-transform transform hover:scale-110"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 text-xl transition-transform transform hover:scale-110"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 text-xl transition-transform transform hover:scale-110"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://wa.me/919840635391"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-500 text-xl transition-transform transform hover:scale-110"
          >
            <FaWhatsapp />
          </a>
          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-600 text-xl transition-transform transform hover:scale-110"
          >
            <FaYoutube />
          </a>
        </div>
      </footer>


      </div>
    </section>
  );
};

export default Contact;
