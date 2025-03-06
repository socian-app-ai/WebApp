import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, ThumbsUp, ThumbsDown, Laugh, Meh, Flag, MessageCircle, ArrowDown, ArrowUp } from 'lucide-react';

// Sample data to mimic API response
const sampleData = {
    cafes: [
        { id: 1, name: "Science Block Cafe" },
        { id: 2, name: "Library Cafe" },
        { id: 3, name: "Engineering Block Cafe" }
    ],
    categories: [
        { id: 1, name: "Breakfast" },
        { id: 2, name: "Lunch" },
        { id: 3, name: "Snacks" },
        { id: 4, name: "Beverages" }
    ],
    foodItems: [
        {
            id: 1,
            name: "Veggie Sandwich",
            category: 1,
            cafe: 1,
            reviews: [
                {
                    id: 101,
                    rating: "loved",
                    content: "Best sandwich on campus! The bread is always fresh.",
                    student: "Alex Johnson",
                    studentId: "AJ2023",
                    date: "2025-02-28",
                    votes: { loved: 24, ok: 5, yuck: 1, haha: 3 },
                    comments: [
                        {
                            id: 201,
                            content: "I agree! Their homemade mayo is amazing too.",
                            student: "Sam Wilson",
                            studentId: "SW2022",
                            date: "2025-02-28",
                            isFromCafe: false,
                            replies: [
                                {
                                    id: 301,
                                    content: "We make our mayo fresh every morning. Thank you for noticing!",
                                    student: "Science Cafe Staff",
                                    studentId: "STAFF123",
                                    date: "2025-02-29",
                                    isFromCafe: true
                                }
                            ]
                        },
                        {
                            id: 202,
                            content: "Could use more veggies though.",
                            student: "Jamie Lee",
                            studentId: "JL2024",
                            date: "2025-03-01",
                            isFromCafe: false,
                            replies: []
                        }
                    ]
                },
                {
                    id: 102,
                    rating: "ok",
                    content: "It was decent today, but not as fresh as usual.",
                    student: "Alex Johnson",
                    studentId: "AJ2023",
                    date: "2025-03-01",
                    votes: { loved: 5, ok: 12, yuck: 3, haha: 1 },
                    comments: []
                }
            ]
        },
        {
            id: 2,
            name: "Chocolate Brownie",
            category: 3,
            cafe: 1,
            reviews: [
                {
                    id: 103,
                    rating: "loved",
                    content: "Absolutely delicious! Perfect sweetness and so fudgy.",
                    student: "Taylor Swift",
                    studentId: "TS2024",
                    date: "2025-03-01",
                    votes: { loved: 45, ok: 2, yuck: 0, haha: 0 },
                    comments: [
                        {
                            id: 203,
                            content: "Agreed! Best dessert on campus!",
                            student: "Jordan Smith",
                            studentId: "JS2025",
                            date: "2025-03-01",
                            isFromCafe: false,
                            replies: []
                        }
                    ]
                }
            ]
        },
        {
            id: 3,
            name: "Chicken Curry",
            category: 2,
            cafe: 2,
            reviews: [
                {
                    id: 104,
                    rating: "yuck",
                    content: "Way too spicy today and the chicken seemed undercooked.",
                    student: "Chris Evans",
                    studentId: "CE2023",
                    date: "2025-03-01",
                    votes: { loved: 2, ok: 5, yuck: 18, haha: 0 },
                    comments: [
                        {
                            id: 204,
                            content: "We apologize for your experience. We'll look into this immediately.",
                            student: "Library Cafe Manager",
                            studentId: "MANAGER2",
                            date: "2025-03-01",
                            isFromCafe: true,
                            replies: []
                        }
                    ]
                }
            ]
        }
    ]
};

// Mock axios call
const fetchData = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(sampleData);
        }, 500);
    });
};

