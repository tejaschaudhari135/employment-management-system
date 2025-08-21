package com.company.employee.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class CreateEmployeeRequest {
    
    @NotBlank(message = "Employee code is required")
    @Size(max = 50, message = "Employee code must not exceed 50 characters")
    private String employeeCode;
    
    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;
    
    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;
    
    @Size(max = 15, message = "Phone must not exceed 15 characters")
    private String phone;
    
    @NotBlank(message = "Position is required")
    @Size(max = 100, message = "Position must not exceed 100 characters")
    private String position;
    
    private Long departmentId;
    private Long managerId;
    private Boolean isCeo = false;
    
    @NotNull(message = "Hire date is required")
    @PastOrPresent(message = "Hire date cannot be in the future")
    private LocalDate hireDate;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Salary must be positive")
    private BigDecimal salary;
    
    // Getters and Setters
    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }
    
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    
    public Long getManagerId() { return managerId; }
    public void setManagerId(Long managerId) { this.managerId = managerId; }
    
    public Boolean getIsCeo() { return isCeo; }
    public void setIsCeo(Boolean isCeo) { this.isCeo = isCeo; }
    
    public LocalDate getHireDate() { return hireDate; }
    public void setHireDate(LocalDate hireDate) { this.hireDate = hireDate; }
    
    public BigDecimal getSalary() { return salary; }
    public void setSalary(BigDecimal salary) { this.salary = salary; }
}