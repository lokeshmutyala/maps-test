
export interface PaginatedResponse<T> {
    page: Page,
    links: Links,
    results: Array<T>
}

export interface Page {
    current_page: number,
    next_page: number,
    prev_page: number,
    total_pages: number,
    page_size: number,
    count: number
}

export interface Links {
    next: string,
    prev: string
}

