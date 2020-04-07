import { InlineForm, InlineFormProps } from 'react-tinacms-inline'
import { useOpenAuthoringToolbarPlugins } from '../../open-authoring/toolbar-plugins/useOpenAuthoringToolbarPlugins'
import { useLocalStorageCache } from '@tinacms/browser-storage-client'
import useOpenAuthoringErrorListener from '../../open-authoring/errors/useOpenAuthoringErrorListener'
import AutoAuthModal from '../open-authoring/AutoAuthModal'

interface Props extends InlineFormProps {
  editMode: boolean
  children: any
  path: string
}

const OpenAuthoringSiteForm = ({ form, editMode, path, children }: Props) => {
  // Toolbar Plugins
  useOpenAuthoringToolbarPlugins(form, editMode)

  // Persist pending changes to localStorage
  useLocalStorageCache(path, form, editMode)

  useOpenAuthoringErrorListener(form)

  return (
    <>
      <InlineForm
        form={form}
        initialStatus={
          typeof document !== 'undefined' && editMode ? 'active' : 'inactive'
        }
      >
        {children}
      </InlineForm>
      <AutoAuthModal />
    </>
  )
}

export default OpenAuthoringSiteForm
