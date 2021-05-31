//create a class for each album

import {Artist} from "Artist";

export class Album{
    id: any;
    name: string = "";
    external_urls : any;
    images: any[] = [];
    release_date: string = "";
    total_tracks: number = 0;
    artists: Artist[] = [];
}