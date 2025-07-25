import React from 'react';
import { useTokenContext } from '../../contexts/TokenContext';
import { useAppState } from '../../contexts/AppContext';
import { getChainName } from '../../utils/networks';
import styles from './NetworkWarning.module.css';

export const NetworkWarning: React.FC = () => {
  const { getTokenConfig, isCorrectNetwork, switchToTokenNetwork } =
    useTokenContext();
  const { user, web3 } = useAppState();

  // Don't show any warning if wallet is not connected
  if (!user.address || !web3.connected) {
    return null;
  }

  // If wallet is connected and network is correct, don't show warning
  if (isCorrectNetwork()) {
    return null;
  }

  const tokenConfig = getTokenConfig();
  const requiredNetwork = getChainName(tokenConfig.chainId);

  return (
    <div className={styles.warningContainer}>
      <div className={styles.warningContent}>
        <div className={styles.warningIcon}>
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <div className={styles.warningText}>
          <div className={styles.warningTitle}>Wrong Network</div>
          <div className={styles.warningMessage}>
            {tokenConfig.symbol} requires {requiredNetwork}. Please switch
            networks to continue.
          </div>
        </div>
        <button
          className={styles.switchButton}
          onClick={() => switchToTokenNetwork()}
        >
          Switch to {requiredNetwork}
        </button>
      </div>
    </div>
  );
};
