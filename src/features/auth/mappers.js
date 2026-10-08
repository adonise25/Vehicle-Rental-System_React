import { ApiError } from "../../shared/http/errors";

export const toCredentialsDto = ({ email, password }) => ({
  email: email.trim(),
  password,
});

export const toRegisterDto = ({
  fullName,
  email,
  phone,
  password,
}) => ({
  fullName: fullName.trim(),
  email: email.trim(),
  phone: phone.trim(),
  password,
});

export function toToken(data) {
  const token =
    typeof data === "string"
      ? data.trim()
      : data?.token ?? data?.accessToken ?? data?.jwt;

  if (!token) {
    throw new ApiError({
      kind: "garbled",
      message: "Login worked but no token came back.",
    });
  }

  return token;
}