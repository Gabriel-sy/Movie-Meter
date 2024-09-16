package com.gabriel.backend.domain;

import jakarta.validation.constraints.NotEmpty;

public record ShowRequestDTO(@NotEmpty Long id, @NotEmpty String userRating) {
}
