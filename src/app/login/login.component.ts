import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }
  
  client_id = "ae76e3353c924f5f91a7f9d64f7a8d5f"; //client id from spotify api
  client_secret = "fc3607837db84a739b6c5d6a34ce783b"; //client secret from apofity api
  access_token = "";
  refresh_token = "";
  AUTHORIZE = "https://accounts.spotify.com/authorize"; //authorization link
  TOKEN = "https://accounts.spotify.com/api/token"; //token link
  redirect_uri = "http://localhost:4200/"; //redirect link

  //request authorization by going to following link with following parameters
  public requestAuthorization() {   
    let url = this.AUTHORIZE;
    url += "?client_id=" + this.client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(this.redirect_uri);
    url += "&show_dialog=true";
    window.location.href = url; 
  }  

  ngOnInit(): void { 
    //if url's length is greater than 0 
    if ( window.location.search.length > 0 ){
      let code = null;
      const queryString = window.location.search;
      if ( queryString.length > 0 ){
          //get the parameters from the url 
          const urlParams = new URLSearchParams(queryString);
          //set the parameter of 'code' to code
          code = urlParams.get('code');

          //body of request to get access token and refresh token
          let body = "grant_type=authorization_code";
          body += "&code=" + code; 
          body += "&redirect_uri=" + encodeURI(this.redirect_uri);
          body += "&client_id=" + this.client_id;
          body += "&client_secret=" + this.client_secret;

          let access_token = this.access_token;
          let refresh_token = this.refresh_token;
          let token = this.TOKEN;
          let clientId = this.client_id;

          //start request to push token 
          let xhr = new XMLHttpRequest();
          xhr.onload = function(){
            if ( this.status == 200 ){              
              var data = JSON.parse(this.responseText);
              if ( data.access_token != undefined ){
                  //get access token and put it in local storage to save it
                  access_token = data.access_token;
                  localStorage.setItem("access_token", access_token);
              }
              if ( data.refresh_token  != undefined ){
                  //get refresh token and put it in local storage to save it
                  refresh_token = data.refresh_token;
                  localStorage.setItem("refresh_token", refresh_token);
              }
              //get expiration date of the access token and change it to Int
              var exp = parseInt(data.expires_in);
              
              //after the duration of the expiration time finishes then change the access token's value in the local storage to be that of the refresh token
              setInterval(function(){
                console.log("Refresh Token");
                let send = 'grant_type=refresh_token';
                send += 'refresh_token=' + localStorage.getItem(refresh_token);
                send += 'client_id=' + clientId;

                let refresh = new XMLHttpRequest();
                refresh.onload = function(){ 
                  localStorage.setItem("access_token", refresh_token);
                  location.reload();
                };
                refresh.open("POST", token, true);
                refresh.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                refresh.send(send);
              },exp);
              
              //refresh page
              location.reload();
            }
            else {
                console.log(this.responseText);
                alert(this.responseText);
            }
          };
          xhr.open("POST", this.TOKEN, true);
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          xhr.setRequestHeader('Authorization', 'Basic ' + btoa(this.client_id + ":" + this.client_secret));
          xhr.send(body);
          window.history.pushState("", "", "/search"); // remove param from url and go to search component
      }
    }
  }
}