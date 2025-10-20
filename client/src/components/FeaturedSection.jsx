import Title from './Title';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import CarCard from './CarCard';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

const FeaturedSection = () => {
  const navigate = useNavigate();
  const { cars } = useAppContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Title
          title="Featured Vehicles"
          subTitle="Explore our selection of premium vehicles available for your next adventure"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-10 px-6 md:px-0"
      >
        {cars.slice(0, 6).map((car) => (
          <motion.div
            key={car._id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <CarCard car={car} />
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        onClick={() => {
          navigate('/cars');
          window.scrollTo(0, 0);
        }}
        className="flex items-center justify-center gap-2 px-6 py-2 border hover:bg-gray-50 rounded-md mt-10 cursor-pointer"
      >
        Explore all the cars <img src={assets.arrow_icon} alt="arrow" />
      </motion.button>
    </motion.div>
  );
};

export default FeaturedSection;
