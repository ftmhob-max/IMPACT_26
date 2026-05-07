# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `impact26-connector`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListPublishedCourses*](#listpublishedcourses)
  - [*GetCourseBySlug*](#getcoursebyslug)
  - [*GetLesson*](#getlesson)
  - [*GetQuizQuestions*](#getquizquestions)
  - [*GetInProgressAttempt*](#getinprogressattempt)
  - [*GetUserCourseProgress*](#getusercourseprogress)
  - [*GetLessonProgress*](#getlessonprogress)
  - [*GetUserCourseProgressFull*](#getusercourseprogressfull)
  - [*GetUserAttemptHistory*](#getuserattempthistory)
  - [*GetAttemptResults*](#getattemptresults)
  - [*GetFormulaSections*](#getformulasections)
  - [*GetUserProgressDetails*](#getuserprogressdetails)
  - [*ListAdminQuizzes*](#listadminquizzes)
  - [*GetQuizQuestionCount*](#getquizquestioncount)
  - [*GetQuizQuestionsAdmin*](#getquizquestionsadmin)
  - [*GetAttemptForEvaluation*](#getattemptforevaluation)
  - [*GetQuestionWithAnswers*](#getquestionwithanswers)
  - [*GetQuizQuestionPointValue*](#getquizquestionpointvalue)
  - [*GetAttemptForCompletion*](#getattemptforcompletion)
  - [*GetAttemptOwner*](#getattemptowner)
  - [*AdminListQuestions*](#adminlistquestions)
  - [*AdminListQuestionsPage*](#adminlistquestionspage)
  - [*AdminCountQuestions*](#admincountquestions)
  - [*AdminListQuizQuestionUsage*](#adminlistquizquestionusage)
  - [*AdminListCourses*](#adminlistcourses)
  - [*GetLessonVersions*](#getlessonversions)
  - [*AdminListSourceMaterials*](#adminlistsourcematerials)
  - [*AdminListUsers*](#adminlistusers)
  - [*AdminCohortStats*](#admincohortstats)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*UpdateUserRole*](#updateuserrole)
  - [*CreateCourse*](#createcourse)
  - [*UpdateCourse*](#updatecourse)
  - [*CreateModule*](#createmodule)
  - [*UpdateModule*](#updatemodule)
  - [*CreateLessonVersion*](#createlessonversion)
  - [*CreateLesson*](#createlesson)
  - [*UpdateLesson*](#updatelesson)
  - [*DeleteLesson*](#deletelesson)
  - [*DeleteModule*](#deletemodule)
  - [*DeleteLessonVersionsForLesson*](#deletelessonversionsforlesson)
  - [*DeleteSourceLinksForLesson*](#deletesourcelinksforlesson)
  - [*DeleteSourceLinksForQuestion*](#deletesourcelinksforquestion)
  - [*DeleteSourceLinksForMaterial*](#deletesourcelinksformaterial)
  - [*DeleteUserLessonProgressForLesson*](#deleteuserlessonprogressforlesson)
  - [*DeleteIngestionJobsForMaterial*](#deleteingestionjobsformaterial)
  - [*DeleteSourceMaterial*](#deletesourcematerial)
  - [*CreateSourceMaterial*](#createsourcematerial)
  - [*CreateIngestionJob*](#createingestionjob)
  - [*CreateQuestion*](#createquestion)
  - [*UpdateQuestion*](#updatequestion)
  - [*UpdateQuestionStatus*](#updatequestionstatus)
  - [*CreateAnswerChoice*](#createanswerchoice)
  - [*UpdateAnswerChoice*](#updateanswerchoice)
  - [*DeleteAnswerChoicesForQuestion*](#deleteanswerchoicesforquestion)
  - [*DeleteQuizQuestionsForQuestion*](#deletequizquestionsforquestion)
  - [*DeleteQuestion*](#deletequestion)
  - [*CreateQuiz*](#createquiz)
  - [*AddQuestionToQuiz*](#addquestiontoquiz)
  - [*UpdateQuizStatus*](#updatequizstatus)
  - [*DeleteQuizQuestionsForQuiz*](#deletequizquestionsforquiz)
  - [*DeleteQuizResponsesForQuiz*](#deletequizresponsesforquiz)
  - [*DeleteQuizAttemptsForQuiz*](#deletequizattemptsforquiz)
  - [*DeleteQuiz*](#deletequiz)
  - [*EnrollInCourse*](#enrollincourse)
  - [*UpsertLessonProgress*](#upsertlessonprogress)
  - [*CreateQuizAttempt*](#createquizattempt)
  - [*UpsertQuizResponse*](#upsertquizresponse)
  - [*CompleteQuizAttempt*](#completequizattempt)
  - [*MarkAnsweredAt*](#markansweredat)
  - [*CreateFormulaSection*](#createformulasection)
  - [*CreateFormula*](#createformula)
  - [*CreateContentSourceLink*](#createcontentsourcelink)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `impact26-connector`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@impact26/dataconnect-sdk` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@impact26/dataconnect-sdk';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@impact26/dataconnect-sdk';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `impact26-connector` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListPublishedCourses
You can execute the `ListPublishedCourses` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listPublishedCourses(options?: ExecuteQueryOptions): QueryPromise<ListPublishedCoursesData, undefined>;

interface ListPublishedCoursesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublishedCoursesData, undefined>;
}
export const listPublishedCoursesRef: ListPublishedCoursesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPublishedCourses(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPublishedCoursesData, undefined>;

interface ListPublishedCoursesRef {
  ...
  (dc: DataConnect): QueryRef<ListPublishedCoursesData, undefined>;
}
export const listPublishedCoursesRef: ListPublishedCoursesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPublishedCoursesRef:
```typescript
const name = listPublishedCoursesRef.operationName;
console.log(name);
```

### Variables
The `ListPublishedCourses` query has no variables.
### Return Type
Recall that executing the `ListPublishedCourses` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPublishedCoursesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPublishedCoursesData {
  courses: ({
    id: UUIDString;
    slug: string;
    title: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    createdBy: {
      fullName?: string | null;
    };
  } & Course_Key)[];
}
```
### Using `ListPublishedCourses`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPublishedCourses } from '@impact26/dataconnect-sdk';


// Call the `listPublishedCourses()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPublishedCourses();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPublishedCourses(dataConnect);

console.log(data.courses);

// Or, you can use the `Promise` API.
listPublishedCourses().then((response) => {
  const data = response.data;
  console.log(data.courses);
});
```

### Using `ListPublishedCourses`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPublishedCoursesRef } from '@impact26/dataconnect-sdk';


// Call the `listPublishedCoursesRef()` function to get a reference to the query.
const ref = listPublishedCoursesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPublishedCoursesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.courses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.courses);
});
```

## GetCourseBySlug
You can execute the `GetCourseBySlug` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getCourseBySlug(vars: GetCourseBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetCourseBySlugData, GetCourseBySlugVariables>;

interface GetCourseBySlugRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCourseBySlugVariables): QueryRef<GetCourseBySlugData, GetCourseBySlugVariables>;
}
export const getCourseBySlugRef: GetCourseBySlugRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCourseBySlug(dc: DataConnect, vars: GetCourseBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetCourseBySlugData, GetCourseBySlugVariables>;

interface GetCourseBySlugRef {
  ...
  (dc: DataConnect, vars: GetCourseBySlugVariables): QueryRef<GetCourseBySlugData, GetCourseBySlugVariables>;
}
export const getCourseBySlugRef: GetCourseBySlugRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCourseBySlugRef:
```typescript
const name = getCourseBySlugRef.operationName;
console.log(name);
```

### Variables
The `GetCourseBySlug` query requires an argument of type `GetCourseBySlugVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCourseBySlugVariables {
  slug: string;
}
```
### Return Type
Recall that executing the `GetCourseBySlug` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCourseBySlugData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCourseBySlugData {
  courses: ({
    id: UUIDString;
    slug: string;
    title: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    modules_on_course: ({
      id: UUIDString;
      title: string;
      position: number;
      prerequisiteModuleIds?: string | null;
      lessons_on_module: ({
        id: UUIDString;
        title: string;
        position: number;
        lessonType: string;
        durationSeconds?: number | null;
        videoPlaybackId?: string | null;
        videoUrl?: string | null;
        quiz?: {
          id: UUIDString;
        } & Quiz_Key;
      } & Lesson_Key)[];
    } & Module_Key)[];
  } & Course_Key)[];
}
```
### Using `GetCourseBySlug`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCourseBySlug, GetCourseBySlugVariables } from '@impact26/dataconnect-sdk';

// The `GetCourseBySlug` query requires an argument of type `GetCourseBySlugVariables`:
const getCourseBySlugVars: GetCourseBySlugVariables = {
  slug: ..., 
};

// Call the `getCourseBySlug()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCourseBySlug(getCourseBySlugVars);
// Variables can be defined inline as well.
const { data } = await getCourseBySlug({ slug: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCourseBySlug(dataConnect, getCourseBySlugVars);

console.log(data.courses);

// Or, you can use the `Promise` API.
getCourseBySlug(getCourseBySlugVars).then((response) => {
  const data = response.data;
  console.log(data.courses);
});
```

### Using `GetCourseBySlug`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCourseBySlugRef, GetCourseBySlugVariables } from '@impact26/dataconnect-sdk';

// The `GetCourseBySlug` query requires an argument of type `GetCourseBySlugVariables`:
const getCourseBySlugVars: GetCourseBySlugVariables = {
  slug: ..., 
};

// Call the `getCourseBySlugRef()` function to get a reference to the query.
const ref = getCourseBySlugRef(getCourseBySlugVars);
// Variables can be defined inline as well.
const ref = getCourseBySlugRef({ slug: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCourseBySlugRef(dataConnect, getCourseBySlugVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.courses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.courses);
});
```

## GetLesson
You can execute the `GetLesson` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getLesson(vars: GetLessonVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonData, GetLessonVariables>;

interface GetLessonRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLessonVariables): QueryRef<GetLessonData, GetLessonVariables>;
}
export const getLessonRef: GetLessonRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLesson(dc: DataConnect, vars: GetLessonVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonData, GetLessonVariables>;

interface GetLessonRef {
  ...
  (dc: DataConnect, vars: GetLessonVariables): QueryRef<GetLessonData, GetLessonVariables>;
}
export const getLessonRef: GetLessonRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLessonRef:
```typescript
const name = getLessonRef.operationName;
console.log(name);
```

### Variables
The `GetLesson` query requires an argument of type `GetLessonVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLessonVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetLesson` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLessonData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetLessonData {
  lesson?: {
    id: UUIDString;
    title: string;
    lessonType: string;
    contentJson?: string | null;
    videoPlaybackId?: string | null;
    videoUrl?: string | null;
    durationSeconds?: number | null;
    quiz?: {
      id: UUIDString;
      title: string;
      timeLimitSeconds?: number | null;
      shuffleQuestions: boolean;
      shuffleChoices: boolean;
    } & Quiz_Key;
      module: {
        course: {
          slug: string;
          title: string;
        };
      };
  } & Lesson_Key;
}
```
### Using `GetLesson`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLesson, GetLessonVariables } from '@impact26/dataconnect-sdk';

// The `GetLesson` query requires an argument of type `GetLessonVariables`:
const getLessonVars: GetLessonVariables = {
  id: ..., 
};

// Call the `getLesson()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLesson(getLessonVars);
// Variables can be defined inline as well.
const { data } = await getLesson({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLesson(dataConnect, getLessonVars);

console.log(data.lesson);

// Or, you can use the `Promise` API.
getLesson(getLessonVars).then((response) => {
  const data = response.data;
  console.log(data.lesson);
});
```

### Using `GetLesson`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLessonRef, GetLessonVariables } from '@impact26/dataconnect-sdk';

// The `GetLesson` query requires an argument of type `GetLessonVariables`:
const getLessonVars: GetLessonVariables = {
  id: ..., 
};

// Call the `getLessonRef()` function to get a reference to the query.
const ref = getLessonRef(getLessonVars);
// Variables can be defined inline as well.
const ref = getLessonRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLessonRef(dataConnect, getLessonVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.lesson);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.lesson);
});
```

## GetQuizQuestions
You can execute the `GetQuizQuestions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getQuizQuestions(vars: GetQuizQuestionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionsData, GetQuizQuestionsVariables>;

interface GetQuizQuestionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuizQuestionsVariables): QueryRef<GetQuizQuestionsData, GetQuizQuestionsVariables>;
}
export const getQuizQuestionsRef: GetQuizQuestionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getQuizQuestions(dc: DataConnect, vars: GetQuizQuestionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionsData, GetQuizQuestionsVariables>;

interface GetQuizQuestionsRef {
  ...
  (dc: DataConnect, vars: GetQuizQuestionsVariables): QueryRef<GetQuizQuestionsData, GetQuizQuestionsVariables>;
}
export const getQuizQuestionsRef: GetQuizQuestionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getQuizQuestionsRef:
```typescript
const name = getQuizQuestionsRef.operationName;
console.log(name);
```

### Variables
The `GetQuizQuestions` query requires an argument of type `GetQuizQuestionsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetQuizQuestionsVariables {
  quizId: UUIDString;
}
```
### Return Type
Recall that executing the `GetQuizQuestions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetQuizQuestionsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetQuizQuestionsData {
  quizQuestions: ({
    position: number;
    pointValue: number;
    question: {
      id: UUIDString;
      questionText: string;
      difficulty: string;
      domain: string;
      formulaRef?: string | null;
      isMultiselect: boolean;
      answerChoices_on_question: ({
        id: UUIDString;
        letter: string;
        choiceText: string;
        position: number;
      } & AnswerChoice_Key)[];
    } & Question_Key;
  })[];
}
```
### Using `GetQuizQuestions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getQuizQuestions, GetQuizQuestionsVariables } from '@impact26/dataconnect-sdk';

// The `GetQuizQuestions` query requires an argument of type `GetQuizQuestionsVariables`:
const getQuizQuestionsVars: GetQuizQuestionsVariables = {
  quizId: ..., 
};

// Call the `getQuizQuestions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getQuizQuestions(getQuizQuestionsVars);
// Variables can be defined inline as well.
const { data } = await getQuizQuestions({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getQuizQuestions(dataConnect, getQuizQuestionsVars);

console.log(data.quizQuestions);

// Or, you can use the `Promise` API.
getQuizQuestions(getQuizQuestionsVars).then((response) => {
  const data = response.data;
  console.log(data.quizQuestions);
});
```

### Using `GetQuizQuestions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getQuizQuestionsRef, GetQuizQuestionsVariables } from '@impact26/dataconnect-sdk';

// The `GetQuizQuestions` query requires an argument of type `GetQuizQuestionsVariables`:
const getQuizQuestionsVars: GetQuizQuestionsVariables = {
  quizId: ..., 
};

// Call the `getQuizQuestionsRef()` function to get a reference to the query.
const ref = getQuizQuestionsRef(getQuizQuestionsVars);
// Variables can be defined inline as well.
const ref = getQuizQuestionsRef({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getQuizQuestionsRef(dataConnect, getQuizQuestionsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizQuestions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizQuestions);
});
```

## GetInProgressAttempt
You can execute the `GetInProgressAttempt` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getInProgressAttempt(vars: GetInProgressAttemptVariables, options?: ExecuteQueryOptions): QueryPromise<GetInProgressAttemptData, GetInProgressAttemptVariables>;

interface GetInProgressAttemptRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetInProgressAttemptVariables): QueryRef<GetInProgressAttemptData, GetInProgressAttemptVariables>;
}
export const getInProgressAttemptRef: GetInProgressAttemptRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getInProgressAttempt(dc: DataConnect, vars: GetInProgressAttemptVariables, options?: ExecuteQueryOptions): QueryPromise<GetInProgressAttemptData, GetInProgressAttemptVariables>;

interface GetInProgressAttemptRef {
  ...
  (dc: DataConnect, vars: GetInProgressAttemptVariables): QueryRef<GetInProgressAttemptData, GetInProgressAttemptVariables>;
}
export const getInProgressAttemptRef: GetInProgressAttemptRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getInProgressAttemptRef:
```typescript
const name = getInProgressAttemptRef.operationName;
console.log(name);
```

### Variables
The `GetInProgressAttempt` query requires an argument of type `GetInProgressAttemptVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetInProgressAttemptVariables {
  userId: string;
  quizId: UUIDString;
}
```
### Return Type
Recall that executing the `GetInProgressAttempt` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetInProgressAttemptData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetInProgressAttemptData {
  quizAttempts: ({
    id: UUIDString;
    status: string;
    questionOrder: string;
    startedAt: DateString;
    quiz: {
      timeLimitSeconds?: number | null;
    };
      quizResponses_on_attempt: ({
        question: {
          id: UUIDString;
        } & Question_Key;
          selectedLetters: string;
          isCorrect?: boolean | null;
          pointsEarned?: number | null;
          pointsPossible?: number | null;
          answeredAt?: DateString | null;
      })[];
  } & QuizAttempt_Key)[];
}
```
### Using `GetInProgressAttempt`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getInProgressAttempt, GetInProgressAttemptVariables } from '@impact26/dataconnect-sdk';

// The `GetInProgressAttempt` query requires an argument of type `GetInProgressAttemptVariables`:
const getInProgressAttemptVars: GetInProgressAttemptVariables = {
  userId: ..., 
  quizId: ..., 
};

// Call the `getInProgressAttempt()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getInProgressAttempt(getInProgressAttemptVars);
// Variables can be defined inline as well.
const { data } = await getInProgressAttempt({ userId: ..., quizId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getInProgressAttempt(dataConnect, getInProgressAttemptVars);

console.log(data.quizAttempts);

// Or, you can use the `Promise` API.
getInProgressAttempt(getInProgressAttemptVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempts);
});
```

### Using `GetInProgressAttempt`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getInProgressAttemptRef, GetInProgressAttemptVariables } from '@impact26/dataconnect-sdk';

// The `GetInProgressAttempt` query requires an argument of type `GetInProgressAttemptVariables`:
const getInProgressAttemptVars: GetInProgressAttemptVariables = {
  userId: ..., 
  quizId: ..., 
};

// Call the `getInProgressAttemptRef()` function to get a reference to the query.
const ref = getInProgressAttemptRef(getInProgressAttemptVars);
// Variables can be defined inline as well.
const ref = getInProgressAttemptRef({ userId: ..., quizId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getInProgressAttemptRef(dataConnect, getInProgressAttemptVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizAttempts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempts);
});
```

## GetUserCourseProgress
You can execute the `GetUserCourseProgress` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getUserCourseProgress(vars: GetUserCourseProgressVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserCourseProgressData, GetUserCourseProgressVariables>;

interface GetUserCourseProgressRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserCourseProgressVariables): QueryRef<GetUserCourseProgressData, GetUserCourseProgressVariables>;
}
export const getUserCourseProgressRef: GetUserCourseProgressRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserCourseProgress(dc: DataConnect, vars: GetUserCourseProgressVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserCourseProgressData, GetUserCourseProgressVariables>;

interface GetUserCourseProgressRef {
  ...
  (dc: DataConnect, vars: GetUserCourseProgressVariables): QueryRef<GetUserCourseProgressData, GetUserCourseProgressVariables>;
}
export const getUserCourseProgressRef: GetUserCourseProgressRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserCourseProgressRef:
```typescript
const name = getUserCourseProgressRef.operationName;
console.log(name);
```

### Variables
The `GetUserCourseProgress` query requires an argument of type `GetUserCourseProgressVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserCourseProgressVariables {
  userId: string;
  courseId: UUIDString;
}
```
### Return Type
Recall that executing the `GetUserCourseProgress` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserCourseProgressData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserCourseProgressData {
  userLessonProgresses: ({
    lesson: {
      id: UUIDString;
    } & Lesson_Key;
      status: string;
      videoPositionSeconds?: number | null;
      completedAt?: DateString | null;
  })[];
}
```
### Using `GetUserCourseProgress`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserCourseProgress, GetUserCourseProgressVariables } from '@impact26/dataconnect-sdk';

// The `GetUserCourseProgress` query requires an argument of type `GetUserCourseProgressVariables`:
const getUserCourseProgressVars: GetUserCourseProgressVariables = {
  userId: ..., 
  courseId: ..., 
};

// Call the `getUserCourseProgress()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserCourseProgress(getUserCourseProgressVars);
// Variables can be defined inline as well.
const { data } = await getUserCourseProgress({ userId: ..., courseId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserCourseProgress(dataConnect, getUserCourseProgressVars);

console.log(data.userLessonProgresses);

// Or, you can use the `Promise` API.
getUserCourseProgress(getUserCourseProgressVars).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgresses);
});
```

### Using `GetUserCourseProgress`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserCourseProgressRef, GetUserCourseProgressVariables } from '@impact26/dataconnect-sdk';

// The `GetUserCourseProgress` query requires an argument of type `GetUserCourseProgressVariables`:
const getUserCourseProgressVars: GetUserCourseProgressVariables = {
  userId: ..., 
  courseId: ..., 
};

// Call the `getUserCourseProgressRef()` function to get a reference to the query.
const ref = getUserCourseProgressRef(getUserCourseProgressVars);
// Variables can be defined inline as well.
const ref = getUserCourseProgressRef({ userId: ..., courseId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserCourseProgressRef(dataConnect, getUserCourseProgressVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userLessonProgresses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgresses);
});
```

## GetLessonProgress
You can execute the `GetLessonProgress` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getLessonProgress(vars: GetLessonProgressVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonProgressData, GetLessonProgressVariables>;

interface GetLessonProgressRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLessonProgressVariables): QueryRef<GetLessonProgressData, GetLessonProgressVariables>;
}
export const getLessonProgressRef: GetLessonProgressRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLessonProgress(dc: DataConnect, vars: GetLessonProgressVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonProgressData, GetLessonProgressVariables>;

interface GetLessonProgressRef {
  ...
  (dc: DataConnect, vars: GetLessonProgressVariables): QueryRef<GetLessonProgressData, GetLessonProgressVariables>;
}
export const getLessonProgressRef: GetLessonProgressRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLessonProgressRef:
```typescript
const name = getLessonProgressRef.operationName;
console.log(name);
```

### Variables
The `GetLessonProgress` query requires an argument of type `GetLessonProgressVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLessonProgressVariables {
  userId: string;
  lessonId: UUIDString;
}
```
### Return Type
Recall that executing the `GetLessonProgress` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLessonProgressData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetLessonProgressData {
  userLessonProgresses: ({
    status: string;
    videoPositionSeconds?: number | null;
    completedAt?: DateString | null;
  })[];
}
```
### Using `GetLessonProgress`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLessonProgress, GetLessonProgressVariables } from '@impact26/dataconnect-sdk';

// The `GetLessonProgress` query requires an argument of type `GetLessonProgressVariables`:
const getLessonProgressVars: GetLessonProgressVariables = {
  userId: ..., 
  lessonId: ..., 
};

// Call the `getLessonProgress()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLessonProgress(getLessonProgressVars);
// Variables can be defined inline as well.
const { data } = await getLessonProgress({ userId: ..., lessonId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLessonProgress(dataConnect, getLessonProgressVars);

console.log(data.userLessonProgresses);

// Or, you can use the `Promise` API.
getLessonProgress(getLessonProgressVars).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgresses);
});
```

### Using `GetLessonProgress`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLessonProgressRef, GetLessonProgressVariables } from '@impact26/dataconnect-sdk';

// The `GetLessonProgress` query requires an argument of type `GetLessonProgressVariables`:
const getLessonProgressVars: GetLessonProgressVariables = {
  userId: ..., 
  lessonId: ..., 
};

// Call the `getLessonProgressRef()` function to get a reference to the query.
const ref = getLessonProgressRef(getLessonProgressVars);
// Variables can be defined inline as well.
const ref = getLessonProgressRef({ userId: ..., lessonId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLessonProgressRef(dataConnect, getLessonProgressVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userLessonProgresses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgresses);
});
```

## GetUserCourseProgressFull
You can execute the `GetUserCourseProgressFull` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getUserCourseProgressFull(vars: GetUserCourseProgressFullVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserCourseProgressFullData, GetUserCourseProgressFullVariables>;

interface GetUserCourseProgressFullRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserCourseProgressFullVariables): QueryRef<GetUserCourseProgressFullData, GetUserCourseProgressFullVariables>;
}
export const getUserCourseProgressFullRef: GetUserCourseProgressFullRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserCourseProgressFull(dc: DataConnect, vars: GetUserCourseProgressFullVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserCourseProgressFullData, GetUserCourseProgressFullVariables>;

interface GetUserCourseProgressFullRef {
  ...
  (dc: DataConnect, vars: GetUserCourseProgressFullVariables): QueryRef<GetUserCourseProgressFullData, GetUserCourseProgressFullVariables>;
}
export const getUserCourseProgressFullRef: GetUserCourseProgressFullRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserCourseProgressFullRef:
```typescript
const name = getUserCourseProgressFullRef.operationName;
console.log(name);
```

### Variables
The `GetUserCourseProgressFull` query requires an argument of type `GetUserCourseProgressFullVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserCourseProgressFullVariables {
  userId: string;
  courseId: UUIDString;
}
```
### Return Type
Recall that executing the `GetUserCourseProgressFull` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserCourseProgressFullData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserCourseProgressFullData {
  userCourseProgress: ({
    enrolledAt: DateString;
  })[];
    userLessonProgresses: ({
      lesson: {
        id: UUIDString;
      } & Lesson_Key;
        status: string;
        videoPositionSeconds?: number | null;
        completedAt?: DateString | null;
    })[];
}
```
### Using `GetUserCourseProgressFull`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserCourseProgressFull, GetUserCourseProgressFullVariables } from '@impact26/dataconnect-sdk';

// The `GetUserCourseProgressFull` query requires an argument of type `GetUserCourseProgressFullVariables`:
const getUserCourseProgressFullVars: GetUserCourseProgressFullVariables = {
  userId: ..., 
  courseId: ..., 
};

// Call the `getUserCourseProgressFull()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserCourseProgressFull(getUserCourseProgressFullVars);
// Variables can be defined inline as well.
const { data } = await getUserCourseProgressFull({ userId: ..., courseId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserCourseProgressFull(dataConnect, getUserCourseProgressFullVars);

console.log(data.userCourseProgress);
console.log(data.userLessonProgresses);

// Or, you can use the `Promise` API.
getUserCourseProgressFull(getUserCourseProgressFullVars).then((response) => {
  const data = response.data;
  console.log(data.userCourseProgress);
  console.log(data.userLessonProgresses);
});
```

### Using `GetUserCourseProgressFull`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserCourseProgressFullRef, GetUserCourseProgressFullVariables } from '@impact26/dataconnect-sdk';

// The `GetUserCourseProgressFull` query requires an argument of type `GetUserCourseProgressFullVariables`:
const getUserCourseProgressFullVars: GetUserCourseProgressFullVariables = {
  userId: ..., 
  courseId: ..., 
};

// Call the `getUserCourseProgressFullRef()` function to get a reference to the query.
const ref = getUserCourseProgressFullRef(getUserCourseProgressFullVars);
// Variables can be defined inline as well.
const ref = getUserCourseProgressFullRef({ userId: ..., courseId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserCourseProgressFullRef(dataConnect, getUserCourseProgressFullVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userCourseProgress);
console.log(data.userLessonProgresses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userCourseProgress);
  console.log(data.userLessonProgresses);
});
```

## GetUserAttemptHistory
You can execute the `GetUserAttemptHistory` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getUserAttemptHistory(vars: GetUserAttemptHistoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserAttemptHistoryData, GetUserAttemptHistoryVariables>;

interface GetUserAttemptHistoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserAttemptHistoryVariables): QueryRef<GetUserAttemptHistoryData, GetUserAttemptHistoryVariables>;
}
export const getUserAttemptHistoryRef: GetUserAttemptHistoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserAttemptHistory(dc: DataConnect, vars: GetUserAttemptHistoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserAttemptHistoryData, GetUserAttemptHistoryVariables>;

interface GetUserAttemptHistoryRef {
  ...
  (dc: DataConnect, vars: GetUserAttemptHistoryVariables): QueryRef<GetUserAttemptHistoryData, GetUserAttemptHistoryVariables>;
}
export const getUserAttemptHistoryRef: GetUserAttemptHistoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserAttemptHistoryRef:
```typescript
const name = getUserAttemptHistoryRef.operationName;
console.log(name);
```

### Variables
The `GetUserAttemptHistory` query requires an argument of type `GetUserAttemptHistoryVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserAttemptHistoryVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserAttemptHistory` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserAttemptHistoryData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserAttemptHistoryData {
  quizAttempts: ({
    id: UUIDString;
    quiz: {
      id: UUIDString;
      title: string;
    } & Quiz_Key;
      scorePct?: number | null;
      passed?: boolean | null;
      completedAt?: DateString | null;
  } & QuizAttempt_Key)[];
}
```
### Using `GetUserAttemptHistory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserAttemptHistory, GetUserAttemptHistoryVariables } from '@impact26/dataconnect-sdk';

// The `GetUserAttemptHistory` query requires an argument of type `GetUserAttemptHistoryVariables`:
const getUserAttemptHistoryVars: GetUserAttemptHistoryVariables = {
  userId: ..., 
};

// Call the `getUserAttemptHistory()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserAttemptHistory(getUserAttemptHistoryVars);
// Variables can be defined inline as well.
const { data } = await getUserAttemptHistory({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserAttemptHistory(dataConnect, getUserAttemptHistoryVars);

console.log(data.quizAttempts);

// Or, you can use the `Promise` API.
getUserAttemptHistory(getUserAttemptHistoryVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempts);
});
```

### Using `GetUserAttemptHistory`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserAttemptHistoryRef, GetUserAttemptHistoryVariables } from '@impact26/dataconnect-sdk';

// The `GetUserAttemptHistory` query requires an argument of type `GetUserAttemptHistoryVariables`:
const getUserAttemptHistoryVars: GetUserAttemptHistoryVariables = {
  userId: ..., 
};

// Call the `getUserAttemptHistoryRef()` function to get a reference to the query.
const ref = getUserAttemptHistoryRef(getUserAttemptHistoryVars);
// Variables can be defined inline as well.
const ref = getUserAttemptHistoryRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserAttemptHistoryRef(dataConnect, getUserAttemptHistoryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizAttempts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempts);
});
```

## GetAttemptResults
You can execute the `GetAttemptResults` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getAttemptResults(vars: GetAttemptResultsVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptResultsData, GetAttemptResultsVariables>;

interface GetAttemptResultsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAttemptResultsVariables): QueryRef<GetAttemptResultsData, GetAttemptResultsVariables>;
}
export const getAttemptResultsRef: GetAttemptResultsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAttemptResults(dc: DataConnect, vars: GetAttemptResultsVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptResultsData, GetAttemptResultsVariables>;

interface GetAttemptResultsRef {
  ...
  (dc: DataConnect, vars: GetAttemptResultsVariables): QueryRef<GetAttemptResultsData, GetAttemptResultsVariables>;
}
export const getAttemptResultsRef: GetAttemptResultsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAttemptResultsRef:
```typescript
const name = getAttemptResultsRef.operationName;
console.log(name);
```

### Variables
The `GetAttemptResults` query requires an argument of type `GetAttemptResultsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAttemptResultsVariables {
  attemptId: UUIDString;
}
```
### Return Type
Recall that executing the `GetAttemptResults` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAttemptResultsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAttemptResultsData {
  quizAttempt?: {
    id: UUIDString;
    status: string;
    scoreRaw?: number | null;
    scoreMax?: number | null;
    scorePct?: number | null;
    passed?: boolean | null;
    startedAt: DateString;
    completedAt?: DateString | null;
    quiz: {
      title: string;
      passingScore?: number | null;
    };
      quizResponses_on_attempt: ({
        question: {
          id: UUIDString;
          questionText: string;
          difficulty: string;
          domain: string;
          formulaRef?: string | null;
          rationale?: string | null;
          calculation?: string | null;
          sourceRef?: string | null;
        } & Question_Key;
          selectedLetters: string;
          isCorrect?: boolean | null;
          pointsEarned?: number | null;
          pointsPossible?: number | null;
      })[];
  } & QuizAttempt_Key;
}
```
### Using `GetAttemptResults`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAttemptResults, GetAttemptResultsVariables } from '@impact26/dataconnect-sdk';

// The `GetAttemptResults` query requires an argument of type `GetAttemptResultsVariables`:
const getAttemptResultsVars: GetAttemptResultsVariables = {
  attemptId: ..., 
};

// Call the `getAttemptResults()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAttemptResults(getAttemptResultsVars);
// Variables can be defined inline as well.
const { data } = await getAttemptResults({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAttemptResults(dataConnect, getAttemptResultsVars);

console.log(data.quizAttempt);

// Or, you can use the `Promise` API.
getAttemptResults(getAttemptResultsVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt);
});
```

### Using `GetAttemptResults`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAttemptResultsRef, GetAttemptResultsVariables } from '@impact26/dataconnect-sdk';

// The `GetAttemptResults` query requires an argument of type `GetAttemptResultsVariables`:
const getAttemptResultsVars: GetAttemptResultsVariables = {
  attemptId: ..., 
};

// Call the `getAttemptResultsRef()` function to get a reference to the query.
const ref = getAttemptResultsRef(getAttemptResultsVars);
// Variables can be defined inline as well.
const ref = getAttemptResultsRef({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAttemptResultsRef(dataConnect, getAttemptResultsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizAttempt);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt);
});
```

## GetFormulaSections
You can execute the `GetFormulaSections` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getFormulaSections(options?: ExecuteQueryOptions): QueryPromise<GetFormulaSectionsData, undefined>;

interface GetFormulaSectionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetFormulaSectionsData, undefined>;
}
export const getFormulaSectionsRef: GetFormulaSectionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getFormulaSections(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetFormulaSectionsData, undefined>;

interface GetFormulaSectionsRef {
  ...
  (dc: DataConnect): QueryRef<GetFormulaSectionsData, undefined>;
}
export const getFormulaSectionsRef: GetFormulaSectionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getFormulaSectionsRef:
```typescript
const name = getFormulaSectionsRef.operationName;
console.log(name);
```

### Variables
The `GetFormulaSections` query has no variables.
### Return Type
Recall that executing the `GetFormulaSections` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetFormulaSectionsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetFormulaSectionsData {
  formulaSections: ({
    id: UUIDString;
    code: string;
    title: string;
    position: number;
    formulas_on_section: ({
      id: UUIDString;
      code: string;
      name: string;
      expression: string;
      notes?: string | null;
    } & Formula_Key)[];
  } & FormulaSection_Key)[];
}
```
### Using `GetFormulaSections`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getFormulaSections } from '@impact26/dataconnect-sdk';


// Call the `getFormulaSections()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getFormulaSections();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getFormulaSections(dataConnect);

console.log(data.formulaSections);

// Or, you can use the `Promise` API.
getFormulaSections().then((response) => {
  const data = response.data;
  console.log(data.formulaSections);
});
```

### Using `GetFormulaSections`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getFormulaSectionsRef } from '@impact26/dataconnect-sdk';


// Call the `getFormulaSectionsRef()` function to get a reference to the query.
const ref = getFormulaSectionsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getFormulaSectionsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.formulaSections);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.formulaSections);
});
```

## GetUserProgressDetails
You can execute the `GetUserProgressDetails` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getUserProgressDetails(vars: GetUserProgressDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProgressDetailsData, GetUserProgressDetailsVariables>;

interface GetUserProgressDetailsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserProgressDetailsVariables): QueryRef<GetUserProgressDetailsData, GetUserProgressDetailsVariables>;
}
export const getUserProgressDetailsRef: GetUserProgressDetailsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserProgressDetails(dc: DataConnect, vars: GetUserProgressDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProgressDetailsData, GetUserProgressDetailsVariables>;

interface GetUserProgressDetailsRef {
  ...
  (dc: DataConnect, vars: GetUserProgressDetailsVariables): QueryRef<GetUserProgressDetailsData, GetUserProgressDetailsVariables>;
}
export const getUserProgressDetailsRef: GetUserProgressDetailsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserProgressDetailsRef:
```typescript
const name = getUserProgressDetailsRef.operationName;
console.log(name);
```

### Variables
The `GetUserProgressDetails` query requires an argument of type `GetUserProgressDetailsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserProgressDetailsVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserProgressDetails` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserProgressDetailsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserProgressDetailsData {
  quizAttempts: ({
    id: UUIDString;
    quiz: {
      id: UUIDString;
      title: string;
      passingScore?: number | null;
    } & Quiz_Key;
      scorePct?: number | null;
      scoreRaw?: number | null;
      scoreMax?: number | null;
      passed?: boolean | null;
      startedAt: DateString;
      completedAt?: DateString | null;
      quizResponses_on_attempt: ({
        isCorrect?: boolean | null;
        pointsEarned?: number | null;
        pointsPossible?: number | null;
        question: {
          domain: string;
        };
      })[];
  } & QuizAttempt_Key)[];
}
```
### Using `GetUserProgressDetails`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserProgressDetails, GetUserProgressDetailsVariables } from '@impact26/dataconnect-sdk';

// The `GetUserProgressDetails` query requires an argument of type `GetUserProgressDetailsVariables`:
const getUserProgressDetailsVars: GetUserProgressDetailsVariables = {
  userId: ..., 
};

// Call the `getUserProgressDetails()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserProgressDetails(getUserProgressDetailsVars);
// Variables can be defined inline as well.
const { data } = await getUserProgressDetails({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserProgressDetails(dataConnect, getUserProgressDetailsVars);

console.log(data.quizAttempts);

// Or, you can use the `Promise` API.
getUserProgressDetails(getUserProgressDetailsVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempts);
});
```

### Using `GetUserProgressDetails`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserProgressDetailsRef, GetUserProgressDetailsVariables } from '@impact26/dataconnect-sdk';

// The `GetUserProgressDetails` query requires an argument of type `GetUserProgressDetailsVariables`:
const getUserProgressDetailsVars: GetUserProgressDetailsVariables = {
  userId: ..., 
};

// Call the `getUserProgressDetailsRef()` function to get a reference to the query.
const ref = getUserProgressDetailsRef(getUserProgressDetailsVars);
// Variables can be defined inline as well.
const ref = getUserProgressDetailsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserProgressDetailsRef(dataConnect, getUserProgressDetailsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizAttempts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempts);
});
```

## ListAdminQuizzes
You can execute the `ListAdminQuizzes` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listAdminQuizzes(options?: ExecuteQueryOptions): QueryPromise<ListAdminQuizzesData, undefined>;

interface ListAdminQuizzesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAdminQuizzesData, undefined>;
}
export const listAdminQuizzesRef: ListAdminQuizzesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAdminQuizzes(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAdminQuizzesData, undefined>;

interface ListAdminQuizzesRef {
  ...
  (dc: DataConnect): QueryRef<ListAdminQuizzesData, undefined>;
}
export const listAdminQuizzesRef: ListAdminQuizzesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAdminQuizzesRef:
```typescript
const name = listAdminQuizzesRef.operationName;
console.log(name);
```

### Variables
The `ListAdminQuizzes` query has no variables.
### Return Type
Recall that executing the `ListAdminQuizzes` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAdminQuizzesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAdminQuizzesData {
  quizzes: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    status: string;
    passingScore?: number | null;
    timeLimitSeconds?: number | null;
    shuffleQuestions: boolean;
    createdAt: DateString;
  } & Quiz_Key)[];
}
```
### Using `ListAdminQuizzes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAdminQuizzes } from '@impact26/dataconnect-sdk';


// Call the `listAdminQuizzes()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAdminQuizzes();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAdminQuizzes(dataConnect);

console.log(data.quizzes);

// Or, you can use the `Promise` API.
listAdminQuizzes().then((response) => {
  const data = response.data;
  console.log(data.quizzes);
});
```

### Using `ListAdminQuizzes`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAdminQuizzesRef } from '@impact26/dataconnect-sdk';


// Call the `listAdminQuizzesRef()` function to get a reference to the query.
const ref = listAdminQuizzesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAdminQuizzesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizzes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizzes);
});
```

## GetQuizQuestionCount
You can execute the `GetQuizQuestionCount` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getQuizQuestionCount(vars: GetQuizQuestionCountVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionCountData, GetQuizQuestionCountVariables>;

interface GetQuizQuestionCountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuizQuestionCountVariables): QueryRef<GetQuizQuestionCountData, GetQuizQuestionCountVariables>;
}
export const getQuizQuestionCountRef: GetQuizQuestionCountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getQuizQuestionCount(dc: DataConnect, vars: GetQuizQuestionCountVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionCountData, GetQuizQuestionCountVariables>;

interface GetQuizQuestionCountRef {
  ...
  (dc: DataConnect, vars: GetQuizQuestionCountVariables): QueryRef<GetQuizQuestionCountData, GetQuizQuestionCountVariables>;
}
export const getQuizQuestionCountRef: GetQuizQuestionCountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getQuizQuestionCountRef:
```typescript
const name = getQuizQuestionCountRef.operationName;
console.log(name);
```

### Variables
The `GetQuizQuestionCount` query requires an argument of type `GetQuizQuestionCountVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetQuizQuestionCountVariables {
  quizId: UUIDString;
}
```
### Return Type
Recall that executing the `GetQuizQuestionCount` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetQuizQuestionCountData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetQuizQuestionCountData {
  quizQuestions: ({
    position: number;
  })[];
}
```
### Using `GetQuizQuestionCount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getQuizQuestionCount, GetQuizQuestionCountVariables } from '@impact26/dataconnect-sdk';

// The `GetQuizQuestionCount` query requires an argument of type `GetQuizQuestionCountVariables`:
const getQuizQuestionCountVars: GetQuizQuestionCountVariables = {
  quizId: ..., 
};

// Call the `getQuizQuestionCount()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getQuizQuestionCount(getQuizQuestionCountVars);
// Variables can be defined inline as well.
const { data } = await getQuizQuestionCount({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getQuizQuestionCount(dataConnect, getQuizQuestionCountVars);

console.log(data.quizQuestions);

// Or, you can use the `Promise` API.
getQuizQuestionCount(getQuizQuestionCountVars).then((response) => {
  const data = response.data;
  console.log(data.quizQuestions);
});
```

### Using `GetQuizQuestionCount`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getQuizQuestionCountRef, GetQuizQuestionCountVariables } from '@impact26/dataconnect-sdk';

// The `GetQuizQuestionCount` query requires an argument of type `GetQuizQuestionCountVariables`:
const getQuizQuestionCountVars: GetQuizQuestionCountVariables = {
  quizId: ..., 
};

// Call the `getQuizQuestionCountRef()` function to get a reference to the query.
const ref = getQuizQuestionCountRef(getQuizQuestionCountVars);
// Variables can be defined inline as well.
const ref = getQuizQuestionCountRef({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getQuizQuestionCountRef(dataConnect, getQuizQuestionCountVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizQuestions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizQuestions);
});
```

## GetQuizQuestionsAdmin
You can execute the `GetQuizQuestionsAdmin` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getQuizQuestionsAdmin(vars: GetQuizQuestionsAdminVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionsAdminData, GetQuizQuestionsAdminVariables>;

interface GetQuizQuestionsAdminRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuizQuestionsAdminVariables): QueryRef<GetQuizQuestionsAdminData, GetQuizQuestionsAdminVariables>;
}
export const getQuizQuestionsAdminRef: GetQuizQuestionsAdminRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getQuizQuestionsAdmin(dc: DataConnect, vars: GetQuizQuestionsAdminVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionsAdminData, GetQuizQuestionsAdminVariables>;

interface GetQuizQuestionsAdminRef {
  ...
  (dc: DataConnect, vars: GetQuizQuestionsAdminVariables): QueryRef<GetQuizQuestionsAdminData, GetQuizQuestionsAdminVariables>;
}
export const getQuizQuestionsAdminRef: GetQuizQuestionsAdminRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getQuizQuestionsAdminRef:
```typescript
const name = getQuizQuestionsAdminRef.operationName;
console.log(name);
```

### Variables
The `GetQuizQuestionsAdmin` query requires an argument of type `GetQuizQuestionsAdminVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetQuizQuestionsAdminVariables {
  quizId: UUIDString;
}
```
### Return Type
Recall that executing the `GetQuizQuestionsAdmin` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetQuizQuestionsAdminData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetQuizQuestionsAdminData {
  quiz?: {
    id: UUIDString;
    title: string;
    timeLimitSeconds?: number | null;
    shuffleQuestions: boolean;
    shuffleChoices: boolean;
  } & Quiz_Key;
    quizQuestions: ({
      position: number;
      pointValue: number;
      question: {
        id: UUIDString;
        questionText: string;
        difficulty: string;
        domain: string;
        formulaRef?: string | null;
        isMultiselect: boolean;
        answerChoices_on_question: ({
          id: UUIDString;
          letter: string;
          choiceText: string;
          isCorrect: boolean;
          explanation?: string | null;
          position: number;
        } & AnswerChoice_Key)[];
      } & Question_Key;
    })[];
}
```
### Using `GetQuizQuestionsAdmin`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getQuizQuestionsAdmin, GetQuizQuestionsAdminVariables } from '@impact26/dataconnect-sdk';

// The `GetQuizQuestionsAdmin` query requires an argument of type `GetQuizQuestionsAdminVariables`:
const getQuizQuestionsAdminVars: GetQuizQuestionsAdminVariables = {
  quizId: ..., 
};

// Call the `getQuizQuestionsAdmin()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getQuizQuestionsAdmin(getQuizQuestionsAdminVars);
// Variables can be defined inline as well.
const { data } = await getQuizQuestionsAdmin({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getQuizQuestionsAdmin(dataConnect, getQuizQuestionsAdminVars);

console.log(data.quiz);
console.log(data.quizQuestions);

// Or, you can use the `Promise` API.
getQuizQuestionsAdmin(getQuizQuestionsAdminVars).then((response) => {
  const data = response.data;
  console.log(data.quiz);
  console.log(data.quizQuestions);
});
```

### Using `GetQuizQuestionsAdmin`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getQuizQuestionsAdminRef, GetQuizQuestionsAdminVariables } from '@impact26/dataconnect-sdk';

// The `GetQuizQuestionsAdmin` query requires an argument of type `GetQuizQuestionsAdminVariables`:
const getQuizQuestionsAdminVars: GetQuizQuestionsAdminVariables = {
  quizId: ..., 
};

// Call the `getQuizQuestionsAdminRef()` function to get a reference to the query.
const ref = getQuizQuestionsAdminRef(getQuizQuestionsAdminVars);
// Variables can be defined inline as well.
const ref = getQuizQuestionsAdminRef({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getQuizQuestionsAdminRef(dataConnect, getQuizQuestionsAdminVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quiz);
console.log(data.quizQuestions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quiz);
  console.log(data.quizQuestions);
});
```

## GetAttemptForEvaluation
You can execute the `GetAttemptForEvaluation` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getAttemptForEvaluation(vars: GetAttemptForEvaluationVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptForEvaluationData, GetAttemptForEvaluationVariables>;

interface GetAttemptForEvaluationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAttemptForEvaluationVariables): QueryRef<GetAttemptForEvaluationData, GetAttemptForEvaluationVariables>;
}
export const getAttemptForEvaluationRef: GetAttemptForEvaluationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAttemptForEvaluation(dc: DataConnect, vars: GetAttemptForEvaluationVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptForEvaluationData, GetAttemptForEvaluationVariables>;

interface GetAttemptForEvaluationRef {
  ...
  (dc: DataConnect, vars: GetAttemptForEvaluationVariables): QueryRef<GetAttemptForEvaluationData, GetAttemptForEvaluationVariables>;
}
export const getAttemptForEvaluationRef: GetAttemptForEvaluationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAttemptForEvaluationRef:
```typescript
const name = getAttemptForEvaluationRef.operationName;
console.log(name);
```

### Variables
The `GetAttemptForEvaluation` query requires an argument of type `GetAttemptForEvaluationVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAttemptForEvaluationVariables {
  attemptId: UUIDString;
}
```
### Return Type
Recall that executing the `GetAttemptForEvaluation` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAttemptForEvaluationData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAttemptForEvaluationData {
  quizAttempt?: {
    id: UUIDString;
    status: string;
    questionOrder: string;
    user: {
      id: string;
    } & User_Key;
      quiz: {
        id: UUIDString;
      } & Quiz_Key;
        quizResponses_on_attempt: ({
          question: {
            id: UUIDString;
          } & Question_Key;
            isCorrect?: boolean | null;
        })[];
  } & QuizAttempt_Key;
}
```
### Using `GetAttemptForEvaluation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAttemptForEvaluation, GetAttemptForEvaluationVariables } from '@impact26/dataconnect-sdk';

// The `GetAttemptForEvaluation` query requires an argument of type `GetAttemptForEvaluationVariables`:
const getAttemptForEvaluationVars: GetAttemptForEvaluationVariables = {
  attemptId: ..., 
};

// Call the `getAttemptForEvaluation()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAttemptForEvaluation(getAttemptForEvaluationVars);
// Variables can be defined inline as well.
const { data } = await getAttemptForEvaluation({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAttemptForEvaluation(dataConnect, getAttemptForEvaluationVars);

console.log(data.quizAttempt);

// Or, you can use the `Promise` API.
getAttemptForEvaluation(getAttemptForEvaluationVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt);
});
```

### Using `GetAttemptForEvaluation`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAttemptForEvaluationRef, GetAttemptForEvaluationVariables } from '@impact26/dataconnect-sdk';

// The `GetAttemptForEvaluation` query requires an argument of type `GetAttemptForEvaluationVariables`:
const getAttemptForEvaluationVars: GetAttemptForEvaluationVariables = {
  attemptId: ..., 
};

// Call the `getAttemptForEvaluationRef()` function to get a reference to the query.
const ref = getAttemptForEvaluationRef(getAttemptForEvaluationVars);
// Variables can be defined inline as well.
const ref = getAttemptForEvaluationRef({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAttemptForEvaluationRef(dataConnect, getAttemptForEvaluationVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizAttempt);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt);
});
```

## GetQuestionWithAnswers
You can execute the `GetQuestionWithAnswers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getQuestionWithAnswers(vars: GetQuestionWithAnswersVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuestionWithAnswersData, GetQuestionWithAnswersVariables>;

interface GetQuestionWithAnswersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuestionWithAnswersVariables): QueryRef<GetQuestionWithAnswersData, GetQuestionWithAnswersVariables>;
}
export const getQuestionWithAnswersRef: GetQuestionWithAnswersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getQuestionWithAnswers(dc: DataConnect, vars: GetQuestionWithAnswersVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuestionWithAnswersData, GetQuestionWithAnswersVariables>;

interface GetQuestionWithAnswersRef {
  ...
  (dc: DataConnect, vars: GetQuestionWithAnswersVariables): QueryRef<GetQuestionWithAnswersData, GetQuestionWithAnswersVariables>;
}
export const getQuestionWithAnswersRef: GetQuestionWithAnswersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getQuestionWithAnswersRef:
```typescript
const name = getQuestionWithAnswersRef.operationName;
console.log(name);
```

### Variables
The `GetQuestionWithAnswers` query requires an argument of type `GetQuestionWithAnswersVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetQuestionWithAnswersVariables {
  questionId: UUIDString;
}
```
### Return Type
Recall that executing the `GetQuestionWithAnswers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetQuestionWithAnswersData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetQuestionWithAnswersData {
  question?: {
    id: UUIDString;
    questionText: string;
    difficulty: string;
    domain: string;
    formulaRef?: string | null;
    isMultiselect: boolean;
    rationale?: string | null;
    calculation?: string | null;
    sourceRef?: string | null;
    answerChoices_on_question: ({
      id: UUIDString;
      letter: string;
      choiceText: string;
      isCorrect: boolean;
      explanation?: string | null;
      position: number;
    } & AnswerChoice_Key)[];
  } & Question_Key;
}
```
### Using `GetQuestionWithAnswers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getQuestionWithAnswers, GetQuestionWithAnswersVariables } from '@impact26/dataconnect-sdk';

// The `GetQuestionWithAnswers` query requires an argument of type `GetQuestionWithAnswersVariables`:
const getQuestionWithAnswersVars: GetQuestionWithAnswersVariables = {
  questionId: ..., 
};

// Call the `getQuestionWithAnswers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getQuestionWithAnswers(getQuestionWithAnswersVars);
// Variables can be defined inline as well.
const { data } = await getQuestionWithAnswers({ questionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getQuestionWithAnswers(dataConnect, getQuestionWithAnswersVars);

console.log(data.question);

// Or, you can use the `Promise` API.
getQuestionWithAnswers(getQuestionWithAnswersVars).then((response) => {
  const data = response.data;
  console.log(data.question);
});
```

### Using `GetQuestionWithAnswers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getQuestionWithAnswersRef, GetQuestionWithAnswersVariables } from '@impact26/dataconnect-sdk';

// The `GetQuestionWithAnswers` query requires an argument of type `GetQuestionWithAnswersVariables`:
const getQuestionWithAnswersVars: GetQuestionWithAnswersVariables = {
  questionId: ..., 
};

// Call the `getQuestionWithAnswersRef()` function to get a reference to the query.
const ref = getQuestionWithAnswersRef(getQuestionWithAnswersVars);
// Variables can be defined inline as well.
const ref = getQuestionWithAnswersRef({ questionId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getQuestionWithAnswersRef(dataConnect, getQuestionWithAnswersVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.question);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.question);
});
```

## GetQuizQuestionPointValue
You can execute the `GetQuizQuestionPointValue` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getQuizQuestionPointValue(vars: GetQuizQuestionPointValueVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionPointValueData, GetQuizQuestionPointValueVariables>;

interface GetQuizQuestionPointValueRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuizQuestionPointValueVariables): QueryRef<GetQuizQuestionPointValueData, GetQuizQuestionPointValueVariables>;
}
export const getQuizQuestionPointValueRef: GetQuizQuestionPointValueRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getQuizQuestionPointValue(dc: DataConnect, vars: GetQuizQuestionPointValueVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionPointValueData, GetQuizQuestionPointValueVariables>;

interface GetQuizQuestionPointValueRef {
  ...
  (dc: DataConnect, vars: GetQuizQuestionPointValueVariables): QueryRef<GetQuizQuestionPointValueData, GetQuizQuestionPointValueVariables>;
}
export const getQuizQuestionPointValueRef: GetQuizQuestionPointValueRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getQuizQuestionPointValueRef:
```typescript
const name = getQuizQuestionPointValueRef.operationName;
console.log(name);
```

### Variables
The `GetQuizQuestionPointValue` query requires an argument of type `GetQuizQuestionPointValueVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetQuizQuestionPointValueVariables {
  quizId: UUIDString;
  questionId: UUIDString;
}
```
### Return Type
Recall that executing the `GetQuizQuestionPointValue` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetQuizQuestionPointValueData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetQuizQuestionPointValueData {
  quizQuestions: ({
    pointValue: number;
  })[];
}
```
### Using `GetQuizQuestionPointValue`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getQuizQuestionPointValue, GetQuizQuestionPointValueVariables } from '@impact26/dataconnect-sdk';

// The `GetQuizQuestionPointValue` query requires an argument of type `GetQuizQuestionPointValueVariables`:
const getQuizQuestionPointValueVars: GetQuizQuestionPointValueVariables = {
  quizId: ..., 
  questionId: ..., 
};

// Call the `getQuizQuestionPointValue()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getQuizQuestionPointValue(getQuizQuestionPointValueVars);
// Variables can be defined inline as well.
const { data } = await getQuizQuestionPointValue({ quizId: ..., questionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getQuizQuestionPointValue(dataConnect, getQuizQuestionPointValueVars);

console.log(data.quizQuestions);

// Or, you can use the `Promise` API.
getQuizQuestionPointValue(getQuizQuestionPointValueVars).then((response) => {
  const data = response.data;
  console.log(data.quizQuestions);
});
```

### Using `GetQuizQuestionPointValue`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getQuizQuestionPointValueRef, GetQuizQuestionPointValueVariables } from '@impact26/dataconnect-sdk';

// The `GetQuizQuestionPointValue` query requires an argument of type `GetQuizQuestionPointValueVariables`:
const getQuizQuestionPointValueVars: GetQuizQuestionPointValueVariables = {
  quizId: ..., 
  questionId: ..., 
};

// Call the `getQuizQuestionPointValueRef()` function to get a reference to the query.
const ref = getQuizQuestionPointValueRef(getQuizQuestionPointValueVars);
// Variables can be defined inline as well.
const ref = getQuizQuestionPointValueRef({ quizId: ..., questionId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getQuizQuestionPointValueRef(dataConnect, getQuizQuestionPointValueVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizQuestions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizQuestions);
});
```

## GetAttemptForCompletion
You can execute the `GetAttemptForCompletion` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getAttemptForCompletion(vars: GetAttemptForCompletionVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptForCompletionData, GetAttemptForCompletionVariables>;

interface GetAttemptForCompletionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAttemptForCompletionVariables): QueryRef<GetAttemptForCompletionData, GetAttemptForCompletionVariables>;
}
export const getAttemptForCompletionRef: GetAttemptForCompletionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAttemptForCompletion(dc: DataConnect, vars: GetAttemptForCompletionVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptForCompletionData, GetAttemptForCompletionVariables>;

interface GetAttemptForCompletionRef {
  ...
  (dc: DataConnect, vars: GetAttemptForCompletionVariables): QueryRef<GetAttemptForCompletionData, GetAttemptForCompletionVariables>;
}
export const getAttemptForCompletionRef: GetAttemptForCompletionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAttemptForCompletionRef:
```typescript
const name = getAttemptForCompletionRef.operationName;
console.log(name);
```

### Variables
The `GetAttemptForCompletion` query requires an argument of type `GetAttemptForCompletionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAttemptForCompletionVariables {
  attemptId: UUIDString;
}
```
### Return Type
Recall that executing the `GetAttemptForCompletion` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAttemptForCompletionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAttemptForCompletionData {
  quizAttempt?: {
    id: UUIDString;
    status: string;
    user: {
      id: string;
    } & User_Key;
      quiz: {
        id: UUIDString;
        passingScore?: number | null;
      } & Quiz_Key;
        quizResponses_on_attempt: ({
          pointsEarned?: number | null;
          pointsPossible?: number | null;
          question: {
            domain: string;
          };
        })[];
  } & QuizAttempt_Key;
}
```
### Using `GetAttemptForCompletion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAttemptForCompletion, GetAttemptForCompletionVariables } from '@impact26/dataconnect-sdk';

// The `GetAttemptForCompletion` query requires an argument of type `GetAttemptForCompletionVariables`:
const getAttemptForCompletionVars: GetAttemptForCompletionVariables = {
  attemptId: ..., 
};

// Call the `getAttemptForCompletion()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAttemptForCompletion(getAttemptForCompletionVars);
// Variables can be defined inline as well.
const { data } = await getAttemptForCompletion({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAttemptForCompletion(dataConnect, getAttemptForCompletionVars);

console.log(data.quizAttempt);

// Or, you can use the `Promise` API.
getAttemptForCompletion(getAttemptForCompletionVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt);
});
```

### Using `GetAttemptForCompletion`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAttemptForCompletionRef, GetAttemptForCompletionVariables } from '@impact26/dataconnect-sdk';

// The `GetAttemptForCompletion` query requires an argument of type `GetAttemptForCompletionVariables`:
const getAttemptForCompletionVars: GetAttemptForCompletionVariables = {
  attemptId: ..., 
};

// Call the `getAttemptForCompletionRef()` function to get a reference to the query.
const ref = getAttemptForCompletionRef(getAttemptForCompletionVars);
// Variables can be defined inline as well.
const ref = getAttemptForCompletionRef({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAttemptForCompletionRef(dataConnect, getAttemptForCompletionVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizAttempt);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt);
});
```

## GetAttemptOwner
You can execute the `GetAttemptOwner` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getAttemptOwner(vars: GetAttemptOwnerVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptOwnerData, GetAttemptOwnerVariables>;

interface GetAttemptOwnerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAttemptOwnerVariables): QueryRef<GetAttemptOwnerData, GetAttemptOwnerVariables>;
}
export const getAttemptOwnerRef: GetAttemptOwnerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAttemptOwner(dc: DataConnect, vars: GetAttemptOwnerVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptOwnerData, GetAttemptOwnerVariables>;

interface GetAttemptOwnerRef {
  ...
  (dc: DataConnect, vars: GetAttemptOwnerVariables): QueryRef<GetAttemptOwnerData, GetAttemptOwnerVariables>;
}
export const getAttemptOwnerRef: GetAttemptOwnerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAttemptOwnerRef:
```typescript
const name = getAttemptOwnerRef.operationName;
console.log(name);
```

### Variables
The `GetAttemptOwner` query requires an argument of type `GetAttemptOwnerVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAttemptOwnerVariables {
  attemptId: UUIDString;
}
```
### Return Type
Recall that executing the `GetAttemptOwner` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAttemptOwnerData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAttemptOwnerData {
  quizAttempt?: {
    id: UUIDString;
    user: {
      id: string;
    } & User_Key;
  } & QuizAttempt_Key;
}
```
### Using `GetAttemptOwner`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAttemptOwner, GetAttemptOwnerVariables } from '@impact26/dataconnect-sdk';

// The `GetAttemptOwner` query requires an argument of type `GetAttemptOwnerVariables`:
const getAttemptOwnerVars: GetAttemptOwnerVariables = {
  attemptId: ..., 
};

// Call the `getAttemptOwner()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAttemptOwner(getAttemptOwnerVars);
// Variables can be defined inline as well.
const { data } = await getAttemptOwner({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAttemptOwner(dataConnect, getAttemptOwnerVars);

console.log(data.quizAttempt);

// Or, you can use the `Promise` API.
getAttemptOwner(getAttemptOwnerVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt);
});
```

### Using `GetAttemptOwner`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAttemptOwnerRef, GetAttemptOwnerVariables } from '@impact26/dataconnect-sdk';

// The `GetAttemptOwner` query requires an argument of type `GetAttemptOwnerVariables`:
const getAttemptOwnerVars: GetAttemptOwnerVariables = {
  attemptId: ..., 
};

// Call the `getAttemptOwnerRef()` function to get a reference to the query.
const ref = getAttemptOwnerRef(getAttemptOwnerVars);
// Variables can be defined inline as well.
const ref = getAttemptOwnerRef({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAttemptOwnerRef(dataConnect, getAttemptOwnerVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizAttempt);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt);
});
```

## AdminListQuestions
You can execute the `AdminListQuestions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminListQuestions(options?: ExecuteQueryOptions): QueryPromise<AdminListQuestionsData, undefined>;

interface AdminListQuestionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListQuestionsData, undefined>;
}
export const adminListQuestionsRef: AdminListQuestionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListQuestions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListQuestionsData, undefined>;

interface AdminListQuestionsRef {
  ...
  (dc: DataConnect): QueryRef<AdminListQuestionsData, undefined>;
}
export const adminListQuestionsRef: AdminListQuestionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListQuestionsRef:
```typescript
const name = adminListQuestionsRef.operationName;
console.log(name);
```

### Variables
The `AdminListQuestions` query has no variables.
### Return Type
Recall that executing the `AdminListQuestions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListQuestionsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListQuestionsData {
  questions: ({
    id: UUIDString;
    questionText: string;
    questionType: string;
    difficulty: string;
    domain: string;
    formulaRef?: string | null;
    topicTags?: string | null;
    status: string;
    version: number;
    isMultiselect: boolean;
    rationale?: string | null;
    calculation?: string | null;
    sourceRef?: string | null;
    createdAt: DateString;
    answerChoices_on_question: ({
      id: UUIDString;
      letter: string;
      choiceText: string;
      isCorrect: boolean;
      explanation?: string | null;
      position: number;
    } & AnswerChoice_Key)[];
  } & Question_Key)[];
}
```
### Using `AdminListQuestions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListQuestions } from '@impact26/dataconnect-sdk';


// Call the `adminListQuestions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListQuestions();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListQuestions(dataConnect);

console.log(data.questions);

// Or, you can use the `Promise` API.
adminListQuestions().then((response) => {
  const data = response.data;
  console.log(data.questions);
});
```

### Using `AdminListQuestions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListQuestionsRef } from '@impact26/dataconnect-sdk';


// Call the `adminListQuestionsRef()` function to get a reference to the query.
const ref = adminListQuestionsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListQuestionsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.questions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.questions);
});
```

## AdminListQuestionsPage
You can execute the `AdminListQuestionsPage` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminListQuestionsPage(vars: AdminListQuestionsPageVariables, options?: ExecuteQueryOptions): QueryPromise<AdminListQuestionsPageData, AdminListQuestionsPageVariables>;

interface AdminListQuestionsPageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminListQuestionsPageVariables): QueryRef<AdminListQuestionsPageData, AdminListQuestionsPageVariables>;
}
export const adminListQuestionsPageRef: AdminListQuestionsPageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListQuestionsPage(dc: DataConnect, vars: AdminListQuestionsPageVariables, options?: ExecuteQueryOptions): QueryPromise<AdminListQuestionsPageData, AdminListQuestionsPageVariables>;

interface AdminListQuestionsPageRef {
  ...
  (dc: DataConnect, vars: AdminListQuestionsPageVariables): QueryRef<AdminListQuestionsPageData, AdminListQuestionsPageVariables>;
}
export const adminListQuestionsPageRef: AdminListQuestionsPageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListQuestionsPageRef:
```typescript
const name = adminListQuestionsPageRef.operationName;
console.log(name);
```

### Variables
The `AdminListQuestionsPage` query requires an argument of type `AdminListQuestionsPageVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminListQuestionsPageVariables {
  limit: number;
  offset: number;
}
```
### Return Type
Recall that executing the `AdminListQuestionsPage` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListQuestionsPageData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListQuestionsPageData {
  questions: ({
    id: UUIDString;
    questionText: string;
    questionType: string;
    difficulty: string;
    domain: string;
    formulaRef?: string | null;
    topicTags?: string | null;
    status: string;
    version: number;
    isMultiselect: boolean;
    createdAt: DateString;
  } & Question_Key)[];
}
```
### Using `AdminListQuestionsPage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListQuestionsPage, AdminListQuestionsPageVariables } from '@impact26/dataconnect-sdk';

// The `AdminListQuestionsPage` query requires an argument of type `AdminListQuestionsPageVariables`:
const adminListQuestionsPageVars: AdminListQuestionsPageVariables = {
  limit: ..., 
  offset: ..., 
};

// Call the `adminListQuestionsPage()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListQuestionsPage(adminListQuestionsPageVars);
// Variables can be defined inline as well.
const { data } = await adminListQuestionsPage({ limit: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListQuestionsPage(dataConnect, adminListQuestionsPageVars);

console.log(data.questions);

// Or, you can use the `Promise` API.
adminListQuestionsPage(adminListQuestionsPageVars).then((response) => {
  const data = response.data;
  console.log(data.questions);
});
```

### Using `AdminListQuestionsPage`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListQuestionsPageRef, AdminListQuestionsPageVariables } from '@impact26/dataconnect-sdk';

// The `AdminListQuestionsPage` query requires an argument of type `AdminListQuestionsPageVariables`:
const adminListQuestionsPageVars: AdminListQuestionsPageVariables = {
  limit: ..., 
  offset: ..., 
};

// Call the `adminListQuestionsPageRef()` function to get a reference to the query.
const ref = adminListQuestionsPageRef(adminListQuestionsPageVars);
// Variables can be defined inline as well.
const ref = adminListQuestionsPageRef({ limit: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListQuestionsPageRef(dataConnect, adminListQuestionsPageVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.questions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.questions);
});
```

## AdminCountQuestions
You can execute the `AdminCountQuestions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminCountQuestions(options?: ExecuteQueryOptions): QueryPromise<AdminCountQuestionsData, undefined>;

interface AdminCountQuestionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminCountQuestionsData, undefined>;
}
export const adminCountQuestionsRef: AdminCountQuestionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminCountQuestions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminCountQuestionsData, undefined>;

interface AdminCountQuestionsRef {
  ...
  (dc: DataConnect): QueryRef<AdminCountQuestionsData, undefined>;
}
export const adminCountQuestionsRef: AdminCountQuestionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminCountQuestionsRef:
```typescript
const name = adminCountQuestionsRef.operationName;
console.log(name);
```

### Variables
The `AdminCountQuestions` query has no variables.
### Return Type
Recall that executing the `AdminCountQuestions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminCountQuestionsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminCountQuestionsData {
  questions: ({
    id: UUIDString;
  } & Question_Key)[];
}
```
### Using `AdminCountQuestions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminCountQuestions } from '@impact26/dataconnect-sdk';


// Call the `adminCountQuestions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminCountQuestions();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminCountQuestions(dataConnect);

console.log(data.questions);

// Or, you can use the `Promise` API.
adminCountQuestions().then((response) => {
  const data = response.data;
  console.log(data.questions);
});
```

### Using `AdminCountQuestions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminCountQuestionsRef } from '@impact26/dataconnect-sdk';


// Call the `adminCountQuestionsRef()` function to get a reference to the query.
const ref = adminCountQuestionsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminCountQuestionsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.questions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.questions);
});
```

## AdminListQuizQuestionUsage
You can execute the `AdminListQuizQuestionUsage` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminListQuizQuestionUsage(options?: ExecuteQueryOptions): QueryPromise<AdminListQuizQuestionUsageData, undefined>;

interface AdminListQuizQuestionUsageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListQuizQuestionUsageData, undefined>;
}
export const adminListQuizQuestionUsageRef: AdminListQuizQuestionUsageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListQuizQuestionUsage(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListQuizQuestionUsageData, undefined>;

interface AdminListQuizQuestionUsageRef {
  ...
  (dc: DataConnect): QueryRef<AdminListQuizQuestionUsageData, undefined>;
}
export const adminListQuizQuestionUsageRef: AdminListQuizQuestionUsageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListQuizQuestionUsageRef:
```typescript
const name = adminListQuizQuestionUsageRef.operationName;
console.log(name);
```

### Variables
The `AdminListQuizQuestionUsage` query has no variables.
### Return Type
Recall that executing the `AdminListQuizQuestionUsage` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListQuizQuestionUsageData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListQuizQuestionUsageData {
  quizQuestions: ({
    quiz: {
      id: UUIDString;
      title: string;
    } & Quiz_Key;
      question: {
        id: UUIDString;
      } & Question_Key;
  })[];
    lessons: ({
      id: UUIDString;
      title: string;
      quiz?: {
        id: UUIDString;
      } & Quiz_Key;
        module: {
          id: UUIDString;
          title: string;
        } & Module_Key;
    } & Lesson_Key)[];
}
```
### Using `AdminListQuizQuestionUsage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListQuizQuestionUsage } from '@impact26/dataconnect-sdk';


// Call the `adminListQuizQuestionUsage()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListQuizQuestionUsage();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListQuizQuestionUsage(dataConnect);

console.log(data.quizQuestions);
console.log(data.lessons);

// Or, you can use the `Promise` API.
adminListQuizQuestionUsage().then((response) => {
  const data = response.data;
  console.log(data.quizQuestions);
  console.log(data.lessons);
});
```

### Using `AdminListQuizQuestionUsage`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListQuizQuestionUsageRef } from '@impact26/dataconnect-sdk';


// Call the `adminListQuizQuestionUsageRef()` function to get a reference to the query.
const ref = adminListQuizQuestionUsageRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListQuizQuestionUsageRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizQuestions);
console.log(data.lessons);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizQuestions);
  console.log(data.lessons);
});
```

## AdminListCourses
You can execute the `AdminListCourses` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminListCourses(options?: ExecuteQueryOptions): QueryPromise<AdminListCoursesData, undefined>;

interface AdminListCoursesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListCoursesData, undefined>;
}
export const adminListCoursesRef: AdminListCoursesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListCourses(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListCoursesData, undefined>;

interface AdminListCoursesRef {
  ...
  (dc: DataConnect): QueryRef<AdminListCoursesData, undefined>;
}
export const adminListCoursesRef: AdminListCoursesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListCoursesRef:
```typescript
const name = adminListCoursesRef.operationName;
console.log(name);
```

### Variables
The `AdminListCourses` query has no variables.
### Return Type
Recall that executing the `AdminListCourses` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListCoursesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListCoursesData {
  courses: ({
    id: UUIDString;
    slug: string;
    title: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    status: string;
    version: number;
    isPublished: boolean;
    publishedAt?: DateString | null;
    createdAt: DateString;
    updatedAt: DateString;
    createdBy: {
      id: string;
      email: string;
      fullName?: string | null;
    } & User_Key;
      modules_on_course: ({
        id: UUIDString;
        title: string;
        description?: string | null;
        learningObjectives?: string | null;
        prerequisiteModuleIds?: string | null;
        position: number;
        status: string;
        lessons_on_module: ({
          id: UUIDString;
          title: string;
          position: number;
          lessonType: string;
          status: string;
          isPublished: boolean;
          durationSeconds?: number | null;
          videoPlaybackId?: string | null;
          videoUrl?: string | null;
          contentJson?: string | null;
          quiz?: {
            id: UUIDString;
          } & Quiz_Key;
        } & Lesson_Key)[];
      } & Module_Key)[];
  } & Course_Key)[];
}
```
### Using `AdminListCourses`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListCourses } from '@impact26/dataconnect-sdk';


// Call the `adminListCourses()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListCourses();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListCourses(dataConnect);

console.log(data.courses);

// Or, you can use the `Promise` API.
adminListCourses().then((response) => {
  const data = response.data;
  console.log(data.courses);
});
```

### Using `AdminListCourses`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListCoursesRef } from '@impact26/dataconnect-sdk';


// Call the `adminListCoursesRef()` function to get a reference to the query.
const ref = adminListCoursesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListCoursesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.courses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.courses);
});
```

## GetLessonVersions
You can execute the `GetLessonVersions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getLessonVersions(vars: GetLessonVersionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonVersionsData, GetLessonVersionsVariables>;

interface GetLessonVersionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLessonVersionsVariables): QueryRef<GetLessonVersionsData, GetLessonVersionsVariables>;
}
export const getLessonVersionsRef: GetLessonVersionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLessonVersions(dc: DataConnect, vars: GetLessonVersionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonVersionsData, GetLessonVersionsVariables>;

interface GetLessonVersionsRef {
  ...
  (dc: DataConnect, vars: GetLessonVersionsVariables): QueryRef<GetLessonVersionsData, GetLessonVersionsVariables>;
}
export const getLessonVersionsRef: GetLessonVersionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLessonVersionsRef:
```typescript
const name = getLessonVersionsRef.operationName;
console.log(name);
```

### Variables
The `GetLessonVersions` query requires an argument of type `GetLessonVersionsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLessonVersionsVariables {
  lessonId: UUIDString;
}
```
### Return Type
Recall that executing the `GetLessonVersions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLessonVersionsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetLessonVersionsData {
  lessonVersions: ({
    id: UUIDString;
    contentJson?: string | null;
    videoPlaybackId?: string | null;
    versionNote?: string | null;
    createdAt: DateString;
    createdBy: {
      id: string;
      email: string;
      fullName?: string | null;
    } & User_Key;
  } & LessonVersion_Key)[];
}
```
### Using `GetLessonVersions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLessonVersions, GetLessonVersionsVariables } from '@impact26/dataconnect-sdk';

// The `GetLessonVersions` query requires an argument of type `GetLessonVersionsVariables`:
const getLessonVersionsVars: GetLessonVersionsVariables = {
  lessonId: ..., 
};

// Call the `getLessonVersions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLessonVersions(getLessonVersionsVars);
// Variables can be defined inline as well.
const { data } = await getLessonVersions({ lessonId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLessonVersions(dataConnect, getLessonVersionsVars);

console.log(data.lessonVersions);

// Or, you can use the `Promise` API.
getLessonVersions(getLessonVersionsVars).then((response) => {
  const data = response.data;
  console.log(data.lessonVersions);
});
```

### Using `GetLessonVersions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLessonVersionsRef, GetLessonVersionsVariables } from '@impact26/dataconnect-sdk';

// The `GetLessonVersions` query requires an argument of type `GetLessonVersionsVariables`:
const getLessonVersionsVars: GetLessonVersionsVariables = {
  lessonId: ..., 
};

// Call the `getLessonVersionsRef()` function to get a reference to the query.
const ref = getLessonVersionsRef(getLessonVersionsVars);
// Variables can be defined inline as well.
const ref = getLessonVersionsRef({ lessonId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLessonVersionsRef(dataConnect, getLessonVersionsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.lessonVersions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.lessonVersions);
});
```

## AdminListSourceMaterials
You can execute the `AdminListSourceMaterials` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminListSourceMaterials(options?: ExecuteQueryOptions): QueryPromise<AdminListSourceMaterialsData, undefined>;

interface AdminListSourceMaterialsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListSourceMaterialsData, undefined>;
}
export const adminListSourceMaterialsRef: AdminListSourceMaterialsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListSourceMaterials(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListSourceMaterialsData, undefined>;

interface AdminListSourceMaterialsRef {
  ...
  (dc: DataConnect): QueryRef<AdminListSourceMaterialsData, undefined>;
}
export const adminListSourceMaterialsRef: AdminListSourceMaterialsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListSourceMaterialsRef:
```typescript
const name = adminListSourceMaterialsRef.operationName;
console.log(name);
```

### Variables
The `AdminListSourceMaterials` query has no variables.
### Return Type
Recall that executing the `AdminListSourceMaterials` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListSourceMaterialsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListSourceMaterialsData {
  sourceMaterials: ({
    id: UUIDString;
    title: string;
    fileName: string;
    fileType: string;
    storagePath: string;
    downloadUrl?: string | null;
    metadataJson?: string | null;
    status: string;
    createdAt: DateString;
    updatedAt: DateString;
    uploadedBy?: {
      id: string;
      email: string;
      fullName?: string | null;
    } & User_Key;
      ingestionJobs_on_sourceMaterial: ({
        id: UUIDString;
        status: string;
        parser: string;
        extractedCharacters: number;
        errorMessage?: string | null;
        createdAt: DateString;
        completedAt?: DateString | null;
      } & IngestionJob_Key)[];
  } & SourceMaterial_Key)[];
}
```
### Using `AdminListSourceMaterials`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListSourceMaterials } from '@impact26/dataconnect-sdk';


// Call the `adminListSourceMaterials()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListSourceMaterials();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListSourceMaterials(dataConnect);

console.log(data.sourceMaterials);

// Or, you can use the `Promise` API.
adminListSourceMaterials().then((response) => {
  const data = response.data;
  console.log(data.sourceMaterials);
});
```

### Using `AdminListSourceMaterials`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListSourceMaterialsRef } from '@impact26/dataconnect-sdk';


// Call the `adminListSourceMaterialsRef()` function to get a reference to the query.
const ref = adminListSourceMaterialsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListSourceMaterialsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.sourceMaterials);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterials);
});
```

## AdminListUsers
You can execute the `AdminListUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminListUsers(options?: ExecuteQueryOptions): QueryPromise<AdminListUsersData, undefined>;

interface AdminListUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListUsersData, undefined>;
}
export const adminListUsersRef: AdminListUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListUsersData, undefined>;

interface AdminListUsersRef {
  ...
  (dc: DataConnect): QueryRef<AdminListUsersData, undefined>;
}
export const adminListUsersRef: AdminListUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListUsersRef:
```typescript
const name = adminListUsersRef.operationName;
console.log(name);
```

### Variables
The `AdminListUsers` query has no variables.
### Return Type
Recall that executing the `AdminListUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListUsersData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListUsersData {
  users: ({
    id: string;
    email: string;
    fullName?: string | null;
    role: string;
    createdAt: DateString;
  } & User_Key)[];
}
```
### Using `AdminListUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListUsers } from '@impact26/dataconnect-sdk';


// Call the `adminListUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
adminListUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `AdminListUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListUsersRef } from '@impact26/dataconnect-sdk';


// Call the `adminListUsersRef()` function to get a reference to the query.
const ref = adminListUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## AdminCohortStats
You can execute the `AdminCohortStats` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminCohortStats(options?: ExecuteQueryOptions): QueryPromise<AdminCohortStatsData, undefined>;

interface AdminCohortStatsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminCohortStatsData, undefined>;
}
export const adminCohortStatsRef: AdminCohortStatsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminCohortStats(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminCohortStatsData, undefined>;

interface AdminCohortStatsRef {
  ...
  (dc: DataConnect): QueryRef<AdminCohortStatsData, undefined>;
}
export const adminCohortStatsRef: AdminCohortStatsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminCohortStatsRef:
```typescript
const name = adminCohortStatsRef.operationName;
console.log(name);
```

### Variables
The `AdminCohortStats` query has no variables.
### Return Type
Recall that executing the `AdminCohortStats` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminCohortStatsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminCohortStatsData {
  quizAttempts: ({
    id: UUIDString;
    user: {
      id: string;
      email: string;
      fullName?: string | null;
    } & User_Key;
      quiz: {
        id: UUIDString;
        title: string;
      } & Quiz_Key;
        scorePct?: number | null;
        passed?: boolean | null;
        completedAt?: DateString | null;
        quizResponses_on_attempt: ({
          isCorrect?: boolean | null;
          pointsEarned?: number | null;
          pointsPossible?: number | null;
          question: {
            id: UUIDString;
            domain: string;
            difficulty: string;
            questionText: string;
            topicTags?: string | null;
          } & Question_Key;
        })[];
  } & QuizAttempt_Key)[];
}
```
### Using `AdminCohortStats`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminCohortStats } from '@impact26/dataconnect-sdk';


// Call the `adminCohortStats()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminCohortStats();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminCohortStats(dataConnect);

console.log(data.quizAttempts);

// Or, you can use the `Promise` API.
adminCohortStats().then((response) => {
  const data = response.data;
  console.log(data.quizAttempts);
});
```

### Using `AdminCohortStats`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminCohortStatsRef } from '@impact26/dataconnect-sdk';


// Call the `adminCohortStatsRef()` function to get a reference to the query.
const ref = adminCohortStatsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminCohortStatsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizAttempts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempts);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `impact26-connector` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  id: string;
  email: string;
  fullName?: string | null;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@impact26/dataconnect-sdk';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  id: ..., 
  email: ..., 
  fullName: ..., // optional
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ id: ..., email: ..., fullName: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@impact26/dataconnect-sdk';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  id: ..., 
  email: ..., 
  fullName: ..., // optional
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ id: ..., email: ..., fullName: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateUserRole
You can execute the `UpdateUserRole` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateUserRole(vars: UpdateUserRoleVariables): MutationPromise<UpdateUserRoleData, UpdateUserRoleVariables>;

interface UpdateUserRoleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserRoleVariables): MutationRef<UpdateUserRoleData, UpdateUserRoleVariables>;
}
export const updateUserRoleRef: UpdateUserRoleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserRole(dc: DataConnect, vars: UpdateUserRoleVariables): MutationPromise<UpdateUserRoleData, UpdateUserRoleVariables>;

interface UpdateUserRoleRef {
  ...
  (dc: DataConnect, vars: UpdateUserRoleVariables): MutationRef<UpdateUserRoleData, UpdateUserRoleVariables>;
}
export const updateUserRoleRef: UpdateUserRoleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserRoleRef:
```typescript
const name = updateUserRoleRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserRole` mutation requires an argument of type `UpdateUserRoleVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserRoleVariables {
  id: string;
  role: string;
}
```
### Return Type
Recall that executing the `UpdateUserRole` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserRoleData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserRoleData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserRole`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserRole, UpdateUserRoleVariables } from '@impact26/dataconnect-sdk';

// The `UpdateUserRole` mutation requires an argument of type `UpdateUserRoleVariables`:
const updateUserRoleVars: UpdateUserRoleVariables = {
  id: ..., 
  role: ..., 
};

// Call the `updateUserRole()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserRole(updateUserRoleVars);
// Variables can be defined inline as well.
const { data } = await updateUserRole({ id: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserRole(dataConnect, updateUserRoleVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserRole(updateUserRoleVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserRole`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserRoleRef, UpdateUserRoleVariables } from '@impact26/dataconnect-sdk';

// The `UpdateUserRole` mutation requires an argument of type `UpdateUserRoleVariables`:
const updateUserRoleVars: UpdateUserRoleVariables = {
  id: ..., 
  role: ..., 
};

// Call the `updateUserRoleRef()` function to get a reference to the mutation.
const ref = updateUserRoleRef(updateUserRoleVars);
// Variables can be defined inline as well.
const ref = updateUserRoleRef({ id: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserRoleRef(dataConnect, updateUserRoleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## CreateCourse
You can execute the `CreateCourse` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createCourse(vars: CreateCourseVariables): MutationPromise<CreateCourseData, CreateCourseVariables>;

interface CreateCourseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCourseVariables): MutationRef<CreateCourseData, CreateCourseVariables>;
}
export const createCourseRef: CreateCourseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCourse(dc: DataConnect, vars: CreateCourseVariables): MutationPromise<CreateCourseData, CreateCourseVariables>;

interface CreateCourseRef {
  ...
  (dc: DataConnect, vars: CreateCourseVariables): MutationRef<CreateCourseData, CreateCourseVariables>;
}
export const createCourseRef: CreateCourseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCourseRef:
```typescript
const name = createCourseRef.operationName;
console.log(name);
```

### Variables
The `CreateCourse` mutation requires an argument of type `CreateCourseVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCourseVariables {
  id: UUIDString;
  slug: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  createdById: string;
}
```
### Return Type
Recall that executing the `CreateCourse` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCourseData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCourseData {
  course_insert: Course_Key;
}
```
### Using `CreateCourse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCourse, CreateCourseVariables } from '@impact26/dataconnect-sdk';

// The `CreateCourse` mutation requires an argument of type `CreateCourseVariables`:
const createCourseVars: CreateCourseVariables = {
  id: ..., 
  slug: ..., 
  title: ..., 
  description: ..., // optional
  thumbnailUrl: ..., // optional
  createdById: ..., 
};

// Call the `createCourse()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCourse(createCourseVars);
// Variables can be defined inline as well.
const { data } = await createCourse({ id: ..., slug: ..., title: ..., description: ..., thumbnailUrl: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCourse(dataConnect, createCourseVars);

console.log(data.course_insert);

// Or, you can use the `Promise` API.
createCourse(createCourseVars).then((response) => {
  const data = response.data;
  console.log(data.course_insert);
});
```

### Using `CreateCourse`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCourseRef, CreateCourseVariables } from '@impact26/dataconnect-sdk';

// The `CreateCourse` mutation requires an argument of type `CreateCourseVariables`:
const createCourseVars: CreateCourseVariables = {
  id: ..., 
  slug: ..., 
  title: ..., 
  description: ..., // optional
  thumbnailUrl: ..., // optional
  createdById: ..., 
};

// Call the `createCourseRef()` function to get a reference to the mutation.
const ref = createCourseRef(createCourseVars);
// Variables can be defined inline as well.
const ref = createCourseRef({ id: ..., slug: ..., title: ..., description: ..., thumbnailUrl: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCourseRef(dataConnect, createCourseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.course_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.course_insert);
});
```

## UpdateCourse
You can execute the `UpdateCourse` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateCourse(vars: UpdateCourseVariables): MutationPromise<UpdateCourseData, UpdateCourseVariables>;

interface UpdateCourseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCourseVariables): MutationRef<UpdateCourseData, UpdateCourseVariables>;
}
export const updateCourseRef: UpdateCourseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateCourse(dc: DataConnect, vars: UpdateCourseVariables): MutationPromise<UpdateCourseData, UpdateCourseVariables>;

interface UpdateCourseRef {
  ...
  (dc: DataConnect, vars: UpdateCourseVariables): MutationRef<UpdateCourseData, UpdateCourseVariables>;
}
export const updateCourseRef: UpdateCourseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateCourseRef:
```typescript
const name = updateCourseRef.operationName;
console.log(name);
```

### Variables
The `UpdateCourse` mutation requires an argument of type `UpdateCourseVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateCourseVariables {
  id: UUIDString;
  title?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  status?: string | null;
  isPublished?: boolean | null;
  updatedById?: string | null;
  publishedAt?: DateString | null;
}
```
### Return Type
Recall that executing the `UpdateCourse` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateCourseData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateCourseData {
  course_update?: Course_Key | null;
}
```
### Using `UpdateCourse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateCourse, UpdateCourseVariables } from '@impact26/dataconnect-sdk';

// The `UpdateCourse` mutation requires an argument of type `UpdateCourseVariables`:
const updateCourseVars: UpdateCourseVariables = {
  id: ..., 
  title: ..., // optional
  description: ..., // optional
  thumbnailUrl: ..., // optional
  status: ..., // optional
  isPublished: ..., // optional
  updatedById: ..., // optional
  publishedAt: ..., // optional
};

// Call the `updateCourse()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCourse(updateCourseVars);
// Variables can be defined inline as well.
const { data } = await updateCourse({ id: ..., title: ..., description: ..., thumbnailUrl: ..., status: ..., isPublished: ..., updatedById: ..., publishedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateCourse(dataConnect, updateCourseVars);

console.log(data.course_update);

// Or, you can use the `Promise` API.
updateCourse(updateCourseVars).then((response) => {
  const data = response.data;
  console.log(data.course_update);
});
```

### Using `UpdateCourse`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateCourseRef, UpdateCourseVariables } from '@impact26/dataconnect-sdk';

// The `UpdateCourse` mutation requires an argument of type `UpdateCourseVariables`:
const updateCourseVars: UpdateCourseVariables = {
  id: ..., 
  title: ..., // optional
  description: ..., // optional
  thumbnailUrl: ..., // optional
  status: ..., // optional
  isPublished: ..., // optional
  updatedById: ..., // optional
  publishedAt: ..., // optional
};

// Call the `updateCourseRef()` function to get a reference to the mutation.
const ref = updateCourseRef(updateCourseVars);
// Variables can be defined inline as well.
const ref = updateCourseRef({ id: ..., title: ..., description: ..., thumbnailUrl: ..., status: ..., isPublished: ..., updatedById: ..., publishedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateCourseRef(dataConnect, updateCourseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.course_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.course_update);
});
```

## CreateModule
You can execute the `CreateModule` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createModule(vars: CreateModuleVariables): MutationPromise<CreateModuleData, CreateModuleVariables>;

interface CreateModuleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateModuleVariables): MutationRef<CreateModuleData, CreateModuleVariables>;
}
export const createModuleRef: CreateModuleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createModule(dc: DataConnect, vars: CreateModuleVariables): MutationPromise<CreateModuleData, CreateModuleVariables>;

interface CreateModuleRef {
  ...
  (dc: DataConnect, vars: CreateModuleVariables): MutationRef<CreateModuleData, CreateModuleVariables>;
}
export const createModuleRef: CreateModuleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createModuleRef:
```typescript
const name = createModuleRef.operationName;
console.log(name);
```

### Variables
The `CreateModule` mutation requires an argument of type `CreateModuleVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateModuleVariables {
  id: UUIDString;
  courseId: UUIDString;
  title: string;
  position: number;
}
```
### Return Type
Recall that executing the `CreateModule` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateModuleData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateModuleData {
  module_insert: Module_Key;
}
```
### Using `CreateModule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createModule, CreateModuleVariables } from '@impact26/dataconnect-sdk';

// The `CreateModule` mutation requires an argument of type `CreateModuleVariables`:
const createModuleVars: CreateModuleVariables = {
  id: ..., 
  courseId: ..., 
  title: ..., 
  position: ..., 
};

// Call the `createModule()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createModule(createModuleVars);
// Variables can be defined inline as well.
const { data } = await createModule({ id: ..., courseId: ..., title: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createModule(dataConnect, createModuleVars);

console.log(data.module_insert);

// Or, you can use the `Promise` API.
createModule(createModuleVars).then((response) => {
  const data = response.data;
  console.log(data.module_insert);
});
```

### Using `CreateModule`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createModuleRef, CreateModuleVariables } from '@impact26/dataconnect-sdk';

// The `CreateModule` mutation requires an argument of type `CreateModuleVariables`:
const createModuleVars: CreateModuleVariables = {
  id: ..., 
  courseId: ..., 
  title: ..., 
  position: ..., 
};

// Call the `createModuleRef()` function to get a reference to the mutation.
const ref = createModuleRef(createModuleVars);
// Variables can be defined inline as well.
const ref = createModuleRef({ id: ..., courseId: ..., title: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createModuleRef(dataConnect, createModuleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.module_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.module_insert);
});
```

## UpdateModule
You can execute the `UpdateModule` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateModule(vars: UpdateModuleVariables): MutationPromise<UpdateModuleData, UpdateModuleVariables>;

interface UpdateModuleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateModuleVariables): MutationRef<UpdateModuleData, UpdateModuleVariables>;
}
export const updateModuleRef: UpdateModuleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateModule(dc: DataConnect, vars: UpdateModuleVariables): MutationPromise<UpdateModuleData, UpdateModuleVariables>;

interface UpdateModuleRef {
  ...
  (dc: DataConnect, vars: UpdateModuleVariables): MutationRef<UpdateModuleData, UpdateModuleVariables>;
}
export const updateModuleRef: UpdateModuleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateModuleRef:
```typescript
const name = updateModuleRef.operationName;
console.log(name);
```

### Variables
The `UpdateModule` mutation requires an argument of type `UpdateModuleVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateModuleVariables {
  id: UUIDString;
  title?: string | null;
  description?: string | null;
  learningObjectives?: string | null;
  prerequisiteModuleIds?: string | null;
  position?: number | null;
  status?: string | null;
}
```
### Return Type
Recall that executing the `UpdateModule` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateModuleData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateModuleData {
  module_update?: Module_Key | null;
}
```
### Using `UpdateModule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateModule, UpdateModuleVariables } from '@impact26/dataconnect-sdk';

// The `UpdateModule` mutation requires an argument of type `UpdateModuleVariables`:
const updateModuleVars: UpdateModuleVariables = {
  id: ..., 
  title: ..., // optional
  description: ..., // optional
  learningObjectives: ..., // optional
  prerequisiteModuleIds: ..., // optional
  position: ..., // optional
  status: ..., // optional
};

// Call the `updateModule()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateModule(updateModuleVars);
// Variables can be defined inline as well.
const { data } = await updateModule({ id: ..., title: ..., description: ..., learningObjectives: ..., prerequisiteModuleIds: ..., position: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateModule(dataConnect, updateModuleVars);

console.log(data.module_update);

// Or, you can use the `Promise` API.
updateModule(updateModuleVars).then((response) => {
  const data = response.data;
  console.log(data.module_update);
});
```

### Using `UpdateModule`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateModuleRef, UpdateModuleVariables } from '@impact26/dataconnect-sdk';

// The `UpdateModule` mutation requires an argument of type `UpdateModuleVariables`:
const updateModuleVars: UpdateModuleVariables = {
  id: ..., 
  title: ..., // optional
  description: ..., // optional
  learningObjectives: ..., // optional
  prerequisiteModuleIds: ..., // optional
  position: ..., // optional
  status: ..., // optional
};

// Call the `updateModuleRef()` function to get a reference to the mutation.
const ref = updateModuleRef(updateModuleVars);
// Variables can be defined inline as well.
const ref = updateModuleRef({ id: ..., title: ..., description: ..., learningObjectives: ..., prerequisiteModuleIds: ..., position: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateModuleRef(dataConnect, updateModuleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.module_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.module_update);
});
```

## CreateLessonVersion
You can execute the `CreateLessonVersion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createLessonVersion(vars: CreateLessonVersionVariables): MutationPromise<CreateLessonVersionData, CreateLessonVersionVariables>;

interface CreateLessonVersionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateLessonVersionVariables): MutationRef<CreateLessonVersionData, CreateLessonVersionVariables>;
}
export const createLessonVersionRef: CreateLessonVersionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createLessonVersion(dc: DataConnect, vars: CreateLessonVersionVariables): MutationPromise<CreateLessonVersionData, CreateLessonVersionVariables>;

interface CreateLessonVersionRef {
  ...
  (dc: DataConnect, vars: CreateLessonVersionVariables): MutationRef<CreateLessonVersionData, CreateLessonVersionVariables>;
}
export const createLessonVersionRef: CreateLessonVersionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createLessonVersionRef:
```typescript
const name = createLessonVersionRef.operationName;
console.log(name);
```

### Variables
The `CreateLessonVersion` mutation requires an argument of type `CreateLessonVersionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateLessonVersionVariables {
  id: UUIDString;
  lessonId: UUIDString;
  contentJson?: string | null;
  videoPlaybackId?: string | null;
  versionNote?: string | null;
  createdById: string;
}
```
### Return Type
Recall that executing the `CreateLessonVersion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateLessonVersionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateLessonVersionData {
  lessonVersion_insert: LessonVersion_Key;
}
```
### Using `CreateLessonVersion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createLessonVersion, CreateLessonVersionVariables } from '@impact26/dataconnect-sdk';

// The `CreateLessonVersion` mutation requires an argument of type `CreateLessonVersionVariables`:
const createLessonVersionVars: CreateLessonVersionVariables = {
  id: ..., 
  lessonId: ..., 
  contentJson: ..., // optional
  videoPlaybackId: ..., // optional
  versionNote: ..., // optional
  createdById: ..., 
};

// Call the `createLessonVersion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createLessonVersion(createLessonVersionVars);
// Variables can be defined inline as well.
const { data } = await createLessonVersion({ id: ..., lessonId: ..., contentJson: ..., videoPlaybackId: ..., versionNote: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createLessonVersion(dataConnect, createLessonVersionVars);

console.log(data.lessonVersion_insert);

// Or, you can use the `Promise` API.
createLessonVersion(createLessonVersionVars).then((response) => {
  const data = response.data;
  console.log(data.lessonVersion_insert);
});
```

### Using `CreateLessonVersion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createLessonVersionRef, CreateLessonVersionVariables } from '@impact26/dataconnect-sdk';

// The `CreateLessonVersion` mutation requires an argument of type `CreateLessonVersionVariables`:
const createLessonVersionVars: CreateLessonVersionVariables = {
  id: ..., 
  lessonId: ..., 
  contentJson: ..., // optional
  videoPlaybackId: ..., // optional
  versionNote: ..., // optional
  createdById: ..., 
};

// Call the `createLessonVersionRef()` function to get a reference to the mutation.
const ref = createLessonVersionRef(createLessonVersionVars);
// Variables can be defined inline as well.
const ref = createLessonVersionRef({ id: ..., lessonId: ..., contentJson: ..., videoPlaybackId: ..., versionNote: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createLessonVersionRef(dataConnect, createLessonVersionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lessonVersion_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lessonVersion_insert);
});
```

## CreateLesson
You can execute the `CreateLesson` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createLesson(vars: CreateLessonVariables): MutationPromise<CreateLessonData, CreateLessonVariables>;

interface CreateLessonRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateLessonVariables): MutationRef<CreateLessonData, CreateLessonVariables>;
}
export const createLessonRef: CreateLessonRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createLesson(dc: DataConnect, vars: CreateLessonVariables): MutationPromise<CreateLessonData, CreateLessonVariables>;

interface CreateLessonRef {
  ...
  (dc: DataConnect, vars: CreateLessonVariables): MutationRef<CreateLessonData, CreateLessonVariables>;
}
export const createLessonRef: CreateLessonRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createLessonRef:
```typescript
const name = createLessonRef.operationName;
console.log(name);
```

### Variables
The `CreateLesson` mutation requires an argument of type `CreateLessonVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateLessonVariables {
  id: UUIDString;
  moduleId: UUIDString;
  title: string;
  position: number;
  lessonType: string;
}
```
### Return Type
Recall that executing the `CreateLesson` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateLessonData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateLessonData {
  lesson_insert: Lesson_Key;
}
```
### Using `CreateLesson`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createLesson, CreateLessonVariables } from '@impact26/dataconnect-sdk';

// The `CreateLesson` mutation requires an argument of type `CreateLessonVariables`:
const createLessonVars: CreateLessonVariables = {
  id: ..., 
  moduleId: ..., 
  title: ..., 
  position: ..., 
  lessonType: ..., 
};

// Call the `createLesson()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createLesson(createLessonVars);
// Variables can be defined inline as well.
const { data } = await createLesson({ id: ..., moduleId: ..., title: ..., position: ..., lessonType: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createLesson(dataConnect, createLessonVars);

console.log(data.lesson_insert);

// Or, you can use the `Promise` API.
createLesson(createLessonVars).then((response) => {
  const data = response.data;
  console.log(data.lesson_insert);
});
```

### Using `CreateLesson`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createLessonRef, CreateLessonVariables } from '@impact26/dataconnect-sdk';

// The `CreateLesson` mutation requires an argument of type `CreateLessonVariables`:
const createLessonVars: CreateLessonVariables = {
  id: ..., 
  moduleId: ..., 
  title: ..., 
  position: ..., 
  lessonType: ..., 
};

// Call the `createLessonRef()` function to get a reference to the mutation.
const ref = createLessonRef(createLessonVars);
// Variables can be defined inline as well.
const ref = createLessonRef({ id: ..., moduleId: ..., title: ..., position: ..., lessonType: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createLessonRef(dataConnect, createLessonVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lesson_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lesson_insert);
});
```

## UpdateLesson
You can execute the `UpdateLesson` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateLesson(vars: UpdateLessonVariables): MutationPromise<UpdateLessonData, UpdateLessonVariables>;

interface UpdateLessonRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateLessonVariables): MutationRef<UpdateLessonData, UpdateLessonVariables>;
}
export const updateLessonRef: UpdateLessonRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateLesson(dc: DataConnect, vars: UpdateLessonVariables): MutationPromise<UpdateLessonData, UpdateLessonVariables>;

interface UpdateLessonRef {
  ...
  (dc: DataConnect, vars: UpdateLessonVariables): MutationRef<UpdateLessonData, UpdateLessonVariables>;
}
export const updateLessonRef: UpdateLessonRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateLessonRef:
```typescript
const name = updateLessonRef.operationName;
console.log(name);
```

### Variables
The `UpdateLesson` mutation requires an argument of type `UpdateLessonVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateLessonVariables {
  id: UUIDString;
  title?: string | null;
  contentJson?: string | null;
  videoPlaybackId?: string | null;
  videoUrl?: string | null;
  quizId?: UUIDString | null;
  sourceMaterialId?: UUIDString | null;
  durationSeconds?: number | null;
  status?: string | null;
  isPublished?: boolean | null;
  updatedById?: string | null;
  publishedAt?: DateString | null;
}
```
### Return Type
Recall that executing the `UpdateLesson` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateLessonData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateLessonData {
  lesson_update?: Lesson_Key | null;
}
```
### Using `UpdateLesson`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateLesson, UpdateLessonVariables } from '@impact26/dataconnect-sdk';

// The `UpdateLesson` mutation requires an argument of type `UpdateLessonVariables`:
const updateLessonVars: UpdateLessonVariables = {
  id: ..., 
  title: ..., // optional
  contentJson: ..., // optional
  videoPlaybackId: ..., // optional
  videoUrl: ..., // optional
  quizId: ..., // optional
  sourceMaterialId: ..., // optional
  durationSeconds: ..., // optional
  status: ..., // optional
  isPublished: ..., // optional
  updatedById: ..., // optional
  publishedAt: ..., // optional
};

// Call the `updateLesson()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateLesson(updateLessonVars);
// Variables can be defined inline as well.
const { data } = await updateLesson({ id: ..., title: ..., contentJson: ..., videoPlaybackId: ..., videoUrl: ..., quizId: ..., sourceMaterialId: ..., durationSeconds: ..., status: ..., isPublished: ..., updatedById: ..., publishedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateLesson(dataConnect, updateLessonVars);

console.log(data.lesson_update);

// Or, you can use the `Promise` API.
updateLesson(updateLessonVars).then((response) => {
  const data = response.data;
  console.log(data.lesson_update);
});
```

### Using `UpdateLesson`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateLessonRef, UpdateLessonVariables } from '@impact26/dataconnect-sdk';

// The `UpdateLesson` mutation requires an argument of type `UpdateLessonVariables`:
const updateLessonVars: UpdateLessonVariables = {
  id: ..., 
  title: ..., // optional
  contentJson: ..., // optional
  videoPlaybackId: ..., // optional
  videoUrl: ..., // optional
  quizId: ..., // optional
  sourceMaterialId: ..., // optional
  durationSeconds: ..., // optional
  status: ..., // optional
  isPublished: ..., // optional
  updatedById: ..., // optional
  publishedAt: ..., // optional
};

// Call the `updateLessonRef()` function to get a reference to the mutation.
const ref = updateLessonRef(updateLessonVars);
// Variables can be defined inline as well.
const ref = updateLessonRef({ id: ..., title: ..., contentJson: ..., videoPlaybackId: ..., videoUrl: ..., quizId: ..., sourceMaterialId: ..., durationSeconds: ..., status: ..., isPublished: ..., updatedById: ..., publishedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateLessonRef(dataConnect, updateLessonVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lesson_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lesson_update);
});
```

## DeleteLesson
You can execute the `DeleteLesson` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteLesson(vars: DeleteLessonVariables): MutationPromise<DeleteLessonData, DeleteLessonVariables>;

interface DeleteLessonRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteLessonVariables): MutationRef<DeleteLessonData, DeleteLessonVariables>;
}
export const deleteLessonRef: DeleteLessonRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteLesson(dc: DataConnect, vars: DeleteLessonVariables): MutationPromise<DeleteLessonData, DeleteLessonVariables>;

interface DeleteLessonRef {
  ...
  (dc: DataConnect, vars: DeleteLessonVariables): MutationRef<DeleteLessonData, DeleteLessonVariables>;
}
export const deleteLessonRef: DeleteLessonRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteLessonRef:
```typescript
const name = deleteLessonRef.operationName;
console.log(name);
```

### Variables
The `DeleteLesson` mutation requires an argument of type `DeleteLessonVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteLessonVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteLesson` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteLessonData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteLessonData {
  lesson_delete?: Lesson_Key | null;
}
```
### Using `DeleteLesson`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteLesson, DeleteLessonVariables } from '@impact26/dataconnect-sdk';

// The `DeleteLesson` mutation requires an argument of type `DeleteLessonVariables`:
const deleteLessonVars: DeleteLessonVariables = {
  id: ..., 
};

// Call the `deleteLesson()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteLesson(deleteLessonVars);
// Variables can be defined inline as well.
const { data } = await deleteLesson({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteLesson(dataConnect, deleteLessonVars);

console.log(data.lesson_delete);

// Or, you can use the `Promise` API.
deleteLesson(deleteLessonVars).then((response) => {
  const data = response.data;
  console.log(data.lesson_delete);
});
```

### Using `DeleteLesson`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteLessonRef, DeleteLessonVariables } from '@impact26/dataconnect-sdk';

// The `DeleteLesson` mutation requires an argument of type `DeleteLessonVariables`:
const deleteLessonVars: DeleteLessonVariables = {
  id: ..., 
};

// Call the `deleteLessonRef()` function to get a reference to the mutation.
const ref = deleteLessonRef(deleteLessonVars);
// Variables can be defined inline as well.
const ref = deleteLessonRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteLessonRef(dataConnect, deleteLessonVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lesson_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lesson_delete);
});
```

## DeleteModule
You can execute the `DeleteModule` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteModule(vars: DeleteModuleVariables): MutationPromise<DeleteModuleData, DeleteModuleVariables>;

interface DeleteModuleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteModuleVariables): MutationRef<DeleteModuleData, DeleteModuleVariables>;
}
export const deleteModuleRef: DeleteModuleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteModule(dc: DataConnect, vars: DeleteModuleVariables): MutationPromise<DeleteModuleData, DeleteModuleVariables>;

interface DeleteModuleRef {
  ...
  (dc: DataConnect, vars: DeleteModuleVariables): MutationRef<DeleteModuleData, DeleteModuleVariables>;
}
export const deleteModuleRef: DeleteModuleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteModuleRef:
```typescript
const name = deleteModuleRef.operationName;
console.log(name);
```

### Variables
The `DeleteModule` mutation requires an argument of type `DeleteModuleVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteModuleVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteModule` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteModuleData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteModuleData {
  module_delete?: Module_Key | null;
}
```
### Using `DeleteModule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteModule, DeleteModuleVariables } from '@impact26/dataconnect-sdk';

// The `DeleteModule` mutation requires an argument of type `DeleteModuleVariables`:
const deleteModuleVars: DeleteModuleVariables = {
  id: ..., 
};

// Call the `deleteModule()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteModule(deleteModuleVars);
// Variables can be defined inline as well.
const { data } = await deleteModule({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteModule(dataConnect, deleteModuleVars);

console.log(data.module_delete);

// Or, you can use the `Promise` API.
deleteModule(deleteModuleVars).then((response) => {
  const data = response.data;
  console.log(data.module_delete);
});
```

### Using `DeleteModule`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteModuleRef, DeleteModuleVariables } from '@impact26/dataconnect-sdk';

// The `DeleteModule` mutation requires an argument of type `DeleteModuleVariables`:
const deleteModuleVars: DeleteModuleVariables = {
  id: ..., 
};

// Call the `deleteModuleRef()` function to get a reference to the mutation.
const ref = deleteModuleRef(deleteModuleVars);
// Variables can be defined inline as well.
const ref = deleteModuleRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteModuleRef(dataConnect, deleteModuleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.module_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.module_delete);
});
```

## DeleteLessonVersionsForLesson
You can execute the `DeleteLessonVersionsForLesson` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteLessonVersionsForLesson(vars: DeleteLessonVersionsForLessonVariables): MutationPromise<DeleteLessonVersionsForLessonData, DeleteLessonVersionsForLessonVariables>;

interface DeleteLessonVersionsForLessonRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteLessonVersionsForLessonVariables): MutationRef<DeleteLessonVersionsForLessonData, DeleteLessonVersionsForLessonVariables>;
}
export const deleteLessonVersionsForLessonRef: DeleteLessonVersionsForLessonRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteLessonVersionsForLesson(dc: DataConnect, vars: DeleteLessonVersionsForLessonVariables): MutationPromise<DeleteLessonVersionsForLessonData, DeleteLessonVersionsForLessonVariables>;

interface DeleteLessonVersionsForLessonRef {
  ...
  (dc: DataConnect, vars: DeleteLessonVersionsForLessonVariables): MutationRef<DeleteLessonVersionsForLessonData, DeleteLessonVersionsForLessonVariables>;
}
export const deleteLessonVersionsForLessonRef: DeleteLessonVersionsForLessonRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteLessonVersionsForLessonRef:
```typescript
const name = deleteLessonVersionsForLessonRef.operationName;
console.log(name);
```

### Variables
The `DeleteLessonVersionsForLesson` mutation requires an argument of type `DeleteLessonVersionsForLessonVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteLessonVersionsForLessonVariables {
  lessonId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteLessonVersionsForLesson` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteLessonVersionsForLessonData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteLessonVersionsForLessonData {
  lessonVersion_deleteMany: number;
}
```
### Using `DeleteLessonVersionsForLesson`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteLessonVersionsForLesson, DeleteLessonVersionsForLessonVariables } from '@impact26/dataconnect-sdk';

// The `DeleteLessonVersionsForLesson` mutation requires an argument of type `DeleteLessonVersionsForLessonVariables`:
const deleteLessonVersionsForLessonVars: DeleteLessonVersionsForLessonVariables = {
  lessonId: ..., 
};

// Call the `deleteLessonVersionsForLesson()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteLessonVersionsForLesson(deleteLessonVersionsForLessonVars);
// Variables can be defined inline as well.
const { data } = await deleteLessonVersionsForLesson({ lessonId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteLessonVersionsForLesson(dataConnect, deleteLessonVersionsForLessonVars);

console.log(data.lessonVersion_deleteMany);

// Or, you can use the `Promise` API.
deleteLessonVersionsForLesson(deleteLessonVersionsForLessonVars).then((response) => {
  const data = response.data;
  console.log(data.lessonVersion_deleteMany);
});
```

### Using `DeleteLessonVersionsForLesson`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteLessonVersionsForLessonRef, DeleteLessonVersionsForLessonVariables } from '@impact26/dataconnect-sdk';

// The `DeleteLessonVersionsForLesson` mutation requires an argument of type `DeleteLessonVersionsForLessonVariables`:
const deleteLessonVersionsForLessonVars: DeleteLessonVersionsForLessonVariables = {
  lessonId: ..., 
};

// Call the `deleteLessonVersionsForLessonRef()` function to get a reference to the mutation.
const ref = deleteLessonVersionsForLessonRef(deleteLessonVersionsForLessonVars);
// Variables can be defined inline as well.
const ref = deleteLessonVersionsForLessonRef({ lessonId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteLessonVersionsForLessonRef(dataConnect, deleteLessonVersionsForLessonVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lessonVersion_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lessonVersion_deleteMany);
});
```

## DeleteSourceLinksForLesson
You can execute the `DeleteSourceLinksForLesson` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteSourceLinksForLesson(vars: DeleteSourceLinksForLessonVariables): MutationPromise<DeleteSourceLinksForLessonData, DeleteSourceLinksForLessonVariables>;

interface DeleteSourceLinksForLessonRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSourceLinksForLessonVariables): MutationRef<DeleteSourceLinksForLessonData, DeleteSourceLinksForLessonVariables>;
}
export const deleteSourceLinksForLessonRef: DeleteSourceLinksForLessonRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSourceLinksForLesson(dc: DataConnect, vars: DeleteSourceLinksForLessonVariables): MutationPromise<DeleteSourceLinksForLessonData, DeleteSourceLinksForLessonVariables>;

interface DeleteSourceLinksForLessonRef {
  ...
  (dc: DataConnect, vars: DeleteSourceLinksForLessonVariables): MutationRef<DeleteSourceLinksForLessonData, DeleteSourceLinksForLessonVariables>;
}
export const deleteSourceLinksForLessonRef: DeleteSourceLinksForLessonRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSourceLinksForLessonRef:
```typescript
const name = deleteSourceLinksForLessonRef.operationName;
console.log(name);
```

### Variables
The `DeleteSourceLinksForLesson` mutation requires an argument of type `DeleteSourceLinksForLessonVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSourceLinksForLessonVariables {
  lessonId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteSourceLinksForLesson` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSourceLinksForLessonData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSourceLinksForLessonData {
  contentSourceLink_deleteMany: number;
}
```
### Using `DeleteSourceLinksForLesson`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSourceLinksForLesson, DeleteSourceLinksForLessonVariables } from '@impact26/dataconnect-sdk';

// The `DeleteSourceLinksForLesson` mutation requires an argument of type `DeleteSourceLinksForLessonVariables`:
const deleteSourceLinksForLessonVars: DeleteSourceLinksForLessonVariables = {
  lessonId: ..., 
};

// Call the `deleteSourceLinksForLesson()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSourceLinksForLesson(deleteSourceLinksForLessonVars);
// Variables can be defined inline as well.
const { data } = await deleteSourceLinksForLesson({ lessonId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSourceLinksForLesson(dataConnect, deleteSourceLinksForLessonVars);

console.log(data.contentSourceLink_deleteMany);

// Or, you can use the `Promise` API.
deleteSourceLinksForLesson(deleteSourceLinksForLessonVars).then((response) => {
  const data = response.data;
  console.log(data.contentSourceLink_deleteMany);
});
```

### Using `DeleteSourceLinksForLesson`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSourceLinksForLessonRef, DeleteSourceLinksForLessonVariables } from '@impact26/dataconnect-sdk';

// The `DeleteSourceLinksForLesson` mutation requires an argument of type `DeleteSourceLinksForLessonVariables`:
const deleteSourceLinksForLessonVars: DeleteSourceLinksForLessonVariables = {
  lessonId: ..., 
};

// Call the `deleteSourceLinksForLessonRef()` function to get a reference to the mutation.
const ref = deleteSourceLinksForLessonRef(deleteSourceLinksForLessonVars);
// Variables can be defined inline as well.
const ref = deleteSourceLinksForLessonRef({ lessonId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSourceLinksForLessonRef(dataConnect, deleteSourceLinksForLessonVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.contentSourceLink_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.contentSourceLink_deleteMany);
});
```

## DeleteSourceLinksForQuestion
You can execute the `DeleteSourceLinksForQuestion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteSourceLinksForQuestion(vars: DeleteSourceLinksForQuestionVariables): MutationPromise<DeleteSourceLinksForQuestionData, DeleteSourceLinksForQuestionVariables>;

interface DeleteSourceLinksForQuestionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSourceLinksForQuestionVariables): MutationRef<DeleteSourceLinksForQuestionData, DeleteSourceLinksForQuestionVariables>;
}
export const deleteSourceLinksForQuestionRef: DeleteSourceLinksForQuestionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSourceLinksForQuestion(dc: DataConnect, vars: DeleteSourceLinksForQuestionVariables): MutationPromise<DeleteSourceLinksForQuestionData, DeleteSourceLinksForQuestionVariables>;

interface DeleteSourceLinksForQuestionRef {
  ...
  (dc: DataConnect, vars: DeleteSourceLinksForQuestionVariables): MutationRef<DeleteSourceLinksForQuestionData, DeleteSourceLinksForQuestionVariables>;
}
export const deleteSourceLinksForQuestionRef: DeleteSourceLinksForQuestionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSourceLinksForQuestionRef:
```typescript
const name = deleteSourceLinksForQuestionRef.operationName;
console.log(name);
```

### Variables
The `DeleteSourceLinksForQuestion` mutation requires an argument of type `DeleteSourceLinksForQuestionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSourceLinksForQuestionVariables {
  questionId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteSourceLinksForQuestion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSourceLinksForQuestionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSourceLinksForQuestionData {
  contentSourceLink_deleteMany: number;
}
```
### Using `DeleteSourceLinksForQuestion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSourceLinksForQuestion, DeleteSourceLinksForQuestionVariables } from '@impact26/dataconnect-sdk';

// The `DeleteSourceLinksForQuestion` mutation requires an argument of type `DeleteSourceLinksForQuestionVariables`:
const deleteSourceLinksForQuestionVars: DeleteSourceLinksForQuestionVariables = {
  questionId: ..., 
};

// Call the `deleteSourceLinksForQuestion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSourceLinksForQuestion(deleteSourceLinksForQuestionVars);
// Variables can be defined inline as well.
const { data } = await deleteSourceLinksForQuestion({ questionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSourceLinksForQuestion(dataConnect, deleteSourceLinksForQuestionVars);

console.log(data.contentSourceLink_deleteMany);

// Or, you can use the `Promise` API.
deleteSourceLinksForQuestion(deleteSourceLinksForQuestionVars).then((response) => {
  const data = response.data;
  console.log(data.contentSourceLink_deleteMany);
});
```

### Using `DeleteSourceLinksForQuestion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSourceLinksForQuestionRef, DeleteSourceLinksForQuestionVariables } from '@impact26/dataconnect-sdk';

// The `DeleteSourceLinksForQuestion` mutation requires an argument of type `DeleteSourceLinksForQuestionVariables`:
const deleteSourceLinksForQuestionVars: DeleteSourceLinksForQuestionVariables = {
  questionId: ..., 
};

// Call the `deleteSourceLinksForQuestionRef()` function to get a reference to the mutation.
const ref = deleteSourceLinksForQuestionRef(deleteSourceLinksForQuestionVars);
// Variables can be defined inline as well.
const ref = deleteSourceLinksForQuestionRef({ questionId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSourceLinksForQuestionRef(dataConnect, deleteSourceLinksForQuestionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.contentSourceLink_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.contentSourceLink_deleteMany);
});
```

## DeleteSourceLinksForMaterial
You can execute the `DeleteSourceLinksForMaterial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteSourceLinksForMaterial(vars: DeleteSourceLinksForMaterialVariables): MutationPromise<DeleteSourceLinksForMaterialData, DeleteSourceLinksForMaterialVariables>;

interface DeleteSourceLinksForMaterialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSourceLinksForMaterialVariables): MutationRef<DeleteSourceLinksForMaterialData, DeleteSourceLinksForMaterialVariables>;
}
export const deleteSourceLinksForMaterialRef: DeleteSourceLinksForMaterialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSourceLinksForMaterial(dc: DataConnect, vars: DeleteSourceLinksForMaterialVariables): MutationPromise<DeleteSourceLinksForMaterialData, DeleteSourceLinksForMaterialVariables>;

interface DeleteSourceLinksForMaterialRef {
  ...
  (dc: DataConnect, vars: DeleteSourceLinksForMaterialVariables): MutationRef<DeleteSourceLinksForMaterialData, DeleteSourceLinksForMaterialVariables>;
}
export const deleteSourceLinksForMaterialRef: DeleteSourceLinksForMaterialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSourceLinksForMaterialRef:
```typescript
const name = deleteSourceLinksForMaterialRef.operationName;
console.log(name);
```

### Variables
The `DeleteSourceLinksForMaterial` mutation requires an argument of type `DeleteSourceLinksForMaterialVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSourceLinksForMaterialVariables {
  sourceMaterialId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteSourceLinksForMaterial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSourceLinksForMaterialData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSourceLinksForMaterialData {
  contentSourceLink_deleteMany: number;
}
```
### Using `DeleteSourceLinksForMaterial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSourceLinksForMaterial, DeleteSourceLinksForMaterialVariables } from '@impact26/dataconnect-sdk';

// The `DeleteSourceLinksForMaterial` mutation requires an argument of type `DeleteSourceLinksForMaterialVariables`:
const deleteSourceLinksForMaterialVars: DeleteSourceLinksForMaterialVariables = {
  sourceMaterialId: ..., 
};

// Call the `deleteSourceLinksForMaterial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSourceLinksForMaterial(deleteSourceLinksForMaterialVars);
// Variables can be defined inline as well.
const { data } = await deleteSourceLinksForMaterial({ sourceMaterialId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSourceLinksForMaterial(dataConnect, deleteSourceLinksForMaterialVars);

console.log(data.contentSourceLink_deleteMany);

// Or, you can use the `Promise` API.
deleteSourceLinksForMaterial(deleteSourceLinksForMaterialVars).then((response) => {
  const data = response.data;
  console.log(data.contentSourceLink_deleteMany);
});
```

### Using `DeleteSourceLinksForMaterial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSourceLinksForMaterialRef, DeleteSourceLinksForMaterialVariables } from '@impact26/dataconnect-sdk';

// The `DeleteSourceLinksForMaterial` mutation requires an argument of type `DeleteSourceLinksForMaterialVariables`:
const deleteSourceLinksForMaterialVars: DeleteSourceLinksForMaterialVariables = {
  sourceMaterialId: ..., 
};

// Call the `deleteSourceLinksForMaterialRef()` function to get a reference to the mutation.
const ref = deleteSourceLinksForMaterialRef(deleteSourceLinksForMaterialVars);
// Variables can be defined inline as well.
const ref = deleteSourceLinksForMaterialRef({ sourceMaterialId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSourceLinksForMaterialRef(dataConnect, deleteSourceLinksForMaterialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.contentSourceLink_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.contentSourceLink_deleteMany);
});
```

## DeleteUserLessonProgressForLesson
You can execute the `DeleteUserLessonProgressForLesson` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteUserLessonProgressForLesson(vars: DeleteUserLessonProgressForLessonVariables): MutationPromise<DeleteUserLessonProgressForLessonData, DeleteUserLessonProgressForLessonVariables>;

interface DeleteUserLessonProgressForLessonRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserLessonProgressForLessonVariables): MutationRef<DeleteUserLessonProgressForLessonData, DeleteUserLessonProgressForLessonVariables>;
}
export const deleteUserLessonProgressForLessonRef: DeleteUserLessonProgressForLessonRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUserLessonProgressForLesson(dc: DataConnect, vars: DeleteUserLessonProgressForLessonVariables): MutationPromise<DeleteUserLessonProgressForLessonData, DeleteUserLessonProgressForLessonVariables>;

interface DeleteUserLessonProgressForLessonRef {
  ...
  (dc: DataConnect, vars: DeleteUserLessonProgressForLessonVariables): MutationRef<DeleteUserLessonProgressForLessonData, DeleteUserLessonProgressForLessonVariables>;
}
export const deleteUserLessonProgressForLessonRef: DeleteUserLessonProgressForLessonRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserLessonProgressForLessonRef:
```typescript
const name = deleteUserLessonProgressForLessonRef.operationName;
console.log(name);
```

### Variables
The `DeleteUserLessonProgressForLesson` mutation requires an argument of type `DeleteUserLessonProgressForLessonVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteUserLessonProgressForLessonVariables {
  lessonId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteUserLessonProgressForLesson` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserLessonProgressForLessonData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserLessonProgressForLessonData {
  userLessonProgress_deleteMany: number;
}
```
### Using `DeleteUserLessonProgressForLesson`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUserLessonProgressForLesson, DeleteUserLessonProgressForLessonVariables } from '@impact26/dataconnect-sdk';

// The `DeleteUserLessonProgressForLesson` mutation requires an argument of type `DeleteUserLessonProgressForLessonVariables`:
const deleteUserLessonProgressForLessonVars: DeleteUserLessonProgressForLessonVariables = {
  lessonId: ..., 
};

// Call the `deleteUserLessonProgressForLesson()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUserLessonProgressForLesson(deleteUserLessonProgressForLessonVars);
// Variables can be defined inline as well.
const { data } = await deleteUserLessonProgressForLesson({ lessonId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUserLessonProgressForLesson(dataConnect, deleteUserLessonProgressForLessonVars);

console.log(data.userLessonProgress_deleteMany);

// Or, you can use the `Promise` API.
deleteUserLessonProgressForLesson(deleteUserLessonProgressForLessonVars).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgress_deleteMany);
});
```

### Using `DeleteUserLessonProgressForLesson`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserLessonProgressForLessonRef, DeleteUserLessonProgressForLessonVariables } from '@impact26/dataconnect-sdk';

// The `DeleteUserLessonProgressForLesson` mutation requires an argument of type `DeleteUserLessonProgressForLessonVariables`:
const deleteUserLessonProgressForLessonVars: DeleteUserLessonProgressForLessonVariables = {
  lessonId: ..., 
};

// Call the `deleteUserLessonProgressForLessonRef()` function to get a reference to the mutation.
const ref = deleteUserLessonProgressForLessonRef(deleteUserLessonProgressForLessonVars);
// Variables can be defined inline as well.
const ref = deleteUserLessonProgressForLessonRef({ lessonId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserLessonProgressForLessonRef(dataConnect, deleteUserLessonProgressForLessonVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userLessonProgress_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgress_deleteMany);
});
```

## DeleteIngestionJobsForMaterial
You can execute the `DeleteIngestionJobsForMaterial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteIngestionJobsForMaterial(vars: DeleteIngestionJobsForMaterialVariables): MutationPromise<DeleteIngestionJobsForMaterialData, DeleteIngestionJobsForMaterialVariables>;

interface DeleteIngestionJobsForMaterialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteIngestionJobsForMaterialVariables): MutationRef<DeleteIngestionJobsForMaterialData, DeleteIngestionJobsForMaterialVariables>;
}
export const deleteIngestionJobsForMaterialRef: DeleteIngestionJobsForMaterialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteIngestionJobsForMaterial(dc: DataConnect, vars: DeleteIngestionJobsForMaterialVariables): MutationPromise<DeleteIngestionJobsForMaterialData, DeleteIngestionJobsForMaterialVariables>;

interface DeleteIngestionJobsForMaterialRef {
  ...
  (dc: DataConnect, vars: DeleteIngestionJobsForMaterialVariables): MutationRef<DeleteIngestionJobsForMaterialData, DeleteIngestionJobsForMaterialVariables>;
}
export const deleteIngestionJobsForMaterialRef: DeleteIngestionJobsForMaterialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteIngestionJobsForMaterialRef:
```typescript
const name = deleteIngestionJobsForMaterialRef.operationName;
console.log(name);
```

### Variables
The `DeleteIngestionJobsForMaterial` mutation requires an argument of type `DeleteIngestionJobsForMaterialVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteIngestionJobsForMaterialVariables {
  sourceMaterialId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteIngestionJobsForMaterial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteIngestionJobsForMaterialData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteIngestionJobsForMaterialData {
  ingestionJob_deleteMany: number;
}
```
### Using `DeleteIngestionJobsForMaterial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteIngestionJobsForMaterial, DeleteIngestionJobsForMaterialVariables } from '@impact26/dataconnect-sdk';

// The `DeleteIngestionJobsForMaterial` mutation requires an argument of type `DeleteIngestionJobsForMaterialVariables`:
const deleteIngestionJobsForMaterialVars: DeleteIngestionJobsForMaterialVariables = {
  sourceMaterialId: ..., 
};

// Call the `deleteIngestionJobsForMaterial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteIngestionJobsForMaterial(deleteIngestionJobsForMaterialVars);
// Variables can be defined inline as well.
const { data } = await deleteIngestionJobsForMaterial({ sourceMaterialId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteIngestionJobsForMaterial(dataConnect, deleteIngestionJobsForMaterialVars);

console.log(data.ingestionJob_deleteMany);

// Or, you can use the `Promise` API.
deleteIngestionJobsForMaterial(deleteIngestionJobsForMaterialVars).then((response) => {
  const data = response.data;
  console.log(data.ingestionJob_deleteMany);
});
```

### Using `DeleteIngestionJobsForMaterial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteIngestionJobsForMaterialRef, DeleteIngestionJobsForMaterialVariables } from '@impact26/dataconnect-sdk';

// The `DeleteIngestionJobsForMaterial` mutation requires an argument of type `DeleteIngestionJobsForMaterialVariables`:
const deleteIngestionJobsForMaterialVars: DeleteIngestionJobsForMaterialVariables = {
  sourceMaterialId: ..., 
};

// Call the `deleteIngestionJobsForMaterialRef()` function to get a reference to the mutation.
const ref = deleteIngestionJobsForMaterialRef(deleteIngestionJobsForMaterialVars);
// Variables can be defined inline as well.
const ref = deleteIngestionJobsForMaterialRef({ sourceMaterialId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteIngestionJobsForMaterialRef(dataConnect, deleteIngestionJobsForMaterialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.ingestionJob_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.ingestionJob_deleteMany);
});
```

## DeleteSourceMaterial
You can execute the `DeleteSourceMaterial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteSourceMaterial(vars: DeleteSourceMaterialVariables): MutationPromise<DeleteSourceMaterialData, DeleteSourceMaterialVariables>;

interface DeleteSourceMaterialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSourceMaterialVariables): MutationRef<DeleteSourceMaterialData, DeleteSourceMaterialVariables>;
}
export const deleteSourceMaterialRef: DeleteSourceMaterialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSourceMaterial(dc: DataConnect, vars: DeleteSourceMaterialVariables): MutationPromise<DeleteSourceMaterialData, DeleteSourceMaterialVariables>;

interface DeleteSourceMaterialRef {
  ...
  (dc: DataConnect, vars: DeleteSourceMaterialVariables): MutationRef<DeleteSourceMaterialData, DeleteSourceMaterialVariables>;
}
export const deleteSourceMaterialRef: DeleteSourceMaterialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSourceMaterialRef:
```typescript
const name = deleteSourceMaterialRef.operationName;
console.log(name);
```

### Variables
The `DeleteSourceMaterial` mutation requires an argument of type `DeleteSourceMaterialVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSourceMaterialVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteSourceMaterial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSourceMaterialData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSourceMaterialData {
  sourceMaterial_delete?: SourceMaterial_Key | null;
}
```
### Using `DeleteSourceMaterial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSourceMaterial, DeleteSourceMaterialVariables } from '@impact26/dataconnect-sdk';

// The `DeleteSourceMaterial` mutation requires an argument of type `DeleteSourceMaterialVariables`:
const deleteSourceMaterialVars: DeleteSourceMaterialVariables = {
  id: ..., 
};

// Call the `deleteSourceMaterial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSourceMaterial(deleteSourceMaterialVars);
// Variables can be defined inline as well.
const { data } = await deleteSourceMaterial({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSourceMaterial(dataConnect, deleteSourceMaterialVars);

console.log(data.sourceMaterial_delete);

// Or, you can use the `Promise` API.
deleteSourceMaterial(deleteSourceMaterialVars).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterial_delete);
});
```

### Using `DeleteSourceMaterial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSourceMaterialRef, DeleteSourceMaterialVariables } from '@impact26/dataconnect-sdk';

// The `DeleteSourceMaterial` mutation requires an argument of type `DeleteSourceMaterialVariables`:
const deleteSourceMaterialVars: DeleteSourceMaterialVariables = {
  id: ..., 
};

// Call the `deleteSourceMaterialRef()` function to get a reference to the mutation.
const ref = deleteSourceMaterialRef(deleteSourceMaterialVars);
// Variables can be defined inline as well.
const ref = deleteSourceMaterialRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSourceMaterialRef(dataConnect, deleteSourceMaterialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sourceMaterial_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterial_delete);
});
```

## CreateSourceMaterial
You can execute the `CreateSourceMaterial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createSourceMaterial(vars: CreateSourceMaterialVariables): MutationPromise<CreateSourceMaterialData, CreateSourceMaterialVariables>;

interface CreateSourceMaterialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSourceMaterialVariables): MutationRef<CreateSourceMaterialData, CreateSourceMaterialVariables>;
}
export const createSourceMaterialRef: CreateSourceMaterialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSourceMaterial(dc: DataConnect, vars: CreateSourceMaterialVariables): MutationPromise<CreateSourceMaterialData, CreateSourceMaterialVariables>;

interface CreateSourceMaterialRef {
  ...
  (dc: DataConnect, vars: CreateSourceMaterialVariables): MutationRef<CreateSourceMaterialData, CreateSourceMaterialVariables>;
}
export const createSourceMaterialRef: CreateSourceMaterialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSourceMaterialRef:
```typescript
const name = createSourceMaterialRef.operationName;
console.log(name);
```

### Variables
The `CreateSourceMaterial` mutation requires an argument of type `CreateSourceMaterialVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateSourceMaterialVariables {
  id: UUIDString;
  title: string;
  fileName: string;
  fileType: string;
  storagePath: string;
  downloadUrl?: string | null;
  extractedText?: string | null;
  metadataJson?: string | null;
  status: string;
  uploadedById?: string | null;
}
```
### Return Type
Recall that executing the `CreateSourceMaterial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSourceMaterialData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSourceMaterialData {
  sourceMaterial_insert: SourceMaterial_Key;
}
```
### Using `CreateSourceMaterial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSourceMaterial, CreateSourceMaterialVariables } from '@impact26/dataconnect-sdk';

// The `CreateSourceMaterial` mutation requires an argument of type `CreateSourceMaterialVariables`:
const createSourceMaterialVars: CreateSourceMaterialVariables = {
  id: ..., 
  title: ..., 
  fileName: ..., 
  fileType: ..., 
  storagePath: ..., 
  downloadUrl: ..., // optional
  extractedText: ..., // optional
  metadataJson: ..., // optional
  status: ..., 
  uploadedById: ..., // optional
};

// Call the `createSourceMaterial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSourceMaterial(createSourceMaterialVars);
// Variables can be defined inline as well.
const { data } = await createSourceMaterial({ id: ..., title: ..., fileName: ..., fileType: ..., storagePath: ..., downloadUrl: ..., extractedText: ..., metadataJson: ..., status: ..., uploadedById: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSourceMaterial(dataConnect, createSourceMaterialVars);

console.log(data.sourceMaterial_insert);

// Or, you can use the `Promise` API.
createSourceMaterial(createSourceMaterialVars).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterial_insert);
});
```

### Using `CreateSourceMaterial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSourceMaterialRef, CreateSourceMaterialVariables } from '@impact26/dataconnect-sdk';

// The `CreateSourceMaterial` mutation requires an argument of type `CreateSourceMaterialVariables`:
const createSourceMaterialVars: CreateSourceMaterialVariables = {
  id: ..., 
  title: ..., 
  fileName: ..., 
  fileType: ..., 
  storagePath: ..., 
  downloadUrl: ..., // optional
  extractedText: ..., // optional
  metadataJson: ..., // optional
  status: ..., 
  uploadedById: ..., // optional
};

// Call the `createSourceMaterialRef()` function to get a reference to the mutation.
const ref = createSourceMaterialRef(createSourceMaterialVars);
// Variables can be defined inline as well.
const ref = createSourceMaterialRef({ id: ..., title: ..., fileName: ..., fileType: ..., storagePath: ..., downloadUrl: ..., extractedText: ..., metadataJson: ..., status: ..., uploadedById: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSourceMaterialRef(dataConnect, createSourceMaterialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sourceMaterial_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterial_insert);
});
```

## CreateIngestionJob
You can execute the `CreateIngestionJob` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createIngestionJob(vars: CreateIngestionJobVariables): MutationPromise<CreateIngestionJobData, CreateIngestionJobVariables>;

interface CreateIngestionJobRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateIngestionJobVariables): MutationRef<CreateIngestionJobData, CreateIngestionJobVariables>;
}
export const createIngestionJobRef: CreateIngestionJobRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createIngestionJob(dc: DataConnect, vars: CreateIngestionJobVariables): MutationPromise<CreateIngestionJobData, CreateIngestionJobVariables>;

interface CreateIngestionJobRef {
  ...
  (dc: DataConnect, vars: CreateIngestionJobVariables): MutationRef<CreateIngestionJobData, CreateIngestionJobVariables>;
}
export const createIngestionJobRef: CreateIngestionJobRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createIngestionJobRef:
```typescript
const name = createIngestionJobRef.operationName;
console.log(name);
```

### Variables
The `CreateIngestionJob` mutation requires an argument of type `CreateIngestionJobVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateIngestionJobVariables {
  id: UUIDString;
  sourceMaterialId: UUIDString;
  status: string;
  parser: string;
  extractedCharacters: number;
  errorMessage?: string | null;
  completedAt?: DateString | null;
}
```
### Return Type
Recall that executing the `CreateIngestionJob` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateIngestionJobData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateIngestionJobData {
  ingestionJob_insert: IngestionJob_Key;
}
```
### Using `CreateIngestionJob`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createIngestionJob, CreateIngestionJobVariables } from '@impact26/dataconnect-sdk';

// The `CreateIngestionJob` mutation requires an argument of type `CreateIngestionJobVariables`:
const createIngestionJobVars: CreateIngestionJobVariables = {
  id: ..., 
  sourceMaterialId: ..., 
  status: ..., 
  parser: ..., 
  extractedCharacters: ..., 
  errorMessage: ..., // optional
  completedAt: ..., // optional
};

// Call the `createIngestionJob()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createIngestionJob(createIngestionJobVars);
// Variables can be defined inline as well.
const { data } = await createIngestionJob({ id: ..., sourceMaterialId: ..., status: ..., parser: ..., extractedCharacters: ..., errorMessage: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createIngestionJob(dataConnect, createIngestionJobVars);

console.log(data.ingestionJob_insert);

// Or, you can use the `Promise` API.
createIngestionJob(createIngestionJobVars).then((response) => {
  const data = response.data;
  console.log(data.ingestionJob_insert);
});
```

### Using `CreateIngestionJob`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createIngestionJobRef, CreateIngestionJobVariables } from '@impact26/dataconnect-sdk';

// The `CreateIngestionJob` mutation requires an argument of type `CreateIngestionJobVariables`:
const createIngestionJobVars: CreateIngestionJobVariables = {
  id: ..., 
  sourceMaterialId: ..., 
  status: ..., 
  parser: ..., 
  extractedCharacters: ..., 
  errorMessage: ..., // optional
  completedAt: ..., // optional
};

// Call the `createIngestionJobRef()` function to get a reference to the mutation.
const ref = createIngestionJobRef(createIngestionJobVars);
// Variables can be defined inline as well.
const ref = createIngestionJobRef({ id: ..., sourceMaterialId: ..., status: ..., parser: ..., extractedCharacters: ..., errorMessage: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createIngestionJobRef(dataConnect, createIngestionJobVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.ingestionJob_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.ingestionJob_insert);
});
```

## CreateQuestion
You can execute the `CreateQuestion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createQuestion(vars: CreateQuestionVariables): MutationPromise<CreateQuestionData, CreateQuestionVariables>;

interface CreateQuestionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateQuestionVariables): MutationRef<CreateQuestionData, CreateQuestionVariables>;
}
export const createQuestionRef: CreateQuestionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createQuestion(dc: DataConnect, vars: CreateQuestionVariables): MutationPromise<CreateQuestionData, CreateQuestionVariables>;

interface CreateQuestionRef {
  ...
  (dc: DataConnect, vars: CreateQuestionVariables): MutationRef<CreateQuestionData, CreateQuestionVariables>;
}
export const createQuestionRef: CreateQuestionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createQuestionRef:
```typescript
const name = createQuestionRef.operationName;
console.log(name);
```

### Variables
The `CreateQuestion` mutation requires an argument of type `CreateQuestionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateQuestionVariables {
  id: UUIDString;
  questionText: string;
  questionType: string;
  difficulty: string;
  domain: string;
  formulaRef?: string | null;
  topicTags?: string | null;
  status: string;
  isMultiselect: boolean;
  rationale?: string | null;
  calculation?: string | null;
  sourceRef?: string | null;
  createdById?: string | null;
}
```
### Return Type
Recall that executing the `CreateQuestion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateQuestionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateQuestionData {
  question_insert: Question_Key;
}
```
### Using `CreateQuestion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createQuestion, CreateQuestionVariables } from '@impact26/dataconnect-sdk';

// The `CreateQuestion` mutation requires an argument of type `CreateQuestionVariables`:
const createQuestionVars: CreateQuestionVariables = {
  id: ..., 
  questionText: ..., 
  questionType: ..., 
  difficulty: ..., 
  domain: ..., 
  formulaRef: ..., // optional
  topicTags: ..., // optional
  status: ..., 
  isMultiselect: ..., 
  rationale: ..., // optional
  calculation: ..., // optional
  sourceRef: ..., // optional
  createdById: ..., // optional
};

// Call the `createQuestion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createQuestion(createQuestionVars);
// Variables can be defined inline as well.
const { data } = await createQuestion({ id: ..., questionText: ..., questionType: ..., difficulty: ..., domain: ..., formulaRef: ..., topicTags: ..., status: ..., isMultiselect: ..., rationale: ..., calculation: ..., sourceRef: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createQuestion(dataConnect, createQuestionVars);

console.log(data.question_insert);

// Or, you can use the `Promise` API.
createQuestion(createQuestionVars).then((response) => {
  const data = response.data;
  console.log(data.question_insert);
});
```

### Using `CreateQuestion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createQuestionRef, CreateQuestionVariables } from '@impact26/dataconnect-sdk';

// The `CreateQuestion` mutation requires an argument of type `CreateQuestionVariables`:
const createQuestionVars: CreateQuestionVariables = {
  id: ..., 
  questionText: ..., 
  questionType: ..., 
  difficulty: ..., 
  domain: ..., 
  formulaRef: ..., // optional
  topicTags: ..., // optional
  status: ..., 
  isMultiselect: ..., 
  rationale: ..., // optional
  calculation: ..., // optional
  sourceRef: ..., // optional
  createdById: ..., // optional
};

// Call the `createQuestionRef()` function to get a reference to the mutation.
const ref = createQuestionRef(createQuestionVars);
// Variables can be defined inline as well.
const ref = createQuestionRef({ id: ..., questionText: ..., questionType: ..., difficulty: ..., domain: ..., formulaRef: ..., topicTags: ..., status: ..., isMultiselect: ..., rationale: ..., calculation: ..., sourceRef: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createQuestionRef(dataConnect, createQuestionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.question_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.question_insert);
});
```

## UpdateQuestion
You can execute the `UpdateQuestion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateQuestion(vars: UpdateQuestionVariables): MutationPromise<UpdateQuestionData, UpdateQuestionVariables>;

interface UpdateQuestionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateQuestionVariables): MutationRef<UpdateQuestionData, UpdateQuestionVariables>;
}
export const updateQuestionRef: UpdateQuestionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateQuestion(dc: DataConnect, vars: UpdateQuestionVariables): MutationPromise<UpdateQuestionData, UpdateQuestionVariables>;

interface UpdateQuestionRef {
  ...
  (dc: DataConnect, vars: UpdateQuestionVariables): MutationRef<UpdateQuestionData, UpdateQuestionVariables>;
}
export const updateQuestionRef: UpdateQuestionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateQuestionRef:
```typescript
const name = updateQuestionRef.operationName;
console.log(name);
```

### Variables
The `UpdateQuestion` mutation requires an argument of type `UpdateQuestionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateQuestionVariables {
  id: UUIDString;
  questionText?: string | null;
  difficulty?: string | null;
  domain?: string | null;
  formulaRef?: string | null;
  rationale?: string | null;
  calculation?: string | null;
  sourceRef?: string | null;
}
```
### Return Type
Recall that executing the `UpdateQuestion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateQuestionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateQuestionData {
  question_update?: Question_Key | null;
}
```
### Using `UpdateQuestion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateQuestion, UpdateQuestionVariables } from '@impact26/dataconnect-sdk';

// The `UpdateQuestion` mutation requires an argument of type `UpdateQuestionVariables`:
const updateQuestionVars: UpdateQuestionVariables = {
  id: ..., 
  questionText: ..., // optional
  difficulty: ..., // optional
  domain: ..., // optional
  formulaRef: ..., // optional
  rationale: ..., // optional
  calculation: ..., // optional
  sourceRef: ..., // optional
};

// Call the `updateQuestion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateQuestion(updateQuestionVars);
// Variables can be defined inline as well.
const { data } = await updateQuestion({ id: ..., questionText: ..., difficulty: ..., domain: ..., formulaRef: ..., rationale: ..., calculation: ..., sourceRef: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateQuestion(dataConnect, updateQuestionVars);

console.log(data.question_update);

// Or, you can use the `Promise` API.
updateQuestion(updateQuestionVars).then((response) => {
  const data = response.data;
  console.log(data.question_update);
});
```

### Using `UpdateQuestion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateQuestionRef, UpdateQuestionVariables } from '@impact26/dataconnect-sdk';

// The `UpdateQuestion` mutation requires an argument of type `UpdateQuestionVariables`:
const updateQuestionVars: UpdateQuestionVariables = {
  id: ..., 
  questionText: ..., // optional
  difficulty: ..., // optional
  domain: ..., // optional
  formulaRef: ..., // optional
  rationale: ..., // optional
  calculation: ..., // optional
  sourceRef: ..., // optional
};

// Call the `updateQuestionRef()` function to get a reference to the mutation.
const ref = updateQuestionRef(updateQuestionVars);
// Variables can be defined inline as well.
const ref = updateQuestionRef({ id: ..., questionText: ..., difficulty: ..., domain: ..., formulaRef: ..., rationale: ..., calculation: ..., sourceRef: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateQuestionRef(dataConnect, updateQuestionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.question_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.question_update);
});
```

## UpdateQuestionStatus
You can execute the `UpdateQuestionStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateQuestionStatus(vars: UpdateQuestionStatusVariables): MutationPromise<UpdateQuestionStatusData, UpdateQuestionStatusVariables>;

interface UpdateQuestionStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateQuestionStatusVariables): MutationRef<UpdateQuestionStatusData, UpdateQuestionStatusVariables>;
}
export const updateQuestionStatusRef: UpdateQuestionStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateQuestionStatus(dc: DataConnect, vars: UpdateQuestionStatusVariables): MutationPromise<UpdateQuestionStatusData, UpdateQuestionStatusVariables>;

interface UpdateQuestionStatusRef {
  ...
  (dc: DataConnect, vars: UpdateQuestionStatusVariables): MutationRef<UpdateQuestionStatusData, UpdateQuestionStatusVariables>;
}
export const updateQuestionStatusRef: UpdateQuestionStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateQuestionStatusRef:
```typescript
const name = updateQuestionStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateQuestionStatus` mutation requires an argument of type `UpdateQuestionStatusVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateQuestionStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateQuestionStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateQuestionStatusData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateQuestionStatusData {
  question_update?: Question_Key | null;
}
```
### Using `UpdateQuestionStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateQuestionStatus, UpdateQuestionStatusVariables } from '@impact26/dataconnect-sdk';

// The `UpdateQuestionStatus` mutation requires an argument of type `UpdateQuestionStatusVariables`:
const updateQuestionStatusVars: UpdateQuestionStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateQuestionStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateQuestionStatus(updateQuestionStatusVars);
// Variables can be defined inline as well.
const { data } = await updateQuestionStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateQuestionStatus(dataConnect, updateQuestionStatusVars);

console.log(data.question_update);

// Or, you can use the `Promise` API.
updateQuestionStatus(updateQuestionStatusVars).then((response) => {
  const data = response.data;
  console.log(data.question_update);
});
```

### Using `UpdateQuestionStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateQuestionStatusRef, UpdateQuestionStatusVariables } from '@impact26/dataconnect-sdk';

// The `UpdateQuestionStatus` mutation requires an argument of type `UpdateQuestionStatusVariables`:
const updateQuestionStatusVars: UpdateQuestionStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateQuestionStatusRef()` function to get a reference to the mutation.
const ref = updateQuestionStatusRef(updateQuestionStatusVars);
// Variables can be defined inline as well.
const ref = updateQuestionStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateQuestionStatusRef(dataConnect, updateQuestionStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.question_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.question_update);
});
```

## CreateAnswerChoice
You can execute the `CreateAnswerChoice` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createAnswerChoice(vars: CreateAnswerChoiceVariables): MutationPromise<CreateAnswerChoiceData, CreateAnswerChoiceVariables>;

interface CreateAnswerChoiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAnswerChoiceVariables): MutationRef<CreateAnswerChoiceData, CreateAnswerChoiceVariables>;
}
export const createAnswerChoiceRef: CreateAnswerChoiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAnswerChoice(dc: DataConnect, vars: CreateAnswerChoiceVariables): MutationPromise<CreateAnswerChoiceData, CreateAnswerChoiceVariables>;

interface CreateAnswerChoiceRef {
  ...
  (dc: DataConnect, vars: CreateAnswerChoiceVariables): MutationRef<CreateAnswerChoiceData, CreateAnswerChoiceVariables>;
}
export const createAnswerChoiceRef: CreateAnswerChoiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAnswerChoiceRef:
```typescript
const name = createAnswerChoiceRef.operationName;
console.log(name);
```

### Variables
The `CreateAnswerChoice` mutation requires an argument of type `CreateAnswerChoiceVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAnswerChoiceVariables {
  questionId: UUIDString;
  letter: string;
  choiceText: string;
  isCorrect: boolean;
  explanation?: string | null;
  position: number;
}
```
### Return Type
Recall that executing the `CreateAnswerChoice` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAnswerChoiceData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAnswerChoiceData {
  answerChoice_insert: AnswerChoice_Key;
}
```
### Using `CreateAnswerChoice`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAnswerChoice, CreateAnswerChoiceVariables } from '@impact26/dataconnect-sdk';

// The `CreateAnswerChoice` mutation requires an argument of type `CreateAnswerChoiceVariables`:
const createAnswerChoiceVars: CreateAnswerChoiceVariables = {
  questionId: ..., 
  letter: ..., 
  choiceText: ..., 
  isCorrect: ..., 
  explanation: ..., // optional
  position: ..., 
};

// Call the `createAnswerChoice()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAnswerChoice(createAnswerChoiceVars);
// Variables can be defined inline as well.
const { data } = await createAnswerChoice({ questionId: ..., letter: ..., choiceText: ..., isCorrect: ..., explanation: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAnswerChoice(dataConnect, createAnswerChoiceVars);

console.log(data.answerChoice_insert);

// Or, you can use the `Promise` API.
createAnswerChoice(createAnswerChoiceVars).then((response) => {
  const data = response.data;
  console.log(data.answerChoice_insert);
});
```

### Using `CreateAnswerChoice`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAnswerChoiceRef, CreateAnswerChoiceVariables } from '@impact26/dataconnect-sdk';

// The `CreateAnswerChoice` mutation requires an argument of type `CreateAnswerChoiceVariables`:
const createAnswerChoiceVars: CreateAnswerChoiceVariables = {
  questionId: ..., 
  letter: ..., 
  choiceText: ..., 
  isCorrect: ..., 
  explanation: ..., // optional
  position: ..., 
};

// Call the `createAnswerChoiceRef()` function to get a reference to the mutation.
const ref = createAnswerChoiceRef(createAnswerChoiceVars);
// Variables can be defined inline as well.
const ref = createAnswerChoiceRef({ questionId: ..., letter: ..., choiceText: ..., isCorrect: ..., explanation: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAnswerChoiceRef(dataConnect, createAnswerChoiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.answerChoice_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.answerChoice_insert);
});
```

## UpdateAnswerChoice
You can execute the `UpdateAnswerChoice` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateAnswerChoice(vars: UpdateAnswerChoiceVariables): MutationPromise<UpdateAnswerChoiceData, UpdateAnswerChoiceVariables>;

interface UpdateAnswerChoiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAnswerChoiceVariables): MutationRef<UpdateAnswerChoiceData, UpdateAnswerChoiceVariables>;
}
export const updateAnswerChoiceRef: UpdateAnswerChoiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateAnswerChoice(dc: DataConnect, vars: UpdateAnswerChoiceVariables): MutationPromise<UpdateAnswerChoiceData, UpdateAnswerChoiceVariables>;

interface UpdateAnswerChoiceRef {
  ...
  (dc: DataConnect, vars: UpdateAnswerChoiceVariables): MutationRef<UpdateAnswerChoiceData, UpdateAnswerChoiceVariables>;
}
export const updateAnswerChoiceRef: UpdateAnswerChoiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateAnswerChoiceRef:
```typescript
const name = updateAnswerChoiceRef.operationName;
console.log(name);
```

### Variables
The `UpdateAnswerChoice` mutation requires an argument of type `UpdateAnswerChoiceVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateAnswerChoiceVariables {
  id: UUIDString;
  choiceText?: string | null;
  isCorrect?: boolean | null;
  explanation?: string | null;
}
```
### Return Type
Recall that executing the `UpdateAnswerChoice` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateAnswerChoiceData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateAnswerChoiceData {
  answerChoice_update?: AnswerChoice_Key | null;
}
```
### Using `UpdateAnswerChoice`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateAnswerChoice, UpdateAnswerChoiceVariables } from '@impact26/dataconnect-sdk';

// The `UpdateAnswerChoice` mutation requires an argument of type `UpdateAnswerChoiceVariables`:
const updateAnswerChoiceVars: UpdateAnswerChoiceVariables = {
  id: ..., 
  choiceText: ..., // optional
  isCorrect: ..., // optional
  explanation: ..., // optional
};

// Call the `updateAnswerChoice()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateAnswerChoice(updateAnswerChoiceVars);
// Variables can be defined inline as well.
const { data } = await updateAnswerChoice({ id: ..., choiceText: ..., isCorrect: ..., explanation: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateAnswerChoice(dataConnect, updateAnswerChoiceVars);

console.log(data.answerChoice_update);

// Or, you can use the `Promise` API.
updateAnswerChoice(updateAnswerChoiceVars).then((response) => {
  const data = response.data;
  console.log(data.answerChoice_update);
});
```

### Using `UpdateAnswerChoice`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateAnswerChoiceRef, UpdateAnswerChoiceVariables } from '@impact26/dataconnect-sdk';

// The `UpdateAnswerChoice` mutation requires an argument of type `UpdateAnswerChoiceVariables`:
const updateAnswerChoiceVars: UpdateAnswerChoiceVariables = {
  id: ..., 
  choiceText: ..., // optional
  isCorrect: ..., // optional
  explanation: ..., // optional
};

// Call the `updateAnswerChoiceRef()` function to get a reference to the mutation.
const ref = updateAnswerChoiceRef(updateAnswerChoiceVars);
// Variables can be defined inline as well.
const ref = updateAnswerChoiceRef({ id: ..., choiceText: ..., isCorrect: ..., explanation: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateAnswerChoiceRef(dataConnect, updateAnswerChoiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.answerChoice_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.answerChoice_update);
});
```

## DeleteAnswerChoicesForQuestion
You can execute the `DeleteAnswerChoicesForQuestion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteAnswerChoicesForQuestion(vars: DeleteAnswerChoicesForQuestionVariables): MutationPromise<DeleteAnswerChoicesForQuestionData, DeleteAnswerChoicesForQuestionVariables>;

interface DeleteAnswerChoicesForQuestionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAnswerChoicesForQuestionVariables): MutationRef<DeleteAnswerChoicesForQuestionData, DeleteAnswerChoicesForQuestionVariables>;
}
export const deleteAnswerChoicesForQuestionRef: DeleteAnswerChoicesForQuestionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteAnswerChoicesForQuestion(dc: DataConnect, vars: DeleteAnswerChoicesForQuestionVariables): MutationPromise<DeleteAnswerChoicesForQuestionData, DeleteAnswerChoicesForQuestionVariables>;

interface DeleteAnswerChoicesForQuestionRef {
  ...
  (dc: DataConnect, vars: DeleteAnswerChoicesForQuestionVariables): MutationRef<DeleteAnswerChoicesForQuestionData, DeleteAnswerChoicesForQuestionVariables>;
}
export const deleteAnswerChoicesForQuestionRef: DeleteAnswerChoicesForQuestionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteAnswerChoicesForQuestionRef:
```typescript
const name = deleteAnswerChoicesForQuestionRef.operationName;
console.log(name);
```

### Variables
The `DeleteAnswerChoicesForQuestion` mutation requires an argument of type `DeleteAnswerChoicesForQuestionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteAnswerChoicesForQuestionVariables {
  questionId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteAnswerChoicesForQuestion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteAnswerChoicesForQuestionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteAnswerChoicesForQuestionData {
  answerChoice_deleteMany: number;
}
```
### Using `DeleteAnswerChoicesForQuestion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteAnswerChoicesForQuestion, DeleteAnswerChoicesForQuestionVariables } from '@impact26/dataconnect-sdk';

// The `DeleteAnswerChoicesForQuestion` mutation requires an argument of type `DeleteAnswerChoicesForQuestionVariables`:
const deleteAnswerChoicesForQuestionVars: DeleteAnswerChoicesForQuestionVariables = {
  questionId: ..., 
};

// Call the `deleteAnswerChoicesForQuestion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteAnswerChoicesForQuestion(deleteAnswerChoicesForQuestionVars);
// Variables can be defined inline as well.
const { data } = await deleteAnswerChoicesForQuestion({ questionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteAnswerChoicesForQuestion(dataConnect, deleteAnswerChoicesForQuestionVars);

console.log(data.answerChoice_deleteMany);

// Or, you can use the `Promise` API.
deleteAnswerChoicesForQuestion(deleteAnswerChoicesForQuestionVars).then((response) => {
  const data = response.data;
  console.log(data.answerChoice_deleteMany);
});
```

### Using `DeleteAnswerChoicesForQuestion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteAnswerChoicesForQuestionRef, DeleteAnswerChoicesForQuestionVariables } from '@impact26/dataconnect-sdk';

// The `DeleteAnswerChoicesForQuestion` mutation requires an argument of type `DeleteAnswerChoicesForQuestionVariables`:
const deleteAnswerChoicesForQuestionVars: DeleteAnswerChoicesForQuestionVariables = {
  questionId: ..., 
};

// Call the `deleteAnswerChoicesForQuestionRef()` function to get a reference to the mutation.
const ref = deleteAnswerChoicesForQuestionRef(deleteAnswerChoicesForQuestionVars);
// Variables can be defined inline as well.
const ref = deleteAnswerChoicesForQuestionRef({ questionId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteAnswerChoicesForQuestionRef(dataConnect, deleteAnswerChoicesForQuestionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.answerChoice_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.answerChoice_deleteMany);
});
```

## DeleteQuizQuestionsForQuestion
You can execute the `DeleteQuizQuestionsForQuestion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteQuizQuestionsForQuestion(vars: DeleteQuizQuestionsForQuestionVariables): MutationPromise<DeleteQuizQuestionsForQuestionData, DeleteQuizQuestionsForQuestionVariables>;

interface DeleteQuizQuestionsForQuestionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuizQuestionsForQuestionVariables): MutationRef<DeleteQuizQuestionsForQuestionData, DeleteQuizQuestionsForQuestionVariables>;
}
export const deleteQuizQuestionsForQuestionRef: DeleteQuizQuestionsForQuestionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteQuizQuestionsForQuestion(dc: DataConnect, vars: DeleteQuizQuestionsForQuestionVariables): MutationPromise<DeleteQuizQuestionsForQuestionData, DeleteQuizQuestionsForQuestionVariables>;

interface DeleteQuizQuestionsForQuestionRef {
  ...
  (dc: DataConnect, vars: DeleteQuizQuestionsForQuestionVariables): MutationRef<DeleteQuizQuestionsForQuestionData, DeleteQuizQuestionsForQuestionVariables>;
}
export const deleteQuizQuestionsForQuestionRef: DeleteQuizQuestionsForQuestionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteQuizQuestionsForQuestionRef:
```typescript
const name = deleteQuizQuestionsForQuestionRef.operationName;
console.log(name);
```

### Variables
The `DeleteQuizQuestionsForQuestion` mutation requires an argument of type `DeleteQuizQuestionsForQuestionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteQuizQuestionsForQuestionVariables {
  questionId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteQuizQuestionsForQuestion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteQuizQuestionsForQuestionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteQuizQuestionsForQuestionData {
  quizQuestion_deleteMany: number;
}
```
### Using `DeleteQuizQuestionsForQuestion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteQuizQuestionsForQuestion, DeleteQuizQuestionsForQuestionVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuizQuestionsForQuestion` mutation requires an argument of type `DeleteQuizQuestionsForQuestionVariables`:
const deleteQuizQuestionsForQuestionVars: DeleteQuizQuestionsForQuestionVariables = {
  questionId: ..., 
};

// Call the `deleteQuizQuestionsForQuestion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteQuizQuestionsForQuestion(deleteQuizQuestionsForQuestionVars);
// Variables can be defined inline as well.
const { data } = await deleteQuizQuestionsForQuestion({ questionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteQuizQuestionsForQuestion(dataConnect, deleteQuizQuestionsForQuestionVars);

console.log(data.quizQuestion_deleteMany);

// Or, you can use the `Promise` API.
deleteQuizQuestionsForQuestion(deleteQuizQuestionsForQuestionVars).then((response) => {
  const data = response.data;
  console.log(data.quizQuestion_deleteMany);
});
```

### Using `DeleteQuizQuestionsForQuestion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteQuizQuestionsForQuestionRef, DeleteQuizQuestionsForQuestionVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuizQuestionsForQuestion` mutation requires an argument of type `DeleteQuizQuestionsForQuestionVariables`:
const deleteQuizQuestionsForQuestionVars: DeleteQuizQuestionsForQuestionVariables = {
  questionId: ..., 
};

// Call the `deleteQuizQuestionsForQuestionRef()` function to get a reference to the mutation.
const ref = deleteQuizQuestionsForQuestionRef(deleteQuizQuestionsForQuestionVars);
// Variables can be defined inline as well.
const ref = deleteQuizQuestionsForQuestionRef({ questionId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteQuizQuestionsForQuestionRef(dataConnect, deleteQuizQuestionsForQuestionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quizQuestion_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quizQuestion_deleteMany);
});
```

## DeleteQuestion
You can execute the `DeleteQuestion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteQuestion(vars: DeleteQuestionVariables): MutationPromise<DeleteQuestionData, DeleteQuestionVariables>;

interface DeleteQuestionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuestionVariables): MutationRef<DeleteQuestionData, DeleteQuestionVariables>;
}
export const deleteQuestionRef: DeleteQuestionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteQuestion(dc: DataConnect, vars: DeleteQuestionVariables): MutationPromise<DeleteQuestionData, DeleteQuestionVariables>;

interface DeleteQuestionRef {
  ...
  (dc: DataConnect, vars: DeleteQuestionVariables): MutationRef<DeleteQuestionData, DeleteQuestionVariables>;
}
export const deleteQuestionRef: DeleteQuestionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteQuestionRef:
```typescript
const name = deleteQuestionRef.operationName;
console.log(name);
```

### Variables
The `DeleteQuestion` mutation requires an argument of type `DeleteQuestionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteQuestionVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteQuestion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteQuestionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteQuestionData {
  question_delete?: Question_Key | null;
}
```
### Using `DeleteQuestion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteQuestion, DeleteQuestionVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuestion` mutation requires an argument of type `DeleteQuestionVariables`:
const deleteQuestionVars: DeleteQuestionVariables = {
  id: ..., 
};

// Call the `deleteQuestion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteQuestion(deleteQuestionVars);
// Variables can be defined inline as well.
const { data } = await deleteQuestion({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteQuestion(dataConnect, deleteQuestionVars);

console.log(data.question_delete);

// Or, you can use the `Promise` API.
deleteQuestion(deleteQuestionVars).then((response) => {
  const data = response.data;
  console.log(data.question_delete);
});
```

### Using `DeleteQuestion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteQuestionRef, DeleteQuestionVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuestion` mutation requires an argument of type `DeleteQuestionVariables`:
const deleteQuestionVars: DeleteQuestionVariables = {
  id: ..., 
};

// Call the `deleteQuestionRef()` function to get a reference to the mutation.
const ref = deleteQuestionRef(deleteQuestionVars);
// Variables can be defined inline as well.
const ref = deleteQuestionRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteQuestionRef(dataConnect, deleteQuestionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.question_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.question_delete);
});
```

## CreateQuiz
You can execute the `CreateQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createQuiz(vars: CreateQuizVariables): MutationPromise<CreateQuizData, CreateQuizVariables>;

interface CreateQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateQuizVariables): MutationRef<CreateQuizData, CreateQuizVariables>;
}
export const createQuizRef: CreateQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createQuiz(dc: DataConnect, vars: CreateQuizVariables): MutationPromise<CreateQuizData, CreateQuizVariables>;

interface CreateQuizRef {
  ...
  (dc: DataConnect, vars: CreateQuizVariables): MutationRef<CreateQuizData, CreateQuizVariables>;
}
export const createQuizRef: CreateQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createQuizRef:
```typescript
const name = createQuizRef.operationName;
console.log(name);
```

### Variables
The `CreateQuiz` mutation requires an argument of type `CreateQuizVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateQuizVariables {
  id: UUIDString;
  title: string;
  description?: string | null;
  timeLimitSeconds?: number | null;
  passingScore?: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  status: string;
  createdById?: string | null;
}
```
### Return Type
Recall that executing the `CreateQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateQuizData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateQuizData {
  quiz_insert: Quiz_Key;
}
```
### Using `CreateQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createQuiz, CreateQuizVariables } from '@impact26/dataconnect-sdk';

// The `CreateQuiz` mutation requires an argument of type `CreateQuizVariables`:
const createQuizVars: CreateQuizVariables = {
  id: ..., 
  title: ..., 
  description: ..., // optional
  timeLimitSeconds: ..., // optional
  passingScore: ..., // optional
  shuffleQuestions: ..., 
  shuffleChoices: ..., 
  status: ..., 
  createdById: ..., // optional
};

// Call the `createQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createQuiz(createQuizVars);
// Variables can be defined inline as well.
const { data } = await createQuiz({ id: ..., title: ..., description: ..., timeLimitSeconds: ..., passingScore: ..., shuffleQuestions: ..., shuffleChoices: ..., status: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createQuiz(dataConnect, createQuizVars);

console.log(data.quiz_insert);

// Or, you can use the `Promise` API.
createQuiz(createQuizVars).then((response) => {
  const data = response.data;
  console.log(data.quiz_insert);
});
```

### Using `CreateQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createQuizRef, CreateQuizVariables } from '@impact26/dataconnect-sdk';

// The `CreateQuiz` mutation requires an argument of type `CreateQuizVariables`:
const createQuizVars: CreateQuizVariables = {
  id: ..., 
  title: ..., 
  description: ..., // optional
  timeLimitSeconds: ..., // optional
  passingScore: ..., // optional
  shuffleQuestions: ..., 
  shuffleChoices: ..., 
  status: ..., 
  createdById: ..., // optional
};

// Call the `createQuizRef()` function to get a reference to the mutation.
const ref = createQuizRef(createQuizVars);
// Variables can be defined inline as well.
const ref = createQuizRef({ id: ..., title: ..., description: ..., timeLimitSeconds: ..., passingScore: ..., shuffleQuestions: ..., shuffleChoices: ..., status: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createQuizRef(dataConnect, createQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quiz_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quiz_insert);
});
```

## AddQuestionToQuiz
You can execute the `AddQuestionToQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
addQuestionToQuiz(vars: AddQuestionToQuizVariables): MutationPromise<AddQuestionToQuizData, AddQuestionToQuizVariables>;

interface AddQuestionToQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddQuestionToQuizVariables): MutationRef<AddQuestionToQuizData, AddQuestionToQuizVariables>;
}
export const addQuestionToQuizRef: AddQuestionToQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addQuestionToQuiz(dc: DataConnect, vars: AddQuestionToQuizVariables): MutationPromise<AddQuestionToQuizData, AddQuestionToQuizVariables>;

interface AddQuestionToQuizRef {
  ...
  (dc: DataConnect, vars: AddQuestionToQuizVariables): MutationRef<AddQuestionToQuizData, AddQuestionToQuizVariables>;
}
export const addQuestionToQuizRef: AddQuestionToQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addQuestionToQuizRef:
```typescript
const name = addQuestionToQuizRef.operationName;
console.log(name);
```

### Variables
The `AddQuestionToQuiz` mutation requires an argument of type `AddQuestionToQuizVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddQuestionToQuizVariables {
  quizId: UUIDString;
  questionId: UUIDString;
  position: number;
  pointValue: number;
}
```
### Return Type
Recall that executing the `AddQuestionToQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddQuestionToQuizData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddQuestionToQuizData {
  quizQuestion_insert: QuizQuestion_Key;
}
```
### Using `AddQuestionToQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addQuestionToQuiz, AddQuestionToQuizVariables } from '@impact26/dataconnect-sdk';

// The `AddQuestionToQuiz` mutation requires an argument of type `AddQuestionToQuizVariables`:
const addQuestionToQuizVars: AddQuestionToQuizVariables = {
  quizId: ..., 
  questionId: ..., 
  position: ..., 
  pointValue: ..., 
};

// Call the `addQuestionToQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addQuestionToQuiz(addQuestionToQuizVars);
// Variables can be defined inline as well.
const { data } = await addQuestionToQuiz({ quizId: ..., questionId: ..., position: ..., pointValue: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addQuestionToQuiz(dataConnect, addQuestionToQuizVars);

console.log(data.quizQuestion_insert);

// Or, you can use the `Promise` API.
addQuestionToQuiz(addQuestionToQuizVars).then((response) => {
  const data = response.data;
  console.log(data.quizQuestion_insert);
});
```

### Using `AddQuestionToQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addQuestionToQuizRef, AddQuestionToQuizVariables } from '@impact26/dataconnect-sdk';

// The `AddQuestionToQuiz` mutation requires an argument of type `AddQuestionToQuizVariables`:
const addQuestionToQuizVars: AddQuestionToQuizVariables = {
  quizId: ..., 
  questionId: ..., 
  position: ..., 
  pointValue: ..., 
};

// Call the `addQuestionToQuizRef()` function to get a reference to the mutation.
const ref = addQuestionToQuizRef(addQuestionToQuizVars);
// Variables can be defined inline as well.
const ref = addQuestionToQuizRef({ quizId: ..., questionId: ..., position: ..., pointValue: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addQuestionToQuizRef(dataConnect, addQuestionToQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quizQuestion_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quizQuestion_insert);
});
```

## UpdateQuizStatus
You can execute the `UpdateQuizStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateQuizStatus(vars: UpdateQuizStatusVariables): MutationPromise<UpdateQuizStatusData, UpdateQuizStatusVariables>;

interface UpdateQuizStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateQuizStatusVariables): MutationRef<UpdateQuizStatusData, UpdateQuizStatusVariables>;
}
export const updateQuizStatusRef: UpdateQuizStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateQuizStatus(dc: DataConnect, vars: UpdateQuizStatusVariables): MutationPromise<UpdateQuizStatusData, UpdateQuizStatusVariables>;

interface UpdateQuizStatusRef {
  ...
  (dc: DataConnect, vars: UpdateQuizStatusVariables): MutationRef<UpdateQuizStatusData, UpdateQuizStatusVariables>;
}
export const updateQuizStatusRef: UpdateQuizStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateQuizStatusRef:
```typescript
const name = updateQuizStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateQuizStatus` mutation requires an argument of type `UpdateQuizStatusVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateQuizStatusVariables {
  id: UUIDString;
  status: string;
  updatedById?: string | null;
  publishedAt?: DateString | null;
}
```
### Return Type
Recall that executing the `UpdateQuizStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateQuizStatusData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateQuizStatusData {
  quiz_update?: Quiz_Key | null;
}
```
### Using `UpdateQuizStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateQuizStatus, UpdateQuizStatusVariables } from '@impact26/dataconnect-sdk';

// The `UpdateQuizStatus` mutation requires an argument of type `UpdateQuizStatusVariables`:
const updateQuizStatusVars: UpdateQuizStatusVariables = {
  id: ..., 
  status: ..., 
  updatedById: ..., // optional
  publishedAt: ..., // optional
};

// Call the `updateQuizStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateQuizStatus(updateQuizStatusVars);
// Variables can be defined inline as well.
const { data } = await updateQuizStatus({ id: ..., status: ..., updatedById: ..., publishedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateQuizStatus(dataConnect, updateQuizStatusVars);

console.log(data.quiz_update);

// Or, you can use the `Promise` API.
updateQuizStatus(updateQuizStatusVars).then((response) => {
  const data = response.data;
  console.log(data.quiz_update);
});
```

### Using `UpdateQuizStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateQuizStatusRef, UpdateQuizStatusVariables } from '@impact26/dataconnect-sdk';

// The `UpdateQuizStatus` mutation requires an argument of type `UpdateQuizStatusVariables`:
const updateQuizStatusVars: UpdateQuizStatusVariables = {
  id: ..., 
  status: ..., 
  updatedById: ..., // optional
  publishedAt: ..., // optional
};

// Call the `updateQuizStatusRef()` function to get a reference to the mutation.
const ref = updateQuizStatusRef(updateQuizStatusVars);
// Variables can be defined inline as well.
const ref = updateQuizStatusRef({ id: ..., status: ..., updatedById: ..., publishedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateQuizStatusRef(dataConnect, updateQuizStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quiz_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quiz_update);
});
```

## DeleteQuizQuestionsForQuiz
You can execute the `DeleteQuizQuestionsForQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteQuizQuestionsForQuiz(vars: DeleteQuizQuestionsForQuizVariables): MutationPromise<DeleteQuizQuestionsForQuizData, DeleteQuizQuestionsForQuizVariables>;

interface DeleteQuizQuestionsForQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuizQuestionsForQuizVariables): MutationRef<DeleteQuizQuestionsForQuizData, DeleteQuizQuestionsForQuizVariables>;
}
export const deleteQuizQuestionsForQuizRef: DeleteQuizQuestionsForQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteQuizQuestionsForQuiz(dc: DataConnect, vars: DeleteQuizQuestionsForQuizVariables): MutationPromise<DeleteQuizQuestionsForQuizData, DeleteQuizQuestionsForQuizVariables>;

interface DeleteQuizQuestionsForQuizRef {
  ...
  (dc: DataConnect, vars: DeleteQuizQuestionsForQuizVariables): MutationRef<DeleteQuizQuestionsForQuizData, DeleteQuizQuestionsForQuizVariables>;
}
export const deleteQuizQuestionsForQuizRef: DeleteQuizQuestionsForQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteQuizQuestionsForQuizRef:
```typescript
const name = deleteQuizQuestionsForQuizRef.operationName;
console.log(name);
```

### Variables
The `DeleteQuizQuestionsForQuiz` mutation requires an argument of type `DeleteQuizQuestionsForQuizVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteQuizQuestionsForQuizVariables {
  quizId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteQuizQuestionsForQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteQuizQuestionsForQuizData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteQuizQuestionsForQuizData {
  quizQuestion_deleteMany: number;
}
```
### Using `DeleteQuizQuestionsForQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteQuizQuestionsForQuiz, DeleteQuizQuestionsForQuizVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuizQuestionsForQuiz` mutation requires an argument of type `DeleteQuizQuestionsForQuizVariables`:
const deleteQuizQuestionsForQuizVars: DeleteQuizQuestionsForQuizVariables = {
  quizId: ..., 
};

// Call the `deleteQuizQuestionsForQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteQuizQuestionsForQuiz(deleteQuizQuestionsForQuizVars);
// Variables can be defined inline as well.
const { data } = await deleteQuizQuestionsForQuiz({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteQuizQuestionsForQuiz(dataConnect, deleteQuizQuestionsForQuizVars);

console.log(data.quizQuestion_deleteMany);

// Or, you can use the `Promise` API.
deleteQuizQuestionsForQuiz(deleteQuizQuestionsForQuizVars).then((response) => {
  const data = response.data;
  console.log(data.quizQuestion_deleteMany);
});
```

### Using `DeleteQuizQuestionsForQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteQuizQuestionsForQuizRef, DeleteQuizQuestionsForQuizVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuizQuestionsForQuiz` mutation requires an argument of type `DeleteQuizQuestionsForQuizVariables`:
const deleteQuizQuestionsForQuizVars: DeleteQuizQuestionsForQuizVariables = {
  quizId: ..., 
};

// Call the `deleteQuizQuestionsForQuizRef()` function to get a reference to the mutation.
const ref = deleteQuizQuestionsForQuizRef(deleteQuizQuestionsForQuizVars);
// Variables can be defined inline as well.
const ref = deleteQuizQuestionsForQuizRef({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteQuizQuestionsForQuizRef(dataConnect, deleteQuizQuestionsForQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quizQuestion_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quizQuestion_deleteMany);
});
```

## DeleteQuizResponsesForQuiz
You can execute the `DeleteQuizResponsesForQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteQuizResponsesForQuiz(vars: DeleteQuizResponsesForQuizVariables): MutationPromise<DeleteQuizResponsesForQuizData, DeleteQuizResponsesForQuizVariables>;

interface DeleteQuizResponsesForQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuizResponsesForQuizVariables): MutationRef<DeleteQuizResponsesForQuizData, DeleteQuizResponsesForQuizVariables>;
}
export const deleteQuizResponsesForQuizRef: DeleteQuizResponsesForQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteQuizResponsesForQuiz(dc: DataConnect, vars: DeleteQuizResponsesForQuizVariables): MutationPromise<DeleteQuizResponsesForQuizData, DeleteQuizResponsesForQuizVariables>;

interface DeleteQuizResponsesForQuizRef {
  ...
  (dc: DataConnect, vars: DeleteQuizResponsesForQuizVariables): MutationRef<DeleteQuizResponsesForQuizData, DeleteQuizResponsesForQuizVariables>;
}
export const deleteQuizResponsesForQuizRef: DeleteQuizResponsesForQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteQuizResponsesForQuizRef:
```typescript
const name = deleteQuizResponsesForQuizRef.operationName;
console.log(name);
```

### Variables
The `DeleteQuizResponsesForQuiz` mutation requires an argument of type `DeleteQuizResponsesForQuizVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteQuizResponsesForQuizVariables {
  quizId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteQuizResponsesForQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteQuizResponsesForQuizData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteQuizResponsesForQuizData {
  quizResponse_deleteMany: number;
}
```
### Using `DeleteQuizResponsesForQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteQuizResponsesForQuiz, DeleteQuizResponsesForQuizVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuizResponsesForQuiz` mutation requires an argument of type `DeleteQuizResponsesForQuizVariables`:
const deleteQuizResponsesForQuizVars: DeleteQuizResponsesForQuizVariables = {
  quizId: ..., 
};

// Call the `deleteQuizResponsesForQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteQuizResponsesForQuiz(deleteQuizResponsesForQuizVars);
// Variables can be defined inline as well.
const { data } = await deleteQuizResponsesForQuiz({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteQuizResponsesForQuiz(dataConnect, deleteQuizResponsesForQuizVars);

console.log(data.quizResponse_deleteMany);

// Or, you can use the `Promise` API.
deleteQuizResponsesForQuiz(deleteQuizResponsesForQuizVars).then((response) => {
  const data = response.data;
  console.log(data.quizResponse_deleteMany);
});
```

### Using `DeleteQuizResponsesForQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteQuizResponsesForQuizRef, DeleteQuizResponsesForQuizVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuizResponsesForQuiz` mutation requires an argument of type `DeleteQuizResponsesForQuizVariables`:
const deleteQuizResponsesForQuizVars: DeleteQuizResponsesForQuizVariables = {
  quizId: ..., 
};

// Call the `deleteQuizResponsesForQuizRef()` function to get a reference to the mutation.
const ref = deleteQuizResponsesForQuizRef(deleteQuizResponsesForQuizVars);
// Variables can be defined inline as well.
const ref = deleteQuizResponsesForQuizRef({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteQuizResponsesForQuizRef(dataConnect, deleteQuizResponsesForQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quizResponse_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quizResponse_deleteMany);
});
```

## DeleteQuizAttemptsForQuiz
You can execute the `DeleteQuizAttemptsForQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteQuizAttemptsForQuiz(vars: DeleteQuizAttemptsForQuizVariables): MutationPromise<DeleteQuizAttemptsForQuizData, DeleteQuizAttemptsForQuizVariables>;

interface DeleteQuizAttemptsForQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuizAttemptsForQuizVariables): MutationRef<DeleteQuizAttemptsForQuizData, DeleteQuizAttemptsForQuizVariables>;
}
export const deleteQuizAttemptsForQuizRef: DeleteQuizAttemptsForQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteQuizAttemptsForQuiz(dc: DataConnect, vars: DeleteQuizAttemptsForQuizVariables): MutationPromise<DeleteQuizAttemptsForQuizData, DeleteQuizAttemptsForQuizVariables>;

interface DeleteQuizAttemptsForQuizRef {
  ...
  (dc: DataConnect, vars: DeleteQuizAttemptsForQuizVariables): MutationRef<DeleteQuizAttemptsForQuizData, DeleteQuizAttemptsForQuizVariables>;
}
export const deleteQuizAttemptsForQuizRef: DeleteQuizAttemptsForQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteQuizAttemptsForQuizRef:
```typescript
const name = deleteQuizAttemptsForQuizRef.operationName;
console.log(name);
```

### Variables
The `DeleteQuizAttemptsForQuiz` mutation requires an argument of type `DeleteQuizAttemptsForQuizVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteQuizAttemptsForQuizVariables {
  quizId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteQuizAttemptsForQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteQuizAttemptsForQuizData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteQuizAttemptsForQuizData {
  quizAttempt_deleteMany: number;
}
```
### Using `DeleteQuizAttemptsForQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteQuizAttemptsForQuiz, DeleteQuizAttemptsForQuizVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuizAttemptsForQuiz` mutation requires an argument of type `DeleteQuizAttemptsForQuizVariables`:
const deleteQuizAttemptsForQuizVars: DeleteQuizAttemptsForQuizVariables = {
  quizId: ..., 
};

// Call the `deleteQuizAttemptsForQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteQuizAttemptsForQuiz(deleteQuizAttemptsForQuizVars);
// Variables can be defined inline as well.
const { data } = await deleteQuizAttemptsForQuiz({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteQuizAttemptsForQuiz(dataConnect, deleteQuizAttemptsForQuizVars);

console.log(data.quizAttempt_deleteMany);

// Or, you can use the `Promise` API.
deleteQuizAttemptsForQuiz(deleteQuizAttemptsForQuizVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt_deleteMany);
});
```

### Using `DeleteQuizAttemptsForQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteQuizAttemptsForQuizRef, DeleteQuizAttemptsForQuizVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuizAttemptsForQuiz` mutation requires an argument of type `DeleteQuizAttemptsForQuizVariables`:
const deleteQuizAttemptsForQuizVars: DeleteQuizAttemptsForQuizVariables = {
  quizId: ..., 
};

// Call the `deleteQuizAttemptsForQuizRef()` function to get a reference to the mutation.
const ref = deleteQuizAttemptsForQuizRef(deleteQuizAttemptsForQuizVars);
// Variables can be defined inline as well.
const ref = deleteQuizAttemptsForQuizRef({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteQuizAttemptsForQuizRef(dataConnect, deleteQuizAttemptsForQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quizAttempt_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt_deleteMany);
});
```

## DeleteQuiz
You can execute the `DeleteQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteQuiz(vars: DeleteQuizVariables): MutationPromise<DeleteQuizData, DeleteQuizVariables>;

interface DeleteQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuizVariables): MutationRef<DeleteQuizData, DeleteQuizVariables>;
}
export const deleteQuizRef: DeleteQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteQuiz(dc: DataConnect, vars: DeleteQuizVariables): MutationPromise<DeleteQuizData, DeleteQuizVariables>;

interface DeleteQuizRef {
  ...
  (dc: DataConnect, vars: DeleteQuizVariables): MutationRef<DeleteQuizData, DeleteQuizVariables>;
}
export const deleteQuizRef: DeleteQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteQuizRef:
```typescript
const name = deleteQuizRef.operationName;
console.log(name);
```

### Variables
The `DeleteQuiz` mutation requires an argument of type `DeleteQuizVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteQuizVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteQuizData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteQuizData {
  quiz_delete?: Quiz_Key | null;
}
```
### Using `DeleteQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteQuiz, DeleteQuizVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuiz` mutation requires an argument of type `DeleteQuizVariables`:
const deleteQuizVars: DeleteQuizVariables = {
  id: ..., 
};

// Call the `deleteQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteQuiz(deleteQuizVars);
// Variables can be defined inline as well.
const { data } = await deleteQuiz({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteQuiz(dataConnect, deleteQuizVars);

console.log(data.quiz_delete);

// Or, you can use the `Promise` API.
deleteQuiz(deleteQuizVars).then((response) => {
  const data = response.data;
  console.log(data.quiz_delete);
});
```

### Using `DeleteQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteQuizRef, DeleteQuizVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuiz` mutation requires an argument of type `DeleteQuizVariables`:
const deleteQuizVars: DeleteQuizVariables = {
  id: ..., 
};

// Call the `deleteQuizRef()` function to get a reference to the mutation.
const ref = deleteQuizRef(deleteQuizVars);
// Variables can be defined inline as well.
const ref = deleteQuizRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteQuizRef(dataConnect, deleteQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quiz_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quiz_delete);
});
```

## EnrollInCourse
You can execute the `EnrollInCourse` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
enrollInCourse(vars: EnrollInCourseVariables): MutationPromise<EnrollInCourseData, EnrollInCourseVariables>;

interface EnrollInCourseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: EnrollInCourseVariables): MutationRef<EnrollInCourseData, EnrollInCourseVariables>;
}
export const enrollInCourseRef: EnrollInCourseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
enrollInCourse(dc: DataConnect, vars: EnrollInCourseVariables): MutationPromise<EnrollInCourseData, EnrollInCourseVariables>;

interface EnrollInCourseRef {
  ...
  (dc: DataConnect, vars: EnrollInCourseVariables): MutationRef<EnrollInCourseData, EnrollInCourseVariables>;
}
export const enrollInCourseRef: EnrollInCourseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the enrollInCourseRef:
```typescript
const name = enrollInCourseRef.operationName;
console.log(name);
```

### Variables
The `EnrollInCourse` mutation requires an argument of type `EnrollInCourseVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface EnrollInCourseVariables {
  userId: string;
  courseId: UUIDString;
}
```
### Return Type
Recall that executing the `EnrollInCourse` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `EnrollInCourseData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface EnrollInCourseData {
  userCourseProgress_insert: UserCourseProgress_Key;
}
```
### Using `EnrollInCourse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, enrollInCourse, EnrollInCourseVariables } from '@impact26/dataconnect-sdk';

// The `EnrollInCourse` mutation requires an argument of type `EnrollInCourseVariables`:
const enrollInCourseVars: EnrollInCourseVariables = {
  userId: ..., 
  courseId: ..., 
};

// Call the `enrollInCourse()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await enrollInCourse(enrollInCourseVars);
// Variables can be defined inline as well.
const { data } = await enrollInCourse({ userId: ..., courseId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await enrollInCourse(dataConnect, enrollInCourseVars);

console.log(data.userCourseProgress_insert);

// Or, you can use the `Promise` API.
enrollInCourse(enrollInCourseVars).then((response) => {
  const data = response.data;
  console.log(data.userCourseProgress_insert);
});
```

### Using `EnrollInCourse`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, enrollInCourseRef, EnrollInCourseVariables } from '@impact26/dataconnect-sdk';

// The `EnrollInCourse` mutation requires an argument of type `EnrollInCourseVariables`:
const enrollInCourseVars: EnrollInCourseVariables = {
  userId: ..., 
  courseId: ..., 
};

// Call the `enrollInCourseRef()` function to get a reference to the mutation.
const ref = enrollInCourseRef(enrollInCourseVars);
// Variables can be defined inline as well.
const ref = enrollInCourseRef({ userId: ..., courseId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = enrollInCourseRef(dataConnect, enrollInCourseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userCourseProgress_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userCourseProgress_insert);
});
```

## UpsertLessonProgress
You can execute the `UpsertLessonProgress` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
upsertLessonProgress(vars: UpsertLessonProgressVariables): MutationPromise<UpsertLessonProgressData, UpsertLessonProgressVariables>;

interface UpsertLessonProgressRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertLessonProgressVariables): MutationRef<UpsertLessonProgressData, UpsertLessonProgressVariables>;
}
export const upsertLessonProgressRef: UpsertLessonProgressRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertLessonProgress(dc: DataConnect, vars: UpsertLessonProgressVariables): MutationPromise<UpsertLessonProgressData, UpsertLessonProgressVariables>;

interface UpsertLessonProgressRef {
  ...
  (dc: DataConnect, vars: UpsertLessonProgressVariables): MutationRef<UpsertLessonProgressData, UpsertLessonProgressVariables>;
}
export const upsertLessonProgressRef: UpsertLessonProgressRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertLessonProgressRef:
```typescript
const name = upsertLessonProgressRef.operationName;
console.log(name);
```

### Variables
The `UpsertLessonProgress` mutation requires an argument of type `UpsertLessonProgressVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertLessonProgressVariables {
  userId: string;
  lessonId: UUIDString;
  status: string;
  videoPositionSeconds?: number | null;
}
```
### Return Type
Recall that executing the `UpsertLessonProgress` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertLessonProgressData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertLessonProgressData {
  userLessonProgress_upsert: UserLessonProgress_Key;
}
```
### Using `UpsertLessonProgress`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertLessonProgress, UpsertLessonProgressVariables } from '@impact26/dataconnect-sdk';

// The `UpsertLessonProgress` mutation requires an argument of type `UpsertLessonProgressVariables`:
const upsertLessonProgressVars: UpsertLessonProgressVariables = {
  userId: ..., 
  lessonId: ..., 
  status: ..., 
  videoPositionSeconds: ..., // optional
};

// Call the `upsertLessonProgress()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertLessonProgress(upsertLessonProgressVars);
// Variables can be defined inline as well.
const { data } = await upsertLessonProgress({ userId: ..., lessonId: ..., status: ..., videoPositionSeconds: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertLessonProgress(dataConnect, upsertLessonProgressVars);

console.log(data.userLessonProgress_upsert);

// Or, you can use the `Promise` API.
upsertLessonProgress(upsertLessonProgressVars).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgress_upsert);
});
```

### Using `UpsertLessonProgress`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertLessonProgressRef, UpsertLessonProgressVariables } from '@impact26/dataconnect-sdk';

// The `UpsertLessonProgress` mutation requires an argument of type `UpsertLessonProgressVariables`:
const upsertLessonProgressVars: UpsertLessonProgressVariables = {
  userId: ..., 
  lessonId: ..., 
  status: ..., 
  videoPositionSeconds: ..., // optional
};

// Call the `upsertLessonProgressRef()` function to get a reference to the mutation.
const ref = upsertLessonProgressRef(upsertLessonProgressVars);
// Variables can be defined inline as well.
const ref = upsertLessonProgressRef({ userId: ..., lessonId: ..., status: ..., videoPositionSeconds: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertLessonProgressRef(dataConnect, upsertLessonProgressVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userLessonProgress_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgress_upsert);
});
```

## CreateQuizAttempt
You can execute the `CreateQuizAttempt` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createQuizAttempt(vars: CreateQuizAttemptVariables): MutationPromise<CreateQuizAttemptData, CreateQuizAttemptVariables>;

interface CreateQuizAttemptRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateQuizAttemptVariables): MutationRef<CreateQuizAttemptData, CreateQuizAttemptVariables>;
}
export const createQuizAttemptRef: CreateQuizAttemptRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createQuizAttempt(dc: DataConnect, vars: CreateQuizAttemptVariables): MutationPromise<CreateQuizAttemptData, CreateQuizAttemptVariables>;

interface CreateQuizAttemptRef {
  ...
  (dc: DataConnect, vars: CreateQuizAttemptVariables): MutationRef<CreateQuizAttemptData, CreateQuizAttemptVariables>;
}
export const createQuizAttemptRef: CreateQuizAttemptRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createQuizAttemptRef:
```typescript
const name = createQuizAttemptRef.operationName;
console.log(name);
```

### Variables
The `CreateQuizAttempt` mutation requires an argument of type `CreateQuizAttemptVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateQuizAttemptVariables {
  userId: string;
  quizId: UUIDString;
  questionOrder: string;
}
```
### Return Type
Recall that executing the `CreateQuizAttempt` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateQuizAttemptData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateQuizAttemptData {
  quizAttempt_insert: QuizAttempt_Key;
}
```
### Using `CreateQuizAttempt`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createQuizAttempt, CreateQuizAttemptVariables } from '@impact26/dataconnect-sdk';

// The `CreateQuizAttempt` mutation requires an argument of type `CreateQuizAttemptVariables`:
const createQuizAttemptVars: CreateQuizAttemptVariables = {
  userId: ..., 
  quizId: ..., 
  questionOrder: ..., 
};

// Call the `createQuizAttempt()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createQuizAttempt(createQuizAttemptVars);
// Variables can be defined inline as well.
const { data } = await createQuizAttempt({ userId: ..., quizId: ..., questionOrder: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createQuizAttempt(dataConnect, createQuizAttemptVars);

console.log(data.quizAttempt_insert);

// Or, you can use the `Promise` API.
createQuizAttempt(createQuizAttemptVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt_insert);
});
```

### Using `CreateQuizAttempt`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createQuizAttemptRef, CreateQuizAttemptVariables } from '@impact26/dataconnect-sdk';

// The `CreateQuizAttempt` mutation requires an argument of type `CreateQuizAttemptVariables`:
const createQuizAttemptVars: CreateQuizAttemptVariables = {
  userId: ..., 
  quizId: ..., 
  questionOrder: ..., 
};

// Call the `createQuizAttemptRef()` function to get a reference to the mutation.
const ref = createQuizAttemptRef(createQuizAttemptVars);
// Variables can be defined inline as well.
const ref = createQuizAttemptRef({ userId: ..., quizId: ..., questionOrder: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createQuizAttemptRef(dataConnect, createQuizAttemptVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quizAttempt_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt_insert);
});
```

## UpsertQuizResponse
You can execute the `UpsertQuizResponse` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
upsertQuizResponse(vars: UpsertQuizResponseVariables): MutationPromise<UpsertQuizResponseData, UpsertQuizResponseVariables>;

interface UpsertQuizResponseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertQuizResponseVariables): MutationRef<UpsertQuizResponseData, UpsertQuizResponseVariables>;
}
export const upsertQuizResponseRef: UpsertQuizResponseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertQuizResponse(dc: DataConnect, vars: UpsertQuizResponseVariables): MutationPromise<UpsertQuizResponseData, UpsertQuizResponseVariables>;

interface UpsertQuizResponseRef {
  ...
  (dc: DataConnect, vars: UpsertQuizResponseVariables): MutationRef<UpsertQuizResponseData, UpsertQuizResponseVariables>;
}
export const upsertQuizResponseRef: UpsertQuizResponseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertQuizResponseRef:
```typescript
const name = upsertQuizResponseRef.operationName;
console.log(name);
```

### Variables
The `UpsertQuizResponse` mutation requires an argument of type `UpsertQuizResponseVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertQuizResponseVariables {
  attemptId: UUIDString;
  questionId: UUIDString;
  selectedLetters: string;
  isCorrect?: boolean | null;
  pointsEarned?: number | null;
  pointsPossible?: number | null;
  answeredAt?: DateString | null;
}
```
### Return Type
Recall that executing the `UpsertQuizResponse` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertQuizResponseData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertQuizResponseData {
  quizResponse_upsert: QuizResponse_Key;
}
```
### Using `UpsertQuizResponse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertQuizResponse, UpsertQuizResponseVariables } from '@impact26/dataconnect-sdk';

// The `UpsertQuizResponse` mutation requires an argument of type `UpsertQuizResponseVariables`:
const upsertQuizResponseVars: UpsertQuizResponseVariables = {
  attemptId: ..., 
  questionId: ..., 
  selectedLetters: ..., 
  isCorrect: ..., // optional
  pointsEarned: ..., // optional
  pointsPossible: ..., // optional
  answeredAt: ..., // optional
};

// Call the `upsertQuizResponse()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertQuizResponse(upsertQuizResponseVars);
// Variables can be defined inline as well.
const { data } = await upsertQuizResponse({ attemptId: ..., questionId: ..., selectedLetters: ..., isCorrect: ..., pointsEarned: ..., pointsPossible: ..., answeredAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertQuizResponse(dataConnect, upsertQuizResponseVars);

console.log(data.quizResponse_upsert);

// Or, you can use the `Promise` API.
upsertQuizResponse(upsertQuizResponseVars).then((response) => {
  const data = response.data;
  console.log(data.quizResponse_upsert);
});
```

### Using `UpsertQuizResponse`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertQuizResponseRef, UpsertQuizResponseVariables } from '@impact26/dataconnect-sdk';

// The `UpsertQuizResponse` mutation requires an argument of type `UpsertQuizResponseVariables`:
const upsertQuizResponseVars: UpsertQuizResponseVariables = {
  attemptId: ..., 
  questionId: ..., 
  selectedLetters: ..., 
  isCorrect: ..., // optional
  pointsEarned: ..., // optional
  pointsPossible: ..., // optional
  answeredAt: ..., // optional
};

// Call the `upsertQuizResponseRef()` function to get a reference to the mutation.
const ref = upsertQuizResponseRef(upsertQuizResponseVars);
// Variables can be defined inline as well.
const ref = upsertQuizResponseRef({ attemptId: ..., questionId: ..., selectedLetters: ..., isCorrect: ..., pointsEarned: ..., pointsPossible: ..., answeredAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertQuizResponseRef(dataConnect, upsertQuizResponseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quizResponse_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quizResponse_upsert);
});
```

## CompleteQuizAttempt
You can execute the `CompleteQuizAttempt` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
completeQuizAttempt(vars: CompleteQuizAttemptVariables): MutationPromise<CompleteQuizAttemptData, CompleteQuizAttemptVariables>;

interface CompleteQuizAttemptRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CompleteQuizAttemptVariables): MutationRef<CompleteQuizAttemptData, CompleteQuizAttemptVariables>;
}
export const completeQuizAttemptRef: CompleteQuizAttemptRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
completeQuizAttempt(dc: DataConnect, vars: CompleteQuizAttemptVariables): MutationPromise<CompleteQuizAttemptData, CompleteQuizAttemptVariables>;

interface CompleteQuizAttemptRef {
  ...
  (dc: DataConnect, vars: CompleteQuizAttemptVariables): MutationRef<CompleteQuizAttemptData, CompleteQuizAttemptVariables>;
}
export const completeQuizAttemptRef: CompleteQuizAttemptRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the completeQuizAttemptRef:
```typescript
const name = completeQuizAttemptRef.operationName;
console.log(name);
```

### Variables
The `CompleteQuizAttempt` mutation requires an argument of type `CompleteQuizAttemptVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CompleteQuizAttemptVariables {
  id: UUIDString;
  scoreRaw: number;
  scoreMax: number;
  scorePct: number;
  passed: boolean;
}
```
### Return Type
Recall that executing the `CompleteQuizAttempt` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CompleteQuizAttemptData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CompleteQuizAttemptData {
  quizAttempt_update?: QuizAttempt_Key | null;
}
```
### Using `CompleteQuizAttempt`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, completeQuizAttempt, CompleteQuizAttemptVariables } from '@impact26/dataconnect-sdk';

// The `CompleteQuizAttempt` mutation requires an argument of type `CompleteQuizAttemptVariables`:
const completeQuizAttemptVars: CompleteQuizAttemptVariables = {
  id: ..., 
  scoreRaw: ..., 
  scoreMax: ..., 
  scorePct: ..., 
  passed: ..., 
};

// Call the `completeQuizAttempt()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await completeQuizAttempt(completeQuizAttemptVars);
// Variables can be defined inline as well.
const { data } = await completeQuizAttempt({ id: ..., scoreRaw: ..., scoreMax: ..., scorePct: ..., passed: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await completeQuizAttempt(dataConnect, completeQuizAttemptVars);

console.log(data.quizAttempt_update);

// Or, you can use the `Promise` API.
completeQuizAttempt(completeQuizAttemptVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt_update);
});
```

### Using `CompleteQuizAttempt`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, completeQuizAttemptRef, CompleteQuizAttemptVariables } from '@impact26/dataconnect-sdk';

// The `CompleteQuizAttempt` mutation requires an argument of type `CompleteQuizAttemptVariables`:
const completeQuizAttemptVars: CompleteQuizAttemptVariables = {
  id: ..., 
  scoreRaw: ..., 
  scoreMax: ..., 
  scorePct: ..., 
  passed: ..., 
};

// Call the `completeQuizAttemptRef()` function to get a reference to the mutation.
const ref = completeQuizAttemptRef(completeQuizAttemptVars);
// Variables can be defined inline as well.
const ref = completeQuizAttemptRef({ id: ..., scoreRaw: ..., scoreMax: ..., scorePct: ..., passed: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = completeQuizAttemptRef(dataConnect, completeQuizAttemptVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quizAttempt_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt_update);
});
```

## MarkAnsweredAt
You can execute the `MarkAnsweredAt` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
markAnsweredAt(vars: MarkAnsweredAtVariables): MutationPromise<MarkAnsweredAtData, MarkAnsweredAtVariables>;

interface MarkAnsweredAtRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkAnsweredAtVariables): MutationRef<MarkAnsweredAtData, MarkAnsweredAtVariables>;
}
export const markAnsweredAtRef: MarkAnsweredAtRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markAnsweredAt(dc: DataConnect, vars: MarkAnsweredAtVariables): MutationPromise<MarkAnsweredAtData, MarkAnsweredAtVariables>;

interface MarkAnsweredAtRef {
  ...
  (dc: DataConnect, vars: MarkAnsweredAtVariables): MutationRef<MarkAnsweredAtData, MarkAnsweredAtVariables>;
}
export const markAnsweredAtRef: MarkAnsweredAtRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markAnsweredAtRef:
```typescript
const name = markAnsweredAtRef.operationName;
console.log(name);
```

### Variables
The `MarkAnsweredAt` mutation requires an argument of type `MarkAnsweredAtVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkAnsweredAtVariables {
  attemptId: UUIDString;
  questionId: UUIDString;
  answeredAt: DateString;
}
```
### Return Type
Recall that executing the `MarkAnsweredAt` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkAnsweredAtData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkAnsweredAtData {
  quizResponse_update?: QuizResponse_Key | null;
}
```
### Using `MarkAnsweredAt`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markAnsweredAt, MarkAnsweredAtVariables } from '@impact26/dataconnect-sdk';

// The `MarkAnsweredAt` mutation requires an argument of type `MarkAnsweredAtVariables`:
const markAnsweredAtVars: MarkAnsweredAtVariables = {
  attemptId: ..., 
  questionId: ..., 
  answeredAt: ..., 
};

// Call the `markAnsweredAt()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markAnsweredAt(markAnsweredAtVars);
// Variables can be defined inline as well.
const { data } = await markAnsweredAt({ attemptId: ..., questionId: ..., answeredAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markAnsweredAt(dataConnect, markAnsweredAtVars);

console.log(data.quizResponse_update);

// Or, you can use the `Promise` API.
markAnsweredAt(markAnsweredAtVars).then((response) => {
  const data = response.data;
  console.log(data.quizResponse_update);
});
```

### Using `MarkAnsweredAt`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markAnsweredAtRef, MarkAnsweredAtVariables } from '@impact26/dataconnect-sdk';

// The `MarkAnsweredAt` mutation requires an argument of type `MarkAnsweredAtVariables`:
const markAnsweredAtVars: MarkAnsweredAtVariables = {
  attemptId: ..., 
  questionId: ..., 
  answeredAt: ..., 
};

// Call the `markAnsweredAtRef()` function to get a reference to the mutation.
const ref = markAnsweredAtRef(markAnsweredAtVars);
// Variables can be defined inline as well.
const ref = markAnsweredAtRef({ attemptId: ..., questionId: ..., answeredAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markAnsweredAtRef(dataConnect, markAnsweredAtVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quizResponse_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quizResponse_update);
});
```

## CreateFormulaSection
You can execute the `CreateFormulaSection` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createFormulaSection(vars: CreateFormulaSectionVariables): MutationPromise<CreateFormulaSectionData, CreateFormulaSectionVariables>;

interface CreateFormulaSectionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFormulaSectionVariables): MutationRef<CreateFormulaSectionData, CreateFormulaSectionVariables>;
}
export const createFormulaSectionRef: CreateFormulaSectionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createFormulaSection(dc: DataConnect, vars: CreateFormulaSectionVariables): MutationPromise<CreateFormulaSectionData, CreateFormulaSectionVariables>;

interface CreateFormulaSectionRef {
  ...
  (dc: DataConnect, vars: CreateFormulaSectionVariables): MutationRef<CreateFormulaSectionData, CreateFormulaSectionVariables>;
}
export const createFormulaSectionRef: CreateFormulaSectionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createFormulaSectionRef:
```typescript
const name = createFormulaSectionRef.operationName;
console.log(name);
```

### Variables
The `CreateFormulaSection` mutation requires an argument of type `CreateFormulaSectionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateFormulaSectionVariables {
  id: UUIDString;
  code: string;
  title: string;
  position: number;
}
```
### Return Type
Recall that executing the `CreateFormulaSection` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateFormulaSectionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateFormulaSectionData {
  formulaSection_insert: FormulaSection_Key;
}
```
### Using `CreateFormulaSection`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createFormulaSection, CreateFormulaSectionVariables } from '@impact26/dataconnect-sdk';

// The `CreateFormulaSection` mutation requires an argument of type `CreateFormulaSectionVariables`:
const createFormulaSectionVars: CreateFormulaSectionVariables = {
  id: ..., 
  code: ..., 
  title: ..., 
  position: ..., 
};

// Call the `createFormulaSection()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createFormulaSection(createFormulaSectionVars);
// Variables can be defined inline as well.
const { data } = await createFormulaSection({ id: ..., code: ..., title: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createFormulaSection(dataConnect, createFormulaSectionVars);

console.log(data.formulaSection_insert);

// Or, you can use the `Promise` API.
createFormulaSection(createFormulaSectionVars).then((response) => {
  const data = response.data;
  console.log(data.formulaSection_insert);
});
```

### Using `CreateFormulaSection`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createFormulaSectionRef, CreateFormulaSectionVariables } from '@impact26/dataconnect-sdk';

// The `CreateFormulaSection` mutation requires an argument of type `CreateFormulaSectionVariables`:
const createFormulaSectionVars: CreateFormulaSectionVariables = {
  id: ..., 
  code: ..., 
  title: ..., 
  position: ..., 
};

// Call the `createFormulaSectionRef()` function to get a reference to the mutation.
const ref = createFormulaSectionRef(createFormulaSectionVars);
// Variables can be defined inline as well.
const ref = createFormulaSectionRef({ id: ..., code: ..., title: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createFormulaSectionRef(dataConnect, createFormulaSectionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.formulaSection_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.formulaSection_insert);
});
```

## CreateFormula
You can execute the `CreateFormula` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createFormula(vars: CreateFormulaVariables): MutationPromise<CreateFormulaData, CreateFormulaVariables>;

interface CreateFormulaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFormulaVariables): MutationRef<CreateFormulaData, CreateFormulaVariables>;
}
export const createFormulaRef: CreateFormulaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createFormula(dc: DataConnect, vars: CreateFormulaVariables): MutationPromise<CreateFormulaData, CreateFormulaVariables>;

interface CreateFormulaRef {
  ...
  (dc: DataConnect, vars: CreateFormulaVariables): MutationRef<CreateFormulaData, CreateFormulaVariables>;
}
export const createFormulaRef: CreateFormulaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createFormulaRef:
```typescript
const name = createFormulaRef.operationName;
console.log(name);
```

### Variables
The `CreateFormula` mutation requires an argument of type `CreateFormulaVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateFormulaVariables {
  sectionId: UUIDString;
  code: string;
  name: string;
  expression: string;
  notes?: string | null;
  position: number;
}
```
### Return Type
Recall that executing the `CreateFormula` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateFormulaData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateFormulaData {
  formula_insert: Formula_Key;
}
```
### Using `CreateFormula`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createFormula, CreateFormulaVariables } from '@impact26/dataconnect-sdk';

// The `CreateFormula` mutation requires an argument of type `CreateFormulaVariables`:
const createFormulaVars: CreateFormulaVariables = {
  sectionId: ..., 
  code: ..., 
  name: ..., 
  expression: ..., 
  notes: ..., // optional
  position: ..., 
};

// Call the `createFormula()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createFormula(createFormulaVars);
// Variables can be defined inline as well.
const { data } = await createFormula({ sectionId: ..., code: ..., name: ..., expression: ..., notes: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createFormula(dataConnect, createFormulaVars);

console.log(data.formula_insert);

// Or, you can use the `Promise` API.
createFormula(createFormulaVars).then((response) => {
  const data = response.data;
  console.log(data.formula_insert);
});
```

### Using `CreateFormula`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createFormulaRef, CreateFormulaVariables } from '@impact26/dataconnect-sdk';

// The `CreateFormula` mutation requires an argument of type `CreateFormulaVariables`:
const createFormulaVars: CreateFormulaVariables = {
  sectionId: ..., 
  code: ..., 
  name: ..., 
  expression: ..., 
  notes: ..., // optional
  position: ..., 
};

// Call the `createFormulaRef()` function to get a reference to the mutation.
const ref = createFormulaRef(createFormulaVars);
// Variables can be defined inline as well.
const ref = createFormulaRef({ sectionId: ..., code: ..., name: ..., expression: ..., notes: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createFormulaRef(dataConnect, createFormulaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.formula_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.formula_insert);
});
```

## CreateContentSourceLink
You can execute the `CreateContentSourceLink` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createContentSourceLink(vars: CreateContentSourceLinkVariables): MutationPromise<CreateContentSourceLinkData, CreateContentSourceLinkVariables>;

interface CreateContentSourceLinkRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateContentSourceLinkVariables): MutationRef<CreateContentSourceLinkData, CreateContentSourceLinkVariables>;
}
export const createContentSourceLinkRef: CreateContentSourceLinkRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createContentSourceLink(dc: DataConnect, vars: CreateContentSourceLinkVariables): MutationPromise<CreateContentSourceLinkData, CreateContentSourceLinkVariables>;

interface CreateContentSourceLinkRef {
  ...
  (dc: DataConnect, vars: CreateContentSourceLinkVariables): MutationRef<CreateContentSourceLinkData, CreateContentSourceLinkVariables>;
}
export const createContentSourceLinkRef: CreateContentSourceLinkRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createContentSourceLinkRef:
```typescript
const name = createContentSourceLinkRef.operationName;
console.log(name);
```

### Variables
The `CreateContentSourceLink` mutation requires an argument of type `CreateContentSourceLinkVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateContentSourceLinkVariables {
  id: UUIDString;
  sourceMaterialId: UUIDString;
  lessonId?: UUIDString | null;
  courseId?: UUIDString | null;
  questionId?: UUIDString | null;
  referenceLabel?: string | null;
}
```
### Return Type
Recall that executing the `CreateContentSourceLink` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateContentSourceLinkData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateContentSourceLinkData {
  contentSourceLink_insert: ContentSourceLink_Key;
}
```
### Using `CreateContentSourceLink`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createContentSourceLink, CreateContentSourceLinkVariables } from '@impact26/dataconnect-sdk';

// The `CreateContentSourceLink` mutation requires an argument of type `CreateContentSourceLinkVariables`:
const createContentSourceLinkVars: CreateContentSourceLinkVariables = {
  id: ..., 
  sourceMaterialId: ..., 
  lessonId: ..., // optional
  courseId: ..., // optional
  questionId: ..., // optional
  referenceLabel: ..., // optional
};

// Call the `createContentSourceLink()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createContentSourceLink(createContentSourceLinkVars);
// Variables can be defined inline as well.
const { data } = await createContentSourceLink({ id: ..., sourceMaterialId: ..., lessonId: ..., courseId: ..., questionId: ..., referenceLabel: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createContentSourceLink(dataConnect, createContentSourceLinkVars);

console.log(data.contentSourceLink_insert);

// Or, you can use the `Promise` API.
createContentSourceLink(createContentSourceLinkVars).then((response) => {
  const data = response.data;
  console.log(data.contentSourceLink_insert);
});
```

### Using `CreateContentSourceLink`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createContentSourceLinkRef, CreateContentSourceLinkVariables } from '@impact26/dataconnect-sdk';

// The `CreateContentSourceLink` mutation requires an argument of type `CreateContentSourceLinkVariables`:
const createContentSourceLinkVars: CreateContentSourceLinkVariables = {
  id: ..., 
  sourceMaterialId: ..., 
  lessonId: ..., // optional
  courseId: ..., // optional
  questionId: ..., // optional
  referenceLabel: ..., // optional
};

// Call the `createContentSourceLinkRef()` function to get a reference to the mutation.
const ref = createContentSourceLinkRef(createContentSourceLinkVars);
// Variables can be defined inline as well.
const ref = createContentSourceLinkRef({ id: ..., sourceMaterialId: ..., lessonId: ..., courseId: ..., questionId: ..., referenceLabel: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createContentSourceLinkRef(dataConnect, createContentSourceLinkVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.contentSourceLink_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.contentSourceLink_insert);
});
```

