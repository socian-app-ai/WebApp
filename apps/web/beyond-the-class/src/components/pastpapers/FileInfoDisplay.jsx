/* eslint-disable react/prop-types */
import { User, Calendar, Eye } from "lucide-react";

const FileInfoDisplay = ({ file, paper, showFileNumber = false, fileNumber, totalFiles }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-2">
      {/* File number badge */}
      {showFileNumber && fileNumber && (
        <div className="flex justify-between items-center">
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            File {fileNumber} of {totalFiles}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {paper.metadata?.views || 0}
          </span>
        </div>
      )}

      {/* Upload Info */}
      <div className="space-y-1">
        {file.uploadedBy && (
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <User className="w-3 h-3" />
            <span>
              Uploaded by: {file.uploadedBy.name || file.uploadedBy.username || 'Anonymous'}
            </span>
          </div>
        )}
        
        {file.uploadedAt && (
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>
              {formatDate(file.uploadedAt)} at {formatTime(file.uploadedAt)}
            </span>
          </div>
        )}

        {file.teachers && file.teachers.length > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">Teachers: </span>
            <span>{file.teachers.map(t => t.name || 'Unknown').join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileInfoDisplay; 