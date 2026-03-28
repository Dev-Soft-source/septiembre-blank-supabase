
// Export all sidebar components from a single entry point
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  TooltipProvider,
} from "./sidebar-components";

// Export the context and hooks for direct usage
export { 
  SidebarContext, 
  SidebarProvider,
  useSidebar,
  type SidebarContext as SidebarContextType 
} from "./sidebar-context";
