package com.company.department.dto;

import java.time.LocalDateTime;

public class DepartmentDto {
    private Long id;
    private String name;
    private String description;
    private Long deptHeadId;
    private String deptHeadName;
    private Long employeeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public DepartmentDto() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getDeptHeadId() { return deptHeadId; }
    public void setDeptHeadId(Long deptHeadId) { this.deptHeadId = deptHeadId; }

    public String getDeptHeadName() { return deptHeadName; }
    public void setDeptHeadName(String deptHeadName) { this.deptHeadName = deptHeadName; }

    public Long getEmployeeCount() { return employeeCount; }
    public void setEmployeeCount(Long employeeCount) { this.employeeCount = employeeCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}