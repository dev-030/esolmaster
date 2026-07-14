import {
  CompleteProfileDtoRequestDto,
  SignUpDtoRequestDto,
} from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  checkUsername,
  completeProfile,
  forgetPassword,
  myProfile,
  refreshToken,
  resetPassword,
  signIn,
  signOut,
  signUp,
  updateMyProfile,
  verifyResetCode,
} from "./api";

export const useSignUpMutation = () => {
  return useMutation({
    mutationKey: ["auth", "signup"],
    mutationFn: async (signUpData: SignUpDtoRequestDto) => signUp(signUpData),
  });
};

export const useSignInMutation = () => {
  return useMutation({
    mutationKey: ["auth", "signin"],
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => signIn(email, password),
  });
};

export const useForgetPasswordMutation = () => {
  return useMutation({
    mutationKey: ["auth", "forget-password"],
    mutationFn: async (email: string) => forgetPassword(email),
  });
};

export const useVerifyResetCodeMutation = () => {
  return useMutation({
    mutationKey: ["auth", "verify-reset-code"],
    mutationFn: async ({ email, code }: { email: string; code: string }) =>
      verifyResetCode(email, code),
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationKey: ["auth", "reset-password"],
    mutationFn: async ({
      password,
      confirmPassword,
      resetToken,
    }: {
      password: string;
      confirmPassword: string;
      resetToken: string;
    }) => resetPassword(password, confirmPassword, resetToken),
  });
};

export const useRefreshTokenMutation = () => {
  return useMutation({
    mutationKey: ["auth", "refresh-token"],
    mutationFn: async () => refreshToken(),
  });
};

export const useSignOutMutation = () => {
  return useMutation({
    mutationKey: ["auth", "signout"],
    mutationFn: async () => signOut(),
  });
};

export const useCheckUsernameQuery = () => {
  return useMutation({
    mutationKey: ["auth", "check-username"],
    mutationFn: async (username: string) => checkUsername(username),
  });
};

export const useCompleteProfileMutation = () => {
  return useMutation({
    mutationKey: ["auth", "complete-profile"],
    mutationFn: async (payload: CompleteProfileDtoRequestDto) =>
      completeProfile(payload),
  });
};

export const useGetMyProfileQuery = () => {
  return useQuery({
    queryKey: ["auth", "my-profile"],
    queryFn: async () => {
      const data = await myProfile();
      return data;
    },
  })
}

export const useUpdateMyProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["auth", "update-my-profile"],
    mutationFn: async (payload: {
      firstName?: string;
      lastName?: string;
      institution?: string;
      bio?: string;
    }) => updateMyProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "my-profile"] });
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationKey: ["auth", "change-password"],
    mutationFn: async (payload: {
      currentPassword?: string;
      newPassword: string;
      confirmPassword: string;
    }) => changePassword(payload),
  });
};