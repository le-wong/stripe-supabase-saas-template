export interface Course {
    courseId: string,
    courseName: string,
    userId: string,
    status: CourseStatus,
    description: string,
}

export const enum CourseStatus {
    Active = "active",
    Inactive = "inactive",
    NotStarted = "not_started",
    Completed = "completed"
};