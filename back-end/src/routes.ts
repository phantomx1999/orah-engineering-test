import { StudentController } from "./controller/student-controller"
import { RollController } from "./controller/roll-controller"
import { GroupController } from "./controller/group-controller"

export const Routes = [
  {
    method: "get",
    route: "/student/get-all",
    controller: StudentController,
    action: "allStudents",
  },
  {
    method: "get",
    route: "/student/get-by-id",
    controller: StudentController,
    action: "getStudent",
  },
  {
    method: "post",
    route: "/student/create",
    controller: StudentController,
    action: "createStudent",
  },
  {
    method: "put",
    route: "/student/update",
    controller: StudentController,
    action: "updateStudent",
  },
  {
    method: "delete",
    route: "/student/delete",
    controller: StudentController,
    action: "removeStudent",
  },
  {
    method: "get",
    route: "/roll/get-all",
    controller: RollController,
    action: "allRolls",
  },
  {
    method: "get",
    route: "/roll/get-by-id",
    controller: RollController,
    action: "getRoll",
  },
  {
    method: "post",
    route: "/roll/create",
    controller: RollController,
    action: "createRoll",
  },
  {
    method: "put",
    route: "/roll/update",
    controller: RollController,
    action: "updateRoll",
  },
  {
    method: "delete",
    route: "/roll/delete",
    controller: RollController,
    action: "removeRoll",
  },
  {
    method: "post",
    route: "/roll/add-student-states",
    controller: RollController,
    action: "addStudentRollStates",
  },
  {
    method: "post",
    route: "/roll/add-student-roll-state",
    controller: RollController,
    action: "addStudentRollState",
  },
  {
    method: "put",
    route: "/roll/update-student-roll-state",
    controller: RollController,
    action: "updateStudentRollState",
  },
  {
    method: "get",
    route:"/roll/student-roll-state-get-all",
    controller: RollController,
    action: "allStudentRoleState"
  },
  {
    method: "get",
    route: "/group/get-all",
    controller: GroupController,
    action: "allGroups",
  },
  {
    method: "post",
    route: "/group/create",
    controller: GroupController,
    action: "createGroup",
  },
  {
    method: "put",
    route: "/group/update",
    controller: GroupController,
    action: "updateGroup",
  },
  {
    method: "delete",
    route: "/group/delete",
    controller: GroupController,
    action: "removeGroup",
  },
  {
    method: "get",
    route: "/group/get-group-students",
    controller: GroupController,
    action: "getGroupStudents"
  },
  {
    method: "post",
    route: "/group/run-group-filters",
    controller: GroupController,
    action: "runGroupFilters"
  }
]
