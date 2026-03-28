
// Re-export all sidebar components from their individual files
export { Sidebar } from "./SidebarCore";
export { SidebarTrigger } from "./SidebarTrigger";
export { SidebarRail } from "./SidebarRail";
export { SidebarInset, SidebarInput } from "./SidebarLayout";
export { SidebarHeader } from "./SidebarHeader";
export { SidebarFooter } from "./SidebarFooter";
export { SidebarContent, SidebarSeparator } from "./SidebarContent";
export { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupAction, 
  SidebarGroupContent 
} from "./SidebarGroup";
export { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarMenuAction, 
  SidebarMenuBadge, 
  SidebarMenuSkeleton 
} from "./SidebarMenu";
export { 
  SidebarMenuSub, 
  SidebarMenuSubItem, 
  SidebarMenuSubButton 
} from "./SidebarSubmenu";

// Re-export TooltipProvider for convenience
export { TooltipProvider } from "@/components/ui/tooltip";
