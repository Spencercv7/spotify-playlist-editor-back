export type AccountInfo = {
    country: string,
    display_name: string,
    email: string,
    href: string,
    id: string,
    images: [
        AccountImage
    ],
    uri: string
}

export type AccountImage = {
    height: number | null,
    url: string,
    width: number | null
}