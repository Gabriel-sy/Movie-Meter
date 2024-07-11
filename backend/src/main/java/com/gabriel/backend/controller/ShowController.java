package com.gabriel.backend.controller;

import com.gabriel.backend.domain.Show;
import com.gabriel.backend.domain.ShowDTO;
import com.gabriel.backend.repository.ShowRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("shows")
@CrossOrigin(origins = "http://localhost:4200")
public class ShowController {
    private final ShowRepository showRepository;

    public ShowController(ShowRepository showRepository) {
        this.showRepository = showRepository;
    }

    @PostMapping(path = "/save")
    public ResponseEntity<Void> saveShow(@RequestBody ShowDTO showDTO){
        Show showToSave = new Show(showDTO);
        showRepository.save(showToSave);
        System.out.println(showToSave);
        return ResponseEntity.ok().build();
    }
}
