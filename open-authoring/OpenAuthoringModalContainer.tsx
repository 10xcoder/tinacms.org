import { useEffect, useState } from 'react'
import { ActionableModal } from '../components/ui'
import { enterEditMode } from './authFlow'
import { useOpenAuthoring } from '../tinacms/react-open-authoring/OpenAuthoring'
import OpenAuthoringErrorProps from './OpenAuthoringErrorProps'

/*
TODO:
This should either take in openAuthoringErrorUI, or openAuthoringError, & have it be required.
Otherwise it's a bit weird to sometimes interpret it outside this contet, and sometimes within this context
*/
interface Props {
  openAuthoringErrorUI?: OpenAuthoringErrorProps
}

/*
  TODO - This modal container is responsible for multiple things:
  - authPopup on initial load,
  - responding to & interpreting errors

  It should probably be more of a dummy modal component, and move that logic elsewhere
*/
export const OpenAuthoringModalContainer = (props: Props) => {
  const [authPopupDisplayed, setAuthPopupDisplayed] = useState(false)
  const [openAuthoringErrorUI, setOpenAuthoringErrorUI] = useState(
    props.openAuthoringErrorUI
  )

  useEffect(() => {
    setOpenAuthoringErrorUI(props.openAuthoringErrorUI)
  }, [props.openAuthoringErrorUI])

  const cancelAuth = () => {
    window.history.replaceState(
      {},
      document.title,
      window.location.href.split('?')[0] //TODO - remove only autoAuth param
    )
    setAuthPopupDisplayed(false)
  }

  useEffect(() => {
    if (window.location.href.includes('autoAuth')) {
      setAuthPopupDisplayed(true)
    }
  }, [])
  const openAuthoring = useOpenAuthoring()

  const runAuthWorkflow = () => {
    enterEditMode(openAuthoring.githubAuthenticated, openAuthoring.forkValid)
  }

  const getActionsFromError = (error: OpenAuthoringErrorProps) => {
    var actions = []
    error.actions.forEach(action => {
      actions.push({
        name: action.message,
        action: () => {
          if (action.action() === true) {
            // close modal
            setOpenAuthoringErrorUI(null)
          }
        },
      })
    })
    return actions
  }

  useEffect(() => {
    if (openAuthoringErrorUI) {
      openAuthoring.updateAuthChecks() //recheck if we need to open auth window as result of error
    }
  }, [openAuthoringErrorUI])

  return (
    <>
      {authPopupDisplayed && (
        <ActionableModal
          title="Authentication"
          message="To edit this site, you first need to be authenticated."
          actions={[
            {
              name: 'Continue',
              action: runAuthWorkflow,
            },
            {
              name: 'Cancel',
              action: cancelAuth,
            },
          ]}
        />
      )}
      {openAuthoringErrorUI && (
        <ActionableModal
          title={openAuthoringErrorUI.title}
          message={openAuthoringErrorUI.message}
          actions={getActionsFromError(openAuthoringErrorUI)}
        />
      )}
    </>
  )
}
