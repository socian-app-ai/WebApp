import { Helmet } from 'react-helmet-async';

const SEO = ({ 
    title, 
    description, 
    keywords, 
    image = `${import.meta.env.VITE_FRONTENT_URL}/Socian.png`,
    type = "website",
    structuredData = null,
    pageType = "default"
}) => {
    // Primary site title for Socian.app
    const siteTitle = "Socian - Student Community Platform";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    
    // Primary description for Socian.app
    const defaultDescription = "Socian is a comprehensive student community platform connecting students, teachers, and alumni. Share resources, discuss courses, and build meaningful connections within your academic community.";
    const defaultKeywords = "Socian, student community, university platform, academic networking, student resources, campus social network, educational platform, student collaboration";

    // Structured data templates for different page types
    const structuredDataTemplates = {
        // Default WebApplication schema
        default: {
        "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Socian",
            "description": "A comprehensive student community platform connecting students, teachers, and alumni for academic collaboration and resource sharing.",
            "url": "https://socian.app",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web, iOS, Android",
            "creator": {
        "@type": "Person",
        "name": "Muhammad Bilal Ellahi",
                "alternateName": ["Bilal Ellahi", "M Bilal"],
        "url": "https://bilalellahi.com",
        "jobTitle": "Full Stack Developer",
                "description": "Creator of Socian - Student Community Platform",
        "sameAs": [
            "https://github.com/MuhammadBilalEllahi",
            "https://linkedin.com/in/bilal-ellahi",
            "https://twitter.com/bilal_illahi",
                    "https://www.instagram.com/bilal._.illahi"
                ]
            },
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            },
            "featureList": [
                "Student Community Networking",
                "Resource Sharing",
                "Course Discussions",
                "Academic Collaboration",
                "Campus Social Features"
            ]
        },

        // Login page schema
        login: {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Socian Login",
            "description": "Login to Socian - Student Community Platform. Connect with students, teachers, and alumni for academic collaboration.",
            "url": "https://socian.app/login",
            "author": {
                "@type": "Person",
                "name": "Muhammad Bilal Ellahi"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Socian",
                "url": "https://socian.app"
            }
        },

        // Signup page schema
        signup: {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Socian Signup",
            "description": "Join Socian - Student Community Platform. Create your account to connect with students, teachers, and alumni.",
            "url": "https://socian.app/signup",
            "author": {
                "@type": "Person",
                "name": "Muhammad Bilal Ellahi"
            }
        },

        // Student dashboard schema
        student: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Student Dashboard",
            "description": "Student dashboard for Socian platform. Access course materials, connect with peers, and participate in academic discussions.",
            "url": "https://socian.app/student",
            "mainEntity": {
                "@type": "EducationalOrganization",
                "name": "Student Community Platform"
            }
        },

        // Teacher dashboard schema
        teacher: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Teacher Dashboard",
            "description": "Teacher dashboard for Socian platform. Manage courses, interact with students, and share educational resources.",
            "url": "https://socian.app/teacher",
            "mainEntity": {
                "@type": "EducationalOrganization",
                "name": "Teacher Community Platform"
            }
        },

        // Societies page schema
        societies: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Student Societies",
            "description": "Explore student societies and organizations on Socian. Join clubs, participate in events, and build your campus community.",
            "url": "https://socian.app/student/societies",
            "mainEntity": {
                "@type": "Organization",
                "name": "Student Societies"
            }
        },

        // Reviews page schema
        reviews: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Teacher Reviews",
            "description": "Read and write teacher reviews on Socian. Share your academic experiences and help other students make informed decisions.",
            "url": "https://socian.app/student/reviews/teachers",
            "mainEntity": {
                "@type": "Review",
                "itemReviewed": {
                    "@type": "Person",
                    "jobTitle": "Teacher"
                }
            }
        },

        // Privacy page schema
        privacy: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Privacy Policy",
            "description": "Privacy policy for Socian - Student Community Platform. Learn how we protect your data and maintain your privacy.",
            "url": "https://socian.app/privacy",
            "mainEntity": {
                "@type": "CreativeWork",
                "name": "Privacy Policy"
            }
        },

        // Admin dashboard schema
        admin: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Admin Dashboard",
            "description": "Administrative dashboard for Socian platform management.",
            "url": "https://socian.app/super",
            "mainEntity": {
                "@type": "Organization",
                "name": "Socian Administration"
            }
        }
    };

    // Get the appropriate structured data based on page type
    const getStructuredData = () => {
        if (structuredData) return structuredData;
        return structuredDataTemplates[pageType] || structuredDataTemplates.default;
    };

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />
            <meta name="author" content="Muhammad Bilal Ellahi - Creator of Socian" />
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />
            <meta name="bingbot" content="index, follow" />
            <meta name="yandexbot" content="index, follow" />
            <meta name="sitemap" content="https://socian.app/sitemap.xml" />

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content="https://socian.app" />
            <meta property="og:type" content={type} />
            <meta property="og:locale" content="en_US" />
            <meta property="og:site_name" content="Socian" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:url" content="https://socian.app" />

            {/* Android App Meta Tags */}
            <meta name="android-app-id" content="app.socian.community" />
            <meta name="android-app-name" content="Socian" />
            <meta name="android-app-url" content="https://socian.app" />

            {/* Search Engine Verification */}
            <meta name="google-site-verification" content="google-site-verification=google-site-verification" />
            <meta name="msvalidate.01" content="Bing-Site-Verification:google-site-verification=google-site-verification" />
            <meta name="yandex-verification" content="yandex-verification" />

            {/* Canonical URL and Sitemap */}
            <link rel="canonical" href="https://socian.app" />
            <link rel="sitemap" href="https://socian.app/sitemap.xml" />

            {/* Favicon */}
            <link rel="icon" href="https://socian.app/favicon.ico" />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(getStructuredData())}
            </script>
        </Helmet>
    );
};

export default SEO; 