import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Post } from './post.model'

// Solo creara una instancia de esto en la app
// Tambien se puede quitar este decorator y meter 'PostsService' en el appModule, en el array de providers
@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postsData) => {
        return postsData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
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

  getPost(postId: string) {
    return this.http.get<{ _id: string, title: string, content: string }>('http://localhost:3000/api/posts/' + postId);
  }

  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      title: title,
      content: content
    };
    this.http.post<{postId: string, message: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
        post.id = responseData.postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      })
  }

  updatePost(postId: string, title: string, content: string) {
    const post: Post = {
      id: postId,
      title: title,
      content: content
    };
    this.http.put<{ message: string}>('http://localhost:3000/api/posts/' + postId, post)
      .subscribe( response => {
        console.log(response.message);
        const updatedPosts = [...this.posts]
        const oldPostIndex = updatedPosts.findIndex( p => p.id === postId );
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      })
  }

  deletePost(postId: string) {
    this.http.delete<{ message: string }>('http://localhost:3000/api/posts/' + postId)
      .subscribe( response => {
        console.log(response.message)
        const updatedPosts = this.posts.filter( post => post.id !== postId );
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      })
  }
}
