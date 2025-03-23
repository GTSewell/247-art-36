import { motion } from "framer-motion";
interface InterestFormProps {
  introText: string;
}
const InterestForm = ({
  introText
}: InterestFormProps) => {
  return <div className="p-6 rounded-lg bg-zap-blue my-[175px] px-[4px] py-[10px]">
      <p className="whitespace-pre-wrap font-semibold text-neutral-700 px-[33px] py-[7px] text-lg">{introText}</p>
      
      {/* Embedded Tally form */}
      <div className="mt-6">
        <iframe src="https://tally.so/embed/3X8q5Y?hideTitle=1&transparentBackground=1&dynamicHeight=1" width="100%" frameBorder="0" marginHeight={0} marginWidth={0} title="Expression of Interest" className="rounded-lg w-full" style={{
        minHeight: "700px"
      }}></iframe>
      </div>
    </div>;
};
export default InterestForm;