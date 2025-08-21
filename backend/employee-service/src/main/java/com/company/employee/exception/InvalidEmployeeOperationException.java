package com.company.employee.exception;

public class InvalidEmployeeOperationException extends RuntimeException {
    public InvalidEmployeeOperationException(String message) {
        super(message);
    }
}