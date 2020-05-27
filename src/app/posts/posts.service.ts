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

  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http
      .get<{message: string, posts: any}>('http://localhost:3000/api/posts/' + queryParams)
      .pipe(map((postsData) => {
        return postsData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
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
    return this.http
      .get<{ _id: string, title: string, content: string, imagePath: string }>('http://localhost:3000/api/posts/' + postId);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title)
    postData.append('content', content)
    postData.append('image', image, title);
    this.http.post<{post: Post, message: string}>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        }
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      })
  }

  updatePost(postId: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', postId);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: postId,
        title: title,
        content: content,
        imagePath: image
      }
    }
    this.http.put<{ message: string, imagePath: string }>('http://localhost:3000/api/posts/' + postId, postData)
      .subscribe( response => {
        console.log(response.message);
        const updatedPosts = [...this.posts]
        const oldPostIndex = updatedPosts.findIndex( p => p.id === postId );
        const post: Post = {
          id: postId,
          title: title,
          content: content,
          imagePath: response.imagePath
        }
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
