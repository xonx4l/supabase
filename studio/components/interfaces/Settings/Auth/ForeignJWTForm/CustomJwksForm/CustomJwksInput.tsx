import { PermissionAction } from '@supabase/shared-types/out/constants'
import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import { Form } from 'ui'

import { useParams } from 'common'
import { AuthConfig } from 'components/interfaces/Auth/Auth.types'
import CodeEditor from 'components/ui/CodeEditor'
import { FormActions, FormSection, FormSectionContent } from 'components/ui/Forms'
import { useJwtSecretUpdateMutation } from 'data/config/jwt-secret-update-mutation'
import { useCheckPermissions, useStore } from 'hooks'
import { uuidv4 } from 'lib/helpers'
import { FormSchema } from 'types'

interface Props {
  template: FormSchema
  authConfig: AuthConfig
  isLoading: boolean
}

export const CustomJwksInput: FC<Props> = observer(({ template, authConfig, isLoading }) => {
  const { ui } = useStore()
  const { ref: projectRef } = useParams()
  const [bodyValue, setBodyValue] = useState('')

  const { id, properties } = template

  const formId = `auth-config-email-templates`
  const INITIAL_VALUES: { [x: string]: string } = {}
  const canUpdateConfig = useCheckPermissions(PermissionAction.UPDATE, 'custom_config_gotrue')

  // Object.keys(properties).forEach((key) => {
  //   INITIAL_VALUES[key] = authConfig.config[key] ?? ''
  // })
  const { mutateAsync: updateJwt, isLoading: isSubmittingJwtSecretUpdateRequest } =
    useJwtSecretUpdateMutation()

  // const messageSlug = `MAILER_TEMPLATES_${id}_CONTENT`
  // const messageProperty = properties[messageSlug]

  const onSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    const payload = bodyValue //JSON.stringify(bodyValue)

    setSubmitting(true)
    const trackingId = uuidv4()
    const { error } = await updateJwt({
      projectRef: projectRef!,
      jwtCustomJwks: payload,
      changeTrackingId: trackingId,
    })
    console.log(error)

    setSubmitting(false)
  }

  return (
    <Form id={formId} className="!border-t-0" initialValues={INITIAL_VALUES} onSubmit={onSubmit}>
      {({ isSubmitting, resetForm, values, initialValues }: any) => {
        const hasChanges = true

        return (
          <FormSection>
            <FormSectionContent fullWidth loading={isLoading}>
              <div className="space-y-3">
                {/* <FormSectionLabel>
                  <span>{messageProperty.title}</span>
                </FormSectionLabel> */}
              </div>
              <div className="relative h-96">
                <CodeEditor
                  id="code-id"
                  language="html"
                  isReadOnly={!canUpdateConfig}
                  className="!mb-0 h-96 overflow-hidden rounded border"
                  onInputChange={(e: string | undefined) => setBodyValue(e ?? '')}
                  options={{ wordWrap: 'off', contextmenu: false }}
                  value={bodyValue}
                />
              </div>
              <div className="col-span-12 flex w-full">
                <FormActions
                  handleReset={() => {
                    resetForm({
                      values: authConfig,
                      initialValues: authConfig,
                    })
                    setBodyValue('')
                  }}
                  form={formId}
                  isSubmitting={isSubmitting}
                  hasChanges={hasChanges}
                  disabled={!canUpdateConfig}
                  helper={
                    !canUpdateConfig
                      ? 'You need additional permissions to update authentication settings'
                      : undefined
                  }
                />
              </div>
            </FormSectionContent>
          </FormSection>
        )
      }}
    </Form>
  )
})
