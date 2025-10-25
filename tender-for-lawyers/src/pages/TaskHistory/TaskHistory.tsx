import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  taskDescription: string;
  specialist: string;
  timestamp: string;
  status: 'Pending' | 'Approved' | 'Completed';
}

const TaskHistory: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate API call to fetch task history
    const fetchTasks = async () => {
      setIsLoading(true);
      
      // Mock data
      const mockTasks: Task[] = [
        {
          id: 'task-1',
          taskDescription: 'Review contract amendments for client Johnson & Co.',
          specialist: 'Legal Researcher',
          timestamp: '2025-10-25T10:30:00Z',
          status: 'Completed'
        },
        {
          id: 'task-2',
          taskDescription: 'Schedule client meeting with Sarah Williams',
          specialist: 'Voice Bot Scheduler',
          timestamp: '2025-10-24T14:15:00Z',
          status: 'Completed'
        },
        {
          id: 'task-3',
          taskDescription: 'Organize evidence files for Martinez case',
          specialist: 'Evidence Sorter',
          timestamp: '2025-10-24T09:45:00Z',
          status: 'Approved'
        },
        {
          id: 'task-4',
          taskDescription: 'Draft response to client inquiry about case status',
          specialist: 'Client Communication Guru',
          timestamp: '2025-10-23T16:20:00Z',
          status: 'Pending'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Approved':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'Approved':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Pending':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const filteredTasks = activeFilter === 'all'
    ? tasks
    : tasks.filter(task => task.status.toLowerCase() === activeFilter);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3 text-law-navy">Task History</h1>
        <p className="text-lg text-neutral-dark max-w-2xl mx-auto">
          View and track all your AI-processed legal tasks
        </p>
      </div>
      
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border border-law-navy rounded-l-lg ${activeFilter === 'all' ? 'bg-law-navy text-white' : 'bg-white text-law-navy hover:bg-neutral-lightest'}`}
            onClick={() => setActiveFilter('all')}
          >
            All Tasks
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border-t border-b border-r border-law-navy ${activeFilter === 'pending' ? 'bg-law-navy text-white' : 'bg-white text-law-navy hover:bg-neutral-lightest'}`}
            onClick={() => setActiveFilter('pending')}
          >
            Pending
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border-t border-b border-r border-law-navy ${activeFilter === 'approved' ? 'bg-law-navy text-white' : 'bg-white text-law-navy hover:bg-neutral-lightest'}`}
            onClick={() => setActiveFilter('approved')}
          >
            Approved
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border-t border-b border-r border-law-navy rounded-r-lg ${activeFilter === 'completed' ? 'bg-law-navy text-white' : 'bg-white text-law-navy hover:bg-neutral-lightest'}`}
            onClick={() => setActiveFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-card">
          <svg className="animate-spin h-10 w-10 text-law-navy mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg text-neutral-dark">Loading task history...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
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
                  Specialist
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-light">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-neutral-lightest transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-normal">
                    <div className="text-sm font-medium text-neutral-darkest">{task.taskDescription}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-dark">{task.specialist}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-dark">{formatDate(task.timestamp)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                      {getStatusIcon(task.status)}
                      {task.status}
                    </span>
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