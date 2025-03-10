import { Rating } from "@mui/material";
import { Star } from "@mui/icons-material";
import { Link } from 'react-router-dom';

/* eslint-disable react/prop-types */
export default function TeacherCard({ teacher }) {
    // console.log("teacher", teacher)
    return (
        <Link
            to={`/student/teacher/comments/${teacher._id}`}
            className="block p-6 transition-all duration-200 hover:shadow-lg rounded-lg border border-border bg-card hover:bg-accent/5"
        >
            <div className="flex items-center space-x-4">
                <div className="relative">
                    {teacher.imageUrl !== '' ? (
                        <img
                            className="h-12 w-12 rounded-full object-cover border border-border"
                            src={teacher.imageUrl}
                            alt={`${teacher.name}'s photo`}
                        />
                    ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
                            <span className="text-primary-foreground text-sm font-medium">
                                {teacher.name.charAt(0).toUpperCase() || 'D'}
                            </span>
                        </div>
                    )}
                    {teacher.onLeave && (
                        <span className="absolute -top-1 -right-1 h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                        </span>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-foreground truncate">
                        {teacher.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {teacher?.designation || 'designation'}
                    </p>
                </div>
            </div>

            <div className="mt-4 space-y-3">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Rating:</span>
                    <Rating
                        readOnly
                        value={teacher.rating}
                        precision={0.5}
                        size="small"
                        emptyIcon={<Star className="opacity-90 text-muted-foreground/20" fontSize="inherit" />}
                    />
                </div>

                {teacher?.topComment && (
                    <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {teacher.topComment}
                        </p>
                    </div>
                )}

                <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Feedback Summary</p>
                    <p className="text-sm text-muted-foreground">
                        {teacher.feedbackSummary || "No summary available."}
                    </p>
                </div>

                {teacher.onLeave && (
                    <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border border-destructive/50 text-destructive">
                        Currently on leave
                    </div>
                )}
            </div>
        </Link>
    );
}
