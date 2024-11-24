import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] =[];

    getAllTasks(){
        return this.tasks;
    }

    getTasksWithFilters(filterDto: GetTasksFilterDto): Task[]{
        const {status, search} = filterDto;

        // define a temporary array to hold the filtered tasks
        let tasks = this.getAllTasks();

        // filter tasks based on status
        if(status){
            tasks = tasks.filter((task) => task.status === status);
        }

        // filter tasks based on search
        if(search){
            tasks = tasks.filter((task) => {
                if(task.title.includes(search) || task.description.includes(search)) {
                    return true;
                }
                return false;
            });
        }

        return tasks;
    }

    getTaskById(id: string): Task{
        const found = this.tasks.find((task) => task.id === id);

        if(!found){
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return found;
    }

    createTask(createTaskDto: CreateTaskDto){
        const {title, description} = createTaskDto;

        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };

        this.tasks.push(task);
        return task;
    }

    deleteTask(id: string): void{
        // you loop once to get the task and then loop again to filter it out 
        // -> inefficient but the exercise is to show how to handle errors
        const found = this.getTaskById(id);
        this.tasks = this.tasks.filter((task) => task.id !== found.id);
    }

    updateTaskStatus(id: string, status: TaskStatus): Task{
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }
}
