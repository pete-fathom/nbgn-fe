import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { WalletConnect } from './Web3/WalletConnect';
import { NBGNTransfer } from './Web3/NBGNTransfer';
import { TokenTrade } from './Web3/TokenTrade';
import { TransactionHistory } from './Web3/TransactionHistory';
import { LanguageSwitcher } from './LanguageSwitcher';
import { VersionInfo } from './VersionInfo';
import { MobileWarning } from './MobileWarning';
import TokenSelector from './TokenSelector';
import { NetworkWarning } from './NetworkWarning';
import MoneriumExplainer from './MoneriumExplainer';
import TokenInfoExplainer from './TokenInfoExplainer';
import { useAppState } from '../contexts/AppContext';
import { useTokenContext } from '../contexts/TokenContext';
import { BottomNavigation } from './BottomNavigation';

export const AppContent: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAppState();
  const { selectedToken } = useTokenContext();
  // const { chainId, switchToArbitrum } = useWeb3();
  const [activeWidget, setActiveWidget] = useState<
    'send' | 'history' | 'trade'
  >('send');
  const [prefilledRecipient, setPrefilledRecipient] = useState<string>('');
  const [prefilledAmount, setPrefilledAmount] = useState<string>('');

  const handleNavigateToSend = (address: string, amount?: string) => {
    setPrefilledRecipient(address);
    if (amount) {
      setPrefilledAmount(amount);
    }
    setActiveWidget('send');
  };

  const handleWidgetChange = (widget: 'send' | 'history' | 'trade') => {
    if (widget !== 'send') {
      setPrefilledRecipient('');
      setPrefilledAmount('');
    }
    setActiveWidget(widget);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-controls">
          <LanguageSwitcher />
        </div>
        <div
          className="header-logo"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '32px',
            marginTop: '60px',
            paddingTop: '20px',
          }}
        >
          <img
            src="/lion_head_black_no_bg.png"
            alt="NBGN Lion"
            style={{
              width: '80px',
              height: '80px',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
            }}
          />
          <h1
            style={{
              fontSize: '56px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
              letterSpacing: '-3px',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              textTransform: 'uppercase',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            NBGN
          </h1>
        </div>

        <div className="info-nav">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <Link to="/info" className="info-nav-link">
              <i className="fas fa-book-open mr-2"></i>
              Информация и упътване 📖
            </Link>
          </div>
        </div>

        <MobileWarning />

        {!user.address ? (
          // Show wallet connect first if not connected
          <>
            <div
              style={{
                marginTop: '40px',
                marginBottom: '20px',
                width: '90vw',
                maxWidth: '1200px',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  marginBottom: '20px',
                  color: '#333',
                }}
              >
                {t('common:connectFirst', 'Connect your wallet to get started')}
              </h2>
              <WalletConnect key={user.address || 'no-wallet'} />
            </div>
          </>
        ) : (
          // Show token selector and other components after wallet is connected
          <>
            <div style={{ width: '90vw', maxWidth: '1200px' }}>
              <div
                className="token-selector-container"
                style={{ marginTop: '20px', marginBottom: '20px' }}
              >
                <TokenSelector />
              </div>

              <TokenInfoExplainer />

              <MoneriumExplainer isVisible={selectedToken === 'NBGN'} />

              <WalletConnect key={user.address || 'wallet-connected'} />
            </div>
          </>
        )}

        {user.address && (
          <>
            <div
              className="mt-8 w-full"
              style={{ width: '90vw', maxWidth: '1200px' }}
            >
              {/* Network Warning for selected token */}
              <NetworkWarning />

              {/* Widget Content */}
              {activeWidget === 'send' && (
                <NBGNTransfer
                  initialRecipient={prefilledRecipient}
                  initialAmount={prefilledAmount}
                />
              )}
              {activeWidget === 'trade' && <TokenTrade />}
              {activeWidget === 'history' && (
                <TransactionHistory onNavigateToSend={handleNavigateToSend} />
              )}

              {/* Bottom Navigation - Positioned after widgets */}
              <BottomNavigation
                activeWidget={activeWidget}
                onWidgetChange={handleWidgetChange}
                selectedToken={selectedToken}
              />
            </div>
          </>
        )}
      </header>

      <VersionInfo />

      <footer className="disclaimer-footer">
        <div className="disclaimer-content">
          <p className="disclaimer-short">
            ⚠️ nbgn е частен токен, няма връзка с БНБ или официалната валута.
            Участието е изцяло на собствен риск.
            <a href="/disclaimer" className="disclaimer-link">
              Виж пълния дисклеймър тук. 🔗
            </a>
          </p>

          <div
            className="sponsor-section"
            style={{ marginTop: '16px', marginBottom: '16px' }}
          >
            <button
              onClick={() =>
                handleNavigateToSend(
                  '0x9d47330F73336cEDb75695dD0391adA2c6be529d',
                  '5'
                )
              }
              className="sponsor-link"
              style={{
                background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(236, 72, 153, 0.3)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 4px 16px rgba(236, 72, 153, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 2px 8px rgba(236, 72, 153, 0.3)';
              }}
            >
              <span>
                {t('common:sponsorProject', 'Sponsor the NBGN project')}
              </span>
              <span style={{ fontSize: '18px' }}>❤️</span>
            </button>
          </div>

          <div className="footer-links">
            <a
              href="https://discord.gg/ereWXZWMvj"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <i className="fab fa-discord mr-2"></i>
              Discord
            </a>
            <a
              href="https://github.com/pete-fathom/nbgn-fe"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <i className="fab fa-github mr-2"></i>
              Frontend
            </a>
            <a
              href="https://github.com/pete-fathom/nbgn"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <i className="fab fa-github mr-2"></i>
              Contracts
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
