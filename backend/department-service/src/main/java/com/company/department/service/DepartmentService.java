package com.company.department.service;

import com.company.department.dto.CreateDepartmentRequest;
import com.company.department.dto.DepartmentDto;
import com.company.department.entity.Department;
import com.company.department.exception.DepartmentNotFoundException;
import com.company.department.exception.DuplicateDepartmentException;
import com.company.department.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private RestTemplate restTemplate;

    private final String EMPLOYEE_SERVICE_URL = "http://localhost:8081/api/employees";

    @Transactional(readOnly = true)
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAllOrderByName().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DepartmentDto getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new DepartmentNotFoundException("Department not found with id: " + id));
        return convertToDto(department);
    }

    @Transactional(readOnly = true)
    public List<DepartmentDto> searchDepartments(String searchTerm) {
        return departmentRepository.searchDepartments(searchTerm).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public DepartmentDto createDepartment(CreateDepartmentRequest request) {
        // Validate unique constraint
        if (departmentRepository.existsByName(request.getName())) {
            throw new DuplicateDepartmentException("Department name already exists: " + request.getName());
        }

        Department department = new Department();
        department.setName(request.getName());
        department.setDescription(request.getDescription());
        department.setDeptHeadId(request.getDeptHeadId());

        Department savedDepartment = departmentRepository.save(department);
        return convertToDto(savedDepartment);
    }

    public DepartmentDto updateDepartment(Long id, CreateDepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new DepartmentNotFoundException("Department not found with id: " + id));

        // Check if name is being changed and if new name already exists
        if (!department.getName().equals(request.getName()) && 
            departmentRepository.existsByName(request.getName())) {
            throw new DuplicateDepartmentException("Department name already exists: " + request.getName());
        }

        department.setName(request.getName());
        department.setDescription(request.getDescription());
        department.setDeptHeadId(request.getDeptHeadId());

        Department updatedDepartment = departmentRepository.save(department);
        return convertToDto(updatedDepartment);
    }

    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new DepartmentNotFoundException("Department not found with id: " + id));

        // Check if department has employees
        Long employeeCount = getEmployeeCount(id);
        if (employeeCount > 0) {
            throw new RuntimeException("Cannot delete department with employees. Please move employees to other departments first.");
        }

        departmentRepository.delete(department);
    }

    // Helper method to get employee count from Employee Service
    private Long getEmployeeCount(Long departmentId) {
        try {
            return restTemplate.getForObject(
                EMPLOYEE_SERVICE_URL + "/department/" + departmentId + "/count", 
                Long.class
            );
        } catch (Exception e) {
            // If Employee Service is down, return 0 for now
            System.err.println("Could not fetch employee count: " + e.getMessage());
            return 0L;
        }
    }

    private DepartmentDto convertToDto(Department department) {
        DepartmentDto dto = new DepartmentDto();
        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setDescription(department.getDescription());
        dto.setDeptHeadId(department.getDeptHeadId());
        dto.setCreatedAt(department.getCreatedAt());
        dto.setUpdatedAt(department.getUpdatedAt());
        
        // Get employee count
        dto.setEmployeeCount(getEmployeeCount(department.getId()));
        
        // Note: Department head name can be fetched from Employee Service if needed
        // dto.setDeptHeadName(getEmployeeName(department.getDeptHeadId()));
        
        return dto;
    }
}