import Link from "next/link";

import { UsersTable } from "@/components/admin/users-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UsersPage() {
  return (
    <div className="space-y-6 p-6">
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-r from-primary/15 via-primary/5 to-background">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-6">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Admin / Users
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
            <p className="text-sm text-muted-foreground">
              Quản lý tài khoản, phân quyền và cập nhật thông tin người dùng.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/dashboard">Back To Dashboard</Link>
          </Button>
        </CardContent>
      </Card>

      <UsersTable />
    </div>
  );
}
