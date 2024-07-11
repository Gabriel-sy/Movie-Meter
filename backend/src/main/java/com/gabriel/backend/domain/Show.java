package com.gabriel.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table
@NoArgsConstructor
@Data
public class Show {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String showId;
    private String title;
    private String releaseDate;
    private int[] genreIds;
    private String userRating;
    private String publicRating;
    private String mediaType;
    private String posterPath;
    @Column(columnDefinition = "TEXT")
    private String overview;

    public Show(ShowDTO showDTO) {
        if (showDTO.name() == null){
            this.title = showDTO.title();
        } else if (showDTO.title() == null) {
            this.title = showDTO.name();
        }
        this.showId = showDTO.id();
        this.releaseDate = showDTO.release_date();
        this.genreIds = showDTO.genre_ids();
        this.userRating = showDTO.user_rating();
        this.publicRating = showDTO.vote_average();
        this.mediaType = showDTO.media_type();
        this.posterPath = showDTO.poster_path();
        this.overview = showDTO.overview();
    }
}
