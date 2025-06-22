import { t } from 'i18next'
import { Link } from 'react-router-dom'
import CenterContainer from '../components/common/CenterContainer'
import Header from '../components/common/headers/Header'
import DTypography from '../components/common/typographys/DTypography'
import PrivacyPolicy from '../components/other/PrivacyPolicy'
import { styles } from '../components/pdf-tools/PdfStyles'

const AboutPage = () => (
  <CenterContainer>
    <Header tTitle="about.title" tSubtitle="about.description" tDescription="" />

    <div className={styles.content}>
      <DTypography>{t('about.github')}</DTypography>
      <Link
        className="text-primary hover:underline underline-offset-5 mb-2"
        to="https://github.com/cristiano/ronaldo"
        target="_blank"
        rel="noopener"
      >
        GitHub
      </Link>

      <PrivacyPolicy />
    </div>
  </CenterContainer>
)

export default AboutPage
