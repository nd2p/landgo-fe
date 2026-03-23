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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateEstateForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const payload = toCreatePostInput(values);
      const response = await createPostsApi(payload);
      console.log("Post created:", response.data);
      router.push("/my-estates");
    } catch (error) {
      console.error("Create post error:", error);
      console.log("images:", values.images);
      console.log("redBookImages:", values.redBookImages);
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
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Hủy
            </Button>
            <Button type="submit">Đăng tin</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
