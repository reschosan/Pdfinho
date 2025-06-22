import { t } from 'i18next'
import { Button } from '../../ui/button'
import { Upload } from 'lucide-react' // shadcn/ui Icon
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'

interface Props extends React.ComponentPropsWithoutRef<'input'> {
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  translationTitle?: string
  acceptedFileTypes?: string
}

const FileUpload = ({
  handleImageChange,
  translationTitle,
  acceptedFileTypes,
  ...rest
}: Props) => {
  return (
    <div className="flex flex-col items-center">
      {translationTitle && (
        <span className="text-sm font-medium mb-1">
          {t(translationTitle)}
        </span>
      )}

      <Button
        asChild
        className="rounded-[4px] font-medium px-5 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Label className="flex items-center cursor-pointer">
          <Upload className="w-5 h-5" />
          {t('label.upload')}
          <Input
            {...rest}
            accept={acceptedFileTypes || rest.accept}
            type="file"
            onChange={handleImageChange}
            hidden
          />
        </Label>
      </Button>
    </div>
  )
}
export default FileUpload
