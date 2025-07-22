'use client'

import { ChevronsUpDown, HeartHandshake, LifeBuoy, LogIn, LogOut, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu/dropdown-menu'

import { useSubscription } from '@/hooks/use-subscription'
import { useSession } from '@/containers/SessionProvider'
import { DASHBOARD_PRICING, LOGIN } from '@/constants/routes'
import { siteConfig } from '@/lib/config'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/ui/toast/toast'

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './sidebar'

export function NavUser() {
  const { user } = useSession()
  const router = useRouter()
  const { currentPlan } = useSubscription()

  const getInitials = () => {
    if (!user) return '?'

    const name = user.user_metadata?.full_name?.trim()

    if (name) {
      const words = name.split(/\s+/).filter(Boolean)
      const initials = words
        .slice(0, 2)
        .map((word: string) => word[0].toUpperCase())
        .join('')

      return initials || '?'
    }

    const email = user.email || ''
    const username = email.split('@')[0]

    if (username.length >= 2) {
      return (username[0] + username[1]).toUpperCase()
    } else if (username.length === 1) {
      return username[0].toUpperCase()
    }

    return '?'
  }

  const handleSignOut = async () => {
    const supabase = createClient()

    const { error } = await supabase.auth.signOut()

    if (error) return toast({ description: error.message, type: 'error' })

    return router.push(LOGIN)
  }

  if (!user || user.is_anonymous) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <Link href={LOGIN} className="flex items-center gap-2">
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer">
              <LogIn className="size-4" />
              <span className="text-sm font-medium">Log in</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.user_metadata.avatar_url} alt="User avatar" />
                <AvatarFallback className="rounded-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.user_metadata.full_name || user.email}
                </span>
                <span className="truncate text-xs capitalize">{`${currentPlan} plan`}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[17rem] min-w-56 rounded-lg"
            side="top"
            align="center"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.user_metadata.avatar_url} alt="User avatar" />
                  <AvatarFallback className="rounded-lg">{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.user_metadata.full_name || user.email}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push(DASHBOARD_PRICING)}>
                <Sparkles />
                View plans
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={`mailto:${siteConfig.links.mail}`}>
                  <HeartHandshake />
                  Feedback
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`mailto:${siteConfig.links.mail}`}>
                  <LifeBuoy />
                  Support
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
