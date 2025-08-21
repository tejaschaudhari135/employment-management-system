package com.company.department.repository;

import com.company.department.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    Optional<Department> findByName(String name);

    boolean existsByName(String name);

    List<Department> findByDeptHeadId(Long deptHeadId);

    @Query("SELECT d FROM Department d ORDER BY d.name")
    List<Department> findAllOrderByName();

    @Query("SELECT d FROM Department d WHERE " +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Department> searchDepartments(@Param("searchTerm") String searchTerm);
}