import { useEffect, useState } from "react";

type Province = {
  code: number;
  name: string;
};

type District = {
  code: number;
  name: string;
  province_code: number;
};

type Ward = {
  code: number;
  name: string;
  district_code: number;
};

export const useLocationData = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://provinces.open-api.vn/api/v1/p/");
        if (!response.ok) {
          throw new Error("Không thể tải danh sách tỉnh/thành phố");
        }
        const data: Province[] = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    void fetchProvinces();
  }, []);

  // Fetch districts when province changes
  const fetchDistricts = async (provinceCode: string) => {
    if (!provinceCode) {
      setDistricts([]);
      return;
    }

    setIsLoadingDistricts(true);
    try {
      const response = await fetch("https://provinces.open-api.vn/api/v1/d/");
      if (!response.ok) {
        throw new Error("Không thể tải danh sách quận/huyện");
      }
      const data: District[] = await response.json();
      const provinceCodeNum = Number(provinceCode);
      setDistricts(
        data.filter((item) => item.province_code === provinceCodeNum),
      );
    } catch (error) {
      console.error(error);
      setDistricts([]);
    } finally {
      setIsLoadingDistricts(false);
    }
  };

  // Fetch wards when district changes
  const fetchWards = async (districtCode: string) => {
    if (!districtCode) {
      setWards([]);
      return;
    }

    setIsLoadingWards(true);
    try {
      const response = await fetch("https://provinces.open-api.vn/api/v1/w/");
      if (!response.ok) {
        throw new Error("Không thể tải danh sách xã/phường");
      }
      const data: Ward[] = await response.json();
      const districtCodeNum = Number(districtCode);
      setWards(data.filter((item) => item.district_code === districtCodeNum));
    } catch (error) {
      console.error(error);
      setWards([]);
    } finally {
      setIsLoadingWards(false);
    }
  };

  return {
    provinces,
    districts,
    wards,
    isLoadingProvinces,
    isLoadingDistricts,
    isLoadingWards,
    fetchDistricts,
    fetchWards,
  };
};
