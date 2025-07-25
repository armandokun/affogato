import React from 'react'
import Link from 'next/link'
import { MessagesSquare } from 'lucide-react'

import { DASHBOARD } from '@/constants/routes'
import useLibraryItems from '@/hooks/use-library-items'
import { useSession } from '@/containers/SessionProvider'
import useSidebar from '@/hooks/use-sidebar'

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './sidebar'

const ChatListItem = ({ chat }: { chat: { id: string; title: string } }) => {
  const { isMobile, setOpenMobile } = useSidebar()

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarMenuItem key={chat.id}>
      <SidebarMenuButton asChild size="sm">
        <Link href={`${DASHBOARD}/${chat.id}`} className="w-full" onClick={handleLinkClick}>
          <span className="truncate text-xs">{chat.title || 'Untitled Chat'}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

const ChatSection = ({
  label,
  chats
}: {
  label: string
  chats: { id: string; title: string }[]
}) => {
  if (chats.length === 0) return null
  return (
    <>
      <SidebarMenuItem>
        <span className="text-sm text-muted-foreground mt-4 mb-1 block font-medium px-2">
          {label}
        </span>
      </SidebarMenuItem>
      {chats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}
    </>
  )
}

const NavHistory = () => {
  const { items: chats, loading } = useLibraryItems()
  const { user } = useSession()

  const today: typeof chats = []
  const last7Days: typeof chats = []
  const last30Days: typeof chats = []
  const now = new Date()

  chats.forEach((chat) => {
    const created = new Date(chat.created_at)
    const diffMs = now.getTime() - created.getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    if (
      created.getDate() === now.getDate() &&
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    ) {
      today.push(chat)
    } else if (diffDays <= 7) {
      last7Days.push(chat)
    } else if (diffDays <= 30) {
      last30Days.push(chat)
    }
  })

  if (!user || user.is_anonymous) {
    return (
      <SidebarMenu className="flex flex-1 items-center justify-center">
        <SidebarMenuItem className="w-full flex flex-col items-center justify-center">
          <MessagesSquare className="size-8 text-muted-foreground" />
          <span className="text-md font-medium text-muted-foreground p-2 text-center w-full block">
            Log in to save your chats
          </span>
          <span className="text-xs text-muted-foreground text-center">
            Once you sign up, your chat history will appear here.
          </span>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu
      className={
        !loading && chats.length === 0 ? 'flex flex-1 items-center justify-center' : undefined
      }>
      {loading ? (
        <SidebarMenuItem>
          <span className="text-xs text-muted-foreground p-2">Loading...</span>
        </SidebarMenuItem>
      ) : (
        <>
          <ChatSection label="Today" chats={today} />
          <ChatSection label="Last 7 days" chats={last7Days} />
          <ChatSection label="Older" chats={last30Days} />
          {chats.length === 0 && (
            <SidebarMenuItem className="w-full flex flex-col items-center justify-center">
              <MessagesSquare className="size-8 text-muted-foreground" />
              <span className="text-md font-medium text-muted-foreground p-2 text-center w-full block">
                No Chats Yet
              </span>
              <span className="text-xs text-muted-foreground">
                Your chat history will appear here.
              </span>
            </SidebarMenuItem>
          )}
        </>
      )}
    </SidebarMenu>
  )
}

export default NavHistory
