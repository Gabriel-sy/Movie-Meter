package com.gabriel.backend.domain;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotEmpty;

public record ShowDTO(@NotEmpty String id, @Nullable String title, @NotEmpty String release_date,
                      @NotEmpty int[] genre_ids, @NotEmpty String vote_average,
                      @NotEmpty String media_type, @Nullable String name, @NotEmpty String poster_path,
                      @NotEmpty String user_rating, @NotEmpty String overview) {
}
