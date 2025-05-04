import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./sidebar";

const meta = {
  title: "General/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const Basic = () => (
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader>
        <h2>Sidebar Header</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>Dashboard</SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>Settings</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
    <div style={{ marginLeft: 260, padding: 24 }}>
      <h1>Main Content</h1>
      <p>This is the main content area next to the sidebar.</p>
    </div>
  </SidebarProvider>
);
