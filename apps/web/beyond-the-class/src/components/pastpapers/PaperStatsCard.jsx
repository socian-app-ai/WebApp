/* eslint-disable react/prop-types */
import { FileText, Download, Eye, Users } from "lucide-react";

const PaperStatsCard = ({ papers = [], className = "" }) => {
  // Calculate statistics
  const totalPapers = papers.length;
  const totalFiles = papers.reduce((acc, paper) => acc + (paper.files?.length || 0), 0);
  const totalViews = papers.reduce((acc, paper) => acc + (paper.metadata?.views || 0), 0);
  const totalDownloads = papers.reduce((acc, paper) => acc + (paper.metadata?.downloads || 0), 0);

  // Get unique uploaders
  const uniqueUploaders = new Set();
  papers.forEach(paper => {
    paper.files?.forEach(file => {
      if (file.uploadedBy) {
        uniqueUploaders.add(file.uploadedBy._id || file.uploadedBy);
      }
    });
  });

  const stats = [
    {
      label: "Papers",
      value: totalPapers,
      icon: FileText,
      color: "text-blue-600"
    },
    {
      label: "Files",
      value: totalFiles,
      icon: FileText,
      color: "text-green-600"
    },
    {
      label: "Views",
      value: totalViews,
      icon: Eye,
      color: "text-purple-600"
    },
    {
      label: "Contributors",
      value: uniqueUploaders.size,
      icon: Users,
      color: "text-orange-600"
    }
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-2">
                <IconComponent className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaperStatsCard; 