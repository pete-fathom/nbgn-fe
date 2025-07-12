import React, { useState, useEffect } from 'react';

export const MobileWarning: React.FC = () => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // eslint-disable-next-line no-undef
      const userAgent = navigator.userAgent.toLowerCase();
      // eslint-disable-next-line no-undef
      const screenWidth = window.innerWidth;

      // Check if it's a mobile device based on screen width and user agent
      const isMobileDevice =
        screenWidth <= 768 ||
        /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent
        );

      // Check if it's MetaMask's built-in browser
      const isMetaMask =
        userAgent.includes('metamask') ||
        // eslint-disable-next-line no-undef
        (typeof window !== 'undefined' && window.ethereum?.isMetaMask);

      setShowWarning(isMobileDevice && !isMetaMask);
    };

    checkMobile();
    // eslint-disable-next-line no-undef
    window.addEventListener('resize', checkMobile);

    // eslint-disable-next-line no-undef
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!showWarning) {
    return null;
  }

  return (
    <div className="mobile-warning">
      <div className="mobile-warning-content">
        <i className="fas fa-mobile-alt mr-2"></i>
        <div className="mobile-warning-text">
          <strong>📱 Мобилно устройство</strong>
          <p>
            За да използвате платформата на мобилно устройство, моля отворете
            този сайт от <strong>вградения браузър на MetaMask</strong>.
          </p>
          <p className="mobile-warning-steps">
            1. Отворете MetaMask приложението
            <br />
            2. Натиснете иконата за браузър (долу в средата)
            <br />
            3. Въведете адреса на сайта
          </p>
        </div>
      </div>
    </div>
  );
};
