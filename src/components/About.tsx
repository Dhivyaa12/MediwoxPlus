import React, {  useEffect, useState  } from 'react';
import { Award, Star, Users, Clock } from 'lucide-react';
import { clinic } from '../data/mockData';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 4,
      comment: 'Exceptional care and professional staff. The doctors here truly care about their patients.',
      image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
    {
      name: 'Michael Chen',
      rating: 3,
      comment: 'State-of-the-art facilities and world-class treatment. Highly recommended!',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
    {
      name: 'Emily Davis',
      rating: 5,
      comment: 'The medical team here saved my life. Forever grateful for their expertise and compassion.',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
    {
      name: 'John Smith',
      rating: 5,
      comment: 'Great experience. Friendly staff and amazing care.',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
  ];

  const medicalVideos = [
    {
      title: "First Aid & Emergency Care",
      embedUrl: "/medical video/video-1.mp4",
    },
    {
      title: "Infectious Disease Prevention",
      embedUrl: "/medical video/video-2.mp4",
    },
    {
      title: " Nutrition & Healthy Lifestyle",
      embedUrl: "/medical video/video-3.mp4",
    },
    {
      title: "Mental Health Awareness",
      embedUrl: "/medical video/video-4.mp4",
    },
    {
      title: "Chronic Disease Management",
      embedUrl: "/medical video/video-5.mp4",
    },
    {
      title: "Reproductive & Sexual Health",
      embedUrl: "/medical video/video-6.mp4",
    },
  ];

  const enterFullscreen = (e: React.MouseEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if ((video as any).webkitRequestFullscreen) {
      (video as any).webkitRequestFullscreen();
    } else if ((video as any).mozRequestFullScreen) {
      (video as any).mozRequestFullScreen();
    } else if ((video as any).msRequestFullscreen) {
      (video as any).msRequestFullscreen();
    }
  };

  const [displayRating, setDisplayRating] = useState(0);
  const [displayReviews, setDisplayReviews] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / 1000, 1);
      setDisplayRating(parseFloat((clinic.rating * progress).toFixed(1)));
      setDisplayReviews(Math.floor(clinic.reviews * progress));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  return (
    <section
      id="about"
      className="py-20 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage:
          "url('/medical video/aboutbd.avif')",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <motion.div className="text-center" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold text-white mb-4">About Mediwox Plus</h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">Leading healthcare provider with over 25 years of excellence in medical care</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <div className="rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-500">
            <img src="/medical video/about image.webp" alt="Hospital History" className="w-full h-80 object-cover" />
          </div>
          <div className="space-y-6 text-white">
            <h3 className="text-3xl font-bold">Our History</h3>
            <p>Founded in 1998, Mediwox Plus Hospital has been at the forefront of medical innovation. What started as a small clinic has grown into one of the region's most trusted healthcare institutions.</p>
            <p>Our commitment to excellence has earned us recognition as a {clinic.ranking}, serving over {clinic.totalPatients.toLocaleString()} patients with a team of {clinic.totalDoctors}+ medical professionals.</p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[{ icon: <Users className="h-8 w-8 text-blue-300 mx-auto mb-2" />, value: `${clinic.totalDoctors}+`, label: 'Expert Doctors' }, { icon: <Clock className="h-8 w-8 text-green-300 mx-auto mb-2" />, value: '25+', label: 'Years Experience' }].map((item, i) => (
                <div key={i} className="text-center p-4 bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
                  {item.icon}
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  <p className="text-gray-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <h3 className="text-3xl font-bold text-white text-center mb-8">Medical Education Videos</h3>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" drag="x" dragConstraints={{ left: -100, right: 100 }}>
            {medicalVideos.map((video, idx) => (
              <motion.div key={idx} className="rounded-lg overflow-hidden shadow-lg bg-white/80 border border-white cursor-grab active:cursor-grabbing" whileHover={{ scale: 1.05 }}>
                <div className="aspect-video relative rounded-lg overflow-hidden group">
                  <video onClick={enterFullscreen} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" src={video.embedUrl} muted preload="metadata" onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()} onMouseLeave={(e) => { const vid = e.currentTarget as HTMLVideoElement; vid.pause(); vid.currentTime = 0; }} />
                </div>
                <div className="p-4">
                  <p className="text-gray-800 font-semibold">{video.title}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <h3 className="text-3xl font-bold text-white text-center mb-8">Awards & Certifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clinic.awards.map((award, index) => (
              <motion.div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transform hover:-translate-y-1 transition duration-300" whileHover={{ scale: 1.05 }}>
                <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900">{award}</h4>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <h3 className="text-3xl font-bold text-white text-center mb-8">Patient Testimonials</h3>
          <div className="overflow-hidden relative">
            <motion.div className="flex w-max" animate={{ x: ['0%', '-50%'] }} transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}>
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div key={index} className={`w-80 flex-shrink-0 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ${index !== 0 ? 'ml-6' : ''}`}>
                  <div className="flex items-center mb-4">
                    <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div className="text-center bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Star className="h-8 w-8 text-yellow-400 fill-current" />
            <span className="text-3xl font-bold text-gray-900">{displayRating.toFixed(1)}</span>
            <span className="text-gray-600">/ 5.0</span>
          </div>
          <p className="text-gray-600">Based on {displayReviews.toLocaleString()} patient reviews</p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;


