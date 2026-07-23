import { api } from "@/api/client";
import type { LoginResponse } from "../types";

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post<LoginResponse>(
    "/auth/login",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
}