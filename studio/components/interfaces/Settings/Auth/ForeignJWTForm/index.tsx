import { useParams } from 'common'
import { FormHeader } from 'components/ui/Forms'
import { useAuthConfigQuery } from 'data/auth/auth-config-query'

import { useState } from 'react'
import { Button } from 'ui'
import JWTSettings from '../JWTSettings'
import { CustomJwksForm } from './CustomJwksForm'
import { CustomJwtUrlsForm } from './CustomJwtUrlsForm'

const ForeignJWTSettings = () => {
  const { ref: projectRef } = useParams()
  const { data: authConfig, isLoading, isSuccess } = useAuthConfigQuery({ projectRef })
  const [newModalShown, setNewModalShown] = useState(false)
  const [jwksUris, setJwksUris] = useState<string[]>([])
  const [jwksOidcIssuers, setjwksOidcIssuers] = useState<string[]>([])
  const [customJwks, setCustomJwks] = useState<string[]>([])

  const onSubmit = ({
    type,
    value,
  }: {
    type: 'OpenIdIssuer' | 'JwksUrl' | 'JwksInput'
    value: string
  }) => {
    if (type === 'OpenIdIssuer') {
      setjwksOidcIssuers([...jwksOidcIssuers, value])
    } else if (type === 'JwksUrl') {
      setJwksUris([...jwksUris, value])
    } else if (type === 'JwksInput') {
      setCustomJwks([...customJwks, value])
    }
    setNewModalShown(false)
  }

  return (
    <>
      <section>
        <div className="flex items-center justify-between">
          <FormHeader
            title="JWT Settings"
            description="You can manage your own JWT key and add keys from 3rd party services."
          />
          <div className="flex items-center space-x-2 mb-6">
            <Button onClick={() => setNewModalShown(true)}>Add foreign JWT key</Button>
          </div>
        </div>
        <JWTSettings />
        {isSuccess && (
          <>
            <CustomJwtUrlsForm authConfig={authConfig} isLoading={isLoading} />
            <CustomJwksForm authConfig={authConfig} isLoading={isLoading} />
          </>
        )}
      </section>
    </>
  )
}

export default ForeignJWTSettings
