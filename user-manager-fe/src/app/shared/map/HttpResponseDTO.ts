export interface HttpResponseDTO {
  httpStatus?:     string;
  reason?:         string;
  message?:        string;
  httpStatusCode?: number;
}

export const mappedHttpResponse = (res: any): HttpResponseDTO => {
  const {httpStatus, reason, message, httpStatusCode} = res
  return {
    httpStatus,
    reason,
    message,
    httpStatusCode
  }
}
