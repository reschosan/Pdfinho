import { t } from 'i18next'
import { styles } from '../../pdf-tools/PdfStyles'

interface Props {
  tTitle: string
  tSubtitle?: string
  tDescription?: string
}

const Header = ({ tTitle, tSubtitle, tDescription }: Props) => {
  return (
    <div className={styles.header}>
      <h1 className="text-3xl font-semibold text-primary text-center">
        {t(tTitle)}
      </h1>
      {tSubtitle && (
        <p className="text-lg text-secondary text-center mt-1">{t(tSubtitle)}</p>
      )}
      {tDescription && (
        <p className="text-base text-center mt-3">{t(tDescription)}</p>
      )}
    </div>
  )
}

export default Header
