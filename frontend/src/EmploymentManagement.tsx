// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Users, Building2, UserPlus, ArrowRightLeft, Eye, Plus, Search, ChevronRight, User, X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api';

// Mock data for demonstration (replace with actual API calls)
/*
const mockEmployees = [
  { id: 1, employeeCode: 'EMP001', firstName: 'John', lastName: 'Smith', email: 'john.smith@company.com', position: 'Chief Executive Officer', departmentId: null, departmentName: null, managerId: null, managerName: null, isCeo: true, salary: 200000 },
  { id: 2, employeeCode: 'EMP002', firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@company.com', position: 'Engineering Manager', departmentId: 1, departmentName: 'Engineering', managerId: 1, managerName: 'John Smith', isCeo: false, salary: 120000 },
  { id: 3, employeeCode: 'EMP003', firstName: 'Bob', lastName: 'Wilson', email: 'bob.wilson@company.com', position: 'Marketing Manager', departmentId: 2, departmentName: 'Marketing', managerId: 1, managerName: 'John Smith', isCeo: false, salary: 110000 },
  { id: 4, employeeCode: 'EMP004', firstName: 'Carol', lastName: 'Brown', email: 'carol.brown@company.com', position: 'Finance Manager', departmentId: 3, departmentName: 'Finance', managerId: 1, managerName: 'John Smith', isCeo: false, salary: 115000 },
  { id: 5, employeeCode: 'EMP005', firstName: 'David', lastName: 'Davis', email: 'david.davis@company.com', position: 'Senior Developer', departmentId: 1, departmentName: 'Engineering', managerId: 2, managerName: 'Alice Johnson', isCeo: false, salary: 95000 }
];

const mockDepartments = [
  { id: 1, name: 'Engineering', description: 'Software Development and Technical Operations', deptHeadId: 2, deptHeadName: 'Alice Johnson', employeeCount: 2 },
  { id: 2, name: 'Marketing', description: 'Marketing and Brand Management', deptHeadId: 3, deptHeadName: 'Bob Wilson', employeeCount: 1 },
  { id: 3, name: 'Finance', description: 'Financial Planning and Accounting', deptHeadId: 4, deptHeadName: 'Carol Brown', employeeCount: 1 }
];

*/

