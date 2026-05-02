
import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getAnsweredQuestions, getCourseProgress, getCourseQuestions, getUnattemptedCourseQuestions } from './actions';
import { CourseProgressCard } from '@/components/CourseProgressCard';
import { Question } from '@/utils/types';
import CourseBlock from './course-block';

export default async function WebCourse(request: NextRequest) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }
    //console.log(data.user)
    const userId = data.user.id;

    const headerList = headers();
    const courseInfo = JSON.parse((await headerList).get('x-query') || "");
    const courseProgress = (await getCourseProgress(courseInfo.id, userId)).at(0) ?? {
        courseName: "",
        questionsAnswered: 0,
        questionsTotal: 0
    }
    //console.log(courseInfo)
    //console.log(courseProgress)
    const courseQuestions = await getCourseQuestions(courseInfo.id);
    const startingQuestion = (await getUnattemptedCourseQuestions(courseInfo.id, userId)).at(0)?.number;
    const answeredQuestions = await getAnsweredQuestions(courseInfo.id, userId);
    const fixedCourseQuestions: Map<number, Question> = new Map();
    const answeredQuestionSet: Set<number> = new Set();
    for (const question of courseQuestions) {
        const mapQuestion = fixedCourseQuestions.get(question.number);
        const answered = answeredQuestions.get(question.id);
        const isAnswered = answered ? (answered.length > 0 ? true : false) : false
        if (mapQuestion) {
            mapQuestion.choices.push({
                id: question.choiceId ?? "",
                choiceNumber: question.choiceNumber ?? -1,
                choiceText: question.choiceText ?? "",
                userChose: answered === question.choiceId
            });
        }
        else {
            fixedCourseQuestions.set(question.number, {
                id: question.id,
                number: question.number,
                text: question.text,
                choices: [{
                    id: question.choiceId ?? "",
                    choiceNumber: question.choiceNumber ?? -1,
                    choiceText: question.choiceText ?? "",
                    userChose: answered === question.choiceId
                }],
            })
            if (isAnswered) {
                answeredQuestionSet.add(question.number);
            }
        }
    }
    //console.log(fixedCourseQuestions)


    return (
        <>
            {fixedCourseQuestions.size > 0 ? <CourseBlock
                courseId={courseInfo.id}
                courseName={courseProgress.courseName ?? ""}
                userId={userId}
                questions={Array.from(fixedCourseQuestions.values())}
                answeredQuestions={answeredQuestionSet}
                startIndex={startingQuestion ? startingQuestion - 1 : 0} />
                : <span className="px-4">Oh no... our (questions) table... it's broken........</span>
            }
        </>
    )
}