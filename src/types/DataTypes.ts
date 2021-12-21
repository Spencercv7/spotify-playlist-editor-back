export type AccountInfo = {
    country: string,
    display_name: string,
    email: string,
    href: string,
    id: string,
    images: Array<Image>,
    uri: string
}

export type Image = {
    height: number | null,
    url: string,
    width: number | null
}

export type Playlist = {
    description: string,
    id: string,
    images: Array<Image>,
    public: boolean,
    tracks: {
        url: string,
        total: number
    }
}

export type Playlists = {
    lists: Array<Playlist>,
    next: string,
    previous: string,
    total: number
}