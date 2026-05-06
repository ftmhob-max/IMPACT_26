# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, updateUserRole, createCourse, updateCourse, createModule, updateModule, createLessonVersion, createLesson, updateLesson, createSourceMaterial } from '@impact26/dataconnect-sdk';


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

// Operation UpdateModule:  For variables, look at type UpdateModuleVars in ../index.d.ts
const { data } = await UpdateModule(dataConnect, updateModuleVars);

// Operation CreateLessonVersion:  For variables, look at type CreateLessonVersionVars in ../index.d.ts
const { data } = await CreateLessonVersion(dataConnect, createLessonVersionVars);

// Operation CreateLesson:  For variables, look at type CreateLessonVars in ../index.d.ts
const { data } = await CreateLesson(dataConnect, createLessonVars);

// Operation UpdateLesson:  For variables, look at type UpdateLessonVars in ../index.d.ts
const { data } = await UpdateLesson(dataConnect, updateLessonVars);

// Operation CreateSourceMaterial:  For variables, look at type CreateSourceMaterialVars in ../index.d.ts
const { data } = await CreateSourceMaterial(dataConnect, createSourceMaterialVars);


```