export default function CafeFeedbacks() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCafe, setSelectedCafe] = useState(null);
    const [selectedDateRange, setSelectedDateRange] = useState({ from: null, to: null });
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedReviews, setExpandedReviews] = useState({});

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const result = await fetchData();
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const toggleExpandReview = (reviewId) => {
        setExpandedReviews(prev => ({
            ...prev,
            [reviewId]: !prev[reviewId]
        }));
    };

    const handleReportComment = (reviewId, commentId) => {
        // In a real app, this would make an API call
        alert(`Reported comment #${commentId} on review #${reviewId}`);
    };

    const getCafeName = (cafeId) => {
        if (!data) return "";
        const cafe = data.cafes.find(c => c.id === cafeId);
        return cafe ? cafe.name : "";
    };

    const getCategoryName = (categoryId) => {
        if (!data) return "";
        const category = data.categories.find(c => c.id === categoryId);
        return category ? category.name : "";
    };

    const filterReviews = () => {
        if (!data) return [];

        let filtered = [...data.foodItems];

        // Filter by cafe
        if (selectedCafe) {
            filtered = filtered.filter(item => item.cafe === selectedCafe);
        }

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(term) ||
                item.reviews.some(r =>
                    r.content.toLowerCase().includes(term) ||
                    r.student.toLowerCase().includes(term)
                )
            );
        }

        // Filter by date range
        if (selectedDateRange.from && selectedDateRange.to) {
            filtered = filtered.map(item => {
                const filteredReviews = item.reviews.filter(review => {
                    const reviewDate = new Date(review.date);
                    const fromDate = new Date(selectedDateRange.from);
                    const toDate = new Date(selectedDateRange.to);
                    return reviewDate >= fromDate && reviewDate <= toDate;
                });

                return {
                    ...item,
                    reviews: filteredReviews
                };
            }).filter(item => item.reviews.length > 0);
        }

        return filtered;
    };

    const getRatingIcon = (rating) => {
        switch (rating) {
            case 'loved': return <ThumbsUp className="text-green-500" />;
            case 'ok': return <Meh className="text-yellow-500" />;
            case 'yuck': return <ThumbsDown className="text-red-500" />;
            case 'haha': return <Laugh className="text-blue-500" />;
            default: return null;
        }
    };

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Filter reviews for today
    const todaysReviews = data?.foodItems.flatMap(item =>
        item.reviews
            .filter(review => review.date === today)
            .map(review => ({
                ...review,
                foodItem: item.name,
                cafe: getCafeName(item.cafe),
                category: getCategoryName(item.category)
            }))
    ) || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 dark:text-white">
            <div className="container mx-auto px-4 py-8">
                {/* Header with Theme Toggle */}
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        Cafe Feedback
                    </h1>
                </header>

                {/* Search and Filter Section */}
                <div className="mb-8 p-6 rounded-xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-grow">
                            <div className="relative">
                                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for food items, reviews, or students..."
                                    className="pl-12 pr-4 py-3 w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <select
                                className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                value={selectedCafe || ''}
                                onChange={(e) => setSelectedCafe(e.target.value ? Number(e.target.value) : null)}
                            >
                                <option value="">All Cafes</option>
                                {data?.cafes.map(cafe => (
                                    <option key={cafe.id} value={cafe.id}>{cafe.name}</option>
                                ))}
                            </select>

                            <div className="flex gap-3">
                                <input
                                    type="date"
                                    className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                    value={selectedDateRange.from || ''}
                                    onChange={(e) => setSelectedDateRange(prev => ({ ...prev, from: e.target.value }))}
                                />
                                <span className="self-center text-gray-400">to</span>
                                <input
                                    type="date"
                                    className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                    value={selectedDateRange.to || ''}
                                    onChange={(e) => setSelectedDateRange(prev => ({ ...prev, to: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <>
                        {/* Today's Reviews Section */}
                        {todaysReviews.length > 0 && (
                            <section className="mb-12">
                                <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                    Today's Reviews
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {todaysReviews.map(review => (
                                        <div
                                            key={review.id}
                                            className="rounded-xl p-6 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-xl font-semibold">{review.foodItem}</h3>
                                                <div className="flex items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                                                    {getRatingIcon(review.rating)}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{review.cafe} • {review.category}</p>
                                            <p className="mb-4 text-gray-700 dark:text-gray-200">{review.content}</p>
                                            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-medium">{review.student}</span>
                                                <span>{new Date(review.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* All Reviews Section */}
                        <section>
                            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                Food Item Reviews
                            </h2>

                            {filterReviews().length === 0 ? (
                                <div className="p-12 text-center rounded-xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg">
                                    <p className="text-xl text-gray-600 dark:text-gray-300">No reviews match your search criteria.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {filterReviews().map(item => (
                                        <div
                                            key={item.id}
                                            className="rounded-xl overflow-hidden bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg"
                                        >
                                            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30">
                                                <h3 className="text-2xl font-bold">{item.name}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{getCafeName(item.cafe)} • {getCategoryName(item.category)}</p>
                                            </div>

                                            <div className="p-6">
                                                <h4 className="text-xl font-semibold mb-4">Reviews ({item.reviews.length})</h4>
                                                <div className="space-y-6">
                                                    {item.reviews.map(review => (
                                                        <div
                                                            key={review.id}
                                                            className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700/50 shadow-inner"
                                                        >
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2 bg-white dark:bg-gray-600 rounded-full shadow-sm">
                                                                        {getRatingIcon(review.rating)}
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-semibold">{review.student}</span>
                                                                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({review.studentId})</span>
                                                                    </div>
                                                                </div>
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                                                            </div>

                                                            <p className="mb-6 text-gray-700 dark:text-gray-200">{review.content}</p>

                                                            {/* Votes section */}
                                                            <div className="flex flex-wrap gap-4 mb-6">
                                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-600 rounded-full shadow-sm">
                                                                    <ThumbsUp className="h-4 w-4 text-green-500" />
                                                                    <span className="font-medium">{review.votes.loved}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-600 rounded-full shadow-sm">
                                                                    <Meh className="h-4 w-4 text-yellow-500" />
                                                                    <span className="font-medium">{review.votes.ok}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-600 rounded-full shadow-sm">
                                                                    <ThumbsDown className="h-4 w-4 text-red-500" />
                                                                    <span className="font-medium">{review.votes.yuck}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-600 rounded-full shadow-sm">
                                                                    <Laugh className="h-4 w-4 text-blue-500" />
                                                                    <span className="font-medium">{review.votes.haha}</span>
                                                                </div>
                                                            </div>

                                                            {/* Comments section */}
                                                            <div>
                                                                <button
                                                                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-600 rounded-full shadow-sm hover:shadow-md transition-shadow"
                                                                    onClick={() => toggleExpandReview(review.id)}
                                                                >
                                                                    <MessageCircle className="h-4 w-4" />
                                                                    <span className="font-medium">
                                                                        {review.comments.length} {review.comments.length === 1 ? 'Comment' : 'Comments'}
                                                                    </span>
                                                                    {expandedReviews[review.id] ? (
                                                                        <ArrowUp className="h-4 w-4" />
                                                                    ) : (
                                                                        <ArrowDown className="h-4 w-4" />
                                                                    )}
                                                                </button>

                                                                {expandedReviews[review.id] && (
                                                                    <div className="ml-6 space-y-4 mt-4">
                                                                        {review.comments.map(comment => (
                                                                            <div
                                                                                key={comment.id}
                                                                                className={`p-4 rounded-xl ${comment.isFromCafe
                                                                                        ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500'
                                                                                        : 'bg-white dark:bg-gray-600'
                                                                                    } shadow-sm`}
                                                                            >
                                                                                <div className="flex justify-between items-start mb-2">
                                                                                    <div>
                                                                                        <span className={`font-medium ${comment.isFromCafe
                                                                                                ? 'text-blue-600 dark:text-blue-300'
                                                                                                : ''
                                                                                            }`}>
                                                                                            {comment.student}
                                                                                        </span>
                                                                                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                                                                            {new Date(comment.date).toLocaleDateString()}
                                                                                        </span>
                                                                                    </div>
                                                                                    <button
                                                                                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                                                                                        onClick={() => handleReportComment(review.id, comment.id)}
                                                                                    >
                                                                                        <Flag className="h-4 w-4" />
                                                                                    </button>
                                                                                </div>
                                                                                <p className="text-gray-700 dark:text-gray-200">{comment.content}</p>

                                                                                {/* Replies */}
                                                                                {comment.replies.length > 0 && (
                                                                                    <div className="ml-6 mt-3 space-y-3">
                                                                                        {comment.replies.map(reply => (
                                                                                            <div
                                                                                                key={reply.id}
                                                                                                className={`p-3 rounded-lg ${reply.isFromCafe
                                                                                                        ? 'bg-blue-50/50 dark:bg-blue-900/20 border-l-2 border-blue-500'
                                                                                                        : 'bg-gray-50 dark:bg-gray-700/50'
                                                                                                    }`}
                                                                                            >
                                                                                                <div className="flex justify-between items-start">
                                                                                                    <div>
                                                                                                        <span className={`font-medium ${reply.isFromCafe
                                                                                                                ? 'text-blue-600 dark:text-blue-300'
                                                                                                                : ''
                                                                                                            }`}>
                                                                                                            {reply.student}
                                                                                                        </span>
                                                                                                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                                                                                            {new Date(reply.date).toLocaleDateString()}
                                                                                                        </span>
                                                                                                    </div>
                                                                                                    <button
                                                                                                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                                                                                                        onClick={() => handleReportComment(review.id, reply.id)}
                                                                                                    >
                                                                                                        <Flag className="h-3 w-3" />
                                                                                                    </button>
                                                                                                </div>
                                                                                                <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">{reply.content}</p>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}