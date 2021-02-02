import {QuizCourse} from "../models/QuizCourse";

export class QuizCoursesServices {
  getCources( ):QuizCourse[]{

    return [
        { id: 1, title: "Mathematics", description:""},
        { id: 2, title: "General Knowledge", description:""},
        { id: 3, title: "English", description:"" },
        { id: 4, title: "Bangla", description: ""}
      ];
  }
}
