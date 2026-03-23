"use client";

import { useCallback, useEffect, useMemo, useState, type ElementType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  FileText,
  Shield,
  Users,
} from "lucide-react";

import { adminService, type AdminPostStats } from "@/features/admin/admin.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const numberFormatter = new Intl.NumberFormat("vi-VN");

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: ElementType;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {sub ? <p className="text-xs text-muted-foreground">{sub}</p> : null}
          </div>
          <div className="rounded-lg border bg-muted p-2 text-muted-foreground">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type PieItem = {
  key: string;
  label: string;
  value: number;
  color: string;
  badge?: "default" | "secondary" | "destructive" | "outline";
};

function PieChart({
  items,
  centerLabel,
  centerValue,
}: {
  items: PieItem[];
  centerLabel: string;
  centerValue?: number;
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="flex h-44 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        No data
      </div>
    );
  }

  const gradient = items
    .reduce(
      (acc, item) => {
        const sweep = (item.value / total) * 360;
        const start = acc.current;
        const end = start + sweep;
        acc.current = end;
        acc.parts.push(`${item.color} ${start}deg ${end}deg`);
        return acc;
      },
      { current: 0, parts: [] as string[] },
    )
    .parts.join(", ");

  return (
    <div className="grid gap-4 lg:grid-cols-[180px_1fr] lg:items-center">
      <div
        className="relative mx-auto h-40 w-40 rounded-full border"
        style={{ background: `conic-gradient(${gradient})` }}
      >
        <div className="absolute inset-6 flex flex-col items-center justify-center rounded-full border bg-background">
          <span className="text-xs text-muted-foreground">{centerLabel}</span>
          <span className="text-lg font-semibold">
            {numberFormatter.format(centerValue ?? total)}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const percent = Math.round((item.value / total) * 100);
          return (
            <div key={item.key} className="flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.badge ? (
                  <Badge variant={item.badge}>{item.label}</Badge>
                ) : (
                  <span className="text-muted-foreground">{item.label}</span>
                )}
              </div>
              <span className="font-medium">
                {numberFormatter.format(item.value)} ({percent}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminPostStats | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, usersData] = await Promise.all([
        adminService.getPostStats(),
        adminService.getUsersWithPagination({ page: 1, limit: 1 }),
      ]);

      setStats(statsData);
      setTotalUsers(usersData.pagination.total);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const overviewCards = useMemo(() => {
    if (!stats) return [];

    return [
      {
        key: "active-posts",
        title: "Active Posts",
        value: numberFormatter.format(stats.byStatus.active),
        sub: `${stats.overview.activeRate}% of all posts`,
        icon: FileText,
      },
      {
        key: "inactive-posts",
        title: "Inactive Posts",
        value: numberFormatter.format(stats.byStatus.inactive),
        sub: `Total posts: ${numberFormatter.format(stats.overview.totalAllPosts)}`,
        icon: Shield,
      },
      {
        key: "users",
        title: "Total Users",
        value: numberFormatter.format(totalUsers),
        sub: "User management overview",
        icon: Users,
      },
      {
        key: "views",
        title: "Total Views",
        value: numberFormatter.format(stats.overview.totalViews),
        sub: `${numberFormatter.format(stats.overview.totalComments)} comments`,
        icon: Eye,
      },
    ];
  }, [stats, totalUsers]);

  return (
    <div className="space-y-6 p-6">
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-r from-primary/15 via-primary/5 to-background">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-6">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Admin Dashboard
            </p>
            <h1 className="text-3xl font-bold tracking-tight">LandGo Overview</h1>
            <p className="text-sm text-muted-foreground">
              Chỉ giữ dữ liệu tổng quan, chi tiết thao tác nằm trong tab Posts và Users.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/admin/posts">
                Go To Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/users">
                Go To Users
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="space-y-3 pt-6">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))
          : overviewCards.map((card) => (
              <StatCard
                key={card.key}
                title={card.title}
                value={card.value}
                sub={card.sub}
                icon={card.icon}
              />
            ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Post Status Overview</CardTitle>
            <CardDescription>Tỷ lệ active/inactive của toàn bộ bài đăng</CardDescription>
          </CardHeader>
          <CardContent>
            {loading || !stats ? (
              <Skeleton className="h-44 w-full" />
            ) : (
              <PieChart
                centerLabel="Posts"
                centerValue={stats.overview.totalAllPosts}
                items={[
                  {
                    key: "active",
                    label: "Active",
                    value: stats.byStatus.active,
                    color: "#16a34a",
                    badge: "default",
                  },
                  {
                    key: "inactive",
                    label: "Inactive",
                    value: stats.byStatus.inactive,
                    color: "#6b7280",
                    badge: "secondary",
                  },
                ]}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Overview</CardTitle>
            <CardDescription>Các chỉ số tổng quan cần theo dõi hàng ngày</CardDescription>
          </CardHeader>
          <CardContent>
            {loading || !stats ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <PieChart
                centerLabel="Signals"
                items={[
                  {
                    key: "views",
                    label: "Views",
                    value: stats.overview.totalViews,
                    color: "#3b82f6",
                  },
                  {
                    key: "comments",
                    label: "Comments",
                    value: stats.overview.totalComments,
                    color: "#f59e0b",
                  },
                  {
                    key: "pinned",
                    label: "Pinned",
                    value: stats.overview.pinnedPosts,
                    color: "#8b5cf6",
                  },
                ]}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Navigation</CardTitle>
          <CardDescription>
            Dashboard chỉ overview. Vào từng tab để xử lý chi tiết.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/admin/posts"
            className="group rounded-lg border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <p className="text-sm font-semibold">Posts Management</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Bật/tắt active, xem thống kê chi tiết, quản lý toàn bộ bài đăng.
            </p>
            <span className="mt-3 inline-flex items-center text-xs text-primary">
              Open posts
              <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          <Link
            href="/admin/users"
            className="group rounded-lg border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <p className="text-sm font-semibold">Users Management</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Quản lý tài khoản, role và thông tin user.
            </p>
            <span className="mt-3 inline-flex items-center text-xs text-primary">
              Open users
              <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
