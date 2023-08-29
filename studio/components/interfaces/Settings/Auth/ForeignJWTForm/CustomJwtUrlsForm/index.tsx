import { AuthConfig } from 'components/interfaces/Auth/Auth.types'
import { FormPanel, FormSection, FormSectionContent } from 'components/ui/Forms'
import { CustomOpenIdUrls } from './CustomOpenIdUrls'

export const CustomJwtUrlsForm = ({
  authConfig,
  isLoading,
}: {
  authConfig: AuthConfig
  isLoading: boolean
}) => {
  return (
    <div className="mb-8">
      <FormPanel header="Custom OpenID URLs">
        <FormSection>
          <FormSectionContent loading={isLoading} fullWidth>
            <CustomOpenIdUrls authConfig={authConfig} />
          </FormSectionContent>
        </FormSection>
      </FormPanel>
    </div>
  )
}
