import React from 'react';
import AppDownloadQR, { CustomQRCode } from './AppDownloadQR';

const QRCodeExamples = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            QR Code Component Examples
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Different layouts and configurations for app download QR codes
          </p>
        </div>

        {/* Card Layout Examples */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Card Layout (Standalone Components)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Default Card */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Default Card</h3>
              <AppDownloadQR layout="card" />
            </div>

            {/* App Only Card */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">App Only</h3>
              <AppDownloadQR 
                layout="card" 
                showOnlyApp={true}
                customTitle="Download Socian App"
              />
            </div>

            {/* Large Size Card */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Large Size</h3>
              <AppDownloadQR 
                layout="card" 
                size="large"
                showOnlyApp={true}
              />
            </div>

            {/* Small Size Card */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Small Size</h3>
              <AppDownloadQR 
                layout="card" 
                size="small"
                showOnlyApp={true}
              />
            </div>

            {/* Minimal Card */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Minimal</h3>
              <AppDownloadQR 
                layout="card" 
                showTitle={false}
                showDescription={false}
                showLinkButton={false}
                showOnlyApp={true}
              />
            </div>

            {/* Custom Text Card */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Custom Text</h3>
              <AppDownloadQR 
                layout="card" 
                showOnlyApp={true}
                customTitle="Beyond The Class"
                customDescription="Your university companion app"
              />
            </div>
          </div>
        </section>

        {/* Mobile Layout Example */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Mobile Layout
          </h2>
          <div className="max-w-md mx-auto">
            <AppDownloadQR layout="mobile" />
          </div>
        </section>

        {/* Custom QR Code Examples */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Custom QR Codes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            <CustomQRCode 
              url="https://socian.app" 
              label="Socian Website"
              size={120}
            />
            
            <CustomQRCode 
              url="https://github.com/socian-app" 
              label="GitHub"
              size={120}
            />
            
            <CustomQRCode 
              url="https://www.linkedin.com/company/socian-app/" 
              label="LinkedIn Company"
              size={120}
            />
            
            <CustomQRCode 
              url="mailto:support@socian.app" 
              label="Contact Us"
              size={120}
            />
          </div>
        </section>

        {/* Usage Examples in Code */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Usage Examples
          </h2>
          <div className="bg-gray-800 text-gray-100 p-6 rounded-lg overflow-x-auto">
            <pre className="text-sm">
{`// Import the component
import AppDownloadQR, { CustomQRCode } from './components/QRCode/AppDownloadQR';

// Basic usage - Floating desktop QR (like login page)
<AppDownloadQR />

// Card layout for any page
<AppDownloadQR layout="card" />

// Mobile optimized version
<AppDownloadQR layout="mobile" />

// App only with custom title
<AppDownloadQR 
  layout="card" 
  showOnlyApp={true}
  customTitle="Download Beyond The Class"
  customDescription="Your university companion app"
/>

// Minimal version
<AppDownloadQR 
  layout="card" 
  showTitle={false}
  showDescription={false}
  showLinkButton={false}
  showOnlyApp={true}
/>

// Custom QR for any URL
<CustomQRCode 
  url="https://socian.app" 
  label="Visit Website"
  size={150}
/>

// Large size with both QR codes
<AppDownloadQR 
  layout="card" 
  size="large"
  showBoth={true}
/>`}
            </pre>
          </div>
        </section>

        {/* Props Documentation */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Props Documentation
          </h2>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">AppDownloadQR Props:</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left p-2 text-gray-900 dark:text-white">Prop</th>
                    <th className="text-left p-2 text-gray-900 dark:text-white">Type</th>
                    <th className="text-left p-2 text-gray-900 dark:text-white">Default</th>
                    <th className="text-left p-2 text-gray-900 dark:text-white">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-mono">layout</td>
                    <td className="p-2">"desktop" | "mobile" | "card"</td>
                    <td className="p-2">"desktop"</td>
                    <td className="p-2">Component layout type</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-mono">size</td>
                    <td className="p-2">"small" | "medium" | "large"</td>
                    <td className="p-2">"medium"</td>
                    <td className="p-2">QR code size</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-mono">showOnlyApp</td>
                    <td className="p-2">boolean</td>
                    <td className="p-2">false</td>
                    <td className="p-2">Show only app QR, hide LinkedIn</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-mono">showTitle</td>
                    <td className="p-2">boolean</td>
                    <td className="p-2">true</td>
                    <td className="p-2">Show/hide title</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-mono">showDescription</td>
                    <td className="p-2">boolean</td>
                    <td className="p-2">true</td>
                    <td className="p-2">Show/hide description</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2 font-mono">customTitle</td>
                    <td className="p-2">string</td>
                    <td className="p-2">"Better on the app"</td>
                    <td className="p-2">Custom title text</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono">customDescription</td>
                    <td className="p-2">string</td>
                    <td className="p-2">Default description</td>
                    <td className="p-2">Custom description text</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>Choose the layout and configuration that best fits your needs!</p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeExamples; 