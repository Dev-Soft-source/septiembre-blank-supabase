
# Sidebar Component

This is a fully-featured sidebar component with support for:

- Responsive design (mobile and desktop)
- Collapsible sidebar (icon-only or fully hidden)
- Keyboard shortcuts (Ctrl/Cmd + B)
- Context API for state management
- Submenus and nested navigation
- Customizable styling with Tailwind CSS

## Usage

```tsx
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function App() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Dashboard</SidebarMenuButton>
              </SidebarMenuItem>
              {/* More menu items */}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1">
          {/* Main content */}
        </main>
      </div>
    </SidebarProvider>
  );
}
```

## Components

The sidebar is composed of multiple smaller components:

- `SidebarProvider`: Context provider for sidebar state
- `Sidebar`: Main sidebar container
- `SidebarContent`: Content area of the sidebar
- `SidebarHeader`: Header section of the sidebar
- `SidebarFooter`: Footer section of the sidebar
- `SidebarMenu`: Menu container
- `SidebarMenuItem`: Menu item container
- `SidebarMenuButton`: Clickable menu button
- And more specialized components for various use cases

## Customization

The sidebar can be customized through props:

```tsx
<Sidebar 
  side="left" // or "right"
  variant="sidebar" // or "floating" or "inset"
  collapsible="offcanvas" // or "icon" or "none"
>
  {/* Sidebar content */}
</Sidebar>
```
