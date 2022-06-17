import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { PaginatedResponse } from '../commons/models/common.models';


export const PRIMARY_COLOR_DARK: string = "#593696" // "#511e60";
export const PRIMARY_COLOR: string = "#7e57c2";
// Color for Upsell
// export const PRIMARY_COLOR_DARK: string = "#511e60";
// export const PRIMARY_COLOR: string = "#622473";

export const DATE_FORMAT: string = "YYYY-MM-DD";
export const SORT_PARAM_NAME: string = 'ordering';

export function graphGradient(context: any, startColor?: string, endColor?: string): any {
    var gradient = context.createLinearGradient(0, 0, 0, 100)
    startColor = (startColor) ? startColor : "#e4dcf2";
    endColor = (endColor) ? endColor : "white";
    gradient.addColorStop(0, startColor)
    gradient.addColorStop(1, endColor)
    return gradient;
}

export function isNotBlank(value: string): boolean {
    if (value) {
        switch (typeof value) {
            case 'string':
                return value.trim().length > 0;
            case 'undefined':
                return false;
            default:
                return true;
        }
    }
    return false;
}

export function isBlank(value: string): boolean {
    return !isNotBlank(value);
}

export function isNotEmpty(value: any[]): boolean {
    return !isEmpty(value);
}

export function isEmpty(value: any[]): boolean {
    return (value == null) || value.length == 0;
}


export function isNotNull(value: any) {
    return (value) ? true : false;
}

export function isNull(value: any): boolean {
    return !isNotNull(value);
}

export function isFunction(type: any): boolean {
    return (type) && typeof type == 'function';
}

export function compareIgnoreCase(leftOp: string, rightOp: string): boolean {
    if ((leftOp == rightOp) ||
        (isNotBlank(leftOp) && isNotBlank(leftOp)
            && leftOp.toLowerCase() == rightOp.toLowerCase())) {
        return true;
    }
    return false;
}


export function isTrue(value: any) {
    return (typeof (value) == "boolean" && value == true) ? true : false;
}

export function isFalse(value: any) {
    return !isTrue(value);
}

export function mergeMapEntries(...args): Map<string, any> {
    const map = new Map<string, any>();
    if (args && args.length > 0) {
        Array.from(arguments).forEach(sourceMap => {
            if (sourceMap instanceof Map) {
                const m = sourceMap as Map<string, any>;
                m.forEach((v, k) => {
                    map.set(k, v);
                });
            }
        });
    }
    return map;
}

export function toCamelCase(str: string, seprator: string = " "): string {
    return (str && typeof str == 'string') ? str.split(seprator).map(v => v.charAt(0).toUpperCase() + v.substring(1).toLowerCase()).join(" ") : "";
}

export function emptyPaginatedResponse(): PaginatedResponse<any> {
    return { page: null, links: null, results: null };
}

export function mergePaginatedResponse(source: PaginatedResponse<any>, destination: PaginatedResponse<any>): PaginatedResponse<any> {
    const response = emptyPaginatedResponse();
    if (isNotNull(source) && isNotNull(destination)) {
        response.links = source.links;
        response.page = source.page;
        response.results = [];
        if (isNotEmpty(destination.results)) {
            response.results.push(...destination.results);
        }
        if (isNotEmpty(source.results)) {
            response.results.push(...source.results);
        }
    }
    return response;
}


export const copyPaginatedResponse = <T>(first: PaginatedResponse<T>, second: PaginatedResponse<T>, equalFn: (item1: T, item2: T) => boolean, mergeData: boolean = false) => {
    const result: PaginatedResponse<T> = { page: null, links: null, results: new Array<T>() };
    result.links = first.links;
    result.page = first.page;
    result.results = [...first.results]
    second.results.forEach(item => {
        const processedItem: T = result.results.find(s => equalFn(s, item));
        if (processedItem) {
            Object.assign(processedItem, item);
        } else {
            result.results.push(item);
        }
    });
    return result;
}

export const mergeFunction = <T>(equalFn: (left: T, right: T) => boolean) => {
    return (head: PaginatedResponse<T>, ...agrs: Array<PaginatedResponse<T>>) => {
        return agrs.reduce((result, response) => {
            return copyPaginatedResponse(result, response, equalFn)
        }, head)
    }
}

export const identityFn = <T>(v: T) => v;


export const mapOf = <K, V>(...args: Array<{ key: K, value: V }>) => {
    return new Map<K, V>(args.map(item => [item.key, item.value]))
}

declare global {
    interface MapConstructor {
        from<K, V>(...args: Array<{ key: K, value: V }>): Map<K, V>
    }
}

Map.from = <K, V>(...args: Array<{ key: K, value: V }>) => {
    return new Map<K, V>(args.map(item => [item.key, item.value]))
}


export function displayStatus(status: string): string {
    return toCamelCase(status, "_")
}

export function unsubscribeAll(subscriptions: Array<Subscription>): void {
    if (subscriptions && subscriptions.length > 0) {
        subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        const items = subscriptions.splice(0);
    }
}

export function pluck(object: any, fieldName: string, defaultValue: any = null): any | null {
    return (object && Object.keys(object).indexOf(fieldName) > -1) ? object[fieldName] : defaultValue;
}


export function calDivision(numerator: number, denominator: number): number {
    return (denominator) ? parseFloat((numerator / denominator).toFixed(2)) : 0;
}

export function calPercentage(numerator: number, denominator: number): number {
    return (denominator) ? parseFloat(((numerator / denominator) * 100).toFixed(2)) : 0;
}

export function calculateGrowth(currentValue: number, pastValue: number): number {
    return (currentValue && pastValue) ? parseFloat((((currentValue - pastValue) / currentValue) * 100).toFixed(2)) : 0;
}

export function retrieveErrorMessage(errorResponse: HttpErrorResponse | any, defaultMessage: string = ""): Array<string> {
    let errors = {
        "error": defaultMessage
    }
    if (errorResponse instanceof HttpErrorResponse && errorResponse.error) {
        let error = "";
        switch (errorResponse.status) {
            case 0:
                error = 'The service is not available, please contact your administrator.'
                break;
            case 500:
                error = 'The service is not available, please contact your administrator.'
                break;

            default:
                console.log(errorResponse.error);
                error = (errorResponse.error && typeof errorResponse.error == 'string') ? errorResponse.error : "The did not return expected results, please try later";
                break;
        }
        errors = {
            error: error
        }
    } else if (errorResponse.error) {
        errors = errorResponse.error;
    }
    return Object.keys(errors).reduce((messages, current) => [...messages, errors[current]], []);
}

export function lc(value: string) {
    return value.toLowerCase();
}

export function getQualifiedContactNumber(dialCode: string, contactNumber: string) {

    return (contactNumber)
        ? ((contactNumber.startsWith(dialCode)) ? contactNumber : (isNaN(new Number(contactNumber).valueOf())) ? null : dialCode.concat(contactNumber))
        : null;
}


export function push<T = any>(destination: Array<T>, element: T, pushIfNull: boolean = false): void {
    if (destination && Array.isArray(destination)) {
        const shouldPush = (element) ? true : pushIfNull;
        if (shouldPush) {
            destination.push(element)
        }
    }
}


export function mapImageURL(url: string): string {
    if (url) {
        const urlObject = new URL(url);
        urlObject.searchParams.append('alt', 'media')
        url = urlObject.toString();
    }
    return url;
}