package com.company.employee.repository;

import com.company.employee.entity.Employee;
import com.company.employee.entity.EmployeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    // Basic finders
    Optional<Employee> findByEmployeeCode(String employeeCode);
    
    Optional<Employee> findByEmail(String email);
    
    List<Employee> findByDepartmentId(Long departmentId);
    
    List<Employee> findByManagerId(Long managerId);
    
    Optional<Employee> findByIsCeoTrue();
    
    List<Employee> findByStatus(EmployeeStatus status);
    
    // Existence checks
    boolean existsByEmployeeCode(String employeeCode);
    
    boolean existsByEmail(String email);
    
    // Custom queries
    @Query("SELECT e FROM Employee e WHERE e.departmentId = :deptId AND e.managerId IS NULL")
    List<Employee> findDepartmentHeads(@Param("deptId") Long deptId);
    
    @Query("SELECT e FROM Employee e WHERE e.managerId = :managerId AND e.status = 'ACTIVE'")
    List<Employee> findActiveSubordinates(@Param("managerId") Long managerId);
    
    @Query("SELECT e FROM Employee e WHERE e.status = 'ACTIVE' ORDER BY e.employeeCode")
    List<Employee> findAllActiveEmployees();
    
    @Query("SELECT e FROM Employee e WHERE " +
           "LOWER(e.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.position) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Employee> searchEmployees(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.departmentId = :departmentId AND e.status = 'ACTIVE'")
    long countActiveEmployeesByDepartment(@Param("departmentId") Long departmentId);
}