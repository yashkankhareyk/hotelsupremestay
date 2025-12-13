import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
}

export default function SEO({ title, description, canonical, ogImage }: SEOProps) {
  const siteUrl = window.location.origin;
  const fullTitle = `${title} | Hotel Supreme Stay`;
  const defaultImage = `${siteUrl}/og-image.jpg`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {canonical && <link rel="canonical" href={`${siteUrl}${canonical}`} />}

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:url" content={`${siteUrl}${canonical || ''}`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultImage} />

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Hotel",
          "name": "Hotel Supreme Stay",
          "description": "Luxury hotel in Wagholi, Pune offering exceptional hospitality and modern amenities",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Wagholi",
            "addressLocality": "Pune",
            "addressRegion": "Maharashtra",
            "postalCode": "412207",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 18.5793,
            "longitude": 73.9893
          },
          "telephone": "+91-98765-43210",
          "email": "bookings@hotelsupremestay.in",
          "starRating": {
            "@type": "Rating",
            "ratingValue": "4.8"
          },
          "priceRange": "$$"
        })}
      </script>
    </Helmet>
  );
}
