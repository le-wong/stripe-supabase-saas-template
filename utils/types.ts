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

export const CourseStatusFrom = (enumObj: CourseStatus) => ({
    toString: () => {
        switch (enumObj) {
            case CourseStatus.Active: {
                return "Active";
            }
            case CourseStatus.Completed: {
                return "Completed";
            }
            case CourseStatus.Inactive: {
                return "Inactive";
            }
            case CourseStatus.NotStarted: {
                return "Not Started";
            }
            default: {
                return "Invalid";
            }
        }
    }
})

export interface CourseProgress {
    questionsAnswered: number,
    questionsCorrect: number,
    questionsTotal: number,
    startedAt: Date,
    completedAt: Date | null
}

export interface Question {
    id: string,
    number: number,
    text: string,
    choices: QuestionChoice[],
}

export interface QuestionChoice {
    id: string,
    choiceNumber: number,
    choiceText: string,
    userChose: boolean
}

export interface License {
    id: string,
    type: string,
    number: string,
    state: string
}

export enum SupportedLicenseTypes {
    Electrician = "Electrician",
    Plumber = "Plumber",
    Contractor = "Contractor",
    HVAC = "HVAC"
}

export enum SupportedStates {
    CA = "CA",
    FL = "FL",
    NY = "NY",
    OR = "OR",
    TX = "TX",
    WA = "WA",
}

export enum AllStates {
    AL = "AL",
    AK = "AK",
    AZ = "AZ",
    AR = "AR",
    CA = "CA",
    CO = "CO",
    CT = "CT",
    DE = "DE",
    FL = "FL",
    GA = "GA",
    HI = "HI",
    ID = "ID",
    IL = "IL",
    IN = "IN",
    IA = "IA",
    KS = "KS",
    KY = "KY",
    LA = "LA",
    ME = "ME",
    MD = "MD",
    MA = "MA",
    MI = "MI",
    MN = "MN",
    MS = "MS",
    MO = "MO",
    MT = "MT",
    NE = "NE",
    NV = "NV",
    NH = "NH",
    NJ = "NJ",
    NM = "NM",
    NY = "NY",
    NC = "NC",
    ND = "ND",
    OH = "OH",
    OK = "OK",
    OR = "OR",
    PA = "PA",
    RI = "RI",
    SC = "SC",
    SD = "SD",
    TN = "TN",
    TX = "TX",
    UT = "UT",
    VT = "VT",
    VA = "VA",
    WA = "WA",
    WV = "WV",
    WI = "WI",
    WY = "WY"
}