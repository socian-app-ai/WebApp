import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/users/axios.instance";
import { ArrowBack } from "@mui/icons-material";
import { useSetInfoBarState } from "../../../state_management/zustand/useInfoBar";
import PropTypes from 'prop-types';

export default function CourseInfo() {
  const { id } = useParams();
  const [pastPapers, setPastPapers] = useState(null);
  const [subjectName, setSubjectName] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { infoBarState, setInfoBarState } = useSetInfoBarState();

  useEffect(() => {
    if (infoBarState === true) {
      setInfoBarState(false);
    }
  }, [setInfoBarState, infoBarState]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get(
          "/api/pastpaper/all-pastpapers-in-subject/" + id
        );
        console.log("courseinfo ", res.data.papers)
        setPastPapers(res.data.papers);
        setSubjectName(res.data.subjectName);
      } catch (error) {
        console.error("Error fetching data", error);
        setError("Error loading past papers data.");
      }
    };
    fetch();
  }, [id]);

  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;
  if (!pastPapers) return <p className="text-center mt-4">Loading...</p>;

  // Group papers by year and type
  const papersByYear = pastPapers.reduce((acc, yearGroup) => {
    const year = yearGroup.academicYear;
    if (!acc[year]) {
      acc[year] = {
        types: {}
      };
    }

    // Group papers by type within each year
    yearGroup.papers.forEach(paper => {
      const type = paper.type;

      // Handle SESSIONAL papers differently
      if (type === 'SESSIONAL') {
        const sessionType = paper.sessionType;
        const sessionalType = `SESSIONAL_${sessionType}`;
        if (!acc[year].types[sessionalType]) {
          acc[year].types[sessionalType] = [];
        }
        acc[year].types[sessionalType].push(paper);
      } else {
        // Handle other paper types normally
        if (!acc[year].types[type]) {
          acc[year].types[type] = [];
        }
        acc[year].types[type].push(paper);
      }
    });

    return acc;
  }, {});

  const handleTypeClick = (year, type) => {
    // Extract the base type and session type for SESSIONAL papers
    const [baseType, sessionType] = type.split('_');
    const queryParams = new URLSearchParams();
    queryParams.append('year', year);
    if (baseType === 'SESSIONAL' && sessionType) {
      queryParams.append('sessionType', sessionType);
    }
    navigate(`/student/${baseType.toLowerCase()}/${id}?${queryParams.toString()}`);
  };

  const getDisplayTitle = (type) => {
    if (type.startsWith('SESSIONAL_')) {
      const sessionType = type.split('_')[1];
      return `Sessional ${sessionType}`;
    }
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  return (
    <div className="min-h-screen w-full pt-8 px-4 sm:px-6 md:px-8">
      <div className="flex items-center mb-6">
        <ArrowBack onClick={() => navigate(-1)} className="cursor-pointer mr-2" />
        <h6 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
          {subjectName}
        </h6>
      </div>

      <div className="space-y-6">
        {Object.entries(papersByYear)
          .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
          .map(([year, data]) => (
            <div key={year} className="border dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {year}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(data.types).map(([type, papers]) => (
                  <PaperItem
                    key={`${year}-${type}`}
                    title={getDisplayTitle(type)}
                    count={papers.length}
                    onClick={() => handleTypeClick(year, type)}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export function PaperItem({ title, count, onClick }) {
  return (
    <div
      className="border-2 h-32 cursor-pointer flex flex-col items-center justify-center text-center rounded-lg hover:shadow-lg transition-shadow dark:border-gray-700 dark:hover:border-gray-600"
      onClick={onClick}
    >
      <p className="text-sm sm:text-base md:text-lg font-medium text-gray-800 dark:text-gray-200">{title}</p>
      <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{count}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">Papers</p>
    </div>
  );
}

PaperItem.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
};
