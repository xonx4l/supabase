import React from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Telemetry from '~/lib/telemetry'
import gaEvents from '~/lib/gaEvents'
import { IconCheck } from 'ui'
import { useBreakpoint } from 'common'
import { useTelemetryProps } from 'common/hooks/useTelemetryProps'

import SectionContainer from '~/components/Layouts/SectionContainer'

import ProductCard from './ProductCard'
import DatabaseVisual from './DatabaseVisual'

interface Props {
  products: any
}

export default function Products({ products }: Props) {
  const router = useRouter()
  const telemetryProps = useTelemetryProps()

  const sendTelemetryEvent = async (product: any) => {
    switch (product) {
      case 'Database':
        return await Telemetry.sendEvent(
          gaEvents['www_hp_subhero_products_database'],
          telemetryProps,
          router
        )
      case 'Authentication':
        return await Telemetry.sendEvent(
          gaEvents['www_hp_subhero_products_auth'],
          telemetryProps,
          router
        )
      case 'Storage':
        return await Telemetry.sendEvent(
          gaEvents['www_hp_subhero_products_storage'],
          telemetryProps,
          router
        )
      case 'Edge Functions':
        return await Telemetry.sendEvent(
          gaEvents['www_hp_subhero_products_edgeFunctions'],
          telemetryProps,
          router
        )
      case 'Realtime':
        return await Telemetry.sendEvent(
          gaEvents['www_hp_subhero_products_realtime'],
          telemetryProps,
          router
        )
    }
  }
  const isSm = useBreakpoint(640)

  return (
    <SectionContainer>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-4 lg:gap-6 md:grid-cols-12">
        <ProductCard
          alignLeft
          url={products['database'].url}
          icon={products['database'].icon}
          title={products['database'].name}
          subtitle={products['database'].description}
          highlights={
            <ul className="flex flex-col gap-1">
              <li>
                <IconCheck className="inline h-4 w-4" /> 100% portable
              </li>
              <li>
                <IconCheck className="inline h-4 w-4" /> Built-in Auth with RLS
              </li>
              <li>
                <IconCheck className="inline h-4 w-4" /> Easy to extend
              </li>
            </ul>
          }
          onClick={() => sendTelemetryEvent(name)}
          image={<DatabaseVisual />}
          className="col-span-6"
        />
        <ProductCard
          url={products['authentication'].url}
          icon={products['authentication'].icon}
          title={products['authentication'].name}
          subtitle={
            <>
              Add user sign ups and logins,
              <br className="inline-block sm:hidden lg:inline-block" /> securing your data with Row
              Level Security.
            </>
          }
          image={
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/index/products/auth.svg"
                alt="Supabase Edge Functions feature, hover image with glow"
                layout="fill"
                objectPosition="50% 50%"
                objectFit="cover"
                quality={95}
              />
            </div>
          }
          className="col-span-3"
          onClick={() => sendTelemetryEvent(name)}
        />
        <ProductCard
          url={products['storage'].url}
          icon={products['storage'].icon}
          title={products['storage'].name}
          subtitle={<>Store, organize, and serve large files, from videos to images.</>}
          image={
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/index/products/storage.svg"
                alt="Supabase Edge Functions feature, hover image with glow"
                layout="fill"
                objectPosition="50% 50%"
                objectFit="cover"
                quality={95}
              />
            </div>
          }
          className="!col-span-3"
          onClick={() => sendTelemetryEvent(name)}
        />
        <ProductCard
          url={products['edge-functions'].url}
          icon={products['edge-functions'].icon}
          title={products['edge-functions'].name}
          subtitle={
            <>
              Easily write custom code
              <br className="inline-block sm:hidden lg:inline-block" /> without deploying or scaling
              servers.
            </>
          }
          onClick={() => sendTelemetryEvent(name)}
          image={
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/index/products/edge-functions.svg"
                alt="Supabase Edge Functions feature, hover image with glow"
                layout="fill"
                objectPosition="50% 50%"
                objectFit="cover"
                quality={95}
              />
            </div>
          }
          className="!col-span-3"
        />
        <ProductCard
          url={products['realtime'].url}
          icon={products['realtime'].icon}
          title={products['realtime'].name}
          subtitle={
            <>
              Build multiplayer experiences
              <br className="inline-block sm:hidden lg:inline-block" /> with realtime data
              synchronization.
            </>
          }
          image={
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/index/products/realtime-base.svg"
                alt="Supabase Edge Functions feature, hover image with glow"
                layout="fill"
                objectPosition="50% 50%"
                objectFit="cover"
                quality={95}
              />
            </div>
          }
          className="!col-span-3"
        />
        <ProductCard
          alignLeft
          url={products['vector'].url}
          icon={products['vector'].icon}
          title={products['vector'].name}
          subtitle={products['vector'].description}
          highlights={
            <ul className="flex flex-col gap-1">
              <li>
                <IconCheck className="inline h-4 w-4" /> Postgres + pgvector
              </li>
              <li>
                <IconCheck className="inline h-4 w-4" /> Easily connect to any LLM
              </li>
              <li>
                <IconCheck className="inline h-4 w-4" /> Secure and scalable
              </li>
            </ul>
          }
          onClick={() => sendTelemetryEvent(name)}
          image={
            <div className="absolute inset-0 z-0">
              <Image
                src={
                  isSm
                    ? '/images/index/products/vector-centered.svg'
                    : '/images/index/products/vector.svg'
                }
                alt="Supabase Edge Functions feature, hover image with glow"
                layout="fill"
                objectPosition="50% 50%"
                objectFit="cover"
                quality={95}
              />
            </div>
          }
          className="col-span-full md:col-span-6"
        />
      </dl>
    </SectionContainer>
  )
}
