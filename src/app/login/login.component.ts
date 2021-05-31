import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }
  
  client_id = "ae76e3353c924f5f91a7f9d64f7a8d5f"; 
  client_secret = "fc3607837db84a739b6c5d6a34ce783b"; 
  access_token = "";
  refresh_token = "";
  AUTHORIZE = "https://accounts.spotify.com/authorize";
  TOKEN = "https://accounts.spotify.com/api/token";

  ngOnInit(): void { 
    if ( window.location.search.length > 0 ){
      let code = null;
      const queryString = window.location.search;
      if ( queryString.length > 0 ){
          const urlParams = new URLSearchParams(queryString);
          code = urlParams.get('code');

          let body = "grant_type=authorization_code";
          body += "&code=" + code; 
          body += "&redirect_uri=" + encodeURI("http://localhost:4200/");
          body += "&client_id=" + this.client_id;
          body += "&client_secret=" + this.client_secret;

          let access_token = this.access_token;
          let refresh_token = this.refresh_token;

          let xhr = new XMLHttpRequest();
          xhr.onload = function(){
            if ( this.status == 200 ){
              var data = JSON.parse(this.responseText);
              console.log(data);
              var data = JSON.parse(this.responseText);
              if ( data.access_token != undefined ){
                  access_token = data.access_token;
                  localStorage.setItem("access_token", access_token);
              }
              if ( data.refresh_token  != undefined ){
                  refresh_token = data.refresh_token;
                  localStorage.setItem("refresh_token", refresh_token);
              }
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
          window.history.pushState("", "", "/search"); // remove param from url
      }
    }
  }
  
  public requestAuthorization() {
    localStorage.setItem("client_id", this.client_id);
    localStorage.setItem("client_secret", this.client_secret); 
    
    let url = this.AUTHORIZE;
    url += "?client_id=" + this.client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI("http://localhost:4200/");
    url += "&show_dialog=true";
    window.location.href = url; 
  }  
}