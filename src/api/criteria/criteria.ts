import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {axios} from '@/lib/axios';


export const useGetCriteria = () => {
  return useQuery({
    queryKey: ["criteria"],
    queryFn: async () => {
      const res = await axios.get("/criteria");
      return res.data;
    },
  });
};


export const useCreateCriteria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      code: string;
      description: string;
    }) => {
      const res = await axios.post("/criteria", payload);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["criteria"] });
    },
  });
};


export const useUpdateCriteria = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await axios.patch(`/criteria/${id}`, payload);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["criteria"] });
    },
  });
};


export const useDeleteCriteria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`/criteria/${id}`);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["criteria"] });
    },
  });
};