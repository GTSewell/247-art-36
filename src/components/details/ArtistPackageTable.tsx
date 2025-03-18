
import React, { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { motion } from "framer-motion";
import features from "./data/featuresData";
import TableHeaderComponent from "./TableHeader";
import FeatureRow from "./FeatureRow";
import TableFooterComponent from "./TableFooter";

const ArtistPackageTable = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleRow = (index: number) => {
    setExpandedRow(prev => prev === index ? null : index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-hidden rounded-lg shadow-lg"
    >
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeaderComponent />
          <TableBody>
            {features.map((feature, index) => (
              <FeatureRow
                key={index}
                feature={feature}
                index={index}
                isExpanded={expandedRow === index}
                toggleRow={toggleRow}
              />
            ))}
            <TableFooterComponent />
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default ArtistPackageTable;
