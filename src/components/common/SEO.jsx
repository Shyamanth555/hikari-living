import { Helmet } from 'react-helmet-async';
import { BRAND_NAME } from '../../lib/constants';

export function SEO({ title, description, canonical, image }) {
  const fullTitle = title ? `${title} | ${BRAND_NAME}` : `${BRAND_NAME} — Considered Living`;
  const desc = description || 'Hikari Living — considered furniture, lighting, and decor for the modern home.';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
    </Helmet>
  );
}
