﻿using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Entities;
using server.Helpers;

namespace server.Controllers;

[ApiController]
[Route("api/movietheaters")]
public class MovieTheatersController : ControllerBase
{

    private readonly ApplicationDbContext context;
    private readonly IMapper mapper;
    public MovieTheatersController(ApplicationDbContext context, IMapper mapper)
    {
        this.context = context;
        this.mapper = mapper;
        
    }

    [HttpGet]
    public async Task<ActionResult<List<MovieTheaterDTO>>> Get([FromQuery] PaginationDTO paginationDTO)
    {
        var queryable = context.MovieTheaters.AsQueryable();
        await HttpContext.InertParametersPaginationInHeader(queryable);
        var entities = await queryable.OrderBy(x => x.Name).Paginate(paginationDTO).ToListAsync();
        return mapper.Map<List<MovieTheaterDTO>>(entities);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<MovieTheaterDTO>> Get(int id)
    {
        var movieTheater = await context.MovieTheaters.FirstOrDefaultAsync(x => x.Id == id);

        if (movieTheater == null)
        {
            return NotFound();
        }

        return mapper.Map<MovieTheaterDTO>(movieTheater);
    }

    [HttpPost]
    public async Task<ActionResult> Post(MovieTheaterCreationDTO movieCreationDTO)
    {
        var movieTheater = mapper.Map<MovieTheater>(movieCreationDTO);
        context.Add(movieTheater);
        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> Put(int id, MovieTheaterCreationDTO movieCreationDTO)
    {
        var movieTheater = await context.MovieTheaters.FirstOrDefaultAsync(x => x.Id == id);

        if (movieTheater == null)
        {
            return NotFound();
        }

        movieTheater = mapper.Map(movieCreationDTO, movieTheater);
        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        var movieTheater = await context.MovieTheaters.AnyAsync(x => x.Id == id);

        if (!movieTheater)
        {
            return NotFound();
        }

        context.Remove(new MovieTheater() { Id = id });
        await context.SaveChangesAsync();
        return NoContent();
    }


 }