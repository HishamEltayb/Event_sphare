import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

interface DeliverableHistory {
  id: number;
  date: string;
  action: string;
  user: string;
  details: string;
  attachmentId?: number;
}

interface DeliverableTask {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'in_progress';
  dueDate: string;
  assignedTo: string;
}

interface Deliverable {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'completed' | 'overdue';
  progress: number;
  dueDate: string;
  lastUpdated: string;
  location: string;
  company: string;
  attachments: Array<{
    id: number;
    name: string;
    url: string;
    description: string;
    category: string;
    uploadDate: string;
  }>;
  history: DeliverableHistory[];
  tasks: DeliverableTask[];
}

interface FilterOptions {
  status: 'all' | 'pending' | 'completed' | 'overdue';
  sortBy: 'dueDate' | 'name' | 'status' | 'progress';
  sortOrder: 'asc' | 'desc';
}

// Helper function to generate dummy history
const generateDummyHistory = (deliverableId: number): DeliverableHistory[] => {
  const actions = ['Created', 'Updated', 'Reviewed', 'Approved', 'Upload'];
  const users = ['John Doe', 'Jane Smith', 'System Admin', 'Quality Manager'];
  
  return Array(3).fill(null).map((_, index) => ({
    id: deliverableId * 100 + index,
    date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString(),
    action: actions[Math.floor(Math.random() * actions.length)],
    user: users[Math.floor(Math.random() * users.length)],
    details: `${actions[Math.floor(Math.random() * actions.length)]} the deliverable documentation`,
    attachmentId: index === 0 ? deliverableId : undefined
  }));
};

// Add this helper function for relative time
const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

// Add helper function to generate dummy tasks
const generateDummyTasks = (deliverableId: number): DeliverableTask[] => {
  const taskTemplates = [
    {
      title: 'Submit Documentation',
      description: 'Prepare and submit all required documentation',
    },
    {
      title: 'Quality Check',
      description: 'Perform quality assessment of submitted materials',
    },
    {
      title: 'Obtain Signatures',
      description: 'Get necessary signatures from authorized personnel',
    },
    {
      title: 'Review Compliance',
      description: 'Ensure all items meet compliance requirements',
    },
    {
      title: 'Update Records',
      description: 'Update system records with new information',
    }
  ];

  return taskTemplates.map((template, index) => ({
    id: deliverableId * 100 + index,
    title: template.title,
    description: template.description,
    status: Math.random() > 0.5 ? 'completed' : 'pending',
    dueDate: new Date(Date.now() + (index * 24 * 60 * 60 * 1000)).toISOString(),
    assignedTo: ['John Doe', 'Jane Smith', 'Mike Johnson'][Math.floor(Math.random() * 3)]
  }));
};

// Update the color utility function for progress-based colors
const getProgressColor = (progress: number) => {
  if (progress === 100) return 'bg-[#2ECC71] text-white'; // Green
  if (progress >= 75) return 'bg-[#82E0AA] text-white';   // Yellow-Green
  if (progress >= 50) return 'bg-[#F4D03F] text-gray-800'; // Yellow
  if (progress >= 25) return 'bg-[#F5B041] text-white';   // Orange
  return 'bg-[#EC7063] text-white';                       // Red
};

const getProgressBarColor = (progress: number) => {
  if (progress === 100) return '#2ECC71'; // Green
  if (progress >= 75) return '#82E0AA';   // Yellow-Green
  if (progress >= 50) return '#F4D03F';   // Yellow
  if (progress >= 25) return '#F5B041';   // Orange
  return '#EC7063';                       // Red
};

// Update status badge colors
const getStatusBadgeColor = (status: Deliverable['status'], progress: number) => {
  if (status === 'completed') return 'bg-[#2ECC71] text-white';
  if (status === 'overdue') return 'bg-[#EC7063] text-white';
  return getProgressColor(progress); // For pending status, use progress-based color
};

