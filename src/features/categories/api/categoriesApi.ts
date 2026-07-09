import { apiClient } from '../../../lib/api/apiClient'
import type { TransactionType } from '../../transactions/model/transactionTypes'
import type { CategoryResponse, SubCategoryResponse } from '../model/categoryTypes'

export const categoriesApi = {
  findAll(type?: TransactionType) {
    const queryString = type ? `?type=${type}` : ''

    return apiClient.get<CategoryResponse[]>(`/api/v1/categories${queryString}`)
  },

  findSubCategories(categoryId: string) {
    return apiClient.get<SubCategoryResponse[]>(`/api/v1/categories/${categoryId}/sub-categories`)
  },
}
