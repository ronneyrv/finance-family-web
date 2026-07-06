export type RequestOptions<TBody = unknown> = Omit<RequestInit, 'body'> & {
  body?: TBody
}
