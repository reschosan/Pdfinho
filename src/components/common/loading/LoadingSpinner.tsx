interface Props {
  label?: string
  condition: boolean
}

const LoadingSpinner = ({ label, condition }: Props) => {
  if (!condition) return null

  return (
    <div className="flex flex-col items-center bg-transparent" role="status">
      <span className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-2" />
      {label && <span className="text-base text-center mt-2">{label}</span>}
    </div>
  )
}

export default LoadingSpinner