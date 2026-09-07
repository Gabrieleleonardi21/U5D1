package com.example.u5d1.exceptions;

import com.example.u5d1.payloads.ErrorPayload;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ExceptionsHandler {

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorPayload handleNotFound(NotFoundException e){
        return new ErrorPayload(e.getMessage(), LocalDateTime.now());
    }

    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) // 400: senza questo handler finiva nel generico 500
    public ErrorPayload handleBadRequest(BadRequestException e) {
        return new ErrorPayload(e.getMessage(), LocalDateTime.now());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) // 400: violazioni delle annotazioni @Valid sul DTO
    public ErrorPayload handleValidation(MethodArgumentNotValidException e) {
        // unisce i messaggi di tutti i campi non validi in una sola stringa
        String messaggi = e.getBindingResult().getFieldErrors().stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.joining("; "));
        return new ErrorPayload(messaggi, LocalDateTime.now());
    }
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) // 400: id o parametro malformato
    public ErrorPayload handleTypeMismatch(MethodArgumentTypeMismatchException e) {
        return new ErrorPayload("Parametro non valido: '" + e.getValue() + "'", LocalDateTime.now());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) // 400: body non convertibile
    public ErrorPayload handleUnreadable(HttpMessageNotReadableException e) {
        return new ErrorPayload("Body della richiesta non valido", LocalDateTime.now());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR) // 500
    public ErrorPayload handleGeneric(Exception e) {
        e.printStackTrace(); // lo stack trace vero finisce in console
        return new ErrorPayload("Errore interno del server", LocalDateTime.now());
    }
}
