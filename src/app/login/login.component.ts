import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }
  
  //perform Implicit Grant authentication flow

  client_id = "ae76e3353c924f5f91a7f9d64f7a8d5f"; //client id from spotify api
  redirect_uri = "http://localhost:4200/"; //redirect link
  
  //request authorization by going to following link with following parameters
  public requestAuthorization() {   
    var queryStringData = {
      client_id : this.client_id,
      response_type : "token",
      redirect_uri :  encodeURI("http://localhost:4200"),
      show_dialog :true
    }
    window.location.replace(`https://accounts.spotify.com/authorize?` + $.param(queryStringData));
  }  
  
  ngOnInit(): void { 
    //mouse hover over button
    document.getElementById("login")!.onmouseover = function(){
      document.getElementById("logo")!.setAttribute("src", "assets/Spotify-logo - white.png");
      document.getElementById("text")!.style.color = "white";
    }
    document.getElementById("login")!.onmouseleave = function(){
      document.getElementById("logo")!.setAttribute("src", "assets/Spotify-logo.png");
      document.getElementById("text")!.style.color = "grey";
    }
    
    //reset the offset and searchbar 
    localStorage.setItem("offset", '0');
    localStorage.setItem("offsetAlbums", '0');
    localStorage.setItem("searchBar", '');    

    if (window.location.hash) {
        var token = getParameterByName('access_token'); //get access token
        var exp = getParameterByName('expires_in'); //get the time is expires in

        localStorage.setItem("access_token", token);
        localStorage.setItem("expires_in", exp);
        
        //redirect to search component
        location.href = this.redirect_uri+"search";
    } 
    //if there is a parameter of 'error' in the go back to login page
    else if (new URLSearchParams(window.location.search).get('error')){
      alert("Error: Access Denied");
      location.href = this.redirect_uri;
    }

    //get parameter from URL
    function getParameterByName(name: string) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\#&]" + name + "=([^&#]*)"),
        results = regex.exec(location.hash);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
  }
}