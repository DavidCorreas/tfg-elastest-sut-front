import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Post } from './post.model'

// Solo creara una instancia de esto en la app
// Tambien se puede quitar este decorator y meter 'PostsService' en el appModule, en el array de providers
@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postsData) => {
        return postsData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post.id
          }
        })
      }))
      .subscribe((transPosts) => {
        this.posts = transPosts;
        this.postsUpdated.next([...this.posts])
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      title: title,
      content: content
    };
    this.http.post<{message: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      })
  }
}
