package com.gabriel.backend.controller;

import com.gabriel.backend.domain.Show;
import com.gabriel.backend.domain.ShowDTO;
import com.gabriel.backend.repository.ShowRepository;
import com.gabriel.backend.service.ShowService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("shows")
@CrossOrigin(origins = "http://localhost:4200")
public class ShowController {
    private final ShowService showService;

    public ShowController(ShowService showService) {
        this.showService = showService;
    }

    @PostMapping(path = "/save")
    public ResponseEntity<Void> saveShow(@RequestBody ShowDTO showDTO){
        showService.saveShow(showDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping(path = "")
    public ResponseEntity<List<Show>> findAll(){
        return ResponseEntity.ok(showService.findAllShows());
    }
}
