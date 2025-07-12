import React from 'react';

interface TermsOfUseProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const TermsOfUse: React.FC<TermsOfUseProps> = ({ onAccept, onDecline }) => {
  return (
    <div className="terms-modal-overlay">
      <div className="terms-modal">
        <div className="terms-header">
          <h1>📝 Условия за ползване (Terms of Use)</h1>
          <p className="terms-last-updated">Последна актуализация: {new Date().toLocaleDateString('bg-BG')}</p>
          <p className="terms-intro">
            Моля, прочетете внимателно настоящите Условия за ползване, преди да използвате уебсайта, 
            приложението или услугите, свързани с токена nbgn.
          </p>
          <p className="terms-agreement">
            <strong>Използвайки платформата, вие се съгласявате с тези условия.</strong>
          </p>
        </div>

        <div className="terms-content">
          <div className="terms-divider">⸻</div>

          <div className="terms-section">
            <h2>1. 💡 Обща информация</h2>
            <ul>
              <li>nbgn е частен криптографски токен, създаден с експериментални и образователни цели.</li>
              <li>Проектът не е официална валута, не е регулиран финансов инструмент и не е обвързан с българската държава, БНБ или ЕС.</li>
              <li>Всички участници действат на собствен риск.</li>
            </ul>
          </div>

          <div className="terms-divider">⸻</div>

          <div className="terms-section">
            <h2>2. 🪙 Описание на токена</h2>
            <ul>
              <li>nbgn е частен токен, символично обвързан с EURe по курс 1 EURe = 1.9558 nbgn.</li>
              <li>Този курс няма официален характер и не е гарантиран от никоя институция.</li>
              <li>Проектът не обещава запазване на стойност, ликвидност или възвръщаемост.</li>
            </ul>
          </div>

          <div className="terms-divider">⸻</div>

          <div className="terms-section">
            <h2>3. 🚫 Ограничения и отговорност</h2>
            <ul>
              <li>Услугите не са насочени към лица в юрисдикции, където криптоактиви са незаконни.</li>
              <li>Не носим отговорност за:
                <ul>
                  <li>загуби от търговия,</li>
                  <li>грешки при използване на токена или платформата,</li>
                  <li>регулаторни последствия от действия на потребителите.</li>
                </ul>
              </li>
              <li>Вие се съгласявате, че използвате nbgn на свой риск и без каквато и да е гаранция.</li>
            </ul>
          </div>

          <div className="terms-divider">⸻</div>

          <div className="terms-section">
            <h2>4. 👥 Потребителско поведение</h2>
            <ul>
              <li>Забранено е да използвате платформата за незаконни цели (пране на пари, измами, финансиране на тероризъм и др.).</li>
              <li>При установени нарушения, достъпът ви до услугите може да бъде ограничен или прекратен.</li>
            </ul>
          </div>

          <div className="terms-divider">⸻</div>

          <div className="terms-section">
            <h2>5. 🔐 Лични данни и поверителност</h2>
            <ul>
              <li>Платформата не събира лични данни без ваше изрично съгласие.</li>
              <li>Възможно е използване на аналитични и функционални бисквитки (cookies).</li>
              <li>За повече информация, вижте нашата Политика за поверителност.</li>
            </ul>
          </div>

          <div className="terms-divider">⸻</div>

          <div className="terms-section">
            <h2>6. ⚖️ Правна приложимост</h2>
            <ul>
              <li>Тези условия се уреждат от законодателството на България.</li>
              <li>Всички спорове се решават от компетентния съд в София.</li>
            </ul>
          </div>

          <div className="terms-divider">⸻</div>

          <div className="terms-section">
            <h2>7. 🔄 Промени</h2>
            <ul>
              <li>Условията могат да бъдат актуализирани по всяко време.</li>
              <li>При съществени промени, потребителите ще бъдат уведомени чрез платформата.</li>
            </ul>
          </div>

          <div className="terms-divider">⸻</div>

          <div className="terms-section">
            <h2>8. 📬 Контакт</h2>
            <p>Ако имате въпроси, свържете се с нас:</p>
            <div className="terms-contact-links">
              <a href="https://discord.gg/ereWXZWMvj" target="_blank" rel="noopener noreferrer" className="terms-contact-link">
                <i className="fab fa-discord mr-2"></i>
                Discord
              </a>
              <a href="https://github.com/pete-fathom/nbgn" target="_blank" rel="noopener noreferrer" className="terms-contact-link">
                <i className="fab fa-github mr-2"></i>
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="terms-actions">
          <button onClick={onDecline} className="terms-button terms-button-decline">
            <i className="fas fa-times mr-2"></i>
            Не приемам
          </button>
          <button onClick={onAccept} className="terms-button terms-button-accept">
            <i className="fas fa-check mr-2"></i>
            Приемам условията
          </button>
        </div>
      </div>
    </div>
  );
};