package com.gabriel.backend.service;

import com.gabriel.backend.domain.Show;
import com.gabriel.backend.domain.ShowDTO;
import com.gabriel.backend.domain.ShowRequestDTO;
import com.gabriel.backend.exceptions.ShowNotFoundException;
import com.gabriel.backend.repository.ShowRepository;
import org.hibernate.annotations.NotFound;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShowService {
    private final ShowRepository showRepository;

    public ShowService(ShowRepository showRepository) {
        this.showRepository = showRepository;
    }

    public Show findShowById(Long id){
        return showRepository.findById(id).orElseThrow(() -> new ShowNotFoundException("Id não encontrado"));
    }

    public void saveShow(ShowDTO showDTO){
        Show showToSave = new Show(showDTO);
        showRepository.save(showToSave);
    }

    public List<Show> findAllShows(){
        return showRepository.findAll();
    }

    public void deleteById(Long id) {
        showRepository.deleteById(id);
    }

    public void editRating(ShowRequestDTO showRequestDTO) {
        Show show = findShowById(Long.valueOf(showRequestDTO.id()));
        show.setUserRating(showRequestDTO.userRating());
        showRepository.save(show);
    }
}
