import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useToast } from "../../../../../components/toaster/ToastCustom";
import axiosInstance from "../../../../../config/users/axios.instance";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { HelpCircle } from "lucide-react";

function CommentBox({ discussionId, onComment }) {
    const [content, setContent] = useState('');
    const [questionTag, setQuestionTag] = useState({
        level: '',
        type: 'number',
        content: '',
        parentId: null,
        isAnswer: false
    });
    const [showQuestionFields, setShowQuestionFields] = useState(false);
    const [existingQuestions, setExistingQuestions] = useState([]);
    const [nextLevel, setNextLevel] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        if (showQuestionFields) {
            fetchExistingQuestions();
        }
    }, [showQuestionFields]);

    const fetchExistingQuestions = async () => {
        try {
            const response = await axiosInstance.get(`/api/discussion/structured-questions/${discussionId}/hierarchy`);
            setExistingQuestions(response.data.questions);
        } catch {
            addToast('Failed to fetch existing questions');
        }
    };

    const getNextLevel = async (type, currentLevel) => {
        try {
            const response = await axiosInstance.get(`/api/discussion/structured-questions/${discussionId}/next-level`, {
                params: { type, currentLevel }
            });
            setNextLevel(response.data.nextLevel);
            return response.data.nextLevel;
        } catch {
            addToast('Failed to get next level');
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            addToast('Please enter a comment');
            return;
        }

        try {
            const payload = {
                toBeDiscussedId: discussionId,
                commentContent: content,
                questionTag: showQuestionFields ? {
                    ...questionTag,
                    level: nextLevel || questionTag.level,
                    content: questionTag.content || content
                } : null
            };

            const response = await axiosInstance.post('/api/discussion/comment/add-comment', payload);
            onComment(response.data.comment);
            setContent('');
            setShowQuestionFields(false);
            setQuestionTag({
                level: '',
                type: 'number',
                content: '',
                parentId: null,
                isAnswer: false
            });
            addToast('Comment added successfully!');
        } catch {
            addToast('Failed to add comment');
        }
    };

    const handleQuestionTypeChange = async (type) => {
        setQuestionTag(prev => ({ ...prev, type }));
        const nextLevel = await getNextLevel(type, '');
        if (nextLevel) {
            setQuestionTag(prev => ({ ...prev, level: nextLevel }));
        }
    };

    const handleLevelChange = async (e) => {
        const newLevel = e.target.value;
        setQuestionTag(prev => ({ ...prev, level: newLevel }));

        // Get the next available level for validation
        const nextLevel = await getNextLevel(questionTag.type, newLevel);
        if (nextLevel) {
            setNextLevel(nextLevel);
        }
    };

    return (
        <div className="w-full mb-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setShowQuestionFields(!showQuestionFields)}
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${showQuestionFields
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                } hover:bg-opacity-80`}
                        >
                            <HelpCircle size={14} />
                            <span>Answer to Question</span>
                        </button>
                    </div>
                </div>

                {showQuestionFields && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                                    Question Type
                                </label>
                                <select
                                    value={questionTag.type}
                                    onChange={(e) => handleQuestionTypeChange(e.target.value)}
                                    className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="number">Number (1, 2, 3)</option>
                                    <option value="letter">Letter (a, b, c)</option>
                                    <option value="roman">Roman (i, ii, iii)</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                                    Level
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={questionTag.level}
                                        onChange={handleLevelChange}
                                        className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter level (e.g., 1, a, i)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleQuestionTypeChange(questionTag.type)}
                                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        title="Get next available level"
                                    >
                                        Next
                                    </button>
                                </div>
                                {nextLevel && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Next available level: {nextLevel}
                                    </p>
                                )}
                            </div>
                        </div>

                        {existingQuestions.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                                    Parent Question (optional)
                                </label>
                                <select
                                    value={questionTag.parentId || ''}
                                    onChange={(e) => setQuestionTag(prev => ({ ...prev, parentId: e.target.value || null }))}
                                    className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">None</option>
                                    {existingQuestions.map(q => (
                                        <option key={q._id} value={q._id}>
                                            {q.level} - {q.content}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                                Question Content
                            </label>
                            <input
                                type="text"
                                value={questionTag.content}
                                onChange={(e) => setQuestionTag(prev => ({ ...prev, content: e.target.value }))}
                                className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-700 dark:text-white"
                                placeholder="Enter question content"
                            />
                        </div>
                    </div>
                )}

                <ReactQuill
                    value={content}
                    onChange={setContent}
                    className="mb-4 bg-white dark:bg-gray-800 rounded-lg"
                    theme="snow"
                    modules={{
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote', 'code-block'],
                            [{ 'header': 1 }, { 'header': 2 }],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'script': 'sub' }, { 'script': 'super' }],
                            [{ 'indent': '-1' }, { 'indent': '+1' }],
                            ['link', 'image'],
                            ['clean']
                        ]
                    }}
                />

                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={() => {
                            setShowQuestionFields(false);
                            setQuestionTag({
                                level: '',
                                type: 'number',
                                content: '',
                                parentId: null,
                                isAnswer: false
                            });
                        }}
                        className="px-4 py-2 rounded-3xl dark:bg-[#343434d3] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!content.trim() || (showQuestionFields && !questionTag.content)}
                        className="px-4 py-2 rounded-3xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

CommentBox.propTypes = {
    discussionId: PropTypes.string.isRequired,
    onComment: PropTypes.func.isRequired
};

export default CommentBox;
