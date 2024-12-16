/* eslint-disable react/prop-types */

const AestheticLoadingScreen = ({
    message = "Beyond The Class",
    backgroundColor = "bg-gradient-to-br from-blue-50 to-blue-100"
}) => {
    return (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${backgroundColor} select-none`}>
            <div className="text-center space-y-6">


                {/* Loading Text with Elegant Typography */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-extralight text-gray-800 tracking-wide animate-pulse">
                        {message}
                    </h1>
                </div>

                {/* Subtle Progress Indicator */}
                <div className="w-64 h-1 bg-blue-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 animate-progress-bar"
                        style={{
                            animation: 'progressBar 2s infinite',
                            transformOrigin: 'left'
                        }}
                    ></div>
                </div>
            </div>

            {/* Subtle Background Animation */}
            <div
                className="fixed inset-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
                    animation: 'backgroundPulse 4s infinite alternate'
                }}
            ></div>
        </div>
    );
};

// Custom CSS for animations
const styles = `
@keyframes progressBar {
    0% { transform: scaleX(0); }
    50% { transform: scaleX(1); }
    100% { transform: scaleX(0); }
}

@keyframes backgroundPulse {
    from { transform: scale(0.95); }
    to { transform: scale(1.05); }
}
`;

// Inject styles
const styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = styles
document.head.appendChild(styleSheet)

export default AestheticLoadingScreen;