import React from 'react';

const AppDownloadQR = ({ 
  showTitle = true,
  showDescription = true,
  showLinkButton = true,
  className = "",
  layout = "desktop", // "desktop", "mobile", "card"
  size = "medium", // "small", "medium", "large"
  showBoth = true, // Show both LinkedIn and App QR codes
  showOnlyApp = false, // Show only app QR code
  customTitle = "Better on the app",
  customDescription = "Connect, explore universities, access past papers & teacher reviews. One platform for all campus life."
}) => {
  
  // Size configurations
  const sizeConfig = {
    small: { qr: 80, container: "w-64" },
    medium: { qr: 100, container: "w-80" },
    large: { qr: 120, container: "w-96" }
  };

  const currentSize = sizeConfig[size];

  // Layout: Card (standalone component)
  if (layout === "card") {
    return (
      <div className={`${currentSize.container} max-w-[90vw] rounded-xl border bg-white dark:bg-[#18181b] shadow-lg p-4 flex flex-col items-center transition-all duration-300 ${className}`}
        style={{boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)'}}
      >
        {showTitle && (
          <h2 className="font-semibold text-lg mb-2 text-center dark:text-white">{customTitle}</h2>
        )}
        {showDescription && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">{customDescription}</p>
        )}
        
        <div className={`flex ${showBoth && !showOnlyApp ? 'flex-row gap-6' : 'flex-col'} items-center justify-center w-full`}>
          {/* App QR Code */}
          <div className="flex flex-col items-center">
            <div className="bg-white dark:bg-white p-2 rounded-lg border mb-2">
              <img
                src={'/socian.app.svg'}
                alt="Socian App QR"
                width={currentSize.qr}
                height={currentSize.qr}
                className="rounded"
              />
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300">@socian.app</span>
          </div>

          {/* LinkedIn QR (only if showBoth is true and showOnlyApp is false) */}
          {showBoth && !showOnlyApp && (
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-black p-2 rounded-lg border mb-2">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=${currentSize.qr + 20}x${currentSize.qr + 20}&data=https://www.linkedin.com/company/socian-app/`}
                  alt="LinkedIn QR"
                  width={currentSize.qr}
                  height={currentSize.qr}
                  className="rounded"
                />
              </div>
              <span className="text-xs text-gray-700 dark:text-gray-300">LinkedIn</span>
            </div>
          )}
        </div>
        
        {showLinkButton && (
          <a
            href="https://linktr.ee/socian.app"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 dark:text-white text-black font-medium underline text-sm hover:text-blue-700 dark:hover:text-blue-400"
          >
            <p className="text-sm">Explore the app</p>
          </a>
        )}
      </div>
    );
  }

  // Layout: Mobile (compact version)
  if (layout === "mobile") {
    return (
      <div className={`w-full max-w-md mx-auto mt-6 rounded-xl border bg-white dark:bg-[#18181b] shadow p-4 flex flex-col items-center ${className}`}>
        {showTitle && (
          <h2 className="font-semibold text-base mb-1 text-center dark:text-white">{customTitle}</h2>
        )}
        {showDescription && (
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 text-center">{customDescription}</p>
        )}
        
        {/* Mobile shows only app QR by default */}
        <div className="flex flex-col items-center">
          <div className="bg-white dark:bg-white p-2 rounded-lg border mb-2">
            <img
              src={'/socian.app.svg'}
              alt="Socian App QR"
              width={currentSize.qr}
              height={currentSize.qr}
              className="rounded"
            />
          </div>
          <span className="text-xs text-gray-700 dark:text-gray-300">@socian.app</span>
        </div>

        {showLinkButton && (
          <a
            href="https://linktr.ee/socian.app"
            target="_blank"
            rel="noopener noreferrer"
            className="dark:text-white text-black font-medium underline text-sm hover:text-blue-700 dark:hover:text-blue-400"
          >
            <p className="text-sm">Explore the app</p>
          </a>
        )}
      </div>
    );
  }

  // Layout: Desktop (floating)
  return (
    <div className={`fixed z-50 bottom-4 right-4 ${currentSize.container} max-w-[90vw] rounded-xl border bg-white dark:bg-[#18181b] shadow-lg p-4 flex flex-col items-center transition-all duration-300 ${className}`}
      style={{boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)'}}
    >
      {showTitle && (
        <h2 className="font-semibold text-lg mb-2 text-center dark:text-white">{customTitle}</h2>
      )}
      {showDescription && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">{customDescription}</p>
      )}
      
      <div className={`flex ${showBoth && !showOnlyApp ? 'flex-row gap-6' : 'flex-col'} items-center justify-center w-full`}>
        {/* App QR Code */}
        <div className="flex flex-col items-center">
          <div className="bg-white dark:bg-white p-2 rounded-lg border mb-2">
            <img
              src={'/socian.app.svg'}
              alt="Socian App QR"
              width={currentSize.qr}
              height={currentSize.qr}
              className="rounded"
            />
          </div>
          <span className="text-xs text-gray-700 dark:text-gray-300">@socian.app</span>
        </div>

        {/* LinkedIn QR (only if showBoth is true and showOnlyApp is false) */}
        {showBoth && !showOnlyApp && (
          <div className="flex flex-col items-center">
            <div className="bg-white dark:bg-black p-2 rounded-lg border mb-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=${currentSize.qr + 20}x${currentSize.qr + 20}&data=https://www.linkedin.com/company/socian-app/`}
                alt="LinkedIn QR"
                width={currentSize.qr}
                height={currentSize.qr}
                className="rounded"
              />
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300">LinkedIn</span>
          </div>
        )}
      </div>
      
      {showLinkButton && (
        <a
          href="https://linktr.ee/socian.app"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 dark:text-white text-black font-medium underline text-sm hover:text-blue-700 dark:hover:text-blue-400"
        >
          <p className="text-sm">Explore the app</p>
        </a>
      )}
    </div>
  );
};

// Custom QR Code Generator Component for any URL
export const CustomQRCode = ({ 
  url, 
  label, 
  size = 100, 
  className = "",
  backgroundColor = "white",
  foregroundColor = "black" 
}) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`bg-${backgroundColor} dark:bg-${backgroundColor} p-2 rounded-lg border mb-2`}>
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=${size + 20}x${size + 20}&data=${encodeURIComponent(url)}&bgcolor=${backgroundColor}&color=${foregroundColor}`}
          alt={`QR Code for ${label}`}
          width={size}
          height={size}
          className="rounded"
        />
      </div>
      {label && <span className="text-xs text-gray-700 dark:text-gray-300">{label}</span>}
    </div>
  );
};

export default AppDownloadQR; 