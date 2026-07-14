import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBadge, CreateBadgePayload, deleteBadge, getMyBadges,  } from "./api";

export const useGetMyBadgesQuery = () => {
  return useQuery({
    queryKey: ["my-badges"],
    queryFn: getMyBadges,
  });
};

export const useCreateBadgeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBadgePayload) => createBadge(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-badges"] });
    },
  });
};
    
export const useDeleteBadge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBadge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
    },
  });
};