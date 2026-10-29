import { HttpInterceptorFn } from "@angular/common/http";


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJ0aXBvRG9jdW1lbnRvIjoiQ0MiLCJpYXQiOjE3MTAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.dYxSFARrODFymgA4FSdHzS1g5NvR8vRAic2zJZwwD5U'

  if (token){
    const cloneReq= req.clone({
      setHeaders:{
        Authorization:`Bearer ${token}`
      }
    });
    return next(cloneReq)

  }
  return next(req)

}
