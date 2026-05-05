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
  - [*GetUserAttemptHistory*](#getuserattempthistory)
  - [*GetAttemptResults*](#getattemptresults)
  - [*GetFormulaSections*](#getformulasections)
  - [*GetUserProgressDetails*](#getuserprogressdetails)
  - [*ListAdminQuizzes*](#listadminquizzes)
  - [*GetQuizQuestionsAdmin*](#getquizquestionsadmin)
  - [*GetAttemptForEvaluation*](#getattemptforevaluation)
  - [*GetQuestionWithAnswers*](#getquestionwithanswers)
  - [*GetQuizQuestionPointValue*](#getquizquestionpointvalue)
  - [*GetAttemptForCompletion*](#getattemptforcompletion)
  - [*GetAttemptOwner*](#getattemptowner)
  - [*AdminListQuestions*](#adminlistquestions)
  - [*AdminListCourses*](#adminlistcourses)
  - [*AdminListSourceMaterials*](#adminlistsourcematerials)
  - [*AdminListUsers*](#adminlistusers)
  - [*AdminCohortStats*](#admincohortstats)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*UpdateUserRole*](#updateuserrole)
  - [*CreateCourse*](#createcourse)
  - [*UpdateCourse*](#updatecourse)
  - [*CreateModule*](#createmodule)
  - [*CreateLesson*](#createlesson)
  - [*UpdateLesson*](#updatelesson)
  - [*CreateSourceMaterial*](#createsourcematerial)
  - [*CreateIngestionJob*](#createingestionjob)
  - [*CreateQuestion*](#createquestion)
  - [*UpdateQuestion*](#updatequestion)
  - [*CreateAnswerChoice*](#createanswerchoice)
  - [*UpdateAnswerChoice*](#updateanswerchoice)
  - [*CreateQuiz*](#createquiz)
  - [*AddQuestionToQuiz*](#addquestiontoquiz)
  - [*EnrollInCourse*](#enrollincourse)
  - [*UpsertLessonProgress*](#upsertlessonprogress)
  - [*CreateQuizAttempt*](#createquizattempt)
  - [*UpsertQuizResponse*](#upsertquizresponse)
  - [*CompleteQuizAttempt*](#completequizattempt)
  - [*MarkAnsweredAt*](#markansweredat)
  - [*CreateFormulaSection*](#createformulasection)
  - [*CreateFormula*](#createformula)

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
      lessons_on_module: ({
        id: UUIDString;
        title: string;
        position: number;
        lessonType: string;
        durationSeconds?: number | null;
        videoPlaybackId?: string | null;
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
const { data } = await updateLesson({ id: ..., title: ..., contentJson: ..., videoPlaybackId: ..., quizId: ..., sourceMaterialId: ..., durationSeconds: ..., status: ..., isPublished: ..., updatedById: ..., publishedAt: ..., });

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
const ref = updateLessonRef({ id: ..., title: ..., contentJson: ..., videoPlaybackId: ..., quizId: ..., sourceMaterialId: ..., durationSeconds: ..., status: ..., isPublished: ..., updatedById: ..., publishedAt: ..., });

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

