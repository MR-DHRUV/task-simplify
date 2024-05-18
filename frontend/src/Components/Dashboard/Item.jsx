import React, { useEffect, useState } from 'react'
import { url } from '../constants';
import Swal from 'sweetalert2';

const Item = (props) => {

    const [edit, setEdit] = useState(false);
    const [task, setTask] = useState(props.task);

    // function to update the task
    const updateTask = async () => {
        
        if (task.data === "" || task.due === "") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all the fields!',
            });
            return;
        }
        
        let newTask = props.taskList;
        newTask[props.taskList.findIndex((t) => t._id === task._id)] = task;
        props.setTaskList(newTask);
        setEdit(false);

        await fetch(`${url}/tasks/update/${task._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "auth-token": localStorage.getItem("auth-token"),
            },
            mode: "cors",
            referrerPolicy: "origin-when-cross-origin",
            body: JSON.stringify(task)
        });
    }

    // function to delete the task
    const deleteTask = async () => {
        props.setTaskList(props.taskList.filter((t) => t._id !== task._id));

        await fetch(`${url}/tasks/delete/${task._id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "auth-token": localStorage.getItem("auth-token")?.toString() || "",
            },
            mode: "cors",
            referrerPolicy: "origin-when-cross-origin",
        });
    }

    // function to update the status of the task
    const updateStatus = async () => {
        setTask({ ...task, status: task.status === "completed" ? "pending" : "completed" });
    }

    const onChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    }
    
    // update the status of the task
    useEffect(() => {
        updateTask();
    }, [task.status]);

    useEffect(() => {
        setTask(props.task);
    }, [props.task]);

    return (
        <div >
            {edit ? (
                <div className="row">
                    <div className="col-6">
                        <input
                            type="text"
                            name="data"
                            placeholder='Whats on your mind...'
                            className='form-control no-shadow'
                            value={task.data}
                            onChange={onChange}
                        />
                    </div>
                    <div className="col-2">
                        <input
                            type="number"
                            name="priority"
                            placeholder='Priority'
                            className='form-control no-shadow'
                            value={task.priority}
                            onChange={onChange}
                        />
                    </div>
                    <div className="col-2">
                        <input
                            type="date"
                            name="due"
                            className='form-control no-shadow'
                            value={task.due ? task.due.split('T')[0] : ""}
                            onChange={onChange}
                        />
                    </div>
                    <div className="col-1">
                        <button
                            name='add'
                            className="form-control btn btn-primary no-shadow"
                            onClick={updateTask}
                        >Update
                        </button>
                    </div>
                    <div className="col-1">
                        <button
                            name='add'
                            className="form-control btn btn-primary"
                            onClick={()=>{setEdit(false)}}
                        >Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <ul class="list-group list-group-horizontal">
                    <li class="list-group-item d-flex align-items-center ps-0 pe-3 py-1 bg-transparent justify-content-center border-0">
                        <div class="form-check">
                            <input class="form-check-input me-0" type="checkbox" checked={task.status === "completed"} onChange={updateStatus} />
                        </div>
                        <p className='text-center ms-2 fs-4 m-0'> | {task.priority}</p>
                    </li>
                    <li class="list-group-item px-3 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent">
                        <p class="lead fw-normal mb-0">{task.data}</p>
                    </li>
                    <li class="list-group-item ps-3 pe-0 py-1 rounded-0 border-0 bg-transparent">
                        <div class="d-flex flex-row justify-content-end mb-1">
                            <button class="btn mt-0 text-info pe-0" onClick={() => { setEdit(true) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                </svg>
                            </button>
                            <button class="btn mt-0 text-danger pe-0" onClick={deleteTask}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                </svg>
                            </button>
                        </div>
                        <div class="text-end text-muted">
                            <p class="small mb-0">{task.due.toString().split('T')[0]}</p>
                        </div>
                    </li>
                </ul>
            )}
        </div>
    )
}

export default Item
