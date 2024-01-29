import { authOptions } from "@/lib/utils";
import axios, { AxiosHeaders } from "axios";
import { getServerSession } from "next-auth";

type Options = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: any;
  headers?: AxiosHeaders;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchApi = async (
  url: string,
  options = { method: "GET" } as Options
) => {
  const { headers, method, body } = options;

  const session = await getServerSession(authOptions);
  const token = session?.token.token;
  const authHeader = {
    Authorization: `bearer ${token}`,
  };

  const response = await axios({
    url: `${BASE_URL}/api/v1${url}`,
    method: method,
    headers: { ...headers, ...authHeader },
    data: body,
  })
    .then((res) => res.data)
    .catch((err) => {
      // console.log(err.response.data);
      throw new Error(err.response?.data.message);
    });

  return response;
};

export const createFacility = (obj: any) => {
  return fetchApi("/auth/facility", { method: "POST", body: obj });
};

export const getFacilities = async () => {
  const session = await getServerSession(authOptions);
  // console.log("ses", session.user);
  // return await session;
  return fetchApi(`/auth/facility?organization_id=`);
};
