package com.gabriel.backend.service;

import com.gabriel.backend.domain.Show;
import com.gabriel.backend.domain.ShowDTO;
import com.gabriel.backend.repository.ShowRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowService {
    private final ShowRepository showRepository;

    public ShowService(ShowRepository showRepository) {
        this.showRepository = showRepository;
    }

    public void saveShow(ShowDTO showDTO){
        Show showToSave = new Show(showDTO);
        showRepository.save(showToSave);
    }

    public List<Show> findAllShows(){
        List<Show> shows = showRepository.findAll();

        return showRepository.findAll();
    }
}
