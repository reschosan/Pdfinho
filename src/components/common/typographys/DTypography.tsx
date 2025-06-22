import { cn } from '../../../lib/utils'
import { styles } from '../../pdf-tools/PdfStyles'

interface DTypographyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const DTypography = ({ children, className, ...props }: DTypographyProps) => (
  <div className={cn(styles.typography, className)} {...props}>
    {children}
  </div>
)

export default DTypography
