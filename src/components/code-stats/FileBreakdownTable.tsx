
import React from "react";

type FileStats = {
  path: string;
  lineCount: number;
  sizeInBytes: number;
};

interface FileBreakdownTableProps {
  fileStats: FileStats[];
}

export const FileBreakdownTable: React.FC<FileBreakdownTableProps> = ({ fileStats }) => {
  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return bytes + " B";
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }
  };

  return (
    <details className="group">
      <summary className="cursor-pointer text-fuchsia-400 hover:text-fuchsia-300 transition flex items-center gap-2 mb-4">
        <span className="font-medium">View file breakdown</span>
        <span className="text-xs group-open:rotate-180 transition">▼</span>
      </summary>
      
      <div className="mt-4 overflow-hidden overflow-y-auto max-h-[400px] pr-2 pb-2">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-background">
            <tr className="border-b border-fuchsia-500/10">
              <th className="text-left py-2 px-1 text-foreground/70">File Path</th>
              <th className="text-right py-2 px-1 text-foreground/70">Lines</th>
              <th className="text-right py-2 px-1 text-foreground/70">Size</th>
            </tr>
          </thead>
          <tbody>
            {fileStats
              .sort((a, b) => b.sizeInBytes - a.sizeInBytes)
              .map((file, index) => (
                <tr 
                  key={index} 
                  className="border-b border-fuchsia-500/5 hover:bg-fuchsia-500/5 transition"
                >
                  <td className="py-2 px-1 text-foreground/80 font-mono text-xs truncate max-w-xs">
                    {file.path}
                  </td>
                  <td className="py-2 px-1 text-right text-foreground/80">
                    {file.lineCount.toLocaleString()}
                  </td>
                  <td className="py-2 px-1 text-right text-foreground/80">
                    {formatFileSize(file.sizeInBytes)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </details>
  );
};
