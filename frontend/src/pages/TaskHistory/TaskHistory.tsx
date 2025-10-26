import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  taskDescription: string;
  timestamp: string;
}

const TaskHistory: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate API call to fetch task history
    const fetchTasks = async () => {
      setIsLoading(true);
      
      // Mock data
      const mockTasks: Task[] = [
        {
          id: 'task-1',
          taskDescription: 'Review contract amendments for client Johnson & Co.',
          timestamp: '2025-10-25T10:30:00Z'
        },
        {
          id: 'task-2',
          taskDescription: 'Schedule client meeting with Sarah Williams',
          timestamp: '2025-10-24T14:15:00Z'
        },
        {
          id: 'task-3',
          taskDescription: 'Organize evidence files for Martinez case',
          timestamp: '2025-10-24T09:45:00Z'
        },
        {
          id: 'task-4',
          taskDescription: 'Draft response to client inquiry about case status',
          timestamp: '2025-10-23T16:20:00Z'
        },
        {
          id: 'task-5',
          taskDescription: 'Research precedents for the Thompson lawsuit',
          timestamp: '2025-10-22T11:20:00Z'
        },
        {
          id: 'task-6',
          taskDescription: 'Prepare documents for court filing deadline',
          timestamp: '2025-10-21T15:45:00Z'
        }
      ];
      
      setTimeout(() => {
        setTasks(mockTasks);
        setIsLoading(false);
      }, 1000);
    };

    fetchTasks();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3 text-law-navy">Task History</h1>
        <p className="text-lg text-neutral-dark max-w-2xl mx-auto">
          View and track all your AI-processed legal tasks
        </p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-card">
          <svg className="animate-spin h-10 w-10 text-law-navy mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg text-neutral-dark">Loading task history...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-card">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-neutral mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-lg text-neutral-dark">No tasks found with the selected filter</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-light">
            <thead className="bg-law-navy text-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Task
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-light">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-neutral-lightest transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-normal">
                    <div className="text-sm font-medium text-neutral-darkest">{task.taskDescription}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-dark">{formatDate(task.timestamp)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskHistory;