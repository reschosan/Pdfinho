import React from "react"
import { cn } from "../../../lib/utils"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

const DButtonGroup = ({ children, className, ...rest }: Props) => {
  return (
    <div
      className={cn(
        "flex justify-center mt-3 gap-2", 
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export default DButtonGroup