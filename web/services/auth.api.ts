"use server";

import axios, { AxiosHeaders, RawAxiosRequestHeaders } from "axios";

type Options = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: any;
  headers?: AxiosHeaders;
};

const fetchApi = async (
  url: string,
  options = { method: "GET" } as Options
) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const { headers, method, body } = options;

  // const session = await getServerSession(authOptions);
  // const token = session?.user;
  // const authHeader = {
  //   Authorization: `bearer ${token}`,
  // };

  const response = await axios({
    url: `${BASE_URL}/api/v1${url}`,
    method: method,
    headers: headers,
    data: body,
  })
    .then((res) => res.data)
    .catch((err) => {
      console.log("error : ", err.response.data);
      if(err.response.data.message == ''){

        throw new Error(err.response.data.errors[0].message);
      }else{
        throw new Error(err.response.data.message)
      }
    });

  return response;
};

export const register = (user: any) => {
  // console.log("user", user);
  return fetchApi("/register", { method: "POST", body: user } as Options);
};

export const registerStep2 = ({
  id,
  formdata,
}: {
  id: number;
  formdata: any;
}) => {
  const formbody = new URLSearchParams(formdata).toString();

  return fetchApi(`/user/${id}`, {
    method: "PATCH",
    body: formbody,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    } as RawAxiosRequestHeaders,
  } as Options);
};

export const registerOrganisation = (orgBody: any) => {
  return fetchApi("/organization", { method: "POST", body: orgBody });
};

export const login = (body: any) => {
  const formbody = new FormData();
  formbody.append("email", body.email);
  formbody.append("password", body.password);

  return fetchApi("/login", { method: "POST", body: formbody });
};

export const forgotPassword = (body: any) => {
  const formBody = new FormData();
  formBody.append("email", body.email);
  return fetchApi("/forgot-password", { method: "POST", body: formBody });
};

export const resetPassword = (body: any) => {
  const formbody = new FormData();
  formbody.append("newPassword", body.newPassword);
  formbody.append("confirmPassword", body.confirmPassword);
  formbody.append("email", body.email);
  formbody.append("token", body.token);
  return fetchApi("/reset-password", { method: "POST", body: formbody });
};

export const verifyEmail = (token: string) => {
  const formDetails = new FormData();
  formDetails.append("token", token);
  return fetchApi(`/verify-email`, { method: "POST", body: formDetails });
};
