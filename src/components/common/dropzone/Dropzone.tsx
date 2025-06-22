import { t } from 'i18next'
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone'
import { Button } from '../../ui/button'

interface Props {
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T
}
const Dropzone = ({ getRootProps, getInputProps }: Props) => {
  return (
    <div
      {...getRootProps()}
      className="w-[90%] min-h-[90px] rounded border-2 border-dashed border-[#e3e8f0] bg-white shadow flex items-center justify-center mb-2 cursor-pointer transition-all hover:shadow-lg hover:border-primary"
    >
      <input type="file" {...getInputProps()} />
      <Button
        variant={'ghost'}
        className="hover:bg-transparent hover:text-inherit focus:bg-transparent focus:text-inherit active:bg-transparent active:text-inherit px-4"
      >
        {t('button.drag.text')}
      </Button>
    </div>
  )
}

export default Dropzone
