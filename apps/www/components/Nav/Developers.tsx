import React from 'react'
import { data as DevelopersData } from 'data/Developers'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { TextLink } from 'ui'
import { ListItem } from '.'

type Props = {
  text: string
  description?: string
  url?: string
  icon?: string
  svg?: any
}

const Developers = () => (
  <>
    <ul className="border-b p-2">
      {DevelopersData['header'].map((component) => (
        <ListItem
          key={component.text}
          title={component.text}
          href={component.url}
          className="py-4"
        ></ListItem>
      ))}
    </ul>
    <ul className="grid gap-3 p-2 md:grid-cols-3 w-[650px] border-b">
      {DevelopersData['navigation'].map((column) => (
        <li key={column.label} className="p-2">
          <label className="text-muted text-xs font-mono">{column.label}</label>
          {column.links.map((link: Props) => (
            <TextLink key={link.text} url={link.url} label={link.text} />
          ))}
        </li>
      ))}
    </ul>
    <ul className="p-2 flex justify-between bg-alternative text-sm">
      <Link href={DevelopersData['footer']['support'].url}>
        <a className="p-2 hover:bg-[#101010] rounded">{DevelopersData['footer']['support'].text}</a>
      </Link>
      <Link href={DevelopersData['footer']['systemStatus'].url}>
        <a className="p-2 hover:bg-[#101010] rounded">
          {DevelopersData['footer']['systemStatus'].text}
        </a>
      </Link>
    </ul>
  </>
)

export default Developers
