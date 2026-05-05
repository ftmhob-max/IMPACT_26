# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, updateUserRole, createCourse, updateCourse, createModule, createLesson, updateLesson, createSourceMaterial, createIngestionJob, createQuestion } from '@impact26/dataconnect-sdk';


// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation UpdateUserRole:  For variables, look at type UpdateUserRoleVars in ../index.d.ts
const { data } = await UpdateUserRole(dataConnect, updateUserRoleVars);

// Operation CreateCourse:  For variables, look at type CreateCourseVars in ../index.d.ts
const { data } = await CreateCourse(dataConnect, createCourseVars);

// Operation UpdateCourse:  For variables, look at type UpdateCourseVars in ../index.d.ts
const { data } = await UpdateCourse(dataConnect, updateCourseVars);

// Operation CreateModule:  For variables, look at type CreateModuleVars in ../index.d.ts
const { data } = await CreateModule(dataConnect, createModuleVars);

// Operation CreateLesson:  For variables, look at type CreateLessonVars in ../index.d.ts
const { data } = await CreateLesson(dataConnect, createLessonVars);

// Operation UpdateLesson:  For variables, look at type UpdateLessonVars in ../index.d.ts
const { data } = await UpdateLesson(dataConnect, updateLessonVars);

// Operation CreateSourceMaterial:  For variables, look at type CreateSourceMaterialVars in ../index.d.ts
const { data } = await CreateSourceMaterial(dataConnect, createSourceMaterialVars);

// Operation CreateIngestionJob:  For variables, look at type CreateIngestionJobVars in ../index.d.ts
const { data } = await CreateIngestionJob(dataConnect, createIngestionJobVars);

// Operation CreateQuestion:  For variables, look at type CreateQuestionVars in ../index.d.ts
const { data } = await CreateQuestion(dataConnect, createQuestionVars);


```