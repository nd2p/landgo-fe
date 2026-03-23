"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { adminService, type User } from "@/features/admin/admin.service";
import {
  editUserSchema,
  type EditUserForm,
  type Role,
} from "@/features/admin/admin.validation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 10;
const numberFormatter = new Intl.NumberFormat("vi-VN");

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function roleVariant(role: string): "default" | "secondary" {
  return role === "moderator" ? "default" : "secondary";
}

function roleLabel(role: string): string {
  return role === "moderator" ? "Moderator" : "User";
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "moderator">("all");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await adminService.getUsersWithPagination({
        page,
        limit: PAGE_SIZE,
      });

      const safeTotalPages = Math.max(1, result.pagination.totalPages);
      if (page > safeTotalPages) {
        setPage(safeTotalPages);
        return;
      }

      setUsers(result.users);
      setTotalUsers(result.pagination.total);
      setTotalPages(safeTotalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchRole = roleFilter === "all" ? true : user.role === roleFilter;
      const matchKeyword =
        keyword.length === 0
          ? true
          : user.name.toLowerCase().includes(keyword) ||
            user.email.toLowerCase().includes(keyword) ||
            user.phone.includes(keyword);

      return matchRole && matchKeyword;
    });
  }, [users, search, roleFilter]);

  const currentPageModerators = useMemo(
    () => users.filter((user) => user.role === "moderator").length,
    [users],
  );

  const currentPageUsers = useMemo(
    () => users.filter((user) => user.role !== "moderator").length,
    [users],
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;

    try {
      setDeletingUserId(id);
      await adminService.deleteUser(id);
      await fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total users</p>
            <p className="mt-1 text-2xl font-bold">{numberFormatter.format(totalUsers)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Page</p>
            <p className="mt-1 text-2xl font-bold">
              {numberFormatter.format(page)}/{numberFormatter.format(totalPages)}
            </p>
            <p className="text-xs text-muted-foreground">
              {numberFormatter.format(users.length)} rows loaded
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Moderators</p>
            <p className="mt-1 text-2xl font-bold">{numberFormatter.format(currentPageModerators)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Users</p>
            <p className="mt-1 text-2xl font-bold">{numberFormatter.format(currentPageUsers)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>User Directory</CardTitle>
              <CardDescription>
                Manage account information and role assignments.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="h-8 rounded-md px-3 text-xs">
              {PAGE_SIZE} per page
            </Badge>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, phone..."
                className="w-56"
              />
              <Select
                value={roleFilter}
                onValueChange={(value: "all" | "user" | "moderator") => setRoleFilter(value)}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 px-6 pb-6">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="px-6 pb-6 pt-2 text-sm text-muted-foreground">
              No users match current filters on this page.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-sm">
                <thead>
                  <tr className="border-y bg-muted/40 text-left text-muted-foreground">
                    <th className="px-6 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b align-middle">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted text-xs font-semibold">
                            {getInitials(user.name)}
                          </div>
                          <div className="space-y-0.5">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {user._id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <p className="flex items-center gap-1.5 text-sm">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            {user.email || "-"}
                          </p>
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            {user.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={roleVariant(user.role)}>{roleLabel(user.role)}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {user.isBanned ? (
                          <Badge variant="destructive">Banned</Badge>
                        ) : (
                          <Badge variant="secondary">Active</Badge>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingUser(user)}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => void handleDelete(user._id)}
                            disabled={deletingUserId === user._id}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && totalPages > 1 ? (
            <div className="flex items-center justify-between border-t px-6 py-3">
              <p className="text-sm text-muted-foreground">
                Page {page}/{totalPages} - {numberFormatter.format(totalUsers)} users
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1}
                >
                  Prev
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <EditUserDialog
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSuccess={() => void fetchUsers()}
      />
    </div>
  );
}

function EditUserDialog({
  user,
  onClose,
  onSuccess,
}: {
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditUserForm>({
    resolver: yupResolver(editUserSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "user",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: (user.role as Role) || "user",
      });
    }
  }, [user, reset]);

  const roleValue = watch("role");

  const onSubmit = async (data: EditUserForm) => {
    if (!user) return;

    try {
      setSaving(true);
      await adminService.updateUser(user._id, data);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Full name</p>
            <Input placeholder="Name" {...register("name")} />
            <p className="text-sm text-destructive">{errors.name?.message}</p>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Email</p>
            <Input placeholder="Email" {...register("email")} />
            <p className="text-sm text-destructive">{errors.email?.message}</p>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Phone</p>
            <Input
              placeholder="Phone"
              {...register("phone")}
              onInput={(event: FormEvent<HTMLInputElement>) => {
                event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "");
              }}
            />
            <p className="text-sm text-destructive">{errors.phone?.message}</p>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Role</p>
            <Select value={roleValue} onValueChange={(value: Role) => setValue("role", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  <span className="flex items-center gap-2">
                    <UserRound className="h-3.5 w-3.5" />
                    User
                  </span>
                </SelectItem>
                <SelectItem value="moderator">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Moderator
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-destructive">{errors.role?.message}</p>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