// API Service Functions
const employeeService = {
  getAllEmployees: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching all employees:', error);
      return [];
    }
  },

  getEmployeesByDepartment: async (departmentId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/department/${departmentId}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching employees for department ${departmentId}:`, error);
      return [];
    }
  },

  getEmployeesByManager: async (managerId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/manager/${managerId}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching employees for manager ${managerId}:`, error);
      return [];
    }
  },


  createEmployee: async (employeeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to create employee');
    } catch (error) {
      throw error;
    }
  },

  moveEmployee: async (employeeId, departmentId, managerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${employeeId}/move`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ departmentId, managerId }),
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to move employee');
    } catch (error) {
      throw error;
    }
  }
};

const departmentService = {
  getAllDepartments: async () => {
    try {
      const response = await fetch('http://localhost:8082/api/departments');
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching departments:', error);
      return [];
    }
  },

  createDepartment: async (departmentData) => {
    try {
      const response = await fetch('http://localhost:8082/api/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(departmentData),
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to create department');
    } catch (error) {
      throw error;
    }
  }
};

// Components
const EmployeeCard = ({ employee, onSelect, onMove }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {employee.firstName} {employee.lastName}
          </h3>
          {employee.isCeo && (
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              CEO
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-1">Code: {employee.employeeCode}</p>
        <p className="text-sm text-gray-600 mb-1">Position: {employee.position}</p>
        <p className="text-sm text-gray-600 mb-1">Email: {employee.email}</p>
        {employee.departmentName && (
          <p className="text-sm text-gray-600 mb-1">Department: {employee.departmentName}</p>
        )}
        {employee.managerName && (
          <p className="text-sm text-gray-600 mb-1">Manager: {employee.managerName}</p>
        )}
        {employee.salary && (
          <p className="text-sm font-medium text-green-600">
            Salary: ${employee.salary.toLocaleString()}
          </p>
        )}
      </div>
    </div>
    <div className="flex gap-2 mt-4">
      <button
        onClick={() => onSelect(employee)}
        className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
      >
        <Eye className="w-4 h-4" />
        View Details
      </button>
      {!employee.isCeo && (
        <button
          onClick={() => onMove(employee)}
          className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
        >
          <ArrowRightLeft className="w-4 h-4" />
          Move
        </button>
      )}
    </div>
  </div>
);

const DepartmentCard = ({ department, onViewEmployees }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-2">{department.description}</p>
        {department.deptHeadName && (
          <p className="text-sm text-gray-600 mb-1">Head: {department.deptHeadName}</p>
        )}
        <p className="text-sm font-medium text-blue-600">
          {department.employeeCount || 0} {department.employeeCount === 1 ? 'Employee' : 'Employees'}
        </p>
      </div>
    </div>
    <button
      onClick={() => onViewEmployees(department)}
      className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
    >
      <Users className="w-4 h-4" />
      View Employees
    </button>
  </div>
);

const CreateEmployeeModal = ({ isOpen, onClose, onSubmit, departments, employees }) => {
  const [formData, setFormData] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    departmentId: '',
    managerId: '',
    hireDate: new Date().toISOString().split('T')[0],
    salary: ''
  });

  const [availableManagers, setAvailableManagers] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (formData.departmentId) {
      const deptEmployees = employees.filter(emp => 
        emp.departmentId === parseInt(formData.departmentId) || emp.isCeo
      );
      setAvailableManagers(deptEmployees);
    } else {
      setAvailableManagers([]);
    }
  }, [formData.departmentId, employees]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.employeeCode.trim()) newErrors.employeeCode = 'Employee code is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.departmentId) newErrors.departmentId = 'Department is required';
    if (!formData.managerId) newErrors.managerId = 'Manager is required';
    if (!formData.hireDate) newErrors.hireDate = 'Hire date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
        managerId: formData.managerId ? parseInt(formData.managerId) : null,
        salary: formData.salary ? parseFloat(formData.salary) : null
      };
      await onSubmit(submitData);
      setFormData({
        employeeCode: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        departmentId: '',
        managerId: '',
        hireDate: new Date().toISOString().split('T')[0],
        salary: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Employee</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Employee Code"
                value={formData.employeeCode}
                onChange={(e) => setFormData({...formData, employeeCode: e.target.value})}
                className={`w-full border rounded-md px-3 py-2 ${errors.employeeCode ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.employeeCode && <p className="text-red-500 text-xs mt-1">{errors.employeeCode}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className={`w-full border rounded-md px-3 py-2 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className={`w-full border rounded-md px-3 py-2 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`w-full border rounded-md px-3 py-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
            <div>
              <input
                type="text"
                placeholder="Position"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                className={`w-full border rounded-md px-3 py-2 ${errors.position ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({...formData, departmentId: e.target.value, managerId: ''})}
                className={`w-full border rounded-md px-3 py-2 ${errors.departmentId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
              {errors.departmentId && <p className="text-red-500 text-xs mt-1">{errors.departmentId}</p>}
            </div>
            <div>
              <select
                value={formData.managerId}
                onChange={(e) => setFormData({...formData, managerId: e.target.value})}
                className={`w-full border rounded-md px-3 py-2 ${errors.managerId ? 'border-red-500' : 'border-gray-300'}`}
                disabled={!formData.departmentId}
              >
                <option value="">Select Manager</option>
                {availableManagers.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} {emp.isCeo ? '(CEO)' : ''}
                  </option>
                ))}
              </select>
              {errors.managerId && <p className="text-red-500 text-xs mt-1">{errors.managerId}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="date"
                value={formData.hireDate}
                onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                className={`w-full border rounded-md px-3 py-2 ${errors.hireDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.hireDate && <p className="text-red-500 text-xs mt-1">{errors.hireDate}</p>}
            </div>
            <input
              type="number"
              placeholder="Salary"
              value={formData.salary}
              onChange={(e) => setFormData({...formData, salary: e.target.value})}
              className="border border-gray-300 rounded-md px-3 py-2"
              min="0"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Employee
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateDepartmentModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({ name: '', description: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Department</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Department Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2 h-20 resize-none"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Add Department
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MoveEmployeeModal = ({ isOpen, onClose, onSubmit, employee, departments, employees }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [availableManagers, setAvailableManagers] = useState([]);

  useEffect(() => {
    if (selectedDepartment) {
      const deptEmployees = employees.filter(emp => 
        (emp.departmentId === parseInt(selectedDepartment) || emp.isCeo) && 
        emp.id !== employee?.id
      );
      setAvailableManagers(deptEmployees);
    } else {
      setAvailableManagers([]);
    }
  }, [selectedDepartment, employees, employee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(
      employee.id,
      parseInt(selectedDepartment),
      parseInt(selectedManager)
    );
    setSelectedDepartment('');
    setSelectedManager('');
  };

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Move Employee</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Moving: <strong>{employee.firstName} {employee.lastName}</strong>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setSelectedManager('');
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          >
            <option value="">Select New Department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
          <select
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
            disabled={!selectedDepartment}
          >
            <option value="">Select New Manager</option>
            {availableManagers.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName} {emp.isCeo ? '(CEO)' : ''}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Move Employee
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main App Component
const EmployeeManagementSystem = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isCreateEmployeeModalOpen, setIsCreateEmployeeModalOpen] = useState(false);
  const [isCreateDepartmentModalOpen, setIsCreateDepartmentModalOpen] = useState(false);
  const [isMoveEmployeeModalOpen, setIsMoveEmployeeModalOpen] = useState(false);
  const [employeeToMove, setEmployeeToMove] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'department', 'manager'
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [selectedManagerId, setSelectedManagerId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, viewMode, selectedDepartmentId, selectedManagerId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [employeeData, departmentData] = await Promise.all([
        employeeService.getAllEmployees(),
        departmentService.getAllDepartments()
      ]);
      setEmployees(employeeData);
      setDepartments(departmentData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    // Apply view mode filter
    if (viewMode === 'department' && selectedDepartmentId) {
      filtered = filtered.filter(emp => emp.departmentId === selectedDepartmentId);
    } else if (viewMode === 'manager' && selectedManagerId) {
      filtered = filtered.filter(emp => emp.managerId === selectedManagerId);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEmployees(filtered);
  };

  const handleCreateEmployee = async (employeeData) => {
    try {
      await employeeService.createEmployee(employeeData);
      setIsCreateEmployeeModalOpen(false);
      loadData(); // Refresh data
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('Error creating employee. Please check the form and try again.');
    }
  };

  const handleCreateDepartment = async (departmentData) => {
    try {
      await departmentService.createDepartment(departmentData);
      setIsCreateDepartmentModalOpen(false);
      loadData(); // Refresh data
    } catch (error) {
      console.error('Error creating department:', error);
      alert('Error creating department. Please try again.');
    }
  };

  const handleMoveEmployee = async (employeeId, departmentId, managerId) => {
    try {
      await employeeService.moveEmployee(employeeId, departmentId, managerId);
      setIsMoveEmployeeModalOpen(false);
      setEmployeeToMove(null);
      loadData(); // Refresh data
    } catch (error) {
      console.error('Error moving employee:', error);
      alert('Error moving employee. Please try again.');
    }
  };

  const handleViewDepartmentEmployees = (department) => {
    setViewMode('department');
    setSelectedDepartmentId(department.id);
    setActiveTab('employees');
  };

  const handleViewManagerEmployees = (employee) => {
    setViewMode('manager');
    setSelectedManagerId(employee.id);
    setActiveTab('employees');
  };

  const resetView = () => {
    setViewMode('all');
    setSelectedDepartmentId(null);
    setSelectedManagerId(null);
  };

  const getViewTitle = () => {
    if (viewMode === 'department' && selectedDepartmentId) {
      const dept = departments.find(d => d.id === selectedDepartmentId);
      return `${dept?.name} Department Employees`;
    } else if (viewMode === 'manager' && selectedManagerId) {
      const manager = employees.find(e => e.id === selectedManagerId);
      return `Employees reporting to ${manager?.firstName} ${manager?.lastName}`;
    }
    return 'All Employees';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Employee Management System</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsCreateEmployeeModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Add Employee
              </button>
              <button
                onClick={() => setIsCreateDepartmentModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Department
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('employees');
                resetView();
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'employees'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Employees ({employees.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'departments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Departments ({departments.length})
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'employees' && (
          <div>
            {/* Breadcrumb and Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-900">{getViewTitle()}</h2>
                {viewMode !== 'all' && (
                  <button
                    onClick={resetView}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Employee Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map(employee => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  onSelect={setSelectedEmployee}
                  onMove={(emp) => {
                    setEmployeeToMove(emp);
                    setIsMoveEmployeeModalOpen(true);
                  }}
                />
              ))}
            </div>

            {filteredEmployees.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No employees found matching your criteria.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'departments' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">All Departments</h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search departments..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Department Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map(department => (
                <DepartmentCard
                  key={department.id}
                  department={department}
                  onViewEmployees={handleViewDepartmentEmployees}
                />
              ))}
            </div>

            {departments.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No departments found.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateEmployeeModal
        isOpen={isCreateEmployeeModalOpen}
        onClose={() => setIsCreateEmployeeModalOpen(false)}
        onSubmit={handleCreateEmployee}
        departments={departments}
        employees={employees}
      />

      <CreateDepartmentModal
        isOpen={isCreateDepartmentModalOpen}
        onClose={() => setIsCreateDepartmentModalOpen(false)}
        onSubmit={handleCreateDepartment}
      />

      <MoveEmployeeModal
        isOpen={isMoveEmployeeModalOpen}
        onClose={() => setIsMoveEmployeeModalOpen(false)}
        onSubmit={handleMoveEmployee}
        employee={employeeToMove}
        departments={departments}
        employees={employees}
      />

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Employee Details</h2>
              <button 
                onClick={() => setSelectedEmployee(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employee Code</label>
                  <p className="text-sm text-gray-900">{selectedEmployee.employeeCode}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="text-sm text-gray-900">{selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedEmployee.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{selectedEmployee.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <p className="text-sm text-gray-900">{selectedEmployee.position}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <p className="text-sm text-gray-900">{selectedEmployee.departmentName || 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Manager</label>
                  <p className="text-sm text-gray-900">{selectedEmployee.managerName || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Salary</label>
                  <p className="text-sm text-gray-900">
                    {selectedEmployee.salary ? `${selectedEmployee.salary.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
              </div>
              {selectedEmployee.isCeo && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-purple-800">This employee is the CEO</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              {!selectedEmployee.isCeo && (
                <button
                  onClick={() => {
                    setEmployeeToMove(selectedEmployee);
                    setIsMoveEmployeeModalOpen(true);
                    setSelectedEmployee(null);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Move Employee
                </button>
              )}
              {!selectedEmployee.isCeo && (
  <button
    onClick={() => {
      handleViewManagerEmployees(selectedEmployee);
      setSelectedEmployee(null); // close modal
    }}
    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
  >
    View Subordinates
  </button>
)}

              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagementSystem;