"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  createEstateFormDefaults,
  type EstateFormErrors,
  type EstateFormState,
  type FieldChangeHandler,
  toCreatePostInput,
  validateEstateForm,
} from "@/features/estate/estate.form";
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
  const [values, setValues] = useState<EstateFormState>(() =>
    createEstateFormDefaults(),
  );
  const [errors, setErrors] = useState<EstateFormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearFieldError = (field: keyof EstateFormErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const onFieldChange: FieldChangeHandler = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  const handleProvinceChange = (value: string) => {
    setValues((prev) => ({
      ...prev,
      province: value,
      district: "",
      ward: "",
    }));
    setDistricts([]);
    setWards([]);
    clearFieldError("province");
    clearFieldError("district");
    clearFieldError("ward");
  };

  const handleDistrictChange = (value: string) => {
    setValues((prev) => ({
      ...prev,
      district: value,
      ward: "",
    }));
    setWards([]);
    clearFieldError("district");
    clearFieldError("ward");
  };

  useEffect(() => {
    getProvinceService().then(setProvinces).catch(console.error);
  }, []);

  useEffect(() => {
    if (!values.province) return;
    getDistrictsService(values.province).then(setDistricts).catch(console.error);
  }, [values.province]);

  useEffect(() => {
    if (!values.district) return;
    getWardsService(values.district).then(setWards).catch(console.error);
  }, [values.district]);

  useEffect(() => {
    getMeService()
      .then((user) => {
        setValues((prev) => ({
          ...prev,
          phone: user.phone ?? "",
          name: user.name ?? "",
          email: user.email ?? "",
        }));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!slug) return;

    const loadPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const estate = await getEstateBySlug(slug);
        setPostId(estate._id);

        const normalizedPinLevel =
          estate.pinLevel === 1 || estate.pinLevel === 2
            ? estate.pinLevel
            : null;

        setValues((prev) =>
          createEstateFormDefaults({
            title: estate.title ?? "",
            description: estate.description ?? "",
            price: estate.price ?? null,
            area: estate.area ?? null,
            province: estate.province?._id ?? "",
            district: estate.district?._id ?? "",
            ward: estate.ward?._id ?? "",
            addressDetail: estate.addressDetail ?? "",
            frontage: estate.frontage ?? null,
            entryWidth: estate.entryWidth ?? null,
            direction: estate.direction ?? "",
            floorNumber: estate.floorNumber ?? null,
            lat: estate.lat ?? 0,
            lng: estate.lng ?? 0,
            numberOfBedrooms: estate.numberOfBedrooms ?? null,
            numberOfBathrooms: estate.numberOfBathrooms ?? null,
            propertyType: estate.propertyType as PropertyType,
            legalStatus: estate.legalStatus ?? "",
            isNegotiable: Boolean(estate.isNegotiable),
            isPinned: Boolean(estate.isPinned),
            pinLevel: normalizedPinLevel,
            pinExpiredAt: estate.pinExpiredAt ?? null,
            images: [],
            redBookImages: [],
            phone: prev.phone,
            name: prev.name,
            email: prev.email,
          }),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setIsLoading(false);
      }
    };

    void loadPost();
  }, [slug]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!postId) return;

    const validationErrors = validateEstateForm(values, { isEdit: true });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const payload = toCreatePostInput(values);
      await updatePost(postId, payload);
      router.push("/my-estates");
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <AddressSection
            values={values}
            errors={errors}
            provinces={provinces}
            districts={districts}
            wards={wards}
            onFieldChange={onFieldChange}
            onProvinceChange={handleProvinceChange}
            onDistrictChange={handleDistrictChange}
          />

          <MainInfoSection
            values={values}
            errors={errors}
            onFieldChange={onFieldChange}
            propertyTypes={Object.values(PropertyType)}
          />

          <LegalSection
            values={values}
            errors={errors}
            onFieldChange={onFieldChange}
          />

          <ContactSection
            name={values.name}
            email={values.email}
            phone={values.phone}
          />

          <ContentSection
            values={values}
            errors={errors}
            onFieldChange={onFieldChange}
          />

          <PinSection
            values={values}
            errors={errors}
            onFieldChange={onFieldChange}
          />

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
