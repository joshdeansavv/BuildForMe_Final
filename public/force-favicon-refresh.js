// Force favicon refresh for mobile browsers and cached versions
(function() {
    // Remove any existing favicons
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(link => link.remove());
    
    // Add fresh favicon with cache busting
    const timestamp = new Date().getTime();
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/x-icon';
    favicon.href = `/favicon.ico?v=2025b&t=${timestamp}`;
    document.head.appendChild(favicon);
    
    // Add Apple touch icon with cache busting
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.sizes = '180x180';
    appleTouchIcon.href = `/apple-touch-icon.png?v=2025b&t=${timestamp}`;
    document.head.appendChild(appleTouchIcon);
    
    // Force immediate refresh
    setTimeout(() => {
        favicon.href = favicon.href + '&refresh=1';
        appleTouchIcon.href = appleTouchIcon.href + '&refresh=1';
    }, 100);
})(); 