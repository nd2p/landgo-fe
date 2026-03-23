"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as yup from "yup";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import EstateCard from "@/components/estate/estate-card";
import EmptyState from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { deletePost, getMyPosts } from "@/features/estate/estate.api";
import type { Estate } from "@/features/estate/estate.types";

const filterSchema = yup.object({
  status: yup.string().optional(),
});

type FilterInput = yup.InferType<typeof filterSchema>;

export default function MyEstatesPage() {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<FilterInput>({
    resolver: yupResolver(filterSchema) as Resolver<FilterInput>,
    defaultValues: { status: "" },
  });

  const { getValues } = form;

  const fetchPosts = async (filters: FilterInput) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getMyPosts({
        status: filters.status || undefined,
      });
      setEstates(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
      setEstates([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchPosts(getValues());
  }, [getValues]);

  const handleDelete = async (estateId: string) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa bài này không? Hành động này không thể hoàn tác.",
    );
    if (!confirmed) return;

    try {
      setDeletingId(estateId);
      setError(null);
      await deletePost(estateId);
      await fetchPosts(getValues());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Tin của tôi</h1>
      </div>

      {isLoading ? (
        <div className="py-10">
          <Loading label="Đang tải dữ liệu..." fullScreen={false} />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : estates.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {estates.map((estate) => (
            <div
              key={estate._id}
              className="flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <EstateCard estate={estate} viewMode="list" />
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/my-estates/${estate.slug}/edit`}>
                    Chỉnh sửa
                  </Link>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  disabled={deletingId === estate._id}
                  onClick={() => handleDelete(estate._id)}
                >
                  {deletingId === estate._id ? "Đang xóa..." : "Xóa bài"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
