
import { motion } from "framer-motion";

interface InterestFormProps {
  introText: string;
}

const InterestForm = ({ introText }: InterestFormProps) => {
  return (
    <div className="bg-white/10 p-6 rounded-lg">
      <p className="text-lg text-white/90 whitespace-pre-wrap">{introText}</p>
      
      {/* Embedded Tally form */}
      <div className="mt-6">
        <iframe
          src="https://tally.so/embed/3X8q5Y?hideTitle=1&transparentBackground=1&dynamicHeight=1"
          width="100%"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title="Expression of Interest"
          className="rounded-lg w-full"
          style={{ minHeight: "700px" }}
        ></iframe>
      </div>
    </div>
  );
};

export default InterestForm;
