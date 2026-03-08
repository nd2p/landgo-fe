export interface IProvince {
  _id: string;
  name: string;
  code: string;
}

export interface IDistrict {
  _id: string;
  code: string;
  name: string;
  province: string;
}

export interface IWard {
  _id: string;
  code: string;
  name: string;
  district: string;
}

export interface Paginated {
  page?: number;
  limit?: number;
}
