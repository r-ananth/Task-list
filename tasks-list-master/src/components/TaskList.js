import React, { useState } from "react";
import Task from "./Task";
import styled from "styled-components";

const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #07182E;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  text-align: center;
  font-family: 'Roboto', sans-serif;
  color: #f0f0f0;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 15px;
  margin-right: 10px;
  border: 1px solid #555555;
  border-radius: 5px;
  flex-grow: 1;
  background-color: #444444;
  color: #f0f0f0;
  font-family: 'Roboto', sans-serif;

  &:focus {
    outline: none;
    border-color: #00b7ff;
  }
`;

const Select = styled.select`
  padding: 15px;
  margin-right: 10px;
  border: 1px solid #555555;
  border-radius: 5px;
  background-color: #444444;
  color: #f0f0f0;
  cursor: pointer;
  appearance: none;

  &:focus {
    outline: none;
    border-color: #00b7ff;
  }

  padding-right: 30px; 
  background-image: url('data:image/svg+xml;utf8,<svg fill="%2300b7ff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
`;

const AddButton = styled.button`
  padding: 15px;
  border: none;
  border-radius: 5px;
  background-color: #00b7ff;
  color: white;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;

  &:hover {
    background-color: #0056b3;
  }
`;

const TaskContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  border-top: 1px solid #555555;
`;

const Card = styled.div`
  width: 190px;
  height: 254px;
  background: #07182E;
  position: relative;
  display: flex;
  place-content: center;
  place-items: center;
  overflow: hidden;
  border-radius: 20px;
`;

const CardTitle = styled.h2`
  z-index: 1;
  color: white;
  font-size: 2em;
`;

const CardBefore = styled.div`
  content: '';
  position: absolute;
  width: 100px;
  background-image: linear-gradient(180deg, rgb(0, 183, 255), rgb(255, 48, 255));
  height: 130%;
  animation: rotBGimg 3s linear infinite;
  transition: all 0.2s linear;

  @keyframes rotBGimg {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
`;

const CardAfter = styled.div`
  content: '';
  position: absolute;
  background: #07182E;
  inset: 5px;
  border-radius: 15px;
`;

const TaskList = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [taskText, setTaskText] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");

  const addTask = (e) => {
    e.preventDefault();
    if (taskText.trim()) {
      const newTask = {
        id: Date.now(),
        text: taskText,
        priority: taskPriority,
        done: false,
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setTaskText("");
      setTaskPriority("Medium");
    }
  };

  const deleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }
  };

  const saveTask = (id, text, priority) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, text, priority } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask(e);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const getPriorityValue = (priority) => {
      switch (priority) {
        case "High":
          return 3;
        case "Medium":
          return 2;
        case "Low":
          return 1;
        default:
          return 0;
      }
    };
    return getPriorityValue(b.priority) - getPriorityValue(a.priority);
  });
  return (
    <Container>
      <Title>Tasks</Title>
      <Form onSubmit={addTask}>
        <Input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Task description"
          onKeyPress={handleKeyPress}
        />
        <Select
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </Select>
        <AddButton type="submit">Add Task</AddButton>
      </Form>
      <TaskContainer>
        {sortedTasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onDelete={deleteTask}
            onSave={saveTask}
          />
        ))}
      </TaskContainer>
    </Container>
  );
};
export default TaskList;
