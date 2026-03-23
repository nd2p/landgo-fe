"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@/components/ui/button";
import {
  CreatePostInput,
  createPostSchema,
} from "@/features/estate/estate.validation";
import { PropertyType } from "@/features/estate/estate.types";
import {
  getDistrictsService,
  getProvinceService,
  getWardsService,
} from "@/features/location/location.service";
import { IDistrict, IProvince, IWard } from "@/features/location/location.type";
import { getMeService } from "@/features/auth/auth.service";
import { getEstateBySlug, updatePost } from "@/features/estate/estate.api";

import AddressSection from "@/app/(public)/estates/create/components/address-section";
import MainInfoSection from "@/app/(public)/estates/create/components/main-info-section";
import LegalSection from "@/app/(public)/estates/create/components/legal-section";
import ContentSection from "@/app/(public)/estates/create/components/content-section";
import ContactSection from "@/app/(public)/estates/create/components/contact-section";
import PinSection from "@/app/(public)/estates/create/components/pin-section";

export default function EditEstatePage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [postId, setPostId] = useState<string | null>(null);
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreatePostInput>({
    resolver: yupResolver(createPostSchema, {
      context: { isEdit: true },
    }) as Resolver<CreatePostInput>,
    defaultValues: {
      phone: "",
      name: "",
      email: "",
      lat: 0,
      lng: 0,
      numberOfBedrooms: 0,
      numberOfBathrooms: 0,
      isNegotiable: false,
      isPinned: false,
      pinLevel: null,
      pinExpiredAt: null,
      images: [],
      redBookImages: [],
    },
  });

  const { handleSubmit, setValue, watch, reset } = form;

  useEffect(() => {
    getProvinceService().then(setProvinces).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedProvince) return;
    getDistrictsService(selectedProvince)
      .then(setDistricts)
      .catch(console.error);
  }, [selectedProvince]);

  useEffect(() => {
    if (!selectedDistrict) return;
    getWardsService(selectedDistrict).then(setWards).catch(console.error);
  }, [selectedDistrict]);

  useEffect(() => {
    getMeService()
      .then((user) => {
        setValue("phone", user.phone);
        setValue("name", user.name);
        setValue("email", user.email);
      })
      .catch(console.error);
  }, [setValue]);

  useEffect(() => {
    if (!slug) return;

    const loadPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const estate = await getEstateBySlug(slug);
        setPostId(estate._id);

        reset({
          title: estate.title,
          description: estate.description,
          price: estate.price,
          area: estate.area,
          province: estate.province?._id ?? "",
          district: estate.district?._id ?? "",
          ward: estate.ward?._id ?? "",
          addressDetail: estate.addressDetail ?? "",
          frontage: estate.frontage ?? undefined,
          entryWidth: estate.entryWidth ?? undefined,
          direction: estate.direction ?? "",
          floorNumber: estate.floorNumber ?? undefined,
          lat: estate.lat ?? 0,
          lng: estate.lng ?? 0,
          numberOfBedrooms: estate.numberOfBedrooms ?? 0,
          numberOfBathrooms: estate.numberOfBathrooms ?? 0,
          propertyType: estate.propertyType as PropertyType,
          legalStatus: estate.legalStatus ?? "",
          isNegotiable: Boolean(estate.isNegotiable),
          isPinned: Boolean(estate.isPinned),
          pinLevel: estate.pinLevel ?? null,
          pinExpiredAt: estate.pinExpiredAt ?? null,
          images: [],
          redBookImages: [],
          phone: watch("phone") ?? "",
          name: watch("name") ?? "",
          email: watch("email") ?? "",
        });

        setSelectedProvince(estate.province?._id ?? "");
        setSelectedDistrict(estate.district?._id ?? "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setIsLoading(false);
      }
    };

    void loadPost();
  }, [slug, reset, watch]);

  const onSubmit = async (data: CreatePostInput) => {
    if (!postId) return;
    try {
      setIsLoading(true);
      setError(null);
      await updatePost(postId, data);
      router.push("/user/my-estates");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update post");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center bg-background py-10">
        <main className="w-full max-w-3xl">
          <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-background py-10">
      <main className="w-full max-w-3xl space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AddressSection
            form={form}
            provinces={provinces}
            districts={districts}
            wards={wards}
            onProvinceChange={(value) => {
              setSelectedProvince(value);
              setDistricts([]);
              setWards([]);
              setValue("district", "");
              setValue("ward", "");
            }}
            onDistrictChange={(value) => {
              setSelectedDistrict(value);
              setWards([]);
              setValue("ward", "");
            }}
          />

          <MainInfoSection
            form={form}
            propertyTypes={Object.values(PropertyType)}
          />

          <LegalSection form={form} />

          <ContactSection
            name={watch("name")}
            email={watch("email")}
            phone={watch("phone")}
          />

          <ContentSection form={form} />

          <PinSection form={form} />

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Hủy
            </Button>
            <Button type="submit">Lưu thay đổi</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
