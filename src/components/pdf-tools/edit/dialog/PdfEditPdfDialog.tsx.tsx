import { t } from 'i18next'
import { isEqual } from 'lodash'
import { Check, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setEditDialogOpen, setOverlays } from '../../../../store/pdfSlice'
import { RootState } from '../../../../store/store'
import DIconButton from '../../../common/buttons/DIconButton'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs'
import { styles } from '../../PdfStyles'
import {
  EditorType,
  isCheckboxOptionsValid,
  isImageOptionsValid,
  isSignatureOptionsValid,
  isTextOptionsValid,
} from '../interfaces/EditorOptions'
import AddCheckboxTab from '../tabs/AddCheckboxTab'
import AddImageTab from '../tabs/AddImageTab'
import AddSignatureTab from '../tabs/AddSignatureTab'
import AddTextTab from '../tabs/AddTextTab'
import { cn } from '../../../../lib/utils'

interface Props {
  handleDialogOk: () => void
}
enum TabsPosition {
  AddText = '0',
  AddSignature = '1',
  AddImage = '2',
  AddCheckbox = '3',
}
const PdfEditPdfDialog = ({ handleDialogOk }: Props) => {
  const dispatch = useDispatch()
  const { overlays, editorOptions, pageNumber, coordinates, editDialogOpen } =
    useSelector((state: RootState) => state.pdf)
  const { x, y } = coordinates

  const handleClose = () => {
    dispatch(setEditDialogOpen(false))
  }

  const handleOk = () => {
    if (!editorOptions) {
      handleDialogOk()
      console.warn('Editor options are not set. Cannot add overlay.')
      return
    }
    dispatch(
      setOverlays([
        ...overlays,
        {
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          page: pageNumber,
          x,
          y,
          options: editorOptions,
        },
      ]),
    )
    handleDialogOk()
  }

  const isOkDisabled = () => {
    return (
      !editorOptions ||
      (isEqual(editorOptions.type, EditorType.Text) &&
        !isTextOptionsValid(editorOptions)) ||
      (isEqual(editorOptions.type, EditorType.Signature) &&
        !isSignatureOptionsValid(editorOptions)) ||
      (isEqual(editorOptions.type, EditorType.Image) &&
        !isImageOptionsValid(editorOptions)) ||
      (isEqual(editorOptions.type, EditorType.Checkbox) &&
        !isCheckboxOptionsValid(editorOptions))
    )
  }

  return (
    <Dialog open={editDialogOpen} onOpenChange={handleClose}>
      <DialogContent className={cn(styles.columns, 'bg-accent') }>
        <DialogHeader>
          <DialogTitle className="text-center text-primary font-bold text-xl">
            {t('edit.dialog.title')}
          </DialogTitle>
        </DialogHeader>

        <Tabs className={styles.columns}>
          <TabsList>
            <TabsTrigger value={TabsPosition.AddText}>
              {t('edit.dialog.tabs.addText.title')}
            </TabsTrigger>
            <TabsTrigger value={TabsPosition.AddSignature}>
              {t('edit.dialog.tabs.addSignature.title')}
            </TabsTrigger>
            <TabsTrigger value={TabsPosition.AddImage}>
              {t('edit.dialog.tabs.addImage.title')}
            </TabsTrigger>
            <TabsTrigger value={TabsPosition.AddCheckbox}>
              {t('edit.dialog.tabs.addCheckbox.title')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value={TabsPosition.AddText}>
            <AddTextTab />
          </TabsContent>
          <TabsContent value={TabsPosition.AddSignature}>
            <AddSignatureTab />
          </TabsContent>
          <TabsContent value={TabsPosition.AddImage}>
            <AddImageTab />
          </TabsContent>
          <TabsContent value={TabsPosition.AddCheckbox}>
            <AddCheckboxTab />
          </TabsContent>
        </Tabs>

        <DialogFooter className={cn(styles.rowNoGapNoWidth, 'justify-center-safe') }>
          <DIconButton mode="error" onClick={handleClose}>
            <X />
          </DIconButton>
          <DIconButton disabled={isOkDisabled()} mode="primary" onClick={handleOk}>
            <Check />
          </DIconButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default PdfEditPdfDialog
