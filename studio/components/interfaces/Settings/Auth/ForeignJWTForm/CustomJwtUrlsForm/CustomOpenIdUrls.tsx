import { useState } from 'react'
import { Button, Form, Input, Modal } from 'ui'
import { object, string } from 'yup'

import { urlRegex } from 'components/interfaces/Auth/Auth.constants'
import { AuthConfig } from 'components/interfaces/Auth/Auth.types'
import { useStore } from 'hooks'
import { CustomOpenIdUrlsList } from './CustomOpenIdUrlsList'

export const CustomOpenIdUrls = ({ authConfig }: { authConfig: AuthConfig }) => {
  const [showAddNewUrl, setShowAddNewUrl] = useState(false)
  const [selectedUrlToDelete, setSelectedUrlToDelete] = useState<string>()

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-scale-900 text-sm">
          <div>You can add foreign JWT keys by adding their OpenID URL.</div>
        </div>
        <Button onClick={() => setShowAddNewUrl(true)}>Add URL</Button>
      </div>
      <CustomOpenIdUrlsList
        authConfig={authConfig}
        canUpdate={true}
        onSelectUrlToDelete={(url) => setSelectedUrlToDelete(url)}
      />
      {showAddNewUrl ? <AddNewUrlModal /> : null}
      {selectedUrlToDelete ? (
        <RemoveUrlModal
          selectedUrl={selectedUrlToDelete}
          onClose={() => setSelectedUrlToDelete(undefined)}
        />
      ) : null}
    </>
  )
}

const newUrlSchema = object({
  url: string().matches(urlRegex, 'URL is not valid').required(),
})

const AddNewUrlModal = () => {
  const [open, setOpen] = useState(false)
  const { authConfig, ui } = useStore()

  const onAddNewUrl = async (values: any, { setSubmitting }: any) => {
    if (!values.url) {
      return
    }

    setSubmitting(true)
    const payload = []
    // remove any trailing commas
    payload.push(values.url.replace(/,\s*$/, ''))

    const payloadString = payload.toString()

    if (payloadString.length > 2 * 1024) {
      ui.setNotification({
        message: 'Too many redirect URLs, please remove some or try to use wildcards',
        category: 'error',
      })

      setSubmitting(false)
      return
    }

    const { error } = await authConfig.update({ URI_ALLOW_LIST: payloadString })
    if (!error) {
      setOpen(false)
      ui.setNotification({ category: 'success', message: 'Successfully added URL' })
    } else {
      ui.setNotification({
        error,
        category: 'error',
        message: `Failed to update URL: ${error?.message}`,
      })
    }

    setSubmitting(false)
  }

  return (
    <Modal
      hideFooter
      size="small"
      visible
      onCancel={() => setOpen(!open)}
      header={<h3 className="text-sm">Add a new URL</h3>}
    >
      <Form
        validateOnBlur
        id="new-redirect-url-form"
        initialValues={{ url: '' }}
        validationSchema={newUrlSchema}
        onSubmit={onAddNewUrl}
      >
        {({ isSubmitting }: { isSubmitting: boolean }) => {
          return (
            <div className="mb-4 space-y-4 pt-4">
              <div className="px-5">
                <p className="text-sm text-scale-1100">
                  This will add a URL to a list of allowed URLs that can interact with your
                  Authentication services for this project.
                </p>
              </div>
              <div className="border-overlay-border border-t" />
              <div className="px-5">
                <Input id="url" name="url" label="URL" placeholder="https://mydomain.com" />
              </div>
              <div className="border-overlay-border border-t" />
              <div className="px-5">
                <Button
                  block
                  form="new-redirect-url-form"
                  htmlType="submit"
                  size="medium"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  Add URL
                </Button>
              </div>
            </div>
          )
        }}
      </Form>
    </Modal>
  )
}

const RemoveUrlModal = ({ selectedUrl, onClose }: { selectedUrl: string; onClose: () => void }) => {
  const { authConfig, ui } = useStore()
  const [isDeleting, setIsDeleting] = useState(false)

  const onConfirmDeleteUrl = async () => {
    setIsDeleting(true)

    // TODO: make this work
    const payload = '' //URI_ALLOW_LIST_ARRAY.filter((e: string) => e !== url)

    const { error } = await authConfig.update({ URI_ALLOW_LIST: payload.toString() })

    if (!error) {
      onClose()
      ui.setNotification({ category: 'success', message: 'Successfully removed URL' })
    } else {
      ui.setNotification({
        error,
        category: 'error',
        message: `Failed to remove URL: ${error?.message}`,
      })
    }

    setIsDeleting(false)
  }

  return (
    <Modal
      hideFooter
      size="small"
      visible
      header={<h3 className="text-sm">Remove URL</h3>}
      onCancel={onClose}
    >
      <div className="mb-4 space-y-4 pt-4">
        <div className="px-5">
          <p className="mb-2 text-sm text-scale-1100">
            Are you sure you want to remove <span className="text-scale-1200">{selectedUrl}</span>?
          </p>
          <p className="text-scale-1100 text-sm">
            This URL will no longer work with your authentication configuration.
          </p>
        </div>
        <div className="border-overlay-border border-t"></div>
        <div className="flex gap-3 px-5">
          <Button block type="default" size="medium" onClick={onClose}>
            Cancel
          </Button>
          <Button
            block
            size="medium"
            type="warning"
            loading={isDeleting}
            onClick={() => onConfirmDeleteUrl()}
          >
            {isDeleting ? 'Removing...' : 'Remove URL'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
