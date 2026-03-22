"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createPostsServices } from "@/features/estate/estate.service";
import { PropertyType } from "@/features/estate/estate.types";
import {
  CreatePostInput,
  createPostSchema,
} from "@/features/estate/estate.validation";
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
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const form = useForm<CreatePostInput>({
    resolver: yupResolver(createPostSchema) as Resolver<CreatePostInput>,
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

  const { handleSubmit, setValue, watch } = form;

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

  const onSubmit = async (data: CreatePostInput) => {
    try {
      const response = await createPostsServices(data);
      console.log("Post created:", response);
    } catch (error) {
      console.error("Create post error:", error);
      console.log("images:", data.images);
      console.log("redBookImages:", data.redBookImages);
    }
  };

  return (
    <div className="flex justify-center bg-background py-10">
      <main className="w-full max-w-3xl space-y-6">
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
            <Button variant="outline" type="button">
              Hủy
            </Button>
            <Button type="submit">Đăng tin</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
