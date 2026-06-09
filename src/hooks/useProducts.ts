import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProduct, createProduct, deleteProduct } from "../api/products";
import toast from "react-hot-toast";

export const useProduct =(page=1)=>{
    return useQuery({
        queryKey:['products', page],
        queryFn:async()=>getProduct(page).then(res=>res.data),
        refetchInterval:5000, //refresh every 5s
        enabled: page !== -1
    })
}

export const useCreateProduct = ()=>{
    const queryClient=useQueryClient();
    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:['products']});
            toast.success('product added successfully')
        },
        onError:(error:any)=>{
           const message=error.response?.data?.error || error.response?.data?.errors?.[0]?.msg || 'failed to add this product'
           toast.error(message) 
        }
    })
    
}
export const useDeleteProduct=()=>{
    const queryClient= useQueryClient();
    return useMutation({
        mutationFn:deleteProduct,
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:['products']})
            toast.success('product deleted successfully')
        },
        onError:()=>{toast.error('failed to delete product ')}
    })
}
