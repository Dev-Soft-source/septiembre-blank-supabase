
import { Badge } from "@/components/ui/badge";
import { useMyRoles } from "@/hooks/useMyRoles";

export function UserRoles() {
  const { roles, loading, error } = useMyRoles();

  if (loading) {
    return (
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">User Roles</p>
        <p className="text-sm">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">User Roles</p>
        <p className="text-sm text-destructive">Error loading roles</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">User Roles</p>
      {roles.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <Badge key={role} variant="secondary" className="capitalize">
              {role}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm font-medium">No special roles assigned</p>
      )}
    </div>
  );
}
