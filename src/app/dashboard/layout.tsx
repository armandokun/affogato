import { CSSProperties, ReactNode } from 'react'

import { SidebarInset } from '@/components/general/sidebar/sidebar'
import { AppSidebar } from '@/components/general/sidebar/app-sidebar'
import { SidebarProvider } from '@/containers/SidebarProvider'

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '17rem'
        } as CSSProperties
      }>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout
