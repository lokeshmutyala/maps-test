import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators'
import { throwError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { isNotNull, isNotBlank } from 'src/app/utils/utils-function';



@Injectable({
    providedIn: 'root'
})
export class BaseAPI {

    constructor(
        private httpClient: HttpClient) {
    }

    private getFinalURL(requestOptions: Request): string {
        return (requestOptions.isAbsoluleURL) ? requestOptions.url : environment.api + requestOptions.url;
    }

    public get<T>(requestOptions: Request): Observable<T> {
        let finalUrl = this.getFinalURL(requestOptions);
        let httpParams = this.getHttpParams(requestOptions.params);
        if (requestOptions.skipAuthHeader) {
            httpParams = httpParams.set('skip-interceptor', 'true');
        }
        let httpHeaders = this.getHeaders(requestOptions.headers);
        let $call: Observable<any>;
        switch (requestOptions.responseType) {
            case ResponseType.ARRAY_BUFFER:
                $call = this.httpClient.get(finalUrl, {
                    params: httpParams,
                    headers: httpHeaders,
                    responseType: ResponseType.ARRAY_BUFFER
                });
                break;
            case ResponseType.TEXT:
                $call = this.httpClient.get(finalUrl, {
                    params: httpParams,
                    headers: httpHeaders,
                    responseType: ResponseType.TEXT
                });
                break;

            case ResponseType.BLOB:
                $call = this.httpClient.get(finalUrl, {
                    params: httpParams,
                    headers: httpHeaders,
                    responseType: ResponseType.BLOB
                });
                break;

            default:
                $call = this.httpClient.get(finalUrl, {
                    params: httpParams,
                    headers: httpHeaders,
                });
                break;
        }
        return $call.pipe(catchError(this.handleError));
    }

    public executeGet(requestOptions: Request): Observable<any> {
        return this.get<any>(requestOptions);
    }

    public executePost<T>(request: PostRequest<T>): Observable<any> {
        let finalUrl = this.getFinalURL(request);
        let httpParams = this.getHttpParams(request.params);
        let httpHeaders = this.getHeaders(request.headers);
        //Hack to allow multipart form data
        if (request.body instanceof FormData) {
            httpHeaders = httpHeaders.delete('Content-Type');
        }
        return this.httpClient.post(finalUrl, request.body, {
            params: httpParams,
            headers: httpHeaders
        }).pipe(catchError(this.handleError));
    }

    public executePut<T>(request: PostRequest<T>): Observable<any> {
        let finalUrl = this.getFinalURL(request);
        let httpParams = this.getHttpParams(request.params);
        let httpHeaders = this.getHeaders(request.headers);
        if (request.body instanceof FormData) {
            httpHeaders = httpHeaders.delete('Content-Type');
        }
        return this.httpClient.put(finalUrl, request.body, {
            params: httpParams,
            headers: httpHeaders
        }).pipe(catchError(this.handleError));
    }

    public executePatch<T>(request: PostRequest<T>): Observable<any> {
        let finalUrl = this.getFinalURL(request);
        let httpParams = this.getHttpParams(request.params);
        let httpHeaders = this.getHeaders(request.headers);
        if (request.body instanceof FormData) {
            httpHeaders = httpHeaders.delete('Content-Type');
        }
        return this.httpClient.patch(finalUrl, request.body, {
            params: httpParams,
            headers: httpHeaders
        }).pipe(catchError(this.handleError));
    }

    public executeDelete<T>(request: Request): Observable<T> {
        let finalUrl = this.getFinalURL(request);
        let httpParams = this.getHttpParams(request.params);
        let httpHeaders = this.getHeaders(request.headers);
        return this.httpClient.delete(finalUrl, {
            params: httpParams,
            headers: httpHeaders
        }).pipe(catchError(this.handleError)) as Observable<T>;
    }

    public getHttpParams(params: Map<string, string>): HttpParams {
        let httpParams = new HttpParams();
        if (params && params.size > 0) {
            params.forEach((value, key) => {
                if (isNotNull(value)) {
                    httpParams = httpParams.append(key, value);
                }
            });
        }
        return httpParams;
    }

    public getHeaders(values: Map<string, string>): HttpHeaders {
        let headers: HttpHeaders = this.getBasicHeaders();
        if (values && values.size > 0) {
            values.forEach((value, key) => {
                if (isNotBlank(value)) {
                    headers = headers.append(key, value);
                } else {
                    headers = headers.delete(key);
                }
            });
        }
        return headers;
    }

    public getBasicHeaders(): HttpHeaders {
        let headers = new HttpHeaders();
        return headers
            .append('Accept', 'application/json')
            .append('Content-Type', 'application/json')
            .append('client', 'Upsell Portal')
            .append('app-version', environment.version)
            .append('tenant-id', 'glenmark')
            .append('Authorization','Token 6734ee18b61af2409fad0756ed04a6a7e8a14d9a')
    }

    private handleError(error: HttpErrorResponse) {
        return throwError(error);
    }
}

export interface Request {
    url: string;
    params?: Map<string, any>;
    headers?: Map<string, string>;
    responseType?: ResponseType;
    isAbsoluleURL?: boolean;
    skipAuthHeader?: boolean;
}

export interface PostRequest<T> extends Request {
    body: T;
}

export enum ResponseType {
    ARRAY_BUFFER = "arraybuffer",
    BLOB = "blob",
    JSON = "json",
    TEXT = "text",
}