import { NextFunction, Request, Response } from "express"
import { Group } from "../entity/group.entity"
import { StudentRollState } from "../entity/student-roll-state.entity"
import { GroupStudent } from "../entity/group-student.entity"
import { getRepository, getManager } from "typeorm"
import { CreateGroupInput, UpdateGroupInput } from "../interface/group.interface"
import { CreateGroupStudentInput } from "../interface/group-student.interface"
var moment = require('moment')

export class GroupController {
  private entityManager = getManager();
  private groupRepository = getRepository(Group)
  private groupStudentRepository = getRepository(GroupStudent)
  async allGroups(request: Request, response: Response, next: NextFunction) {
    // Task 1: 
    // Return the list of all groups
    return this.groupRepository.find()

  }

  async createGroup(request: Request, response: Response, next: NextFunction) {
    // Task 1: 
    // Add a Group
    const { body: params } = request

    const createGroupInput: CreateGroupInput = {
      name: params.name,
      number_of_weeks: params.number_of_weeks,
      roll_states: params.roll_states,
      incidents: params.incidents,
      ltmt: params.ltmt,
      student_count: 0
    }
    const group = new Group()
    group.prepareToCreate(createGroupInput)

    return this.groupRepository.save(group)

  }

  async updateGroup(request: Request, response: Response, next: NextFunction) {
    // Task 1: 
    // Update a Group
    const { body: params } = request

    this.groupRepository.findOne(params.id).then((group) => {
      const updateGroupInput: UpdateGroupInput = {
        id: params.id,
        name: params.name,
        number_of_weeks: params.number_of_weeks,
        roll_states: params.roll_states,
        incidents: params.incidents,
        ltmt: params.ltmt
      }
      group.prepareToUpdate(updateGroupInput)

      return this.groupRepository.save(group)
    })

  }

  async removeGroup(request: Request, response: Response, next: NextFunction) {
    // Task 1: 
    // Delete a Group
    let groupToRemove = await this.groupRepository.findOne(request.params.id)
    await this.groupRepository.remove(groupToRemove)
    return (true);
  }

  async getGroupStudents(request: Request, response: Response, next: NextFunction) {
    // Task 1: 
    // Return the list of Students that are in a Group
    const { query: params } = request
    var qur2 = await this.entityManager.query(`SELECT s.id, s.first_name, s.last_name, s.first_name || ' ' || s.last_name AS FullName FROM student s, group_student gs WHERE s.id = gs.student_id and gs.group_id = ${params.id}`)
    return qur2;
  }


  async runGroupFilters(request: Request, response: Response, next: NextFunction) {
    // Task 2:
    const { body: params } = request

    // 1. Clear out the groups (delete all the students from the groups)
    const entities = await this.groupStudentRepository.find();
    if (!entities) {
      console.log(`No entities found. Already empty`);
    }
    else{
      await this.groupStudentRepository.remove(entities);
      console.log("deleted all entries")
    }
    //1st query
    console.log("Running query 1......")
    const qur1 = await this.entityManager.query(`SELECT * from 'group'`)
    // 2. For each group, query the student rolls to see which students match the filter for the group
    for (var i = 0; i < qur1.length; i++) {
      console.log(qur1[i])
      //2nd query
      var dateHigh = moment().toISOString(); //get current date
      var dateLow = moment().subtract(qur1[i].number_of_weeks, 'week').toISOString();//get date in past upto which records need to be checked
      console.log("Running query 2......")
      var qur2 = await this.entityManager.query(`SELECT id from roll where completed_at BETWEEN ? AND ?`, [ `${dateLow}`, `${dateHigh}` ]); //fetching roll ids between our date range
      var listOfRollId = qur2.map(function (obj) { return obj.id; }); //convert roll array of objects to a list

      //3rd query
      console.log("Running query 3......")
      const qur3 = await this.entityManager.query(`SELECT student_id, count(*) as no_of_incidents from student_roll_state where state in ('${qur1[i].roll_states}') and roll_id in (${listOfRollId}) group by student_id having count(*) ${qur1[i].ltmt} ${qur1[i].incidents}`);
      //fetching student ids which meet our filter
      // 3. Add the list of students that match the filter to the group
      for (var j = 0; j < qur3.length; j++) {
        const createGroupStudentInput: CreateGroupStudentInput = {
          student_id: qur3[j].student_id,
          group_id: qur1[i].id,
          incident_count: qur3[j].no_of_incidents
        }
        const groupStudent = new GroupStudent()
        groupStudent.prepareToCreate(createGroupStudentInput);
        await this.groupStudentRepository.save(groupStudent);
      }
      this.groupRepository.findOne(qur1[i].id).then(async (group) => {
        const updateGroupInput: UpdateGroupInput = {
          run_at: moment().toISOString(),
          student_count: qur3.length
        }
        group.prepareToUpdate(updateGroupInput)
        await this.groupRepository.save(group)
      })
    }
    return (true);
  }
}