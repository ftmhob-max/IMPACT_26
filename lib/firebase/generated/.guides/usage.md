# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listPublishedCourses, getCourseBySlug, getLesson, getQuizQuestions, getInProgressAttempt, getUserCourseProgress, getLessonProgress, getUserCourseProgressFull, getUserAttemptHistory, getAttemptResults } from '@impact26/dataconnect-sdk';


// Operation ListPublishedCourses: 
const { data } = await ListPublishedCourses(dataConnect);

// Operation GetCourseBySlug:  For variables, look at type GetCourseBySlugVars in ../index.d.ts
const { data } = await GetCourseBySlug(dataConnect, getCourseBySlugVars);

// Operation GetLesson:  For variables, look at type GetLessonVars in ../index.d.ts
const { data } = await GetLesson(dataConnect, getLessonVars);

// Operation GetQuizQuestions:  For variables, look at type GetQuizQuestionsVars in ../index.d.ts
const { data } = await GetQuizQuestions(dataConnect, getQuizQuestionsVars);

// Operation GetInProgressAttempt:  For variables, look at type GetInProgressAttemptVars in ../index.d.ts
const { data } = await GetInProgressAttempt(dataConnect, getInProgressAttemptVars);

// Operation GetUserCourseProgress:  For variables, look at type GetUserCourseProgressVars in ../index.d.ts
const { data } = await GetUserCourseProgress(dataConnect, getUserCourseProgressVars);

// Operation GetLessonProgress:  For variables, look at type GetLessonProgressVars in ../index.d.ts
const { data } = await GetLessonProgress(dataConnect, getLessonProgressVars);

// Operation GetUserCourseProgressFull:  For variables, look at type GetUserCourseProgressFullVars in ../index.d.ts
const { data } = await GetUserCourseProgressFull(dataConnect, getUserCourseProgressFullVars);

// Operation GetUserAttemptHistory:  For variables, look at type GetUserAttemptHistoryVars in ../index.d.ts
const { data } = await GetUserAttemptHistory(dataConnect, getUserAttemptHistoryVars);

// Operation GetAttemptResults:  For variables, look at type GetAttemptResultsVars in ../index.d.ts
const { data } = await GetAttemptResults(dataConnect, getAttemptResultsVars);


```