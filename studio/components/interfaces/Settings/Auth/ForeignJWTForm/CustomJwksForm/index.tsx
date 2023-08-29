import { AuthConfig } from 'components/interfaces/Auth/Auth.types'
import { FormPanel } from 'components/ui/Forms'
import { INVITE } from 'stores/authConfig/schema/AuthProviders/AuthTemplatesValidation'
import { CustomJwksInput } from './CustomJwksInput'

export const CustomJwksForm = ({
  authConfig,
  isLoading,
}: {
  authConfig: AuthConfig
  isLoading: boolean
}) => {
  return (
    <div className="mb-8">
      <FormPanel header="Custom JWKS JSON">
        <CustomJwksInput template={INVITE} authConfig={authConfig} isLoading={isLoading} />
      </FormPanel>
    </div>
  )
}
