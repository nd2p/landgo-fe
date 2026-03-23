"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ElementType,
} from "react";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Eye,
  FileText,
  MessageSquare,
  Pin,
  RefreshCcw,
  Trash2,
  TrendingUp,
} from "lucide-react";

import {
  adminService,
  type AdminPost,
  type AdminPostDailyStat,
  type AdminPostStats,
  type AdminPostStatusMap,
} from "@/features/admin/admin.service";
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
const POST_PAGE_SIZE = 12;

const statusLabelMap: Record<keyof AdminPostStatusMap, string> = {
  active: "Đang hoạt động",
  inactive: "Ngưng hoạt động",
};

const propertyTypeLabelMap: Record<string, string> = {
  house: "Nhà",
  apartment: "Căn hộ",
  land: "Đất",
  villa: "Biệt thự",
  commercial: "Thương mại",
};

const statusToneMap: Record<
  keyof AdminPostStatusMap,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  inactive: "secondary",
};

const statusColorMap: Record<keyof AdminPostStatusMap, string> = {
  active: "#16a34a",
  inactive: "#6b7280",
};

const loadErrorMessage = "Không thể tải thống kê bài đăng. Vui lòng thử lại.";
const propertyPieColors = [
  "#f59e0b",
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
];

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
    <Card className="border-primary/20 bg-gradient-to-b from-background to-primary/5 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {sub ? (
              <p className="text-xs text-muted-foreground">{sub}</p>
            ) : null}
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
            <div
              key={item.key}
              className="flex items-center justify-between gap-3 text-sm"
            >
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

