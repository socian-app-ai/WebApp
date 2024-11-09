import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [formData, setFormData] = useState({
    year: '',
    assignment: '',
    quiz: '',
    midterm: '',
    finalExam: '',
    sessional: '',
    subjectId: '',
    departmentId: '',
    term: 'fall',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`/upload-${type}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setMessage(response.data.message || 'File uploaded successfully');
      setLoading(false);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error uploading file');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Upload Educational Documents</h1>
      <form method="POST" className="space-y-6">
        <div>
          <label className="block text-sm font-semibold">Year</label>
          <input
            type="text"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Subject ID</label>
          <input
            type="text"
            name="subjectId"
            value={formData.subjectId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Department ID</label>
          <input
            type="text"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Assignment */}
        <div>
          <label className="block text-sm font-semibold">Assignment</label>
          <input
            type="text"
            name="assignment"
            value={formData.assignment}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'assignment')}
            className="mt-2 bg-blue-500 text-white p-2 rounded"
          >
            Upload Assignment
          </button>
        </div>

        {/* Quiz */}
        <div>
          <label className="block text-sm font-semibold">Quiz</label>
          <input
            type="text"
            name="quiz"
            value={formData.quiz}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'quiz')}
            className="mt-2 bg-blue-500 text-white p-2 rounded"
          >
            Upload Quiz
          </button>
        </div>

        {/* Midterm */}
        <div>
          <label className="block text-sm font-semibold">Midterm</label>
          <input
            type="text"
            name="midterm"
            value={formData.midterm}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'midterm')}
            className="mt-2 bg-blue-500 text-white p-2 rounded"
          >
            Upload Midterm
          </button>
        </div>

        {/* Final Exam */}
        <div>
          <label className="block text-sm font-semibold">Final Exam</label>
          <input
            type="text"
            name="finalExam"
            value={formData.finalExam}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'final')}
            className="mt-2 bg-blue-500 text-white p-2 rounded"
          >
            Upload Final Exam
          </button>
        </div>

        {/* Sessional */}
        <div>
          <label className="block text-sm font-semibold">Sessional</label>
          <input
            type="text"
            name="sessional"
            value={formData.sessional}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'sessional')}
            className="mt-2 bg-blue-500 text-white p-2 rounded"
          >
            Upload Sessional
          </button>
        </div>

        {loading && <div>Loading...</div>}
        {message && <div className="mt-4 text-lg">{message}</div>}
      </form>
    </div>
  );
};

export default UploadForm;
