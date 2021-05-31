import { Component, OnInit } from '@angular/core';
import {Artist} from "../../../Artist";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {

  constructor() {
    this.searchRes = [];
    this.searchBar = "";
  }
  searchBar: string;
  searchRes: Artist[]; 
  currentRate = 0;
  ngOnInit(): void {  
    this.searchBar = localStorage.getItem("searchBar")!;
    var btn = document.getElementById("search");
    btn!.click();
  }
  
  public searchMusic(){
    var form = document.getElementById("form");
    var search_bar = document.getElementById("search-bar");
    localStorage.setItem("searchBar", this.searchBar);

    if (this.searchBar != ""){
      form!.style.top = "100px";
      search_bar!.style.textAlign = "left";

      var OAuth_Token = localStorage.getItem("access_token");
      console.log(OAuth_Token);

      var searchRes = this.searchRes;

      var grid = document.getElementById("grid-videos");

      var numberWithCommas = this.numberWithCommas;

      var currentRate = this.currentRate;

      var artistSearch = new XMLHttpRequest();
      artistSearch.onload = function() {
        var response = this.responseText;
        var res = JSON.parse(response);
        
        searchRes = res.artists.items;
        console.log(searchRes); 
        
        searchRes.forEach(artist => {
          var div = document.createElement("div");
          div.style.border = "1px solid black";
          div.style.height = "max-content";
          div.style.width = "250px";
          
          var a = document.createElement("a");
          a.href = "/artist/" + artist.id;
          a.style.textDecoration = "none";
          a.style.color = "black";

          var img = document.createElement("img");
          img.style.width="100%";
          img.style.height = "250px";
          img.style.borderBottom = "1px solid black";
          if (artist.images[0] != undefined){
            img.src = artist.images[0].url;
          } else{
            img.src = "assets/FMISProfilePic.png";
          }
          a.appendChild(img);

          var divDesc = document.createElement("div");
          divDesc.style.paddingLeft = "1em";
          divDesc.style.marginTop = "10px";

          var title = document.createElement("p");
          title.innerHTML = artist.name;
          title.style.fontSize = "20px";

          var followers = document.createElement("p");
          followers.innerHTML = numberWithCommas(artist.followers.total) + " followers";
          followers.style.marginTop = "-12px";
          followers.style.fontSize = "12px";
          followers.style.color = "gray";

          divDesc.appendChild(title);
          divDesc.appendChild(followers);
          
          currentRate = artist.popularity * 5 / 100;

          var stars = document.createElement("div");
          stars.style.marginTop = "40px";
          stars.style.marginBottom = "10px";
          stars.style.fontSize = "25px";
          var star1 = document.createElement("span");
          if (Math.round(currentRate) >= 1){
            star1.className = "fa fa-star checked";
            star1.style.color = "orange";
          } else{
            star1.className = "fa fa-star-o";
          }
          var star2 = document.createElement("span");
          if (Math.round(currentRate) >= 2){
            star2.className = "fa fa-star checked";
            star2.style.color = "orange";
          } else{
            star2.className = "fa fa-star-o";
          }
          var star3 = document.createElement("span");
          if (Math.round(currentRate) >= 3){
            star3.className = "fa fa-star checked";
            star3.style.color = "orange";
          } else{
            star3.className = "fa fa-star-o";
          }
          var star4 = document.createElement("span");
          if (Math.round(currentRate) >= 4){
            star4.className = "fa fa-star checked";
            star4.style.color = "orange";
          } else{
            star4.className = "fa fa-star-o";
          }
          var star5 = document.createElement("span");
          if (Math.round(currentRate) >= 5){
            star5.className = "fa fa-star checked";
            star5.style.color = "orange";
          } else{
            star5.className = "fa fa-star-o";
          }

          stars.appendChild(star1);
          stars.appendChild(star2);
          stars.appendChild(star3);
          stars.appendChild(star4);
          stars.appendChild(star5);

          divDesc.appendChild(stars);
          a.appendChild(divDesc);
          div.appendChild(a);
          grid!.appendChild(div);
        }); 
        
      }
      grid!.innerHTML = ""; 
      var result = localStorage.getItem("searchBar");
      var search = encodeURIComponent(result!.trim());
      console.log(search);
      artistSearch.open("GET", "https://api.spotify.com/v1/search?q="+search+"&type=artist",true );
      artistSearch.setRequestHeader("Accept", "application/json");
      artistSearch.setRequestHeader("Content-Type", "application/json");
      artistSearch.setRequestHeader("Authorization", "Bearer " + OAuth_Token);
      artistSearch.send(null);
    }
  }
  public numberWithCommas(x:any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}