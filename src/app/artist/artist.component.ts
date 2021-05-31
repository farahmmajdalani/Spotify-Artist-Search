import { Component, OnInit } from '@angular/core';
import { Album } from '../../../Album';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  constructor(private route: ActivatedRoute) {  }

  id: any;
  searchRes: Album[] = [];

  ngOnInit(): void { 
    this.id = this.route.snapshot.paramMap.get("id")
    console.log(this.id);
    
    var OAuth_Token = localStorage.getItem("access_token");
    var artistSearch = new XMLHttpRequest();
    artistSearch.onload = function() {
      var response = this.responseText;
      var res = JSON.parse(response);
      
      console.log(res);
      
      var h2 = document.getElementById("artistName");
      h2!.innerHTML = res.name + "<br><span id='albums'>Albums</span>";

      var span = document.getElementById("albums");
      span!.style.fontSize = "19px";
      span!.style.color = "gray";
    }
    artistSearch.open("GET", "https://api.spotify.com/v1/artists/" + this.id,true );
    artistSearch.setRequestHeader("Accept", "application/json");
    artistSearch.setRequestHeader("Content-Type", "application/json");
    artistSearch.setRequestHeader("Authorization", "Bearer " + OAuth_Token);
    artistSearch.send(null);

    var searchRes = this.searchRes;
    var grid = document.getElementById("grid-videos");

    var albumResults = new XMLHttpRequest();
    albumResults.onload = function() {
      var response = this.responseText;
      var res = JSON.parse(response);
      
      console.log(res);
      searchRes = res.items;
      searchRes.forEach(album => {
        var div = document.createElement("div");
        div.style.border = "1px solid black";
        div.style.height = "max-content";
        div.style.width = "250px";

        var img = document.createElement("img");
        img.style.width="100%";
        img.style.height = "250px";
        img.style.borderBottom = "1px solid black";
        if (album.images[0] != undefined){
          img.src = album.images[0].url;
        } else{
          img.src = "assets/FMISProfilePic.png";
        }
        div.appendChild(img);

        var divDesc = document.createElement("div");
        divDesc.style.paddingLeft = "1em";
        divDesc.style.marginTop = "10px";

        var title = document.createElement("p");
        title.innerHTML = album.name;
        title.style.fontSize = "20px";

        var followers = document.createElement("p");
        var albumArtists: string[] = [];
        for (var i = 0; i < album.artists.length; i++){
          albumArtists.push(album.artists[i].name);
        }
        var src = albumArtists.join(" - ");
        followers.innerHTML =  src;
        console.log(albumArtists);
        followers.style.marginTop = "-12px";
        followers.style.fontSize = "12px";
        followers.style.color = "gray";

        divDesc.appendChild(title);
        divDesc.appendChild(followers);

        var div2 = document.createElement("div");
        div2.style.marginTop = "20px";
        div2.style.fontSize = "12px";

        var releaseDate = document.createElement("p");
        releaseDate.innerHTML =  album.release_date;
        releaseDate.style.color = "gray";
        var tracks = document.createElement("p");
        tracks.innerHTML =  album.total_tracks + " tracks";
        tracks.style.marginTop = "-12px";
        tracks.style.color = "gray";

        div2.appendChild(releaseDate);
        div2.appendChild(tracks);
        divDesc.appendChild(div2);
        
        var preview = document.createElement("a");
        preview.href = album.external_urls.spotify;
        preview.style.textDecoration = "none";
        preview.style.color = "gray";
        preview.target = "_blank";
        
        var divPreview = document.createElement("div");
        divPreview.innerHTML = "Preview on Spotify";
        divPreview.style.fontSize = "14px";
        divPreview.style.textAlign = "center";
        divPreview.style.backgroundColor = "rgb(235, 235, 235)";
        divPreview.style.width = "100%";
        divPreview.style.padding="5px";
        divPreview.style.borderTop = "1px solid black";
        divPreview.style.marginTop = "-9px";

        preview.appendChild(divPreview);
        div.appendChild(divDesc);
        div.appendChild(preview);
        grid!.appendChild(div);
      }); 
    }
    albumResults.open("GET", "https://api.spotify.com/v1/artists/" + this.id + "/albums",true );
    albumResults.setRequestHeader("Accept", "application/json");
    albumResults.setRequestHeader("Content-Type", "application/json");
    albumResults.setRequestHeader("Authorization", "Bearer " + OAuth_Token);
    albumResults.send(null);
  }
}