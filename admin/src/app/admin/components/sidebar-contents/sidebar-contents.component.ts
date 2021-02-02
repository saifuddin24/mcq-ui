import { Component, OnInit } from '@angular/core';
import {NestedTreeControl} from "@angular/cdk/tree";
import {MatTreeNestedDataSource} from "@angular/material/tree";
import {Global} from "../../../../common/Global";

@Component({
  selector: 'sidebar-contents',
  templateUrl: './sidebar-contents.component.html',
  // template: `<div>ok</div>`,
  styleUrls: ['./sidebar-contents.component.css']
})
export class SidebarContentsComponent implements OnInit {

  treeControl = new NestedTreeControl<NavItem>(node => node.childNav );
  dataSource = new MatTreeNestedDataSource<NavItem>();

  hasChild = (_: number, node: NavItem) => !!node.childNav && node.childNav.length > 0;

  constructor() {
      this.dataSource.data = TREE_DATA;
  }

  ngOnInit(): void {
  }
}

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface NavItem {
  root?: boolean | false,
  navTitle: string;
  navLink: string;
  linkActiveExact?: boolean | false;
  childNav?: NavItem[];
}



const TREE_DATA: NavItem[] = [
  {
    root: true,
    navTitle: 'Dashboard',
    navLink: Global.adminBase + '/',
    linkActiveExact: true,
  },
  {
    root: true,
    navTitle: "Quiz",
    navLink: Global.adminBase + '/quizzes',
    childNav: [
      {
        navTitle: 'Quiz List',
        navLink: Global.adminBase + '/quizzes/list'
      },
      {
        navTitle: 'Add Quiz',
        navLink: Global.adminBase + '/quizzes/add'
      },
      {
        navTitle: 'Quiz Questions',
        navLink: Global.adminBase + '/quizzes/questions'
      }
    ]
  },
  {
    root: true,
    navTitle: "Subjects",
    navLink: Global.adminBase + '/subject/quiz-subject',
    childNav: [
      {
        navTitle: 'Quiz Subjects',
        navLink: Global.adminBase + '/subject/quiz-subject'
      },
      {
        navTitle: 'Add Quiz Subject',
        navLink: Global.adminBase + '/subject/add-quiz-subject',
      },
      {
        navTitle: 'Question Subjects',
        navLink: Global.adminBase + '/subject/question-subject'
      },
      {
        navTitle: 'Add Question Subject',
        navLink: Global.adminBase + '/subject/question-quiz-subject',
      },
    ]
  }

];
