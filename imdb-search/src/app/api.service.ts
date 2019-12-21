import { Injectable } from '@angular/core';
import {  HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  
  
  constructor(private _http:HttpClient) { }

  search(queryString: any,filter:any) {
    console.log(queryString,filter);
      let _URL: string ="https://www.myapifilms.com/imdb/idIMDB?title="+ queryString+"&token=f9a8659c-977d-4c55-a793-4ef1fbcfb86a&format=json&language=en-us&aka=0&business=0&seasons=0&seasonYear=0&technical=0&filter="+filter+"&exactFilter=1&limit=1&forceYear=0&trailers=0&movieTrivia=0&awards=0&moviePhotos=0&movieVideos=0&actors=0&biography=0&uniqueName=0&filmography=0&bornAndDead=0&starSign=0&actorActress=1&actorTrivia=0&similarMovies=0&adultSearch=0&goofs=0&keyword=1&quotes=0&fullSize=0&companyCredits=0&filmingLocations=1";

      return this._http.get(_URL);
  }


  searchtop():Observable<any> {
   
    return this._http.get("https://www.myapifilms.com/imdb/top?token=f9a8659c-977d-4c55-a793-4ef1fbcfb86a&format=json&data=1");
}

}
