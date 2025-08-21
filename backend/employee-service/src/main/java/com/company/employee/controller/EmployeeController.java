package com.company.employee.controller;

import com.company.employee.dto.CreateEmployeeRequest;
import com.company.employee.dto.EmployeeDto;
import com.company.employee.dto.MoveEmployeeRequest;
import com.company.employee.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        List<EmployeeDto> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long id) {
        EmployeeDto employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(employee);
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<EmployeeDto>> getEmployeesByDepartment(@PathVariable Long departmentId) {
        List<EmployeeDto> employees = employeeService.getEmployeesByDepartment(departmentId);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<EmployeeDto>> getEmployeesByManager(@PathVariable Long managerId) {
        List<EmployeeDto> employees = employeeService.getEmployeesByManager(managerId);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/search")
    public ResponseEntity<List<EmployeeDto>> searchEmployees(@RequestParam String term) {
        List<EmployeeDto> employees = employeeService.searchEmployees(term);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/department/{departmentId}/count")
    public ResponseEntity<Long> getEmployeeCountByDepartment(@PathVariable Long departmentId) {
        long count = employeeService.getEmployeeCountByDepartment(departmentId);
        return ResponseEntity.ok(count);
    }

    @PostMapping
    public ResponseEntity<EmployeeDto> createEmployee(@Valid @RequestBody CreateEmployeeRequest request) {
        EmployeeDto employee = employeeService.createEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(employee);
    }

    @PutMapping("/{id}/move")
    public ResponseEntity<EmployeeDto> moveEmployee(@PathVariable Long id,
                                                   @Valid @RequestBody MoveEmployeeRequest request) {
        EmployeeDto employee = employeeService.moveEmployeeToDepartment(id,
                request.getDepartmentId(), request.getManagerId());
        return ResponseEntity.ok(employee);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}