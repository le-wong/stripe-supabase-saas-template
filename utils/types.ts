export interface Course {
    courseId: string,
    courseName: string,
    stateTags: string,
    roleTags: string,
    userId: string,
    status: CourseStatus,
    description: string,
    progress: CourseProgress
}

export const enum CourseStatus {
    Active = "active",
    Inactive = "inactive",
    NotStarted = "not_started",
    Completed = "completed"
};

export interface CourseProgress {
    questionsAnswered: number,
    questionsCorrect: number,
    startedAt: Date
}