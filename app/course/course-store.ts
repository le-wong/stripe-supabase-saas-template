import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { QuestionChoice } from '@/utils/types';
import { PcCase } from "lucide-react";

interface CourseState {
    courseInfo: {
        courseId: string,
        courseName: string
    }
    questionAnswers: Map<string, QuestionChoice>;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
    setCourse: (courseId: string, name: string) => void;
    addAnswer: (question: string, item: QuestionChoice) => void;
    removeAnswer: (question: string) => void;
    clearCache: () => void;
}

export const useCourseStore = create<CourseState>()(
    persist(
        (set) => ({
            courseInfo: {
                courseId: "",
                courseName: ""
            },
            questionAnswers: new Map(),
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
            setCourse: (courseId, name) =>
                set((state) => {
                    return {
                        courseInfo: {
                            courseId: courseId,
                            courseName: name
                        }
                    }
                }),
            addAnswer: (question, choice) =>
                set((state) => {
                    const updatedQuestions = new Map(state.questionAnswers);
                    updatedQuestions.set(question, choice);
                    return {
                        questionAnswers: updatedQuestions
                    };
                }),
            removeAnswer: (question) =>
                set((state) => {
                    const updatedQuestions = new Map(state.questionAnswers);
                    updatedQuestions.delete(question);
                    return {
                        questionAnswers: updatedQuestions
                    };
                }),
            clearCache: () =>
                set(() => {
                    return {
                        courseInfo: {
                            courseId: "",
                            courseName: ""
                        },
                        questionAnswers: new Map()
                    };
                }),
        }),
        {
            name: "course",
            //skipHydration: true,

            //merge: (persistedState, currentState) => ({ ...currentState, ...(persistedState as CourseState) }),
            /*
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
            storage: createJSONStorage(() => typeof document !== 'undefined' ? localStorage : {
                getItem: () => null,
                setItem: () => { },
                removeItem: () => { },
            })
                */
        }
    )
);