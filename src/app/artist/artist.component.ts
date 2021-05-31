import { Component, OnInit } from '@angular/core';
import { Album } from '../../../Album';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  constructor(private route: ActivatedRoute) {  }

  id: any; //get artist id from url
  searchRes: Album[] = []; //set each album of the artist of type Album from the GET results

  ngOnInit(): void { 
    //get the id of the artist from the url
    this.id = this.route.snapshot.paramMap.get("id")
    
    var OAuth_Token = localStorage.getItem("access_token");

    //get the artist's name from the given id
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
    
    //get the album results 
    var albumResults = new XMLHttpRequest();
    albumResults.onload = function() {
      var response = this.responseText;
      var res = JSON.parse(response);
      
      searchRes = res.items;

      //loop over the array of albums in searchRes and display each item of the array in a div
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

        var albumArtist = document.createElement("p");
        var albumArtists: string[] = [];
        //loop over the array of artists in the album and add even to the new array 'albumArtist'
        for (var i = 0; i < album.artists.length; i++){
          albumArtists.push(album.artists[i].name);
        }
        //join all the elements of the array 'albumArtists' and seperate them by a dash
        var src = albumArtists.join(" - ");
        albumArtist.innerHTML =  src;
        console.log(albumArtists);
        albumArtist.style.marginTop = "-12px";
        albumArtist.style.fontSize = "12px";
        albumArtist.style.color = "gray";

        divDesc.appendChild(title);
        divDesc.appendChild(albumArtist);

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
        
        //clickable link that opens to a new tab to the spotify preview of the album
        var preview = document.createElement("a");
        preview.href = album.external_urls.spotify;
        preview.style.textDecoration = "none";
        preview.style.color = "gray";
        preview.target = "_blank"; //to go to new tab
        
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