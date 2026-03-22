"use client";

import { useEffect, useState } from "react";
import * as yup from "yup";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import EstateCard from "@/components/estate/estate-card";
import EmptyState from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { getMyPosts } from "@/features/estate/estate.api";
import type { Estate } from "@/features/estate/estate.types";

const filterSchema = yup.object({
  status: yup.string().optional(),
});

type FilterInput = yup.InferType<typeof filterSchema>;

export default function MyEstatesPage() {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FilterInput>({
    resolver: yupResolver(filterSchema) as Resolver<FilterInput>,
    defaultValues: { status: "" },
  });

  const { register, handleSubmit, getValues } = form;

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

  const onSubmit = (values: FilterInput) => {
    void fetchPosts(values);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Tin của tôi</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-wrap items-center gap-2"
        >
          <select
            className="border-input h-9 rounded-md border px-3 text-sm"
            {...register("status")}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Đang chờ</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
            <option value="active">Đang hiển thị</option>
          </select>

          <Button type="submit" size="sm">
            Lọc
          </Button>
        </form>
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
            <EstateCard key={estate._id} estate={estate} viewMode="list" />
          ))}
        </div>
      )}
    </div>
  );
}