const SupplierDetailsPage = () => {
  const { supplierId } = useParams();
  const [selectedDeliverable, setSelectedDeliverable] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreview, setFilePreview] = useState<Array<{ file: File; preview: string }>>([]);
  
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { 
      id: 1, 
      name: 'Business License', 
      description: 'Upload current business license and permits',
      status: 'pending',
      progress: 30,
      dueDate: '2024-04-01',
      lastUpdated: '2024-03-15',
      location: 'New York, NY',
      company: 'Event Sphere Inc.',
      attachments: [],
      history: generateDummyHistory(1),
      tasks: generateDummyTasks(1)
    },
    { 
      id: 2, 
      name: 'Food Safety Certificate', 
      description: 'Provide updated food safety certification for all staff',
      status: 'pending',
      progress: 60,
      dueDate: '2024-04-15',
      lastUpdated: '2024-03-10',
      location: 'Brooklyn, NY',
      company: 'Event Sphere Inc.',
      attachments: [],
      history: generateDummyHistory(2),
      tasks: generateDummyTasks(2)
    },
    { 
      id: 3, 
      name: 'Menu Items Photos', 
      description: 'High-quality photos of all menu items',
      status: 'completed',
      progress: 100,
      dueDate: '2024-04-30',
      lastUpdated: '2024-03-20',
      location: 'Manhattan, NY',
      company: 'Event Sphere Inc.',
      attachments: [],
      history: generateDummyHistory(3),
      tasks: generateDummyTasks(3)
    },
  ]);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: 'all',
    sortBy: 'dueDate',
    sortOrder: 'asc'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedHistoryDeliverable, setSelectedHistoryDeliverable] = useState<Deliverable | null>(null);

  const [uploadDetails, setUploadDetails] = useState({
    description: '',
    category: ''
  });

  const [selectedTask, setSelectedTask] = useState<number | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const filesArray = Array.from(files);
      setSelectedFiles(filesArray);
      
      const previews = filesArray.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setFilePreview(previews);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setFilePreview(prev => {
      URL.revokeObjectURL(prev[indexToRemove].preview);
      return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  useEffect(() => {
    return () => {
      filePreview.forEach(item => {
        URL.revokeObjectURL(item.preview);
      });
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeliverable || !selectedTask || selectedFiles.length === 0 || !uploadDetails.description) return;

    try {
      setDeliverables(prevDeliverables => 
        prevDeliverables.map(deliverable => {
          if (deliverable.id === selectedDeliverable) {
            const selectedTaskInfo = deliverable.tasks.find(t => t.id === selectedTask);
            
            const newAttachments = selectedFiles.map((file, index) => ({
              id: Date.now() + index,
              name: file.name,
              url: URL.createObjectURL(file),
              description: uploadDetails.description,
              category: uploadDetails.category,
              uploadDate: new Date().toISOString(),
              taskId: selectedTask,
              taskTitle: selectedTaskInfo?.title || ''
            }));
            
            const newHistory: DeliverableHistory = {
              id: Date.now(),
              date: new Date().toISOString(),
              action: 'Upload',
              user: 'Current User',
              details: `Uploaded ${selectedFiles.length} file(s) for task: ${selectedTaskInfo?.title} - ${uploadDetails.description}`,
              attachmentId: newAttachments[0].id,
              taskId: selectedTask
            };

            // Update task status if needed
            const updatedTasks = deliverable.tasks.map(task => {
              if (task.id === selectedTask) {
                return {
                  ...task,
                  status: 'in_progress'
                };
              }
              return task;
            });

            return {
              ...deliverable,
              tasks: updatedTasks,
              attachments: [...deliverable.attachments, ...newAttachments],
              history: [newHistory, ...deliverable.history]
            };
          }
          return deliverable;
        })
      );

      // Reset form
      setSelectedFiles([]);
      setFilePreview([]);
      setSelectedDeliverable(null);
      setSelectedTask(null);
      setUploadDetails({ description: '', category: '' });
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Update the TasksSection component with new color scheme
  const TasksSection = ({ tasks, attachments }: { 
    tasks: DeliverableTask[]; 
    attachments: Deliverable['attachments'];
  }) => (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Tasks</h4>
      <div className="space-y-6">
        {tasks.map((task) => {
          const taskAttachments = attachments.filter(att => att.taskId === task.id);
          const taskProgress = calculateTaskProgress(task, taskAttachments);
          
          return (
            <div key={task.id} className="bg-white shadow rounded-lg overflow-hidden">
              {/* Task Header */}
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${taskProgress}%`,
                          backgroundColor: getProgressBarColor(taskProgress)
                        }}
                      ></div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${getProgressColor(taskProgress)}`}>
                      {taskProgress}%
                    </span>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Assigned to:</span>
                    <span className="ml-2 text-gray-900">{task.assignedTo}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Due date:</span>
                    <span className="ml-2 text-gray-900">{formatDate(task.dueDate)}</span>
                  </div>
                </div>
              </div>

              {/* Task Attachments */}
              {taskAttachments.length > 0 && (
                <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Uploaded Documents</h4>
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Date Uploaded
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Description
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            File
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {taskAttachments.map((attachment) => (
                          <tr key={attachment.id}>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <div>{formatDate(attachment.uploadDate)}</div>
                              <div className="text-xs">{getRelativeTime(attachment.uploadDate)}</div>
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500">
                              {attachment.description}
                              {attachment.category && (
                                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProgressColor(taskProgress)}`}>
                                  {attachment.category}
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img
                                    src={attachment.url}
                                    alt=""
                                    className="h-10 w-10 rounded object-cover"
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="font-medium text-gray-900">{attachment.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-4 text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <a
                                  href={attachment.url}
                                  download={attachment.name}
                                  className={`text-${getProgressBarColor(taskProgress).slice(1)} hover:opacity-80`}
                                >
                                  Download
                                </a>
                                <button
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this file?')) {
                                      // Add delete functionality here
                                    }
                                  }}
                                  className="text-[#EC7063] hover:opacity-80"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Add helper function to calculate task progress
  const calculateTaskProgress = (task: DeliverableTask, attachments: Deliverable['attachments']): number => {
    if (task.status === 'completed') return 100;
    if (task.status === 'pending') return 0;
    // For in_progress, calculate based on attachments or return a default value
    return attachments.length > 0 ? Math.min(Math.round((attachments.length / 3) * 100), 75) : 25;
  };

  // Update the DeliverableSection component
  const DeliverableSection = ({ deliverable }: { deliverable: Deliverable }) => (
    <div className="bg-white rounded-lg shadow-md mb-6">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{deliverable.name}</h3>
            <p className="text-gray-500">{deliverable.description}</p>
          </div>
          <span 
            key={`status-${deliverable.id}`}
            className={`px-2 py-1 rounded-full text-sm ${getStatusBadgeColor(deliverable.status, deliverable.progress)}`}
          >
            {deliverable.status}
            {deliverable.status === 'pending' && ` (${deliverable.progress}%)`}
          </span>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Due Date</p>
            <p className="font-medium">{formatDate(deliverable.dueDate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="h-2.5 rounded-full transition-all duration-300"
                style={{ 
                  width: `${deliverable.progress}%`,
                  backgroundColor: getProgressBarColor(deliverable.progress)
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {deliverable.tasks.map(task => (
            <span
              key={`task-status-${task.id}`}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${task.status === 'completed' ? 'bg-[#2ECC71] text-white' : 
                  task.status === 'in_progress' ? getProgressColor(deliverable.progress) : 
                  'bg-[#EC7063] text-white'}`}
            >
              {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.slice(1)}
            </span>
          ))}
        </div>

        <TasksSection 
          tasks={deliverable.tasks} 
          attachments={deliverable.attachments} 
        />
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Supplier Details</h1>
      
      {/* Upload Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-medium mb-4">Upload Documents</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Deliverable
            </label>
            <select
              value={selectedDeliverable || ''}
              onChange={(e) => {
                setSelectedDeliverable(Number(e.target.value));
                setSelectedTask(null); // Reset task when deliverable changes
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Choose a deliverable</option>
              {deliverables.map((deliverable) => (
                <option key={deliverable.id} value={deliverable.id}>
                  {deliverable.name}
                </option>
              ))}
            </select>
          </div>

          {selectedDeliverable && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Task
              </label>
              <select
                value={selectedTask || ''}
                onChange={(e) => setSelectedTask(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Choose a task</option>
                {deliverables
                  .find(d => d.id === selectedDeliverable)
                  ?.tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Document Description
            </label>
            <textarea
              value={uploadDetails.description}
              onChange={(e) => setUploadDetails(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
              placeholder="Provide a description of the uploaded documents..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category (Optional)
            </label>
            <select
              value={uploadDetails.category}
              onChange={(e) => setUploadDetails(prev => ({ ...prev, category: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select a category</option>
              <option value="license">License</option>
              <option value="certification">Certification</option>
              <option value="permit">Permit</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Files
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
              required
            />
          </div>

          {filePreview.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filePreview.map((item, index) => (
                <div key={index} className="relative">
                  <img
                    src={item.preview}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedDeliverable || !selectedTask || selectedFiles.length === 0 || !uploadDetails.description}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium 
              rounded-md text-white bg-[#2874A6] hover:bg-[#21618C] 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#21618C] 
              disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Upload Files
          </button>
        </form>
      </div>

      {/* Deliverables List */}
      <div className="space-y-6">
        {deliverables.map((deliverable) => (
          <DeliverableSection key={deliverable.id} deliverable={deliverable} />
        ))}
      </div>
    </div>
  );
};

export default SupplierDetailsPage;