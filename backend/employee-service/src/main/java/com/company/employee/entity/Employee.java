package com.company.employee.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
public class Employee {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "employee_code", unique = true, nullable = false)
    @NotBlank(message = "Employee code is required")
    private String employeeCode;
    
    @Column(name = "first_name", nullable = false)
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @Column(name = "last_name", nullable = false)
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @Column(unique = true, nullable = false)
    @Email(message = "Valid email is required")
    private String email;
    
    private String phone;
    
    @Column(nullable = false)
    @NotBlank(message = "Position is required")
    private String position;
    
    @Column(name = "department_id")
    private Long departmentId;
    
    @Column(name = "manager_id")
    private Long managerId;
    
    @Column(name = "is_ceo")
    private Boolean isCeo = false;
    
    @Column(name = "hire_date", nullable = false)
    @NotNull(message = "Hire date is required")
    private LocalDate hireDate;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal salary;
    
    @Enumerated(EnumType.STRING)
    private EmployeeStatus status = EmployeeStatus.ACTIVE;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Employee() {}
    
    public Employee(String employeeCode, String firstName, String lastName, 
                   String email, String position, LocalDate hireDate) {
        this.employeeCode = employeeCode;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.position = position;
        this.hireDate = hireDate;
    }
    
    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
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
    
    public EmployeeStatus getStatus() { return status; }
    public void setStatus(EmployeeStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Helper methods
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    @Override
    public String toString() {
        return "Employee{" +
                "id=" + id +
                ", employeeCode='" + employeeCode + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", position='" + position + '\'' +
                '}';
    }
}