/**
 * Newsreader + IBM Plex Mono for the sales-site routes. Rendered from each
 * sales route's layout so the paper-themed routes stay on system fonts.
 */
export function SalesFonts() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font -- app-router route-scoped fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
    </>
  );
}
