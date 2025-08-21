package com.company.employee.dto;

import jakarta.validation.constraints.NotNull;

public class MoveEmployeeRequest {
    
    @NotNull(message = "Department ID is required")
    private Long departmentId;
    
    @NotNull(message = "Manager ID is required")
    private Long managerId;
    
    // Getters and Setters
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    
    public Long getManagerId() { return managerId; }
    public void setManagerId(Long managerId) { this.managerId = managerId; }
}