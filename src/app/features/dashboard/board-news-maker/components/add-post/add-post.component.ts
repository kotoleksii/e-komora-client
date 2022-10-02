import { Component, OnInit } from '@angular/core';
import {PostService} from '../../../../../shared/_services/post.service';
import {IPost} from '../../../../../shared/interfaces/Post';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent implements OnInit {

  tutorial: IPost = {
    title: '',
    description: '',
    published: false
  };
  submitted = false;

  constructor(private tutorialService: PostService) { }

  saveTutorial(): void {
    const data = {
      title: this.tutorial.title,
      description: this.tutorial.description
    };

    this.tutorialService.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
        },
        error: (e) => console.error(e)
      });
  }

  newTutorial(): void {
    this.submitted = false;
    this.tutorial = {
      title: '',
      description: '',
      published: false
    };
  }

  ngOnInit(): void {
  }

}
