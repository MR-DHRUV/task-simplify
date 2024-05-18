import React, { useEffect, useState } from 'react'
import { url } from '../constants';
import { useNavigate } from 'react-router-dom';
import Item from './Item';
import Swal from 'sweetalert2';

const Dashboard = () => {

    const navigate = useNavigate();
    const [taskList, setTaskList] = useState([])
    const [newTask, setNewTask] = useState({
        data: "",
        status: "pending",
        priority: 0,
        due: "",
    })

    const [name, setName] = useState("");
    const [sort, setSort] = useState("1");
    const [filter, setFilter] = useState("");
    const [search, setSearch] = useState("")

    // function to fetch the tasks
    const fetchData = async () => {
        const response = await fetch(`${url}/tasks/?search=${search}&status=${filter}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "auth-token": localStorage.getItem("auth-token"),
            },
            mode: "cors",
            referrerPolicy: "origin-when-cross-origin",
        });

        const json = await response.json();
        if (json.success) {
            if (sort === "1") {
                json.tasks.sort((a, b) => new Date(a.due) - new Date(b.due));
            } else {
                json.tasks.sort((a, b) => b.priority - a.priority);
            }
            setTaskList(json.tasks);
        }
    }

    // function to add a task
    const addTask = async () => {

        if (newTask.data === "" || newTask.due === "") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all the fields!',
            });
            return;
        }

        await fetch(`${url}/tasks/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "auth-token": localStorage.getItem("auth-token"),
            },
            mode: "cors",
            referrerPolicy: "origin-when-cross-origin",
            body: JSON.stringify(newTask)
        });

        setNewTask({
            data: "",
            status: "pending",
            priority: 0,
            due: "",
        });

        let newTaskList = taskList;
        newTaskList.push(newTask);

        if (sort === "1") {
            newTaskList.sort((a, b) => new Date(a.due) - new Date(b.due));
        } else {
            newTaskList.sort((a, b) => b.priority - a.priority);
        }

        setTaskList(newTaskList);
    }

    // Function to fetch user data from the server
    const fetchUserData = async () => {
        const response = await fetch(`${url}/auth/verifyuser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "auth-token": localStorage.getItem("auth-token"),
            },
            mode: "cors",
            referrerPolicy: "origin-when-cross-origin",
        });

        const json = await response.json();
        if (!json.success) {
            navigate("/signin");
        }

        setName(json.user.name);
        await fetchData();
    }

    const onChange = (e) => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    }

    // Fetch the data when token is present and is valid
    useEffect(() => {
        if (!localStorage.getItem("auth-token")) {
            navigate("/signin");
        }
        fetchUserData();
    }, []);

    // Fetch the data when the search, filter or sort changes
    useEffect(() => {
        fetchData();
    }, [search, filter]);

    // Sort the tasks based on the selected option
    useEffect(() => {
        let sortedTaskList;
        if (sort === "1") {
            sortedTaskList = [...taskList].sort((a, b) => new Date(a.due) - new Date(b.due));
        } else {
            sortedTaskList = [...taskList].sort((a, b) => b.priority - a.priority);
        }
        setTaskList(sortedTaskList);
    }, [sort]);

    return (
        <div className='d-flex flex-column align-items-center mybg'>
            <nav className="navbar rounded-4 mt-3 w-50 bg-light">
                <div className="container-fluid d-flex flex-row justify-content-between">
                    <a className="navbar-brand" href="#">Tasks</a>
                    <div className="d-flex flex-row">
                        <button className="btn btn-outline-secondary border-0 p-2 mx-1" onClick={() => {
                            localStorage.removeItem("auth-token");
                            navigate("/signin");
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                                <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mt-5">
                <div>
                    <h3>Hi, {name}</h3>
                    <div className="row mt-3">
                        <div className="col-6">
                            <label for="data" className="form-label">Add Task</label>
                            <input
                                type="text"
                                name="data"
                                placeholder='Whats on your mind...'
                                className='form-control'
                                value={newTask.data}
                                onChange={onChange}
                            />
                        </div>
                        <div className="col-2">
                            <label for="due" className="form-label">Priority</label>
                            <input
                                type="number"
                                name="priority"
                                placeholder='Priority'
                                className='form-control'
                                value={newTask.priority}
                                onChange={onChange}
                            />
                        </div>
                        <div className="col-2">
                            <label for="due" className="form-label">Due</label>
                            <input
                                type="date"
                                name="due"
                                className='form-control'
                                value={newTask.due}
                                onChange={onChange}
                            />
                        </div>
                        <div className="col-2">
                            <label htmlFor="add" className='form-label mytxt'>&nsbp;</label>
                            <button
                                name='add'
                                className="form-control btn btn-primary"
                                onClick={addTask}
                            >Add
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <hr className="my-4" />
                    <h3>Your Tasks</h3>
                    <div className="d-flex align-items-center mb-4 pt-2 pb-3 gap-4">
                        <div className="d-flex flex-column">
                            <p className="small mb-0 me-2 text-muted">Search</p>
                            <input class="form-control me-2" type="search" placeholder="Search Tasks" value={search} onChange={(e) => { setSearch(e.target.value) }} />
                        </div>
                        <div className="d-flex flex-column">
                            <p className="small mb-0 me-2 text-muted">Filter</p>
                            <select className="form-select form-sm" value={filter} onChange={(e) => { setFilter(e.target.value) }}>
                                <option value={""}>All</option>
                                <option value={"completed"}>Completed</option>
                                <option value={"pending"}>Pending</option>
                            </select>
                        </div>
                        <div className="d-flex flex-column">
                            <p className="small mb-0 ms-4 me-2 text-muted">Sort</p>
                            <select className="form-select form-sm" value={sort} onChange={(e) => { setSort(e.target.value) }}>
                                <option value={1}>Due date</option>
                                <option value={2}>Priority</option>
                            </select>
                        </div>
                    </div>
                    <div className="tasks pe-3">
                        {taskList.map((task, index) => {
                            return <Item task={task} taskList={taskList} setTaskList={setTaskList} />
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard
