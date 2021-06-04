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

  searchBar: string; //get value from the input text box
  searchRes: Artist[]; //set each artist of type Artist from the GET results
  currentRate = 0; //set star rating for each artist
  offset = '0';
  limit = 20;

  ngOnInit(): void {  
    
    this.searchBar = localStorage.getItem("searchBar")!; //set the searchbar to have the value of the previously saved value
    var btn = document.getElementById("search"); 
    
    if (localStorage.getItem("back")=='true'){
      this.offset = localStorage.getItem("offset")!;
    }else{
      this.offset = '0';
    }
    
    btn!.click(); //then press the button to activate it
    
    if (localStorage.getItem("offset") == null){
      localStorage.setItem("offset", '0');
    }

    //if session expires after an hour go back to login page 
    var exp = Number(localStorage.getItem("expires_in")!) * 1000;
    setTimeout(function(){
      alert("Session Timeout: Back to Login Page");
      location.href = 'http://localhost:4200/';
    }, exp);
  }
  
  public searchMusic(){
    if (localStorage.getItem("back")=='true'){
      this.offset = localStorage.getItem("offset")!;
    } else{
      this.offset = '0';
    }
    var form = document.getElementById("form");
    var search_bar = document.getElementById("search-bar");

    //set the value that we get from the search bar to the local storage to save it
    localStorage.setItem("searchBar", this.searchBar);
    localStorage.setItem("back", 'false');
    localStorage.setItem("offset", this.offset);

    //if the value in the searchbar is not null 
    if (this.searchBar != ""){
      form!.style.top = "100px";
      search_bar!.style.textAlign = "left";
      
      //make the pagination appear
      document.getElementById("paginationTop")!.style.display = "block";
      document.getElementById("paginationBottom")!.style.display = "block";

      //get the access token
      var OAuth_Token = localStorage.getItem("access_token");

      var searchRes = this.searchRes;

      var grid = document.getElementById("grid-videos");

      var numberWithCommas = this.numberWithCommas;

      var currentRate = this.currentRate;
      var limit = this.limit;

        //start request to get the artists in the search
      function getData(){
        var artistSearch = new XMLHttpRequest();
        artistSearch.onload = function() {
          if (this.status == 200){
            var response = this.responseText;
            var res = JSON.parse(response);
            
            searchRes = res.artists.items;
            
            //loop over the array of artists searchRes and display each item of the array in a div
            searchRes.forEach(artist => {
              var div = document.createElement("div");
              div.style.border = "1px solid black";
              div.style.height = "max-content";
              div.style.width = "250px";
              
              var a = document.createElement("a");
              a.href = "/artist/" + artist.id + "/" + artist.name; //when div clicked, go to artist component with corresponding artist id
              a.style.textDecoration = "none";
              a.style.color = "black";

              var img = document.createElement("img");
              img.style.width="100%";
              img.style.height = "250px";
              img.style.borderBottom = "1px solid black";
              //if an image for the artist is available 
              if (artist.images[0] != undefined){
                img.src = artist.images[0].url; //set image to the available one
              } else{
                img.src = "assets/FMISProfilePic.png"; //set set it to default photo
              }
              a.appendChild(img);

              var divDesc = document.createElement("div");
              divDesc.style.paddingLeft = "1em";
              divDesc.style.marginTop = "10px";

              var title = document.createElement("p");
              title.innerHTML = artist.name; //display artist name
              title.style.fontSize = "20px";

              var followers = document.createElement("p");
              followers.innerHTML = numberWithCommas(artist.followers.total) + " followers"; //display total number of followers separated by comma
              followers.style.marginTop = "-12px";
              followers.style.fontSize = "12px";
              followers.style.color = "gray";

              divDesc.appendChild(title);
              divDesc.appendChild(followers);
              
              //set the star rating (1-5 stars)
              //since the artist popularity is over hundred -> convert it to be over 5 
              currentRate = artist.popularity * 5 / 100;

              var stars = document.createElement("div");
              stars.style.marginTop = "40px";
              stars.style.marginBottom = "10px";
              stars.style.fontSize = "25px";
              var star1 = document.createElement("span");
              
              //round the value of the star rating and output the correspoding stars accordingly
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

              localStorage.setItem("total", res.artists.total);
            }); 

          }else{
            //if error go back to login page
            alert("Error: Back to Login Page");
            location.href = 'http://localhost:4200/';
          }
        }
      grid!.innerHTML = ""; //set grid to empty when the search value changes
      var result = localStorage.getItem("searchBar");
      var search = encodeURIComponent(result!.trim()); //set the results of the searchbar to econde it to URI

      artistSearch.open("GET", "https://api.spotify.com/v1/search?q="+search+"&type=artist&offset="+localStorage.getItem("offset")+"&limit="+limit,true );
      artistSearch.setRequestHeader("Accept", "application/json");
      artistSearch.setRequestHeader("Content-Type", "application/json");
      artistSearch.setRequestHeader("Authorization", "Bearer " + OAuth_Token);
      artistSearch.send(null);
      }
      getData();
        
        //pagination actions
      var nextTop = document.getElementById("nextTop"); 
      var prevTop = document.getElementById("prevTop"); 
      var nextBottom = document.getElementById("nextBottom"); 
      var prevBottom = document.getElementById("prevBottom"); 
      
      nextTop!.onclick = function(){
        if (parseInt(localStorage.getItem("total")!) > 20){
          var numOffset = Number(localStorage.getItem("offset"));
          numOffset += limit;
          localStorage.setItem("offset", String(numOffset));
          getData();
        }
      }
      nextBottom!.onclick = function(){
        if (parseInt(localStorage.getItem("total")!) > 20){
          var numOffset = Number(localStorage.getItem("offset"));
          numOffset += limit;
          localStorage.setItem("offset", String(numOffset));
          getData();
        }
      }
      prevTop!.onclick = function(){
        if (Number(localStorage.getItem("offset")) > 0){
          var numOffset = Number(localStorage.getItem("offset"));
          numOffset -= limit;
          localStorage.setItem("offset", String(numOffset));
          getData();
        }
      }
      prevBottom!.onclick = function(){
        if (Number(localStorage.getItem("offset")) > 0){
          var numOffset = Number(localStorage.getItem("offset"));
          numOffset -= limit;
          localStorage.setItem("offset", String(numOffset));
          getData();
        }
      }
    } 
  }
  
  //put commas between big numbers
  public numberWithCommas(x:any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}