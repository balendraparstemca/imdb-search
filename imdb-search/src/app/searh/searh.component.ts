
import { FormControl } from '@angular/forms';
import { ApiService } from '../api.service';
import { switchMap } from 'rxjs/operators';
import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { of } from "rxjs";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
import { fromEvent } from 'rxjs';

import { HttpClient, HttpParams } from "@angular/common/http";
 
const APIKEY = "84079d5c";
 
const PARAMS = new HttpParams({
  fromObject: {
    action: "opensearch",
    format: "json",
    origin: "*"
  }
});
 
@Component({
  selector: 'app-searh',
  templateUrl:'./searh.component.html',
  styleUrls: ['./searh.component.css']
})
export class SearhComponent implements OnInit {
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number;
  movie:any;
  resultsone: any[] = [];
  results: any[] = [];
  search:any;
  imdbid:any;
  moviename:any;
  filter:any;
  notfound:boolean=false;
  notfounddetails:boolean=false;
  url:any;
  termsecond:any='';
  
  @ViewChild('movieSearchInput',{static: false}) movieSearchInput: ElementRef;
 
  searchc: FormControl = new FormControl('all');
  apiResponse:any;
  isSearching:boolean;
  constructor(private _apiService: ApiService, private httpClient: HttpClient) { }
  ngOnInit() {
    /////by default top movies
  this._apiService.searchtop().subscribe((posRes:any)=>
  {    this.notfounddetails=false;
    if(posRes['error'])
    {
      this.notfounddetails=true;
      
    }

    this.results= posRes.data.movies;
  },(errRes)=>
  {
    console.log(errRes);
       

  })

 /////based on category all or movies or tv  for url
  switch(this.searchc.value)
  {
  case "all":
      this.filter=2;
       break;
  case "tv":
      this.filter=5;
      break;
  case "movie":
      this.filter=3;
      break;
  case "videogame":
    this.filter=6;
    break;
  default:
      this.filter=2;

  }
 
  
  
  }
///////////////get movie id and nmae ot store in localstorage
 getid(id:any,name:any)
 {
   this.imdbid=id;
   this.moviename=name;
   console.log(this.imdbid);
 }
 ////////////////////review in star
  countStar(star) {
    this.selectedValue = star;
   
  }
  ///////store movie name and star in localstorage
storestar()
{
  localStorage.movie=JSON.stringify({ImdbId:this.imdbid,moviename:this.moviename});
  console.log(localStorage.movie);
}
//////////when image is not found set by default imdb img
  onImgError(event) { 
    event.target.src = 'https://i.ytimg.com/vi/NYIfU1agZG0/hqdefault.jpg';
}
/////////////suggestion based on search using rxjs

ngAfterViewInit() {
  fromEvent(this.movieSearchInput.nativeElement, 'keyup').pipe(
    // get value
    map((event: any) => {
      return event.target.value;
    })
    // if character length greater then 2
   
    // Time in milliseconds between key events
    ,debounceTime(800)        
    // If previous query is diffent from current   
    ,distinctUntilChanged()
    // subscription for response
    ).subscribe((text: string) => {
      this.isSearching = true;
       
      this.searchGetCall(text).subscribe((res)=>{
        this.notfound=false;
        console.log('res',res);
        this.isSearching = false;
        if(res['error'])
        { 
           this.notfound=true;
            this.apiResponse=res;

            return 0;
        }
          if(Array.isArray(res))
          {
            this.resultsone=res;
            
          }
          else{
          this.resultsone=res['data'].movies;
          }
      
      },(err)=>{
        this.isSearching = false;
        console.log('error',err);
      });
    });
}
////////////calling rest api for suggestion
searchGetCall(term: string) {
  if (term === '') {
    return of([]);
  }
  this.termsecond=term;
  console.log(term,this.filter);
  this.url="https://www.myapifilms.com/imdb/idIMDB?title="+term+"&token=f9a8659c-977d-4c55-a793-4ef1fbcfb86a&format=json&language=en-us&aka=0&business=0&seasons=0&seasonYear=0&technical=0&filter="+ this.filter +"&exactFilter=0&limit=4&forceYear=0&trailers=0&movieTrivia=0&awards=0&moviePhotos=0&movieVideos=0&actors=0&biography=0&uniqueName=0&filmography=0&bornAndDead=0&starSign=0&actorActress=1&actorTrivia=0&similarMovies=0&adultSearch=0&goofs=0&keyword=1&quotes=0&fullSize=0&companyCredits=0&filmingLocations=0";
  return this.httpClient.get(this.url);
}
///////////////when search button clicked
public searchkeyword(termse:any)
{  
   console.log(termse);
  if (termse === '') 
      {
        this.resultsone=[];

        return of([]);
      }
  this.movieSearchInput.nativeElement.value="";
   this.resultsone=[];
  this._apiService.search(termse,this.filter).subscribe((posRes)=>
  {  this.notfounddetails=false;
    if(posRes['error'])
    {
      this.notfounddetails=true;
      
    }

    this.results= posRes['data'].movies;
    
    console.log(this.results)
  },(errRes)=>
  {
    console.log(errRes);
       

  })
}



}
