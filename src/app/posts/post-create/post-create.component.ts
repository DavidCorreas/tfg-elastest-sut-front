import { Component } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html'
})
export class PostCreateComponent {
  newPost = 'NO CONTENT';
  enteredValue = '';

  // onAddPost(postInput: HTMLTextAreaElement) {
  //   console.dir(postInput);
  //   this.newPost = postInput.value;
  // }

  onAddPost() {
    this.newPost = this.enteredValue;
  }

}
