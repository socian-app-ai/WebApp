import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Drawer, Avatar } from '@mui/material';
import { X, ChevronRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import axiosInstance from '../../../../../config/users/axios.instance';
import { useToast } from '../../../../../components/toaster/ToastCustom';
import formatTimeDifference from '../../../../../utils/formatDate';
import { ReVote } from './Comment';
import PropTypes from 'prop-types';

const AnswerDrawer = forwardRef(({ open, onClose, initialQuestionId, paperId }, ref) => {
    const [pastpapers, setPastpapers] = useState([]);
    const [selectedPaperId, setSelectedPaperId] = useState(paperId);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [view, setView] = useState('questions'); // 'papers', 'questions', 'answers'
    const { addToast } = useToast();

    useImperativeHandle(ref, () => ({
        fetchPastpapers: async (type, subjectId) => {
            try {
                const response = await axiosInstance.get(`/api/pastpaper/${type}/${subjectId}`);
                setPastpapers(response.data.papers);
                setView('papers');
            } catch {
                addToast('Failed to fetch past papers');
            }
        }
    }));

    useEffect(() => {
        if (open && initialQuestionId) {
            fetchAnswersForQuestion(initialQuestionId);
        }
    }, [open, initialQuestionId]);

    useEffect(() => {
        if (selectedPaperId) {
            fetchQuestionHierarchy();
        }
    }, [selectedPaperId]);

    const fetchQuestionHierarchy = async () => {
        try {
            const response = await axiosInstance.get(`/api/discussion/structured-questions/${selectedPaperId}/hierarchy`);
            setQuestions(response.data.questions);
            setView('questions');
        } catch {
            addToast('Failed to fetch questions');
        }
    };

    const fetchAnswersForQuestion = async (questionId) => {
        try {
            const response = await axiosInstance.get(`/api/discussion/structured-question/${questionId}/answers?includeSubQuestions=true`);
            setAnswers(response.data.answers);
            setView('answers');
        } catch {
            addToast('Failed to fetch answers');
        }
    };

    const renderPastpaperList = () => (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b dark:border-gray-700">
                <h2 className="text-xl font-bold dark:text-white">Select Past Paper</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
                {pastpapers.map((paper) => (
                    <button
                        key={paper._id}
                        onClick={() => {
                            setSelectedPaperId(paper._id);
                            fetchQuestionHierarchy();
                        }}
                        className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 border-b dark:border-gray-700"
                    >
                        <h3 className="font-medium dark:text-white">{paper.name}</h3>
                        <p className="text-sm text-gray-500">{paper.type} - {paper.academicYear}</p>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderQuestionItem = (question, depth = 0) => (
        <div key={question._id} className="border-b dark:border-gray-700 last:border-0">
            <button
                onClick={() => fetchAnswersForQuestion(question._id)}
                className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between"
                style={{ paddingLeft: `${depth * 1.5 + 1}rem` }}
            >
                <div>
                    <span className="font-medium dark:text-white">
                        {question.level}. {question.content}
                    </span>
                    <p className="text-sm text-gray-500">
                        {question.metadata?.totalAnswers || 0} answers
                    </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
            {question.children?.map(child => renderQuestionItem(child, depth + 1))}
        </div>
    );

    const renderQuestionList = () => (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b dark:border-gray-700 flex items-center gap-4">
                <button
                    onClick={() => setView('papers')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                </button>
                <h2 className="text-xl font-bold dark:text-white">Questions</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
                {questions.map(question => renderQuestionItem(question))}
            </div>
        </div>
    );

    const renderAnswerList = () => (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b dark:border-gray-700 flex items-center gap-4">
                <button
                    onClick={() => setView('questions')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                </button>
                <div>
                    <h2 className="text-xl font-bold dark:text-white">
                        Answers
                    </h2>
                    <p className="text-sm text-gray-500">
                        {answers.length} Answer{answers.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="divide-y dark:divide-gray-700">
                    {answers.map((answer) => (
                        <div
                            key={answer._id}
                            className={`p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedAnswer?._id === answer._id ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
                            onClick={() => setSelectedAnswer(answer)}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Avatar src={answer.user?.profile?.picture} />
                                    <div>
                                        <p className="font-medium dark:text-white">
                                            {answer.user?.username}
                                            {answer.isApproved && (
                                                <CheckCircle2 className="inline ml-2 text-green-500" size={16} />
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatTimeDifference(answer.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <ReVote comment={answer} />
                            </div>
                            {selectedAnswer?._id === answer._id ? (
                                <div
                                    className="prose dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: answer.content }}
                                />
                            ) : (
                                <div
                                    className="prose dark:prose-invert max-w-none max-h-20 overflow-hidden"
                                    dangerouslySetInnerHTML={{ __html: answer.content }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: '50%',
                    minWidth: '600px',
                    bgcolor: 'background.paper'
                }
            }}
        >
            <div className="h-full dark:bg-[#151515] flex flex-col">
                <div className="flex justify-end p-4 border-b dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {view === 'papers' && renderPastpaperList()}
                {view === 'questions' && renderQuestionList()}
                {view === 'answers' && renderAnswerList()}
            </div>
        </Drawer>
    );
});

AnswerDrawer.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    initialQuestionId: PropTypes.string,
    paperId: PropTypes.string
};

AnswerDrawer.displayName = 'AnswerDrawer';

export default AnswerDrawer; 