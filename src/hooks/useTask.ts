import { useContext } from "react";

import { TaskContext } from "../context/TaskContext";
export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('TaskContext must be used within TaskProvider');
  }
  return context;
};