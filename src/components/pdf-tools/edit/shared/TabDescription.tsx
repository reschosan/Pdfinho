import { t } from 'i18next'
import { styles } from '../../PdfStyles'

interface Props {
  tTitle: string
}
const TabDescription = ({ tTitle }: Props) => {
  return <span className={styles.tabDescription}>{t(tTitle)}</span>
}
export default TabDescription
