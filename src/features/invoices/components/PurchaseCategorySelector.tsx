import { useEffect, useState } from 'react'

import { categoriesApi } from '../../categories/api/categoriesApi'
import type { CategoryResponse, SubCategoryResponse } from '../../categories/model/categoryTypes'
import { getApiErrorMessage } from '../../../lib/api/getApiErrorMessage'
import { useNotification } from '../../../app/providers/useNotification'

type PurchaseCategorySelectorProps = {
  categoryId: string | null
  subCategoryId: string | null
  onChange: (categoryId: string | null, subCategoryId: string | null) => void
}

function PurchaseCategorySelector({
  categoryId,
  subCategoryId,
  onChange,
}: PurchaseCategorySelectorProps) {
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([])
  const { notify } = useNotification()

  useEffect(() => {
    let isCancelled = false

    async function loadCategories() {
      try {
        const response = await categoriesApi.findAll('EXPENSE')

        if (!isCancelled) {
          setCategories(response)
        }
      } catch (error) {
        if (!isCancelled) {
          notify.error(getApiErrorMessage(error, 'Não foi possível carregar as categorias.'))
        }
      }
    }

    void loadCategories()

    return () => {
      isCancelled = true
    }
  }, [notify])

  useEffect(() => {
    if (!categoryId) {
      setSubCategories([])
      return
    }

    const selectedCategoryId = categoryId
    let isCancelled = false

    async function loadSubCategories() {
      try {
        const response = await categoriesApi.findSubCategories(selectedCategoryId)

        if (!isCancelled) {
          setSubCategories(response)
        }
      } catch (error) {
        if (!isCancelled) {
          notify.error(getApiErrorMessage(error, 'Não foi possível carregar as subcategorias.'))
        }
      }
    }

    void loadSubCategories()

    return () => {
      isCancelled = true
    }
  }, [notify, categoryId])

  function handleCategoryChange(nextCategoryId: string) {
    const value = nextCategoryId || null

    onChange(value, null)
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <label>
        <span className="text-sm text-(--color-text)">Categoria</span>

        <select
          value={categoryId ?? ''}
          onChange={(event) => handleCategoryChange(event.target.value)}
          className="mt-2 w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-3 py-2.5 text-(--color-text) transition focus:border-(--color-primary) focus:outline-none"
        >
          <option value="">Sem categoria</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="text-sm text-(--color-text)">Subcategoria</span>

        <select
          value={subCategoryId ?? ''}
          disabled={!categoryId}
          onChange={(event) => onChange(categoryId, event.target.value || null)}
          className="mt-2 w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-3 py-2.5 text-(--color-text) transition focus:border-(--color-primary) focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Sem subcategoria</option>

          {subCategories.map((subCategory) => (
            <option key={subCategory.id} value={subCategory.id}>
              {subCategory.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

export default PurchaseCategorySelector
