package com.company.department.exception;

public class DuplicateDepartmentException extends RuntimeException {
    public DuplicateDepartmentException(String message) {
        super(message);
    }
}