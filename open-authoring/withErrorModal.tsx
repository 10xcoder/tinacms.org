import { OpenAuthoringModalContainer } from './OpenAuthoringModalContainer'
import { useEffect, useState } from 'react'
import getErrorUIFrom from './error-interpreter'
import { useOpenAuthoring } from '../components/layout/OpenAuthoring'

declare global {
  interface Window {
    githubAuthenticated: boolean
    forkValid: boolean
  }
}

export const withErrorModal = BaseComponent => (props: { previewError }) => {
  const [openAuthoringErrorUI, setOpenAuthoringErrorUI] = useState(null)
  const openAuthoring = useOpenAuthoring()

  useEffect(() => {
    ;(async () => {
      if (props.previewError) {
        openAuthoring.updateAuthChecks()
        const contextualError = await getErrorUIFrom(props.previewError)
        if (contextualError.asModal) {
          setOpenAuthoringErrorUI(contextualError)
        }
      }
    })()
  }, [props.previewError])

  useEffect(() => {
    window.githubAuthenticated = openAuthoring.githubAuthenticated
    window.forkValid = openAuthoring.forkValid
  }, [openAuthoring.githubAuthenticated, openAuthoring.forkValid])

  if (props.previewError) {
    return (
      <OpenAuthoringModalContainer
        openAuthoringErrorUI={openAuthoringErrorUI}
      />
    )
  } else {
    return <BaseComponent {...props} />
  }
}
