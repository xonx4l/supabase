import { Badge, Button, IconGlobe, IconTrash } from 'ui'

import { AuthConfig } from 'components/interfaces/Auth/Auth.types'
import { EmptyListState } from 'components/ui/States'
import { observer } from 'mobx-react-lite'
import { ValueContainer } from './ValueContainer'

interface Props {
  authConfig: AuthConfig
  canUpdate: boolean
  onSelectUrlToDelete: (url: string) => void
}

export const CustomOpenIdUrlsList = observer(
  ({ authConfig, canUpdate, onSelectUrlToDelete }: Props) => {
    const URI_ALLOW_LIST_ARRAY = [
      'http://localhost:3000/*/*',
      'https://*-supabase.vercel.app/*/*',
      ' https://supabase.com/*/*',
    ]

    return (
      <div className="-space-y-px">
        {/* {!authConfig ? (
          <>
            <ValueContainer>
              <HorizontalShimmerWithIcon />
            </ValueContainer>
            <ValueContainer>
              <HorizontalShimmerWithIcon />
            </ValueContainer>
          </> */}
        {URI_ALLOW_LIST_ARRAY.length > 0 ? (
          URI_ALLOW_LIST_ARRAY.map((url: string) => {
            return (
              <ValueContainer key={url}>
                <div className="flex items-center gap-4 font-mono">
                  <span className="text-scale-900">
                    <IconGlobe strokeWidth={2} size={14} />
                  </span>
                  <span className="text-sm">
                    {url} <Badge>JWKS URI</Badge>
                  </span>
                </div>
                {canUpdate && (
                  <Button
                    type="default"
                    icon={<IconTrash />}
                    onClick={() => onSelectUrlToDelete(url)}
                  >
                    Remove
                  </Button>
                )}
              </ValueContainer>
            )
          })
        ) : (
          <div
            className={[
              'flex items-center border-scale-400 bg-scale-200 text-scale-1200',
              'justify-center gap-2 rounded border px-6 py-8 text-sm',
            ].join(' ')}
          >
            <EmptyListState
              title="No Redirect URLs"
              description="Auth providers may need a URL to redirect back to"
            />
          </div>
        )}
      </div>
    )
  }
)