function Last7DaysChart({ data }: { data: AdminPostDailyStat[] }) {
  const max = Math.max(...data.map((item) => item.count), 1);

  return (
    <div className="flex h-44 items-end gap-2">
      {data.map((item) => {
        const height = Math.max(10, Math.round((item.count / max) * 120));
        return (
          <div
            key={item.date}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <span className="text-xs font-medium">{item.count}</span>
            <div
              className="w-full rounded-md bg-primary/85 transition-all hover:bg-primary"
              style={{ height: `${height}px` }}
              title={`${item.label}: ${item.count}`}
            />
            <span className="text-[11px] text-muted-foreground">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status === "active" ? "active" : "inactive";
  return (
    <Badge variant={statusToneMap[normalized]}>
      {statusLabelMap[normalized]}
    </Badge>
  );
}

export default function ManagePostsPage() {
  const [stats, setStats] = useState<AdminPostStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [postsTotal, setPostsTotal] = useState(0);
  const [postPage, setPostPage] = useState(1);
  const [postPages, setPostPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive">(
    "active",
  );

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      setErrorMessage(null);
      const response = await adminService.getPostStats();
      setStats(response);
    } catch {
      setErrorMessage(loadErrorMessage);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadPosts = useCallback(async () => {
    try {
      setPostsLoading(true);
      const response = await adminService.getPosts({
        page: postPage,
        limit: POST_PAGE_SIZE,
        status: statusFilter,
      });
      const safePages = Math.max(1, response.pages);
      if (postPage > safePages) {
        setPostPage(safePages);
        return;
      }

      setPosts(response.data);
      setPostsTotal(response.total);
      setPostPages(safePages);
    } catch {
      setPosts([]);
      setPostsTotal(0);
      setPostPages(1);
    } finally {
      setPostsLoading(false);
    }
  }, [postPage, statusFilter]);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadStats(), loadPosts()]);
  }, [loadPosts, loadStats]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const statCards = useMemo(() => {
    if (!stats) return [];

    return [
      {
        key: "active",
        title: "Bài đăng đang hoạt động",
        value: numberFormatter.format(stats.overview.totalPosts),
        sub: `Tổng tất cả bài đăng: ${numberFormatter.format(stats.overview.totalAllPosts)}`,
        icon: FileText,
      },
      {
        key: "views",
        title: "Lượt xem",
        value: numberFormatter.format(stats.overview.totalViews),
        sub: `${numberFormatter.format(stats.overview.totalScore)} tổng điểm`,
        icon: Eye,
      },
      {
        key: "comments",
        title: "Bình luận",
        value: numberFormatter.format(stats.overview.totalComments),
        sub: `${numberFormatter.format(stats.byStatus.inactive)} bài đăng ngưng hoạt động`,
        icon: MessageSquare,
      },
      {
        key: "pinned",
        title: "Bài đăng được ghim",
        value: numberFormatter.format(stats.overview.pinnedPosts),
        sub: `Chiếm ${stats.overview.activeRate}% bài đăng đang hoạt động`,
        icon: Pin,
      },
    ];
  }, [stats]);

  const handleDeactivatePost = useCallback(
    async (postId: string) => {
      if (!confirm("Đánh dấu bài đăng này là inactive?")) return;

      await adminService.deactivatePost(postId);
      await refreshAll();
    },
    [refreshAll],
  );

  const handleActivatePost = useCallback(
    async (postId: string) => {
      if (!confirm("Kích hoạt lại bài đăng này?")) return;

      await adminService.activatePost(postId);
      await refreshAll();
    },
    [refreshAll],
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Thống kê bài đăng
          </h1>
          <p className="text-sm text-muted-foreground">
            Thống kê trạng thái và quản lý toàn bộ bài đăng.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => void refreshAll()}
          disabled={statsLoading}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Làm mới
        </Button>
      </div>

      {errorMessage ? (
        <Card className="border-destructive/30">
          <CardContent className="pt-6 text-sm text-destructive">
            {errorMessage}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card
                key={index}
                className="border-primary/20 bg-gradient-to-b from-background to-primary/5 shadow-sm"
              >
                <CardContent className="space-y-3 pt-6">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-3 w-28" />
                </CardContent>
              </Card>
            ))
          : statCards.map((card) => (
              <StatCard
                key={card.key}
                title={card.title}
                value={card.value}
                sub={card.sub}
                icon={card.icon}
              />
            ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="border-primary/20 shadow-sm xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Trạng thái hoạt động
            </CardTitle>
            <CardDescription>
              Phân phối theo trạng thái bài viết
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading || !stats ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <PieChart
                centerLabel="Tổng"
                centerValue={stats.byStatus.active + stats.byStatus.inactive}
                items={[
                  {
                    key: "active",
                    label: "Đang hoạt động",
                    value: stats.byStatus.active,
                    color: statusColorMap.active,
                    badge: "default",
                  },
                  {
                    key: "inactive",
                    label: "Ngưng hoạt động",
                    value: stats.byStatus.inactive,
                    color: statusColorMap.inactive,
                    badge: "secondary",
                  },
                ]}
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-sm xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Bài đăng mới trong 7 ngày gần đây
            </CardTitle>
            <CardDescription>Khối lượng hàng ngày</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading || !stats ? (
              <Skeleton className="h-44 w-full" />
            ) : (
              <Last7DaysChart data={stats.last7Days} />
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-sm xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Các loại hình bất động sản
         </CardTitle>
            <CardDescription>
              Tỷ lệ phần trăm được tính dựa trên tổng số bài đăng theo loại hình.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading || !stats ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <PieChart
                centerLabel="Bài đăng"
                items={stats.propertyTypeDistribution.map((item, index) => ({
                  key: item.propertyType,
                  label:
                    propertyTypeLabelMap[item.propertyType] ??
                    item.propertyType,
                  value: item.count,
                  color: propertyPieColors[index % propertyPieColors.length],
                }))}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 shadow-sm">
        <CardHeader>
          <CardTitle>Bài đăng được xem nhiều nhất</CardTitle>
          <CardDescription>Số luọt xem cao nhất</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {statsLoading || !stats ? (
            <div className="space-y-3 px-6 pb-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-9 w-full" />
              ))}
            </div>
          ) : stats.topViewedPosts.length === 0 ? (
            <div className="px-6 pb-6 text-sm text-muted-foreground">
              No posts available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-y bg-muted/40 text-left text-muted-foreground">
                    <th className="px-6 py-3 font-medium">Tiêu đề</th>
                    <th className="px-4 py-3 font-medium">Loại hình</th>
                    <th className="px-4 py-3 font-medium">Trạng thái</th>
                    <th className="px-4 py-3 font-medium text-right">Lượt xem</th>
                    <th className="px-4 py-3 font-medium text-right">Điểm số</th>
                    <th className="px-6 py-3 font-medium text-right">
                      Ngày tạo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topViewedPosts.map((post) => (
                    <tr key={post._id} className="border-b">
                      <td className="px-6 py-3 font-medium">{post.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {propertyTypeLabelMap[post.propertyType] ??
                          post.propertyType}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={post.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {numberFormatter.format(post.viewCount)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {numberFormatter.format(post.score)}
                      </td>
                      <td className="px-6 py-3 text-right text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/20 shadow-sm">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Tất cả bài đăng đã đăng</CardTitle>
              <CardDescription>
                Danh sách hiển thị theo trạng thái để quản trị viên bật/tắt trạng.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={statusFilter === "active" ? "default" : "outline"}
                onClick={() => {
                  setStatusFilter("active");
                  setPostPage(1);
                }}
              >
                Hoạt động
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "inactive" ? "default" : "outline"}
                onClick={() => {
                  setStatusFilter("inactive");
                  setPostPage(1);
                }}
              >
                Ngưng hoạt động
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {postsLoading ? (
            <div className="space-y-3 px-6 pb-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-9 w-full" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="px-6 pb-6 text-sm text-muted-foreground">
              Không có bài đăng nào trong trạng thái này.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-sm">
                <thead>
                  <tr className="border-y bg-muted/40 text-left text-muted-foreground">
                    <th className="px-6 py-3 font-medium">Tiêu đề</th>
                    <th className="px-4 py-3 font-medium">Tác giả</th>
                    <th className="px-4 py-3 font-medium">Loại hình</th>
                    <th className="px-4 py-3 font-medium text-right">Giá</th>
                    <th className="px-4 py-3 font-medium text-right">Lượt xem</th>
                    <th className="px-4 py-3 font-medium">Trạng thái</th>
                    <th className="px-6 py-3 font-medium text-right">Tùy chọn</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post._id} className="border-b">
                      <td className="px-6 py-3 font-medium">{post.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {post.author?.name ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {propertyTypeLabelMap[post.propertyType] ??
                          post.propertyType}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {numberFormatter.format(post.price)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {numberFormatter.format(post.viewCount)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={post.status} />
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex justify-end">
                          {post.status === "active" ? (
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 px-3"
                              onClick={() =>
                                void handleDeactivatePost(post._id)
                              }
                            >
                              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                              Inactive
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="default"
                              className="h-8 px-3"
                              onClick={() => void handleActivatePost(post._id)}
                            >
                              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                              Active
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!postsLoading ? (
            <div className="flex items-center justify-between border-t px-6 py-3">
              <p className="text-sm text-muted-foreground">
              Trang {postPage}/{postPages} -{" "}
                {numberFormatter.format(postsTotal)} bài đăng
              </p>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setPostPage((prev) => Math.max(1, prev - 1))}
                  disabled={postPage <= 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setPostPage((prev) => Math.min(postPages, prev + 1))
                  }
                  disabled={postPage >= postPages}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
