import { apiClient } from '../../../lib/api/apiClient'
import type { TransferRequest, TransferResponse } from '../model/transferTypes'

const TRANSFERS_PATH = '/api/v1/transfers'

export const transfersApi = {
  create(request: TransferRequest) {
    return apiClient.post<TransferResponse, TransferRequest>(TRANSFERS_PATH, request)
  },
}
