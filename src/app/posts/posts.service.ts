import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Post } from './post.model';

const BACKEND_URL = environment.apiUrl + '/posts';

// Solo creara una instancia de esto en la app
// Tambien se puede quitar este decorator y meter 'PostsService' en el appModule, en el array de providers
@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + '/' + queryParams
      )
      .pipe(
        map((postsData) => {
          return {
            posts: postsData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: postsData.maxPosts,
          };
        })
      )
      .subscribe(transPostsData => {
        this.posts = transPostsData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transPostsData.maxPosts,
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(postId: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string
    }>(BACKEND_URL + '/' + postId);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ post: Post; message: string }>(
        BACKEND_URL,
        postData
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  updatePost(
    postId: string,
    title: string,
    content: string,
    image: File | string
  ) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
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
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put<{ message: string; imagePath: string }>(
        BACKEND_URL + '/' + postId,
        postData
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
     return this.http
      .delete<{ message: string }>(BACKEND_URL + '/' + postId);
  }
}
