package com.company.department.controller;

import com.company.department.dto.CreateDepartmentRequest;
import com.company.department.dto.DepartmentDto;
import com.company.department.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<List<DepartmentDto>> getAllDepartments() {
        List<DepartmentDto> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentDto> getDepartmentById(@PathVariable Long id) {
        DepartmentDto department = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(department);
    }

    @GetMapping("/search")
    public ResponseEntity<List<DepartmentDto>> searchDepartments(@RequestParam String term) {
        List<DepartmentDto> departments = departmentService.searchDepartments(term);
        return ResponseEntity.ok(departments);
    }

    @PostMapping
    public ResponseEntity<DepartmentDto> createDepartment(@Valid @RequestBody CreateDepartmentRequest request) {
        DepartmentDto department = departmentService.createDepartment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(department);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentDto> updateDepartment(@PathVariable Long id,
                                                        @Valid @RequestBody CreateDepartmentRequest request) {
        DepartmentDto department = departmentService.updateDepartment(id, request);
        return ResponseEntity.ok(department);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }
}