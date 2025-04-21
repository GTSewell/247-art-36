
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const JoinUndergroundSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Join the Underground</h2>
        <div className="max-w-2xl mx-auto text-center">
          <p className="mb-6">
            Be part of our exclusive art community and get access to special events, limited editions, and more.
          </p>
          <Link to="/underground">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-zap-yellow text-black font-bold rounded-md"
            >
              Join Now
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JoinUndergroundSection;
