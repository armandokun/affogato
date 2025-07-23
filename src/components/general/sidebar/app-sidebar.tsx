'use client'

import { ComponentProps } from 'react'
import { SquarePen, Plug } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { DASHBOARD, INTEGRATIONS } from '@/constants/routes'
import useSidebar from '@/hooks/use-sidebar'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarMenuButton
} from './sidebar'
import Icons from '../icons'
import { NavUser } from './nav-user'
import NavHistory from './nav-history'

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const { isMobile, setOpenMobile } = useSidebar()

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row justify-between m-2 items-center">
            <Link href="/" onClick={handleLinkClick}>
              <div className="flex flex-row gap-2 leading-none items-center">
                <Icons.logo className="size-6" />
                <span className="text-md font-medium">Affogato</span>
              </div>
            </Link>
            <SidebarTrigger className="-ml-1" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="mx-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-col gap-2">
            <SidebarMenuButton
              className="flex flex-row justify-between cursor-pointer"
              onClick={() => {
                router.push(DASHBOARD)
                handleLinkClick()
              }}>
              <div className="flex items-center gap-2">
                <SquarePen className="size-4" />
                <span className="text-sm font-medium">New Chat</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={INTEGRATIONS} onClick={handleLinkClick}>
                <div className="flex items-center gap-2">
                  <Plug className="size-4" />
                  <span className="text-sm font-medium">Integrations</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavHistory />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
