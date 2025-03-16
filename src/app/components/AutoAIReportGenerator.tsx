/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import axios from "axios";

interface ReportGeneratorProps {
  data: any[];
  title: string;
  type: "monthly" | "yearly";
  className?: string;
}

const AutoAIReportGenerator: React.FC<ReportGeneratorProps> = ({
  data,
  type,
  className = "",
}) => {
  const [report, setReport] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only generate report if we have data
    if (data && data.length > 0) {
      generateReport();
    } else {
      setLoading(false);
    }
  }, [data]);

  const generateReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const prompt =
        type === "monthly"
          ? `Analyze this monthly income data and provide insights (trends, peaks, comparisons): ${JSON.stringify(
              data
            )}`
          : `Analyze this yearly income data by month and provide insights (seasonal trends, growth, comparisons): ${JSON.stringify(
              data
            )}`;

      const response = await axios.post("/api/gemini/generate", {
        prompt,
        data,
      });

      if (response.data && response.data.text) {
        setReport(response.data.text);
      } else {
        throw new Error("Invalid response from API");
      }
    } catch (err: any) {
      console.error("Error generating report:", err);
      setError(err.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`mt-5 px-4 ${className}`}>
        <div className="flex items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-2"></div>
          <span>Generating AI analysis...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`mt-5 px-4 ${className}`}>
        <div className="text-red-500 py-2">
          Unable to generate AI analysis: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-5 px-4 text-black ${className}`}>
      <h4 className="font-bold text-lg mb-2">AI Analysis:</h4>
      <div className="bg-gray-100 p-4 rounded border border-gray-300 text-left">
        {report ? (
          report.split("\n").map((line, i) => (
            <p key={i} className={i > 0 ? "mt-2" : ""}>
              {line}
            </p>
          ))
        ) : (
          <p>No analysis available for the current data.</p>
        )}
      </div>
    </div>
  );
};

export default AutoAIReportGenerator;
