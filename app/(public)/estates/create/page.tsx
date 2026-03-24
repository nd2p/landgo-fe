"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createPostsApi } from "@/features/estate/estate.api";
import {
  createEstateFormDefaults,
  type EstateFormErrors,
  type EstateFormState,
  type FieldChangeHandler,
  extractLatLngFromMapInput,
  toCreatePostInput,
  validateEstateForm,
} from "@/features/estate/estate.form";
import { validateRedBookImagesWithGemini } from "@/features/estate/red-book-validation.service";
import { PropertyType } from "@/features/estate/estate.types";
import {
  getDistrictsService,
  getProvinceService,
  getWardsService,
} from "@/features/location/location.service";
import { IDistrict, IProvince, IWard } from "@/features/location/location.type";
import { getMeService } from "@/features/auth/auth.service";
import { createSepayPayment } from "@/features/subscription/subscription.service";
import AddressSection from "./components/address-section";
import MainInfoSection from "./components/main-info-section";
import LegalSection from "./components/legal-section";
import ContentSection from "./components/content-section";
import ContactSection from "./components/contact-section";
import PinSection from "./components/pin-section";

export default function CreatePostPage() {
  const router = useRouter();
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  const [values, setValues] = useState<EstateFormState>(() =>
    createEstateFormDefaults(),
  );
  const [errors, setErrors] = useState<EstateFormErrors>({});
  const [isValidatingRedBookImages, setIsValidatingRedBookImages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const mapUrl = values.mapUrl.trim();
    if (!mapUrl) return;

    const parsedLatLng = extractLatLngFromMapInput(mapUrl);
    if (!parsedLatLng) return;

    if (values.lat === parsedLatLng.lat && values.lng === parsedLatLng.lng) {
      return;
    }

    setValues((prev) => ({
      ...prev,
      lat: parsedLatLng.lat,
      lng: parsedLatLng.lng,
    }));
    clearFieldError("mapUrl");
  }, [values.mapUrl, values.lat, values.lng]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    let nextValues = values;
    const mapUrl = values.mapUrl.trim();
    const parsedLatLng = mapUrl ? extractLatLngFromMapInput(mapUrl) : null;

    const validationErrors = validateEstateForm(nextValues);
    if (mapUrl && !parsedLatLng) {
      validationErrors.mapUrl = "Link Google Maps không hợp lệ hoặc không chứa tọa độ";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (parsedLatLng) {
      nextValues = {
        ...values,
        lat: parsedLatLng.lat,
        lng: parsedLatLng.lng,
      };

      setValues((prev) => ({
        ...prev,
        lat: parsedLatLng.lat,
        lng: parsedLatLng.lng,
      }));
    }

    setIsSubmitting(true);

    try {
      if (values.redBookImages.length > 0) {
        setIsValidatingRedBookImages(true);
        const validationResult = await validateRedBookImagesWithGemini(values.redBookImages);

        if (!validationResult.valid) {
          const invalidNames = validationResult.invalidFiles.map((file) => file.fileName).join(", ");
          setErrors((prev) => ({
            ...prev,
            redBookImages: `Ảnh sổ đỏ không hợp lệ: ${invalidNames}`,
          }));
          return;
        }
      }

      const payload = toCreatePostInput(nextValues);
      const response = await createPostsApi(payload);
      const createdPostId = response.data?.data?._id;

      if (values.isPinned && values.pinLevel && values.pinDurationType && createdPostId) {
        try {
          const payment = await createSepayPayment({
            postId: createdPostId,
            pinLevel: values.pinLevel,
            durationType: values.pinDurationType,
          });
          router.push(`/payments/${payment._id}`);
          return;
        } catch (paymentError) {
          console.error("Create payment error:", paymentError);
        }
      }

      router.push("/my-estates");
    } catch (error) {
      console.error("Create post error:", error);
      console.log("images:", values.images);
      console.log("redBookImages:", values.redBookImages);
    } finally {
      setIsSubmitting(false);
      setIsValidatingRedBookImages(false);
    }
  };

  const handleRedBookFilesSelected = async (files: File[]) => {
    try {
      setIsValidatingRedBookImages(true);
      const validationResult = await validateRedBookImagesWithGemini(files);

      if (!validationResult.valid) {
        const invalidNames = validationResult.invalidFiles.map((file) => file.fileName).join(", ");
        const message = `Ảnh sổ đỏ không hợp lệ: ${invalidNames}`;
        setErrors((prev) => ({ ...prev, redBookImages: message }));
        return message;
      }

      clearFieldError("redBookImages");
      return null;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể xác thực ảnh sổ đỏ. Vui lòng thử lại.";
      setErrors((prev) => ({ ...prev, redBookImages: message }));
      return message;
    } finally {
      setIsValidatingRedBookImages(false);
    }
  };

  return (
    <div className="flex justify-center bg-background py-10">
      <main className="w-full max-w-3xl space-y-6">
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
            showMapUrlInput
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
            onRedBookFilesSelected={handleRedBookFilesSelected}
            isValidatingRedBookImages={isValidatingRedBookImages}
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
              disabled={isSubmitting}
            >
              Huy
            </Button>
            <Button type="submit" disabled={isSubmitting || isValidatingRedBookImages}>
              {isSubmitting ? "Đang xử lý..." : "Đăng tin"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
