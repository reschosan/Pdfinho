import { t } from 'i18next'
import { styles } from '../pdf-tools/PdfStyles'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'

interface Props {
  mode?: 'default' | 'link'
}

const PrivacyPolicy = ({ mode = 'default' }: Props) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={mode === 'default' ? 'default' : 'link'}>
          {t('privacy.title')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-auto bg-accent">
        <div className={styles.columns}>
          <h2 className={styles.h2}>{t('privacy.title')}</h2>
          <p>{t('privacy.description')}</p>

          <h3 className={styles.h3}>{t('privacy.hosting.title')}</h3>
          <p className={styles.p}>{t('privacy.hosting.description')}</p>

          <h3 className={styles.h3}>{t('privacy.external.title')}</h3>
          <p className={styles.p}>{t('privacy.external.description')}</p>

          <h3 className={styles.h3}>{t('privacy.cookies.title')}</h3>
          <p className={styles.p}>{t('privacy.cookies.description')}</p>

          <h3 className={styles.h3}>{t('privacy.contact.title')}</h3>
          <p className={styles.p}>{t('privacy.contact.description')}</p>

          <p className={styles.p}>[{t('privacy.timestamp')}]</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default PrivacyPolicy
