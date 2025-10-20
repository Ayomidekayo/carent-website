import Title from './Title';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Emma Rodriguez',
      location: 'Barcelona, Spain',
      image: assets.testimonial_image_1,
      rating: 5,
      testimonial:
        'Exceptional service and attention to detail. Everything was handled professionally and efficiently from start to finish. Highly recommended!',
    },
    {
      id: 2,
      name: 'Liam Johnson',
      location: 'Lagos, Nigeria',
      image: assets.testimonial_image_2,
      rating: 4,
      testimonial:
        'I’m truly impressed by the quality and consistency. The entire process was smooth, and the results exceeded all expectations. Thank you!',
    },
    {
      id: 3,
      name: 'Sophia Lee',
      location: 'Seoul, South Korea',
      image: assets.testimonial_image_1,
      rating: 5,
      testimonial:
        'Fantastic experience! From start to finish, the team was professional, responsive, and genuinely cared about delivering great results.',
    },
  ];

  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">
      <Title
        title="What Our Customers Say"
        subTitle="Discover why discerning travelers choose StayVenture for their luxury accommodations around the world."
      />

      <div className="flex flex-col items-center pt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.05 }} // ✅ Hover zoom effect
              className="bg-white p-6 rounded-xl shadow-md max-w-xs transition-transform cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <img
                  className="w-12 h-12 rounded-full"
                  src={testimonial.image}
                  alt={testimonial.name}
                />
                <div>
                  <p className="text-lg font-semibold">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 mt-3">
                {Array(testimonial.rating)
                  .fill(0)
                  .map((_, index) => (
                    <img
                      src={assets.star_icon}
                      key={`${testimonial.id}-star-${index}`}
                      alt="star-icon"
                      className="w-4 h-4"
                    />
                  ))}
              </div>

              <p className="text-gray-500 mt-4 text-sm leading-relaxed italic">
                “{testimonial.testimonial}”
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
