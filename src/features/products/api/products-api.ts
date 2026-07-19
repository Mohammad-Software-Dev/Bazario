import type { ApiSuccessResponse } from '@/lib/api/api-error'
import { httpClient } from '@/lib/api/http-client'

import { productEndpoints } from '@/features/products/api/product-endpoints'
import type { ProductFormValues } from '@/features/products/schemas/product-form-schema'
import type {
  MyProductsResult,
  ProductListItem,
  ProductsResult,
  SellerProductsResult,
} from '@/features/products/types/product.types'

interface GetProductsParams {
  categoryId?: number
  page?: number
  perPage?: number
}

function appendLocalizedField(formData: FormData, key: string, value: { en: string; ar: string }) {
  formData.append(`${key}[en]`, value.en)
  formData.append(`${key}[ar]`, value.ar)
}

function buildProductFormData(payload: ProductFormValues, methodOverride?: 'PUT') {
  const formData = new FormData()

  appendLocalizedField(formData, 'name', payload.name)
  appendLocalizedField(formData, 'description', payload.description)
  formData.append('category_id', String(payload.category_id))
  formData.append('price', String(payload.price))

  if (payload.images instanceof FileList) {
    Array.from(payload.images).forEach((file) => {
      formData.append('images[]', file)
    })
  }

  if (methodOverride) {
    formData.append('_method', methodOverride)
  }

  return formData
}

export async function getProducts(params: GetProductsParams = {}) {
  const response = await httpClient.get<ApiSuccessResponse<ProductsResult>>(productEndpoints.list, {
    params: {
      category_id: params.categoryId,
      page: params.page,
      per_page: params.perPage,
    },
  })

  return response.data
}

export async function getMyProducts(params: GetProductsParams = {}) {
  const response = await httpClient.get<ApiSuccessResponse<MyProductsResult>>(productEndpoints.myList, {
    params: {
      page: params.page,
      per_page: params.perPage,
    },
  })

  return response.data
}

export async function getProductsBySeller(
  sellerId: number,
  params: Omit<GetProductsParams, 'categoryId'> = {},
) {
  const response = await httpClient.get<ApiSuccessResponse<SellerProductsResult>>(
    productEndpoints.bySeller(sellerId),
    {
      params: {
        page: params.page,
        per_page: params.perPage,
      },
    },
  )

  return response.data
}

export async function getProduct(productId: number) {
  const response = await httpClient.get<ApiSuccessResponse<ProductListItem>>(productEndpoints.detail(productId))

  return response.data
}

export async function createProduct(payload: ProductFormValues) {
  const response = await httpClient.post<ApiSuccessResponse<ProductListItem>>(
    productEndpoints.create,
    buildProductFormData(payload),
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )

  return response.data
}

export async function updateProduct(productId: number, payload: ProductFormValues) {
  const response = await httpClient.post<ApiSuccessResponse<ProductListItem>>(
    productEndpoints.update(productId),
    buildProductFormData(payload, 'PUT'),
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )

  return response.data
}

export async function deleteProduct(productId: number) {
  const response = await httpClient.delete<ApiSuccessResponse<[]>>(productEndpoints.delete(productId))

  return response.data
}
