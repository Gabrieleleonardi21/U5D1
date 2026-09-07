package com.example.u5d1.payloads;

import java.time.LocalDateTime;

public record ErrorPayload(String message, LocalDateTime timestamp) {
}
