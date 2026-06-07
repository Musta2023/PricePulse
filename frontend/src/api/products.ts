import axios from "axios";

const api= axios.create({
    baseURL:'/api',
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface Product {
    id:number,
    url:string,
    initialPrice:number,
    currentPrice:number,
    lastUpdate:string,
    createdAt:string
}

export const getProduct = (page=1, limit = 10)=>{
    return api.get <{data:Product[]; pagination:any}>(`/products?page=${page}&limit=${limit}`);
}
export const createProduct= (data:{url:string, initialPrice:number})=>{
   return  api.post<Product>('/products', data)
}
export const deleteProduct= (id:number)=>{
   return api.delete(`/products/${id}`)
}
