'use client'

import { useSidebar } from '@/containers/SidebarProvider'

import { SidebarTrigger } from '../sidebar/sidebar'

type Props = {
  title: string
  description: string
}

const PageHeading = ({ title, description }: Props) => {
  const { open, isMobile } = useSidebar()

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        {(!open || isMobile) && <SidebarTrigger />}
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      <p className="text-muted-foreground mt-2">{description}</p>
    </div>
  )
}

export default PageHeading
