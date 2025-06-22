import React from 'react'
import { styles } from '../pdf-tools/PdfStyles'

interface CenterContainerProps {
  children: React.ReactNode
}

const CenterContainer: React.FC<CenterContainerProps> = ({ children }) => {
  return <div className={styles.container}>{children}</div>
}

export default CenterContainer
