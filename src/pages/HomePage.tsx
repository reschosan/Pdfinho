import { useNavigate } from 'react-router-dom'
import CenterContainer from '../components/common/CenterContainer'
import Header from '../components/common/headers/Header'
import DTypography from '../components/common/typographys/DTypography'
import { styles } from '../components/pdf-tools/PdfStyles'
import { Button } from '../components/ui/button'
import { t } from 'i18next'
import PrivacyPolicy from '../components/other/PrivacyPolicy'
import { cn } from '../lib/utils'

const HomePage = () => {
  const navigate = useNavigate()
  return (
    <CenterContainer>
      <Header
        tTitle="header"
        tSubtitle="description"
        tDescription="home.description"
      />

      <div className={styles.content}>
        <DTypography>{t('label.functions')}:</DTypography>

        <div className={cn(styles.row, 'justify-center')}>
          <Button variant="link" onClick={() => navigate('/combine')}>
            {t('home.button.combine')}
          </Button>
          <Button variant="link" onClick={() => navigate('/editfile')}>
            {t('home.button.edit')}
          </Button>
          <Button variant="link" onClick={() => navigate('/convert')}>
            {t('home.button.converter')}
          </Button>
          <Button variant="link" onClick={() => navigate('/about')}>
            {t('home.button.about')}
          </Button>
        </div>
        <div className={cn(styles.row, 'justify-center')}>
          <PrivacyPolicy mode="link" />
        </div>
      </div>
    </CenterContainer>
  )
}
export default HomePage
