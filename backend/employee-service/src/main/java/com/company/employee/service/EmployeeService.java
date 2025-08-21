package com.company.employee.service;

import com.company.employee.dto.CreateEmployeeRequest;
import com.company.employee.dto.DepartmentDto;
import com.company.employee.dto.EmployeeDto;
import com.company.employee.entity.Employee;
import com.company.employee.entity.EmployeeStatus;
import com.company.employee.exception.DuplicateEmployeeException;
import com.company.employee.exception.EmployeeNotFoundException;
import com.company.employee.exception.InvalidEmployeeOperationException;
import com.company.employee.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;



@Service
@Transactional
public class EmployeeService {
	
	@Autowired
	private RestTemplate restTemplate;
	
	
    @Autowired
    private EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAllActiveEmployees().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmployeeDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));
        return convertToDto(employee);
    }

    @Transactional(readOnly = true)
    public List<EmployeeDto> getEmployeesByDepartment(Long departmentId) {
        return employeeRepository.findByDepartmentId(departmentId).stream()
                .filter(emp -> emp.getStatus() == EmployeeStatus.ACTIVE)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmployeeDto> getEmployeesByManager(Long managerId) {
        return employeeRepository.findActiveSubordinates(managerId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmployeeDto> searchEmployees(String searchTerm) {
        return employeeRepository.searchEmployees(searchTerm).stream()
                .filter(emp -> emp.getStatus() == EmployeeStatus.ACTIVE)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public EmployeeDto createEmployee(CreateEmployeeRequest request) {
        // Validate unique constraints
        if (employeeRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new DuplicateEmployeeException("Employee code already exists: " + request.getEmployeeCode());
        }

        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmployeeException("Email already exists: " + request.getEmail());
        }

        // Validate business rules
        validateEmployeeCreation(request);

        Employee employee = new Employee();
        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setPosition(request.getPosition());
        employee.setDepartmentId(request.getDepartmentId());
        employee.setManagerId(request.getManagerId());
        employee.setIsCeo(request.getIsCeo() != null ? request.getIsCeo() : false);
        employee.setHireDate(request.getHireDate());
        employee.setSalary(request.getSalary());

        Employee savedEmployee = employeeRepository.save(employee);
        return convertToDto(savedEmployee);
    }

    public EmployeeDto moveEmployeeToDepartment(Long employeeId, Long newDepartmentId, Long newManagerId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + employeeId));

        // CEO cannot be moved to a department
        if (employee.getIsCeo()) {
            throw new InvalidEmployeeOperationException("CEO cannot be assigned to a department");
        }

        // Validate that manager belongs to the same department or is CEO
        if (newManagerId != null) {
            Employee manager = employeeRepository.findById(newManagerId)
                    .orElseThrow(() -> new EmployeeNotFoundException("Manager not found with id: " + newManagerId));

            if (!manager.getIsCeo() && !manager.getDepartmentId().equals(newDepartmentId)) {
                throw new InvalidEmployeeOperationException("Manager must belong to the same department");
            }
        }

        employee.setDepartmentId(newDepartmentId);
        employee.setManagerId(newManagerId);

        Employee updatedEmployee = employeeRepository.save(employee);
        return convertToDto(updatedEmployee);
    }

    public void deleteEmployee(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + employeeId));

        // Check if employee is a CEO
        if (employee.getIsCeo()) {
            throw new InvalidEmployeeOperationException("Cannot delete CEO");
        }

        // Check if employee has subordinates
        List<Employee> subordinates = employeeRepository.findByManagerId(employeeId);
        if (!subordinates.isEmpty()) {
            throw new InvalidEmployeeOperationException("Cannot delete employee with subordinates. Please reassign subordinates first.");
        }

        // Soft delete - set status to TERMINATED
        employee.setStatus(EmployeeStatus.TERMINATED);
        employeeRepository.save(employee);
    }

    @Transactional(readOnly = true)
    public long getEmployeeCountByDepartment(Long departmentId) {
        return employeeRepository.countActiveEmployeesByDepartment(departmentId);
    }

    // Private helper methods
    private void validateEmployeeCreation(CreateEmployeeRequest request) {
        // CEO validation
        if (request.getIsCeo() != null && request.getIsCeo()) {
            if (employeeRepository.findByIsCeoTrue().isPresent()) {
                throw new InvalidEmployeeOperationException("CEO already exists");
            }
            if (request.getDepartmentId() != null) {
                throw new InvalidEmployeeOperationException("CEO cannot belong to a department");
            }
            if (request.getManagerId() != null) {
                throw new InvalidEmployeeOperationException("CEO cannot have a manager");
            }
            return; // Skip further validations for CEO
        }

        // Non-CEO validation
        if (request.getDepartmentId() == null) {
            throw new InvalidEmployeeOperationException("Non-CEO employee must belong to a department");
        }
        if (request.getManagerId() == null) {
            throw new InvalidEmployeeOperationException("Non-CEO employee must have a manager");
        }

        // Validate manager exists and belongs to same department or is CEO
        if (request.getManagerId() != null) {
            Employee manager = employeeRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new EmployeeNotFoundException("Manager not found with id: " + request.getManagerId()));

            if (!manager.getIsCeo() && !manager.getDepartmentId().equals(request.getDepartmentId())) {
                throw new InvalidEmployeeOperationException("Employee and manager must belong to same department");
            }

            if (manager.getStatus() != EmployeeStatus.ACTIVE) {
                throw new InvalidEmployeeOperationException("Manager must be an active employee");
            }
        }
    }

    private EmployeeDto convertToDto(Employee employee) {
        EmployeeDto dto = new EmployeeDto();
        dto.setId(employee.getId());
        dto.setEmployeeCode(employee.getEmployeeCode());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setFullName(employee.getFullName());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        dto.setPosition(employee.getPosition());
        dto.setDepartmentId(employee.getDepartmentId());
        dto.setManagerId(employee.getManagerId());
        dto.setIsCeo(employee.getIsCeo());
        dto.setHireDate(employee.getHireDate());
        dto.setSalary(employee.getSalary());
        dto.setStatus(employee.getStatus());
        dto.setCreatedAt(employee.getCreatedAt());
        dto.setUpdatedAt(employee.getUpdatedAt());
        
        if (employee.getManagerId() != null) {
            employeeRepository.findById(employee.getManagerId())
                    .ifPresent(manager -> dto.setManagerName(manager.getFullName()));
        }

        if (employee.getDepartmentId() != null) {
            try {
                String url = "http://localhost:8082/api/departments" + "/" + employee.getDepartmentId();
                DepartmentDto dept = restTemplate.getForObject(url, DepartmentDto.class);
                if (dept != null) {
                    dto.setDepartmentName(dept.getName());
                }
            } catch (Exception e) {
                dto.setDepartmentName(null); // fallback
            }
        }

        if (employee.getManagerId() != null) {
            employeeRepository.findById(employee.getManagerId())
                .ifPresent(manager -> dto.setManagerName(manager.getFullName()));
        }
        
        return dto;
    }
}